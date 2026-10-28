(function(root){
 'use strict';
 const KEY='fluffy-alibi-mobile-v3',BACKUP=KEY+'-backup',PREVIOUS='fluffy-alibi-local-v1',LEGACY='forest-mystery-local-15-v2',FORMAT='fluffy-alibi',VERSION=4,CAMPAIGN='mobile-v3';
 const object=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
 const seconds=v=>Number.isFinite(v)?Math.max(0,Math.min(31536000,Math.floor(v))):0;
 const settings=v=>({sound:(v&&v.sound)===true,timer:(v&&v.timer)===true,guide:(v&&v.guide)!==false,assist:(v&&v.assist)!==false,manualSeen:(v&&v.manualSeen)===true,largeText:(v&&v.largeText)===true,reducedMotion:(v&&v.reducedMotion)===true});
 function fresh(c){return {placed:{},notes:{},excluded:{},excludedCells:[],checked:[],clueRevision:c.clueRevision||1,selected:c.characters[0].id,mode:'place',history:[],future:[],started:false,seconds:0,hints:0,wrongAccusations:0,attemptActive:true,zoom:1};}
 function cleanSnapshot(c,value){
  const v=object(value)?value:{},ids=new Set(c.characters.map(p=>p.id)),cells=new Set(),validCell=cell=>Number.isInteger(cell)&&cell>=0&&cell<c.size*c.size,out={placed:{},notes:{},excluded:{},excludedCells:[],checked:[],selected:ids.has(v.selected)?v.selected:c.characters[0].id,mode:['place','erase','exclude'].includes(v.mode)?v.mode:'place'};
  // A free-placement position can contradict a clue; only malformed data is removed here.
  for(const [id,cell] of Object.entries(object(v.placed)?v.placed:{}))if(ids.has(id)&&validCell(cell)&&!cells.has(cell)){out.placed[id]=cell;cells.add(cell);}
  // Keep the old notes field in the save format, but retire candidate marks and candidate mode.
  const marks=new Set((Array.isArray(v.excludedCells)?v.excludedCells:[]).filter(validCell));
  for(const id of ids)if(Array.isArray((v.excluded&&v.excluded[id])))v.excluded[id].filter(validCell).forEach(cell=>marks.add(cell));
  out.excludedCells=Array.from(marks);
  out.checked=Array.isArray(v.checked)?[...new Set(v.checked.filter(id=>ids.has(id)))]:[];
  return out;
 }
 function cleanGame(c,v){
  if(!object(v))return fresh(c);
  const snap=cleanSnapshot(c,v),history=Array.isArray(v.history)?v.history.filter(object).slice(-100).map(s=>cleanSnapshot(c,s)):[],future=Array.isArray(v.future)?v.future.filter(object).slice(-100).map(s=>cleanSnapshot(c,s)):[];
  if((Number(v.clueRevision)||1)<(c.clueRevision||1)){const changed=new Set();if(c.clueChangesByRevision){Object.keys(c.clueChangesByRevision).forEach(revision=>{if(Number(revision)>(Number(v.clueRevision)||1)&&Number(revision)<=(c.clueRevision||1))c.clueChangesByRevision[revision].forEach(id=>changed.add(id));});}else (c.changedClues||c.characters.map(p=>p.id)).forEach(id=>changed.add(id));[snap].concat(history,future).forEach(s=>{s.checked=s.checked.filter(id=>!changed.has(id));});}
  return Object.assign({},fresh(c),snap,{history,future,started:v.started===true,seconds:seconds(v.seconds),hints:seconds(v.hints),wrongAccusations:seconds(v.wrongAccusations),attemptActive:typeof v.attemptActive==='boolean'?v.attemptActive:Object.keys(snap.placed).length<c.size,zoom:[1,1.5,2].includes(v.zoom)?v.zoom:1});
 }
 function normalize(value,cases){
  const v=object(value)?value:{},ids=new Set(cases.map(c=>c.id)),out={format:FORMAT,version:VERSION,campaign:CAMPAIGN,games:{},completed:[],lastCase:null,favorites:[],records:{},settings:settings(v.settings)};
  for(const c of cases)if(object((v.games&&v.games[c.id])))out.games[c.id]=cleanGame(c,v.games[c.id]);
  out.completed=Array.isArray(v.completed)?[...new Set(v.completed.filter(id=>ids.has(id)))]:[];
  out.favorites=Array.isArray(v.favorites)?[...new Set(v.favorites.filter(id=>ids.has(id)))]:[];
  out.lastCase=ids.has(v.lastCase)?v.lastCase:null;
  for(const id of ids)if(object((v.records&&v.records[id]))){const r=v.records[id];out.records[id]={solves:seconds(r.solves),bestSeconds:seconds(r.bestSeconds),bestHints:seconds(r.bestHints),lastFinishedAt:typeof r.lastFinishedAt==='string'&&/^\d{4}-\d\d-\d\dT/.test(r.lastFinishedAt)?r.lastFinishedAt.slice(0,32):''};}
  return out;
 }
 const current=v=>object(v)&&v.format===FORMAT&&v.version===VERSION&&v.campaign===CAMPAIGN&&object(v.games)&&Array.isArray(v.completed);
 function readPrevious(storage){
  for(const [key,version] of [['fluffy-alibi-challenge-v2',3],[PREVIOUS,2],[LEGACY,1]])try{const value=JSON.parse(storage.getItem(key)||'null');if(object(value)&&value.version===version&&object(value.games)&&Array.isArray(value.completed)&&(version===1||value.format===FORMAT))return value;}catch(_error){}
  return null;
 }
 function read(storage,cases){
  for(const key of [KEY,BACKUP])try{const value=JSON.parse(storage.getItem(key)||'null');if(current(value))return normalize(value,cases);}catch(_error){}
  const previous=readPrevious(storage);
  return normalize({settings:(previous&&previous.settings)},cases);
 }
 function write(storage,disk){
  try{const raw=storage.getItem(KEY);if(raw){let previous;try{previous=JSON.parse(raw);}catch(_error){}if(current(previous))try{storage.setItem(BACKUP,raw);}catch(_error){}}storage.setItem(KEY,JSON.stringify(disk));return true;}catch(_error){return false;}
 }
 function serialize(disk){return JSON.stringify(Object.assign({},disk,{format:FORMAT,version:VERSION,campaign:CAMPAIGN,exportedAt:new Date().toISOString()}),null,2);}
 function parse(text,cases){
  if(typeof text!=='string'||text.length>2000000)throw Error('存档文件过大或无法读取。');
  let v;try{v=JSON.parse(text);}catch(_error){throw Error('这不是有效的 JSON 存档。');}
  if(!object(v)||!object(v.games)||!Array.isArray(v.completed))throw Error('存档缺少游戏数据，当前进度没有更改。');
  if((v.format===FORMAT&&v.version===2)||(v.version===1&&!v.format))throw Error('这是原版题目的存档，请在「原版三十案.html」中继续。本次重做了全部题面，原版进度与新版分开保存。当前进度没有更改。');
  if(v.campaign==='challenge-v2')throw Error('这是旧题库进度，与本版关卡不同；请保留备份，在旧版继续。');
  if(!current(v))throw Error('存档版本或题库不匹配，当前进度没有更改。');
  return normalize(v,cases);
 }
 const api={KEY,BACKUP,PREVIOUS,LEGACY,FORMAT,VERSION,CAMPAIGN,fresh,cleanGame,cleanSnapshot,normalize,readPrevious,read,write,serialize,parse};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ForestSave=api;
})(typeof window!=='undefined'?window:this);
