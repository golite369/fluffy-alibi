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
  const env=environment||root,Audio=env.Audio,setTimer=env.setTimeout?env.setTimeout.bind(env):setTimeout,clearTimer=env.clearTimeout?env.clearTimeout.bind(env):clearTimeout;
  let music=null,fx=null,settings={sound:false,music:false,soundVolume:.55,musicVolume:.3},hidden=!!(env.document&&env.document.hidden),pagePaused=false,unlocked=false,error='',volumeControllable=true,disposed=false;
  const sequence={music:0,fx:0},pending={music:null,fx:null},states={music:'idle',fx:'idle'};
  const names=['open','select','place','exclude','erase','undo','redo','hint','check','error','win','preview'];
  const source=name=>'assets/audio/'+name+'-v1.wav';
  function notify(){if(typeof api.onChange==='function')api.onChange(api.status);}
  function session(){try{if(env.navigator&&env.navigator.audioSession)env.navigator.audioSession.type='playback';}catch(ignore){}}
  function cancel(channel){const request=pending[channel];if(request){clearTimer(request.timer);pending[channel]=null;request.resolve(false);}}
  function stop(channel,reset){cancel(channel);sequence[channel]++;const el=channel==='music'?music:fx;if(el){try{el.pause();if(reset)el.currentTime=0;}catch(ignore){}}states[channel]='paused';}
  function ensure(){
   if(disposed||typeof Audio!=='function')return false;if(music&&fx)return true;
   try{music=new Audio();fx=new Audio();[[music,'music'],[fx,'fx']].forEach(pair=>{const el=pair[0],channel=pair[1];el.preload='auto';el.loop=channel==='music';el.hidden=true;el.id='fluffy-audio-'+channel;if(typeof el.setAttribute==='function'){el.setAttribute('playsinline','');el.setAttribute('webkit-playsinline','');el.setAttribute('aria-hidden','true');}if(env.document&&env.document.body)env.document.body.appendChild(el);
    if(typeof el.addEventListener==='function'){el.addEventListener('playing',()=>{if(!hidden&&!pagePaused){states[channel]='playing';unlocked=true;notify();}});el.addEventListener('ended',()=>{states[channel]='ended';notify();});el.addEventListener('error',()=>{if(el.error){states[channel]='error';error='音频未能加载，请检查网络后点击重试。';notify();}});}
   });applyVolume();return true;}catch(ignore){error='当前浏览器无法创建播放器。';return false;}
  }
  function volume(el,value){if(!el)return;try{el.volume=value;if(Math.abs(el.volume-value)>.02)volumeControllable=false;}catch(ignore){volumeControllable=false;}el.muted=value===0;}
  function applyVolume(){volume(music,settings.musicVolume);volume(fx,settings.soundVolume);}
  function start(el,channel){
   if(hidden||pagePaused||disposed)return Promise.resolve(false);cancel(channel);const id=++sequence[channel];states[channel]='loading';error='';session();notify();
   return new Promise(resolve=>{let settled=false;const finish=(ok,message)=>{if(settled)return;settled=true;if(id!==sequence[channel]){resolve(false);return;}const request=pending[channel];if(request)clearTimer(request.timer);pending[channel]=null;if(hidden||pagePaused||disposed){try{el.pause();}catch(ignore){}states[channel]='paused';resolve(false);return;}states[channel]=ok?'playing':'blocked';if(ok)unlocked=true;else{error=message||'播放受限，请点“开启／重试声音”再试一次。';try{el.pause();}catch(ignore){}}notify();resolve(ok);};
    pending[channel]={resolve,timer:setTimer(()=>finish(false,'声音加载或授权超时，请点“开启／重试声音”。'),6000)};
    // Keep play() in this trusted input call stack, before awaiting any promise.
    try{const result=el.play();Promise.resolve(result).then(()=>finish(true),reason=>{if(reason&&reason.name==='AbortError'){finish(false,'声音已暂停，点击即可重新播放。');return;}finish(false,reason&&reason.name==='NotAllowedError'?'微信或浏览器尚未允许播放，请直接点“开启／重试声音”。':'播放未成功，请检查媒体音量并点击重试。');});}catch(ignore){finish(false);}
   });
  }
  function unlock(force){if(hidden||pagePaused||disposed||(!force&&!settings.sound&&!settings.music)||!ensure())return Promise.resolve(false);session();if(settings.music&&settings.musicVolume>0){if(states.music==='playing'&&!music.paused)return Promise.resolve(true);if(!music.src)music.src=source('music');else if(music.error)music.load();return start(music,'music');}return Promise.resolve(true);}
  function configure(value){const v=value||{};settings={sound:v.sound===true,music:v.music===true,soundVolume:limit(v.soundVolume,.55),musicVolume:limit(v.musicVolume,.3)};applyVolume();if(!settings.music||settings.musicVolume===0)stop('music',false);if(!settings.sound||settings.soundVolume===0)stop('fx',false);notify();}
  function play(name){if(!names.includes(name)||!settings.sound||settings.soundVolume===0||hidden||pagePaused||!ensure())return Promise.resolve(false);stop('fx',false);fx.src=source(name);volume(fx,settings.soundVolume);return start(fx,'fx');}
  function preview(){if(hidden||pagePaused||!ensure())return Promise.resolve(false);stop('fx',false);fx.src=source('preview');volume(fx,settings.soundVolume);if(settings.soundVolume===0){error='音效音量为0，请先调高音量。';notify();return Promise.resolve(false);}return start(fx,'fx');}
  function pause(value){hidden=value===true;if(hidden){stop('music',false);stop('fx',false);}else if(unlocked&&settings.music)unlock();notify();}
  function pagehide(){pagePaused=true;pause(true);}
  function pageshow(){pagePaused=false;pause(!!(env.document&&env.document.hidden));}
  function dispose(){stop('music',false);stop('fx',false);disposed=true;[music,fx].forEach(el=>{if(el){try{el.removeAttribute('src');el.load();if(el.parentNode)el.parentNode.removeChild(el);}catch(ignore){}}});music=null;fx=null;}
  const api={configure,unlock,play,preview,pause,pagehide,pageshow,dispose,onChange:null,get status(){return {backend:'media',supported:typeof Audio==='function',unlocked,musicPlaying:!!(music&&!music.paused&&states.music==='playing'),effectsPlaying:!!(fx&&!fx.paused&&states.fx==='playing'),state:states.music==='playing'||states.fx==='playing'?'playing':error?'blocked':states.music==='loading'||states.fx==='loading'?'loading':'idle',error,volumeControllable,settings:Object.assign({},settings)};}};return api;
 }

 const api={create,musicBar,effect,tempo:BPM,loopSeconds:16*BAR,title:'午夜案卷',effectNames:['open','select','place','exclude','erase','undo','redo','hint','check','error','win']};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.FluffySound=api;
})(typeof window!=='undefined'?window:this);
