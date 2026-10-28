(function(root){
 'use strict';
 const memory=Object.create(null);let warning='';
 function notify(message){warning=message;if(typeof api.onError==='function')api.onError(message);}
 function utf8Size(value){return unescape(encodeURIComponent(value)).length;}
 function compact(text){
  const value=JSON.parse(text);
  if(value&&value.games)Object.keys(value.games).forEach(function(id){const g=value.games[id];if(g&&typeof g==='object'){if(Array.isArray(g.history))g.history=g.history.slice(-10);if(Array.isArray(g.future))g.future=g.future.slice(-5);}});
  let serialized=JSON.stringify(value);
  if(utf8Size(serialized)>900*1024&&value&&value.games){Object.keys(value.games).forEach(function(id){value.games[id].history=[];value.games[id].future=[];});serialized=JSON.stringify(value);}
  if(utf8Size(serialized)>900*1024)throw Error('存档超过可保存容量，请复制备份');
  return serialized;
 }
 const storage={
  getItem:function(key){try{const value=root.localStorage.getItem(key);if(value!==null)memory[key]=value;return value;}catch(error){notify('当前浏览器无法读取进度，可以继续调查并手动备份。');return Object.prototype.hasOwnProperty.call(memory,key)?memory[key]:null;}},
  setItem:function(key,value){const data=compact(String(value));memory[key]=data;try{root.localStorage.setItem(key,data);}catch(error){notify('当前浏览器未能保存进度，请在存档管理中复制备份后再退出。');throw error;}}
 };
 function layout(){
  if(root.CSS&&typeof root.CSS.supports==='function'&&root.CSS.supports('aspect-ratio','1'))return;
  if(typeof document.querySelectorAll!=='function')return;
  const boards=Array.from(document.querySelectorAll('.board')),sizes=boards.map(function(board){return board.getBoundingClientRect().width;});
  boards.forEach(function(board,i){if(sizes[i]>0)board.style.height=sizes[i]+'px';});
 }
 const api={storage:storage,compact:compact,utf8Size:utf8Size,layout:layout,flush:function(){return Promise.resolve();},onViewportChange:null,onError:null,get warning(){return warning;}};
 root.FluffyWeb=api;api.ready=Promise.resolve(api);
 let timer;function resize(){clearTimeout(timer);timer=setTimeout(function(){if(typeof api.onViewportChange==='function')api.onViewportChange();layout();},50);}
 root.addEventListener('resize',resize);if(root.visualViewport&&typeof root.visualViewport.addEventListener==='function')root.visualViewport.addEventListener('resize',resize);
})(window);
