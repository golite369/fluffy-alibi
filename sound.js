(function(root){
 'use strict';
 const BPM=72,BEAT=60/BPM,BAR=BEAT*4;
 const chords=[[57,60,64,71],[53,57,60,64],[50,53,57,64],[52,57,59,64],[57,60,64,67],[55,59,62,69],[53,57,60,67],[52,56,59,62],[57,60,64,71],[53,57,60,64],[50,53,57,64],[55,59,62,65],[53,57,60,64],[50,53,57,60],[52,56,59,62],[52,57,59,64]];
 const melody=[[[.5,76],[2,72],[3.25,71]],[[1,69],[2.75,72]],[[.5,74],[2,72],[3,69]],[[1,71],[2.5,76]],[[.5,79],[1.75,76],[3,72]],[[.75,74],[2.5,71]],[[1,72],[3,69]],[[.5,71],[2,68]],[[.5,76],[2,79],[3.25,76]],[[1,72],[2.75,69]],[[.5,74],[2.5,77]],[[1,74],[3,71]],[[.5,72],[2,69]],[[1,69],[2.5,65]],[[.5,68],[2,71],[3,76]],[[1,74],[2.5,71]]];
 const FX={select:[[.0,76,.07,.16]],place:[[0,69,.11,.23],[.025,76,.1,.11]],exclude:[[0,62,.055,.12]],undo:[[0,72,.09,.16],[.075,67,.1,.13]],redo:[[0,67,.09,.13],[.075,72,.1,.16]],hint:[[0,74,.2,.16],[.095,77,.22,.13],[.19,81,.3,.1]],check:[[0,72,.14,.16],[.1,79,.2,.13]],error:[[0,57,.13,.16],[.13,55,.17,.12]],win:[[0,72,.32,.18],[.13,76,.34,.17],[.26,79,.36,.16],[.39,84,.65,.14]],open:[[.04,69,.13,.09]]};
 const frequency=midi=>440*Math.pow(2,(midi-69)/12),limit=(v,fallback)=>Number.isFinite(v)?Math.max(0,Math.min(1,v)):fallback;
 function tone(ctx,dest,time,midi,length,level,kind,track){
  const oscillator=ctx.createOscillator(),gain=ctx.createGain();oscillator.type=kind||'triangle';oscillator.frequency.setValueAtTime(frequency(midi),time);gain.gain.setValueAtTime(.00001,time);gain.gain.linearRampToValueAtTime(level,time+.009);gain.gain.exponentialRampToValueAtTime(.00001,time+length);oscillator.connect(gain);gain.connect(dest);
  const voice={node:oscillator,gain,kind:'tone'};if(track){track.add(voice);oscillator.onended=function(){track.delete(voice);oscillator.disconnect();gain.disconnect();};}oscillator.start(time);oscillator.stop(time+length+.015);return voice;
 }
 function brush(ctx,dest,time,length,level,track){
  const buffer=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*length),ctx.sampleRate),data=buffer.getChannelData(0);let seed=5811,smoothed=0;
  for(let i=0;i<data.length;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;smoothed=.57*smoothed+.43*(seed/2147483648-1);data[i]=smoothed;}
  const node=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),gain=ctx.createGain();node.buffer=buffer;filter.type='bandpass';filter.frequency.value=1700;filter.Q.value=.7;gain.gain.setValueAtTime(.00001,time);gain.gain.linearRampToValueAtTime(level,time+.008);gain.gain.exponentialRampToValueAtTime(.00001,time+length);node.connect(filter);filter.connect(gain);gain.connect(dest);const voice={node,gain,filter,kind:'noise'};
  if(track){track.add(voice);node.onended=function(){track.delete(voice);node.disconnect();filter.disconnect();gain.disconnect();};}node.start(time);node.stop(time+length+.01);
 }
 function musicBar(ctx,dest,time,bar,track){
  const n=((bar%16)+16)%16,chord=chords[n];
  chord.forEach((note,i)=>tone(ctx,dest,time+i*.035,note,2.3,.08,'sine',track));
  tone(ctx,dest,time,chord[0]-12,.68,.275,'sine',track);tone(ctx,dest,time+2*BEAT,chord[0]-12,.58,.19,'sine',track);
  melody[n].forEach(note=>{tone(ctx,dest,time+note[0]*BEAT,note[1],.78,.225,'triangle',track);tone(ctx,dest,time+note[0]*BEAT,note[1]+12,.38,.0225,'sine',track);});
 }
 function effect(ctx,dest,name,time,track){if(name==='erase'||name==='open')brush(ctx,dest,time,name==='erase' ? .13 : .18,name==='erase' ? .22 : .15,track);(FX[name]||[]).forEach(n=>tone(ctx,dest,time+n[0],n[1],n[2],n[3],'triangle',track));}
 function create(environment){
  const env=environment||root,Context=env.AudioContext||env.webkitAudioContext;let ctx=null,musicBus=null,effectsBus=null,settings={sound:false,music:false,soundVolume:.55,musicVolume:.3},timer=null,bar=0,next=0,hidden=false,pagePaused=false,unlocked=false,starting=null,lastEffect=-1,lastName='',failed=false;
  const musicVoices=new Set(),effectsVoices=new Set(),setTimer=env.setInterval?env.setInterval.bind(env):null,clearTimer=env.clearInterval?env.clearInterval.bind(env):null;
  function gain(bus,value){if(!ctx||!bus)return;const p=bus.gain;try{p.cancelScheduledValues(ctx.currentTime);p.setValueAtTime(p.value,ctx.currentTime);p.linearRampToValueAtTime(value,ctx.currentTime+.07);}catch(error){p.value=value;}}
  function stopVoices(voices,fade){voices.forEach(v=>{try{if(fade&&ctx&&ctx.state==='running'){const p=v.gain.gain;p.cancelScheduledValues(ctx.currentTime);p.setValueAtTime(p.value,ctx.currentTime);p.linearRampToValueAtTime(.00001,ctx.currentTime+.025);v.node.stop(ctx.currentTime+.035);}else{v.node.stop();v.node.disconnect();v.gain.disconnect();if(v.filter)v.filter.disconnect();}}catch(error){}});voices.clear();}
  function stopMusic(){if(timer!==null&&clearTimer)clearTimer(timer);timer=null;stopVoices(musicVoices,!hidden&&!pagePaused);}
  function enabled(){return settings.music&&settings.musicVolume>0&&unlocked&&ctx&&ctx.state==='running'&&!hidden&&!pagePaused;}
  function tick(){if(!enabled()){stopMusic();return;}if(next<ctx.currentTime-.2)next=ctx.currentTime+.05;while(next<ctx.currentTime+.4){musicBar(ctx,musicBus,next,bar++,musicVoices);next+=BAR;}}
  function sync(){gain(musicBus,settings.musicVolume);gain(effectsBus,settings.soundVolume);if(enabled()){if(timer===null){next=ctx.currentTime+.05;tick();if(setTimer)timer=setTimer(tick,150);}}else stopMusic();}
  function unlock(force){
   if(hidden||pagePaused||(!force&&!settings.sound&&!settings.music)||!Context||failed)return Promise.resolve(false);
   try{if(!ctx){ctx=new Context();musicBus=ctx.createGain();effectsBus=ctx.createGain();musicBus.gain.value=0;effectsBus.gain.value=settings.soundVolume;musicBus.connect(ctx.destination);effectsBus.connect(ctx.destination);if(typeof ctx.addEventListener==='function')ctx.addEventListener('statechange',()=>{if(ctx.state==='running'&&unlocked)sync();else stopMusic();});}
    if(starting)return starting;
    const attempt=ctx.state==='suspended'||ctx.state==='interrupted'?ctx.resume():Promise.resolve();starting=Promise.resolve(attempt).then(()=>{unlocked=ctx.state==='running';starting=null;sync();return unlocked;},()=>{starting=null;return false;});return starting;
   }catch(error){failed=true;stopMusic();return Promise.resolve(false);}
  }
  function configure(value){const v=value||{};settings={sound:v.sound===true,music:v.music===true,soundVolume:limit(v.soundVolume,.55),musicVolume:limit(v.musicVolume,.3)};if(!settings.sound)stopVoices(effectsVoices,true);sync();}
  function play(name){if(!settings.sound||!settings.soundVolume||hidden||pagePaused)return Promise.resolve(false);return unlock().then(ok=>{if(!ok||!settings.sound||hidden||pagePaused)return false;if(name===lastName&&ctx.currentTime-lastEffect<.045)return false;lastName=name;lastEffect=ctx.currentTime;effect(ctx,effectsBus,name,ctx.currentTime+.005,effectsVoices);return true;});}
  function preview(){return unlock(true).then(ok=>{if(!ok||hidden||pagePaused)return false;effect(ctx,effectsBus,'open',ctx.currentTime+.01,effectsVoices);effect(ctx,effectsBus,'place',ctx.currentTime+.3,effectsVoices);effect(ctx,effectsBus,'erase',ctx.currentTime+.58,effectsVoices);effect(ctx,effectsBus,'hint',ctx.currentTime+.85,effectsVoices);effect(ctx,effectsBus,'win',ctx.currentTime+1.5,effectsVoices);return true;});}
  function pause(value){hidden=value===true;if(hidden){stopMusic();stopVoices(effectsVoices);if(ctx&&typeof ctx.suspend==='function')try{const p=ctx.suspend();if(p&&p.catch)p.catch(()=>{});}catch(error){}}else if(unlocked)unlock();}
  function pagehide(){pagePaused=true;pause(true);}
  function pageshow(){pagePaused=false;pause(!!(env.document&&env.document.hidden));}
  function dispose(){stopMusic();stopVoices(effectsVoices);unlocked=false;if(ctx&&typeof ctx.close==='function')try{const p=ctx.close();if(p&&p.catch)p.catch(()=>{});}catch(error){}ctx=null;}
  return {configure,unlock,play,preview,pause,pagehide,pageshow,dispose,get status(){return {supported:!!Context&&!failed,unlocked,musicPlaying:timer!==null,voices:musicVoices.size+effectsVoices.size,state:ctx?ctx.state:'idle',settings:Object.assign({},settings)};}};
 }
 const api={create,musicBar,effect,tempo:BPM,loopSeconds:16*BAR,title:'午夜案卷',effectNames:['open','select','place','exclude','erase','undo','redo','hint','check','error','win']};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.FluffySound=api;
})(typeof window!=='undefined'?window:this);
