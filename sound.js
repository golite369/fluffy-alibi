(function(root){
 'use strict';
 const BPM=108,BEAT=60/BPM,BAR=BEAT*4;
 const chords=[[60,64,67,69],[55,59,62,67],[53,57,60,65],[55,59,62,65],[60,64,67,72],[57,60,64,67],[53,57,60,65],[55,59,62,67],[60,64,67,69],[55,59,62,67],[53,57,60,65],[55,59,62,65],[60,64,67,72],[53,57,60,65],[55,59,62,65],[60,64,67,72]];
 const melody=[[[0,72],[0.5,76],[1,79],[2,76],[2.5,74],[3,76]],[[0,74],[0.5,76],[1,79],[2,81],[3,79]],[[0,77],[1,81],[1.5,79],[2,77],[3,76]],[[0,74],[1,71],[2,74],[3,79]],[[0,76],[0.5,79],[1,84],[2,83],[2.5,81],[3,79]],[[0,81],[1,79],[2,76],[2.5,74],[3,72]],[[0,77],[0.5,79],[1,81],[2,79],[3,77]],[[0,74],[1,76],[2,79],[3,74]],[[0,72],[0.5,76],[1,79],[2,84],[3,79]],[[0,83],[1,81],[2,79],[2.5,76],[3,74]],[[0,77],[1,81],[2,84],[3,81]],[[0,79],[0.5,77],[1,76],[2,74],[3,71]],[[0,72],[0.5,74],[1,76],[2,79],[3,76]],[[0,77],[1,79],[2,81],[3,77]],[[0,79],[1,77],[2,74],[3,71]],[[0,72],[1,76],[2,79],[3,72]]];
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
  // Light offbeat plucked accompaniment, soft mallet melody and quiet shaker.
  [.5,1.5,2.5,3.5].forEach(beat=>chord.slice(0,3).forEach((note,i)=>{tone(ctx,dest,time+beat*BEAT+i*.012,note,.26,.036,'triangle',track);tone(ctx,dest,time+beat*BEAT+i*.012,note,.32,.025,'sine',track);}));
  tone(ctx,dest,time,chord[0]-12,.36,.18,'sine',track);tone(ctx,dest,time+2*BEAT,chord[0]-12,.3,.14,'sine',track);
  melody[n].forEach(note=>{const at=time+note[0]*BEAT;tone(ctx,dest,at,note[1],.5,.13,'sine',track);tone(ctx,dest,at,note[1],.38,.032,'triangle',track);tone(ctx,dest,at,note[1]+12,.2,.009,'sine',track);});
  [1,3].forEach(beat=>brush(ctx,dest,time+beat*BEAT,.055,.035,track));
 }
 function effect(ctx,dest,name,time,track){if(name==='erase'||name==='open')brush(ctx,dest,time,name==='erase' ? .13 : .18,name==='erase' ? .22 : .15,track);(FX[name]||[]).forEach(n=>tone(ctx,dest,time+n[0],n[1],n[2],n[3],'triangle',track));}
 function create(environment){
  const env=environment||root,Audio=env.Audio,setTimer=env.setTimeout?env.setTimeout.bind(env):setTimeout,clearTimer=env.clearTimeout?env.clearTimeout.bind(env):clearTimeout;
  let music=null,fx=null,settings={sound:false,music:false,soundVolume:.55,musicVolume:.3},hidden=!!(env.document&&env.document.hidden),pagePaused=false,unlocked=false,error='',volumeControllable=true,disposed=false;
  const sequence={music:0,fx:0},pending={music:null,fx:null},states={music:'idle',fx:'idle'};
  const names=['open','select','place','exclude','erase','undo','redo','hint','check','error','win','preview'];
  const source=name=>'assets/audio/'+name+(name==='music'?'-v2.wav':'-v1.wav');
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

 const api={create,musicBar,effect,tempo:BPM,loopSeconds:16*BAR,title:'晴日小侦探',effectNames:['open','select','place','exclude','erase','undo','redo','hint','check','error','win']};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.FluffySound=api;
})(typeof window!=='undefined'?window:this);
