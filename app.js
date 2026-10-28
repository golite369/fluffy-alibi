window.FluffyWeb.ready.then(function(){
(function () {
  'use strict';
  const E = window.ForestEngine, CASES = window.FOREST_CASES, S=window.ForestSave, P=window.ForestProps;
  const ART = { chapter1:'assets/chapter-1.png',chapter2:'assets/chapter-2.png',chapter3:'assets/chapter-3.png',chapter4:'assets/chapter-4.png',chapter5:'assets/chapter-5.png',chapter6:'assets/chapter-6.png',cover:'assets/cover-opening-v2.png',appIcon:'assets/app-icon-v2.png',cat:'assets/cat.png', dog:'assets/dog.png', mouse:'assets/mouse.png', tiger:'assets/tiger.png', fox:'assets/fox.png', owl:'assets/owl.png', rabbit:'assets/rabbit.png',raccoon:'assets/raccoon.png',chair:'assets/chair.png', table:'assets/table.png', plant:'assets/plant.png', rug:'assets/rug.png' };
  const KIND = {cat:'猫',dog:'狗',mouse:'鼠',tiger:'虎',fox:'狐',owl:'猫头鹰',rabbit:'兔',raccoon:'浣熊',chair:'椅子',table:'桌子',plant:'盆栽',rug:'地毯'};
  const FONT_LICENSE="Fusion Pixel Font\nhttps://github.com/TakWolf/fusion-pixel-font\n\nCopyright (c) 2022, TakWolf (https://takwolf.com).\n\nThis Font Software is licensed under the SIL Open Font License, Version 1.1.\nThis license is copied below, and is also available with a FAQ at:\nhttps://openfontlicense.org\n\n\n-----------------------------------------------------------\nSIL OPEN FONT LICENSE Version 1.1 - 26 February 2007\n-----------------------------------------------------------\n\nPREAMBLE\nThe goals of the Open Font License (OFL) are to stimulate worldwide\ndevelopment of collaborative font projects, to support the font creation\nefforts of academic and linguistic communities, and to provide a free and\nopen framework in which fonts may be shared and improved in partnership\nwith others.\n\nThe OFL allows the licensed fonts to be used, studied, modified and\nredistributed freely as long as they are not sold by themselves. The\nfonts, including any derivative works, can be bundled, embedded,\nredistributed and/or sold with any software provided that any reserved\nnames are not used by derivative works. The fonts and derivatives,\nhowever, cannot be released under any other type of license. The\nrequirement for fonts to remain under this license does not apply\nto any document created using the fonts or their derivatives.\n\nDEFINITIONS\n\"Font Software\" refers to the set of files released by the Copyright\nHolder(s) under this license and clearly marked as such. This may\ninclude source files, build scripts and documentation.\n\n\"Reserved Font Name\" refers to any names specified as such after the\ncopyright statement(s).\n\n\"Original Version\" refers to the collection of Font Software components as\ndistributed by the Copyright Holder(s).\n\n\"Modified Version\" refers to any derivative made by adding to, deleting,\nor substituting -- in part or in whole -- any of the components of the\nOriginal Version, by changing formats or by porting the Font Software to a\nnew environment.\n\n\"Author\" refers to any designer, engineer, programmer, technical\nwriter or other person who contributed to the Font Software.\n\nPERMISSION & CONDITIONS\nPermission is hereby granted, free of charge, to any person obtaining\na copy of the Font Software, to use, study, copy, merge, embed, modify,\nredistribute, and sell modified and unmodified copies of the Font\nSoftware, subject to the following conditions:\n\n1) Neither the Font Software nor any of its individual components,\nin Original or Modified Versions, may be sold by itself.\n\n2) Original or Modified Versions of the Font Software may be bundled,\nredistributed and/or sold with any software, provided that each copy\ncontains the above copyright notice and this license. These can be\nincluded either as stand-alone text files, human-readable headers or\nin the appropriate machine-readable metadata fields within text or\nbinary files as long as those fields can be easily viewed by the user.\n\n3) No Modified Version of the Font Software may use the Reserved Font\nName(s) unless explicit written permission is granted by the corresponding\nCopyright Holder. This restriction only applies to the primary font name as\npresented to the users.\n\n4) The name(s) of the Copyright Holder(s) or the Author(s) of the Font\nSoftware shall not be used to promote, endorse or advertise any\nModified Version, except to acknowledge the contribution(s) of the\nCopyright Holder(s) and the Author(s) or with their explicit written\npermission.\n\n5) The Font Software, modified or unmodified, in part or in whole,\nmust be distributed entirely under this license, and must not be\ndistributed under any other license. The requirement for fonts to\nremain under this license does not apply to any document created\nusing the Font Software.\n\nTERMINATION\nThis license becomes null and void if any of the above conditions are\nnot met.\n\nDISCLAIMER\nTHE FONT SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND,\nEXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF\nMERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT\nOF COPYRIGHT, PATENT, TRADEMARK, OR OTHER RIGHT. IN NO EVENT SHALL THE\nCOPYRIGHT HOLDER BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,\nINCLUDING ANY GENERAL, SPECIAL, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL\nDAMAGES, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING\nFROM, OUT OF THE USE OR INABILITY TO USE THE FONT SOFTWARE OR FROM\nOTHER DEALINGS IN THE FONT SOFTWARE.\n";
  const NUM = ['零','一','二','三','四','五','六','七','八','九','十'];
  const app = document.getElementById('app'), dialog = document.getElementById('modal');
  const esc = v => String(v===null||v===undefined?'':v).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const clone = value => JSON.parse(JSON.stringify(value));
  const storage=window.FluffyWeb.storage;
  let disk=S.read(storage,CASES),storageWarned=false,pendingImport=null;
  let view = 'home', current = null, game = null, lit = null, hintCell = null, hint = null, chosen = null, replayIndex = 0;
  let toastTimer, pendingCell, audio;
  let chapterTab=0,caseFilter='all';
  const pixelIcons={"back":["000100000000","001100000000","011100000000","111111111110","011100000000","001100000000","000100000000"],"more":["000000000000","000000000000","011001100110","011001100110","000000000000"],"close":["110000000011","011000000110","001100001100","000110011000","000011110000","000001100000","000011110000","000110011000","001100001100","011000000110","110000000011"],"place":["000011000000","000011000000","000111100000","000111100000","001111110000","001111110000","011111111000","000111100000","000111100000","011111111000"],"note":["000000011000","000000111100","000001111110","000011111100","000111111000","001111110000","011111100000","011111000000","011110000000","011100000000","011000000000"],"undo":["000100000000","001100000000","011111111000","111111111100","011100001110","001100000110","000100000110","000000000110","000000001110","000111111100","000111111000"],"hint":["000111111000","001100001100","011000000110","011000000110","011000000110","001100001100","000110011000","000110011000","000111111000","000100001000","000111111000","000011110000"],"arrow":["000000010000","000000011000","000000011100","011111111110","011111111111","011111111110","000000011100","000000011000","000000010000"],"book":["011111111110","110001100011","110001100011","110001100011","110001100011","110001100011","110001100011","110001100011","111111111111","011111111110"],"check":["000000000011","000000000110","000000001100","000000011000","110000110000","011001100000","001111000000","000110000000"],"sound":["000011000000","000111000100","001111001100","111111011000","111111011000","111111011000","001111001100","000111000100","000011000000"],"gear":["000110011000","001111111100","011111111110","111100001111","111000000111","011001100110","011001100110","111000000111","111100001111","011111111110","001111111100","000110011000"],"x":["110000000011","011000000110","001100001100","000110011000","000011110000","000001100000","000011110000","000110011000","001100001100","011000000110","110000000011"]};
  const icon=name=>{const rows=pixelIcons[name]||pixelIcons.more,offset=Math.floor((12-rows.length)/2);return '<svg class="pixel-icon" aria-hidden="true" viewBox="0 0 12 12" shape-rendering="crispEdges">'+rows.flatMap((row,y)=>[...row].flatMap((p,x)=>p==='1'?['<rect x="'+x+'" y="'+(y+offset)+'" width="1" height="1"/>']:[])).join('')+'</svg>';};
  const img = (kind, cls='', alt='') => `<img src="${ART[kind]}" class="${cls}" alt="${esc(alt)}" draggable="false">`;
  const propImage=(kind,cls='',alt='')=>{const d=P.get(kind);return `<img src="${d.asset}" class="${cls}" alt="${esc(alt||d.name)}" draggable="false">`;};
  window.FluffyWeb.onError=message=>toast(message);window.FluffyWeb.onViewportChange=()=>{layoutInvestigation();window.FluffyWeb.layout();};
  if(window.FluffyWeb.warning)setTimeout(()=>toast(window.FluffyWeb.warning),0);
  function save() { if(!S.write(storage,disk)&&!storageWarned){storageWarned=true;toast('当前进度尚未保存成功，请在存档管理中复制备份后再退出。');} }
  function fresh(c) { return S.fresh(c); }
  function load(c) { return S.cleanGame(c,disk.games[c.id]); }
  function persist() { if (current && game) { disk.games[current.id]=game;disk.lastCase=current.id; }save(); }
  function snap() { return clone({placed:game.placed,notes:game.notes,excluded:game.excluded,selected:game.selected,mode:game.mode,checked:game.checked}); }
  function mutate(fn) {
    game.history.push(snap()); if(game.history.length>100)game.history.shift();game.future=[];
    game.started=true;fn();lit=null;hintCell=null;hint=null;persist();render();
  }
  function undo(redo=false) {
    const from=redo?game.future:game.history,to=redo?game.history:game.future;
    if(!from.length)return toast(redo?'没有可重做的操作。':'还没有可撤销的操作。');
    to.push(snap());const previous=from.pop();
    if(!previous || !previous.placed || !previous.notes || !previous.excluded){from.length=0;persist();return toast('这段历史记录无法恢复，请继续调查。');}
    Object.assign(game,previous);lit=null;hintCell=null;hint=null;persist();render();beep(redo?420:300);
  }
  function toast(message) {
    const el=document.getElementById('toast');el.textContent=message;el.classList.add('show');
    clearTimeout(toastTimer);toastTimer=setTimeout(()=>{el.classList.remove('show');el.textContent='';},3300);
  }
  function beep(freq=510) {
    if(!disk.settings.sound)return;
    try { audio=audio||new (window.AudioContext||window.webkitAudioContext)();audio.resume();const o=audio.createOscillator(),g=audio.createGain();o.type='triangle';o.frequency.value=freq;g.gain.setValueAtTime(.07,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.09);o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+.1); } catch(_error){}
  }
  function modal(title, body) {
    dialog.innerHTML=`<header class="modal-head"><h2 id="modal-title">${title}</h2><button class="quiet-btn" data-action="close-modal" aria-label="关闭">${icon('close')}</button></header><div class="modal-body">${body}</div>`;
    if(!dialog.open){if(typeof dialog.showModal==='function')dialog.showModal();else{dialog.setAttribute('open','');document.body.classList.add('fallback-modal-open');}}
    dialog.scrollTop=0;
  }
  function closeModal(){if(dialog.open){if(typeof dialog.close==='function')dialog.close();else dialog.removeAttribute('open');}document.body.classList.remove('fallback-modal-open');}
  function select(id) {game.selected=id;lit=null;hintCell=null;persist();render();}
  function positionText(cell) {const [r,col]=E.pos(current,cell);return `第${NUM[r]}行第${NUM[col]}列`;}
  function currentCharacter(){return current.characters.find(p=>p.id===game.selected);}
  function caseStatus(c){const saved=disk.games[c.id];return (saved&&saved.attemptActive)&&(saved&&saved.started)?'调查中':disk.completed.includes(c.id)?'已结案':Object.keys((saved&&saved.placed)||{}).length?'调查中':'未开始';}
  function chapterCover(index,cls='chapter-cover'){const scenes=['雨夜书库与茶杯','温室唱片与钟表','封蜡钥匙与旧照片','灯塔空座与手铃','雪夜车站与档案','晨雾邮局与末页'];const title=(CASES.find(c=>c.chapterIndex===index)||{}).chapter||'';return img('chapter'+(index+1),cls,'第'+NUM[index+1]+'章《'+title+'》像素场景封面：'+scenes[index]);}
  function home() {
    const next=CASES.find(c=>c.id===disk.lastCase&&caseStatus(c)==='调查中')||CASES.find(c=>!disk.completed.includes(c.id))||CASES[0];
    const chapters=[...new Map(CASES.map(c=>[c.chapterIndex,c.chapter])).entries()];
    const shown=CASES.filter(c=>c.chapterIndex===chapterTab).filter(c=>caseFilter==='all'||caseFilter==='favorite'&&disk.favorites.includes(c.id)||caseFilter==='active'&&caseStatus(c)==='调查中'||caseFilter==='solved'&&disk.completed.includes(c.id)||caseFilter==='new'&&caseStatus(c)==='未开始');
    return `<section class="screen casebook"><div class="book-top"><button class="quiet-btn light-btn" data-action="settings" aria-label="声音与显示设置">${icon('gear')}</button></div>
      <div class="brand-page paper full-brand"><h1>毛茸茸的<br>不在场证明</h1>${img('appIcon','brand-cat-icon','三花猫侦探 App 图标')}</div>
      <div class="campaign-progress"><span>结案进度</span><div><i style="width:${disk.completed.length/CASES.length*100}%"></i></div><strong>${disk.completed.length} / ${CASES.length}</strong></div>
      ${disk.completed.length===CASES.length&&caseStatus(next)!=='调查中'?`<article class="continue-card paper"><div><h2>三十案，已归档</h2><p>笔记末页还留着探长的话。</p></div>${chapterCover(5,'case-cover-thumb')}<button class="wood-btn primary" data-action="epilogue">翻到终章 ${icon('arrow')}</button></article>`:`<article class="continue-card paper"><div><span class="eyebrow">${caseStatus(next)==='调查中'?'继续第':'下一案 · '}${next.number}${caseStatus(next)==='调查中'?'案':''}</span><h2>${next.title}</h2><p>${next.focus}</p></div>${chapterCover(next.chapterIndex,'case-cover-thumb')}<button class="wood-btn primary" data-action="open-case" data-case="${next.id}">${caseStatus(next)==='调查中'?'继续调查':'展开案卷'} ${icon('arrow')}</button></article>`}
      <div class="chapter-tabs" role="tablist" aria-label="案件章节">${chapters.map(([i,name])=>`<button role="tab" aria-selected="${chapterTab===i}" class="${chapterTab===i?'active':''}" data-action="chapter" data-chapter="${i}"><small>第${NUM[i+1]}辑</small>${name}<span>${i*5+1}—${i*5+5}</span></button>`).join('')}</div>
      <figure class="chapter-scene" aria-label="当前章节封面">${chapterCover(chapterTab)}</figure>
      <div class="case-filter"><label for="case-filter">本章案件</label><select id="case-filter" data-filter aria-label="筛选本章案件">${[['all','全部'],['new','未开始'],['active','调查中'],['solved','已结案'],['favorite','已收藏']].map(([v,t])=>`<option value="${v}" ${caseFilter===v?'selected':''}>${t}</option>`).join('')}</select></div>
      <div class="level-list">${shown.map(c=>`<button class="level-card" data-action="open-case" data-case="${c.id}" aria-label="第${c.level}关，${c.title}，${c.difficulty}，${caseStatus(c)}"><span class="level-number">${String(c.level).padStart(2,'0')}</span><span class="level-copy"><strong>${c.title}</strong><small>${c.size}×${c.size} · ${c.difficulty}</small></span><span class="level-state ${disk.completed.includes(c.id)?'complete':''}">${caseStatus(c)==='未开始'?icon('arrow'):caseStatus(c)}</span></button>`).join('')||'<p class="empty-list">本章没有符合筛选条件的案件。<br>可以切换上方章节，或选择“全部”。</p>'}</div>
      <footer class="book-footer full-footer"><button class="quiet-btn" data-action="rules">玩法手册</button><button class="quiet-btn" data-action="journal">调查记录</button><button class="quiet-btn" data-action="save-manager">存档管理</button><button class="quiet-btn" data-action="about">关于作品</button></footer></section>`;
  }

  function board(c,placed,interactive=true){
    const selected=interactive?game.selected:null;
    const occupant=Object.fromEntries(Object.entries(placed).map(([id,cell])=>[cell,id]));
    const usedRows=new Set(),usedCols=new Set();
    Object.entries(placed).forEach(([id,cell])=>{if(id!==selected){const [r,col]=E.pos(c,cell);usedRows.add(r);usedCols.add(col);}});
    const labelAt={};
    for(const a of c.areas){
      const candidates=a.cells.filter(i=>!E.objectsAt(c,i).length&&!occupant[i]);
      if(candidates.length)labelAt[candidates[candidates.length-1]]=a.name;
    }
    return `<div class="board-holder"><div class="coords-col" aria-hidden="true">${Array.from({length:c.size},(_,i)=>`<span>${NUM[i+1]}</span>`).join('')}</div><div class="board" role="group" aria-label="${NUM[c.size]}行${NUM[c.size]}列的现场地图" style="--size:${c.size};--label-font:${c.size>=7?8:12}px">${Array.from({length:c.size**2},(_,i)=>{
      const [r,col]=E.pos(c,i),a=c.areas.find(a=>a.id===E.areaAt(c,i)),objects=E.objectsAt(c,i),id=occupant[i],p=c.characters.find(p=>p.id===id);
      const dim=interactive&&!id&&(usedRows.has(r)||usedCols.has(col));
      const isLit=interactive&&(lit&&lit.type)==='area'&&a.id===lit.key,objectLit=interactive&&(lit&&lit.type)==='object'&&objects.some(o=>o.kind===lit.key);
      const classes=['cell',`terrain-${a.terrain}`,!E.passable(c,i)?'blocked':'',col<c.size&&E.areaAt(c,i+1)!==a.id?'edge-r':'',r<c.size&&E.areaAt(c,i+c.size)!==a.id?'edge-b':'',dim?'dimmed':'',isLit?'room-lit':'',objectLit?'object-lit':'',interactive&&hintCell===i?'hint-cell':''].filter(Boolean).join(' ');
      const excluded=interactive&&(game.excluded[selected]||[]).includes(i);
      const notes=interactive?c.characters.filter(ch=>(game.notes[ch.id]||[]).includes(i)):[];
      const aria=`第${NUM[r]}行第${NUM[col]}列，${a.name}${objects.map(o=>'，'+P.get(o.kind).name).join('')}${p?'，已放置'+p.name:''}${excluded?'，已排除当前动物':''}${notes.length?'，候选'+notes.map(n=>n.name).join('、'):''}`;
      const tag=interactive?'button':'div';
      return `<${tag} class="${classes}" ${interactive?`data-action="cell" data-cell="${i}" aria-label="${esc(aria)}"`:''}>${objects.map(o=>propImage(o.kind,`prop ${o.baseKind||P.get(o.kind).role}`)).join('')}${labelAt[i]?`<span class="region-label">${labelAt[i]}</span>`:''}${p?`<span class="token ${id===selected?'active-token':''} ${p.victim?'victim-token':''}">${img(p.kind,'',p.name)}${p.victim?'<span class="victim-dot">受害</span>':''}</span>`:excluded?'<span class="x-mark" aria-hidden="true">×</span>':notes.length?`<span class="notes">${notes.slice(0,3).map(n=>`<span class="note-chip">${n.name}</span>`).join('')}${notes.length>3?`<span class="note-chip">＋${notes.length-3}</span>`:''}</span>`:''}</${tag}>`;
    }).join('')}</div><div class="coords-row" style="--size:${c.size}" aria-hidden="true">${Array.from({length:c.size},(_,i)=>`<span>${NUM[i+1]}</span>`).join('')}</div></div>`;
  }
  function clueMarkup(char){
    const keywords=[...current.areas.map(a=>({text:a.name,type:'area',key:a.id})),...P.kinds(current).map(k=>({text:P.get(k).name,type:'object',key:k}))].sort((a,b)=>b.text.length-a.text.length);
    let source=char.clue.startsWith(char.name)?char.clue.slice(char.name.length):char.clue,output='';
    while(source.length){const next=keywords.map(k=>Object.assign({},k,{at:source.indexOf(k.text)})).filter(k=>k.at>=0).sort((a,b)=>a.at-b.at||b.text.length-a.text.length)[0];if(!next){output+=esc(source);break;}output+=esc(source.slice(0,next.at))+`<button class="keyword" data-action="highlight" data-type="${next.type}" data-key="${next.key}" data-owner="${char.id}" aria-label="在地图上定位${next.text}">${next.text}</button>`;source=source.slice(next.at+next.text.length);}
    return output;
  }
  function guidance(count){if(current.level>3||!disk.settings.guide)return '';const messages=['点整张证词卡选动物，再点地图空格。','每行每列只能一位，已经放好的位置仍可修改。','“身旁”只算同区上下左右一格。'];return `<aside class="guide">${img('owl')}<span>${messages[Math.min(count,2)]}</span><button data-action="dismiss-guide" aria-label="收起教学提示">×</button></aside>`;}
  function gameScreen(){
    const p=currentCharacter(),count=Object.keys(game.placed).length,zoom=game.zoom||1,columns=current.size<=4?2:current.size<=6?3:4;
    return `<section class="screen investigation" data-selected-animal="${game.selected}" style="--evidence-cols:${columns}"><header class="game-top paper"><button class="quiet-btn" data-action="home" aria-label="返回案卷">${icon('back')}</button><div><div class="eyebrow">第${current.number}案</div><h1>${current.title}</h1></div><button class="quiet-btn" data-action="rules" aria-label="查看玩法规则">${icon('book')}</button></header>
    <div class="game-workspace"><div class="scene-desk"><div class="game-status"><span class="active-animal" data-active-animal="${p.id}">正在${game.mode==='place'?'放置':game.mode==='note'?'暂记':'排除'}：<strong>${p.name}</strong></span><span>${count}／${current.size}</span>${disk.settings.timer?`<span data-elapsed>${timeText(game.seconds)}</span>`:''}</div>${guidance(count)}
    <div class="board-frame"><div class="map-viewport" style="--zoom:${zoom}" aria-label="现场地图，可在放大后拖动查看">${board(current,game.placed)}</div></div>
    <div class="map-controls"><span>${Math.round(zoom*100)}%</span><button class="quiet-btn" data-action="zoom-out" aria-label="缩小地图" ${zoom<=1?'disabled':''}>−</button><button class="quiet-btn" data-action="zoom-in" aria-label="放大地图" ${zoom>=2?'disabled':''}>＋</button><button class="quiet-btn" data-action="zoom-reset">适应</button><button class="quiet-btn" data-action="legend">图例</button></div>
    <section class="evidence-wall" aria-label="动物与完整线索"><div class="evidence-grid">${current.characters.map(ch=>`<article class="evidence-card ${ch.id===game.selected?'selected':''} ${game.checked.includes(ch.id)?'reviewed':''} ${game.placed[ch.id]!==undefined?'placed':''}" data-action="select" data-id="${ch.id}" data-card-id="${ch.id}" tabindex="0" role="group" aria-label="选择${ch.name}，${esc(ch.clue)}" aria-current="${ch.id===game.selected}"><button class="evidence-portrait" data-action="select" data-id="${ch.id}" aria-label="选择${ch.name}" aria-pressed="${ch.id===game.selected}">${img(ch.kind)}${ch.victim?'<span>受害者</span>':''}</button><div class="evidence-title"><button class="animal-name" data-action="select" data-id="${ch.id}" aria-pressed="${ch.id===game.selected}">${ch.name}</button><label class="clue-toggle"><input type="checkbox" data-clue-check="${ch.id}" ${game.checked.includes(ch.id)?'checked':''} aria-label="标记${ch.name}的线索已核对"><span>核对</span></label></div><p>${clueMarkup(ch)}</p>${game.placed[ch.id]!==undefined?`<span class="evidence-status">已放置 · ${positionText(game.placed[ch.id])}</span>`:''}</article>`).join('')}</div></section>
    <div class="tool-dock"><div class="selected-readout">${p.name} · ${game.mode==='place'?'放置':game.mode==='note'?'候选笔记':'排除笔记'}</div><nav class="toolbar" aria-label="推理工具">${[['place','place','放置'],['note','note','候选'],['exclude','x','排除']].map(([mode,ico,label])=>`<button class="tool" data-action="mode" data-mode="${mode}" aria-pressed="${game.mode===mode}" ${game.mode===mode?'data-active="true"':''}>${icon(ico)}<span>${label}</span></button>`).join('')}<button class="tool" data-action="undo" ${game.history.length?'':'disabled'}>${icon('undo')}<span>撤销</span></button><button class="tool" data-action="hint">${icon('hint')}<span>提示</span></button></nav></div>
    <div class="action-row"><button class="wood-btn primary" data-action="check" ${count===current.size?'':'disabled'}>${count===current.size?'检查现场，指认凶手':`还剩${NUM[current.size-count]}位动物未放置`}${count===current.size?icon('arrow'):''}</button><button class="wood-btn more" data-action="tools" aria-label="删除、重做与更多工具">${icon('more')}</button></div>
    <p class="mode-description">${game.mode==='place'?'点动物头像或名字选择，再点地图落子。':game.mode==='note'?`候选只暂记${p.name}的位置，不算正式落子。`:`排除只针对${p.name}，不影响其他动物。`}</p></div></div></section>`;
  }

  function layoutInvestigation(){
    if(view!=='game')return;
    const scene=document.querySelector('.scene-desk'),frame=document.querySelector('.board-frame'),wall=document.querySelector('.evidence-wall'),grid=document.querySelector('.evidence-grid');
    if(!scene||!frame||!wall||!grid||typeof scene.getBoundingClientRect!=='function')return;
    const height=(window.visualViewport&&window.visualViewport.height)||window.innerHeight||844;
    app.style.setProperty('--game-height',height+'px');
    const rect=scene.getBoundingClientRect(),children=Array.from(scene.children).filter(el=>el!==frame&&el!==wall&&getComputedStyle(el).display!=='none');
    const other=children.reduce((n,el)=>n+el.getBoundingClientRect().height,0)+5*(children.length+1);
    const side=Math.max(144,Math.min(rect.width,rect.height-other-grid.scrollHeight-4));
    frame.style.width=side+'px';frame.style.height=side+'px';
  }
  function render(){
    const oldMap=document.querySelector('.map-viewport'),oldWall=document.querySelector('.evidence-wall');
    const scroll={x:(oldMap&&oldMap.scrollLeft)||0,y:(oldMap&&oldMap.scrollTop)||0,wall:(oldWall&&oldWall.scrollTop)||0};
    document.body.dataset.screen=view;document.body.classList.toggle('large-text',disk.settings.largeText);document.body.classList.toggle('reduce-motion',disk.settings.reducedMotion);
    app.innerHTML=view==='home'?home():view==='game'?gameScreen():resolution();layoutInvestigation();window.FluffyWeb.layout();
    const map=document.querySelector('.map-viewport'),wall=document.querySelector('.evidence-wall');
    if(map){map.scrollLeft=scroll.x;map.scrollTop=scroll.y;}if(wall)wall.scrollTop=scroll.wall;
  }
  function openCase(id,force=false){
    persist();const c=CASES.find(c=>c.id===id);if(!c)return;
    current=c;chapterTab=c.chapterIndex;game=load(c);lit=null;hintCell=null;hint=null;
    if(disk.completed.includes(id)&&!force&&!game.attemptActive){view='resolution';replayIndex=c.steps.length;render();window.scrollTo(0,0);return;}
    view='game';persist();render();window.scrollTo(0,0);
    if(!game.started)showIntro();
  }
  function showIntro(){modal(current.title,`${chapterCover(current.chapterIndex,'intro-cover')}${current.level%5===1?`<p class="chapter-opening">${current.chapterStory}</p>`:''}<div class="eyebrow">第${current.level}关 · ${current.chapter} · ${NUM[current.size]}位动物</div><p style="margin-top:10px">${current.intro}</p><div style="clear:both"></div><div class="intro-rule">${current.premise}<br><strong>每行、每列恰好一位。所有线索均为真。</strong></div><div class="skill-note"><strong>本案关注：${current.focus}</strong>${current.skills.includes('above')?'<p>“高一行/两行”只比较行号，不要求同一列。</p>':''}${current.skills.includes('left')?'<p>“所在列更靠左”只比较列号，不要求同一行。</p>':''}${current.skills.includes('count')?'<p>区域人数包括该动物本人，也包括受害者。</p>':''}</div><p class="tiny muted">受害者也需要放回现场。图例随时可查，卡住时可向探长要一点提示。</p><button class="wood-btn primary full" data-action="start-investigation">展开现场 ${icon('arrow')}</button>`);}
  function tapCell(cell,override=false){
    const p=currentCharacter(),other=Object.entries(game.placed).find(([,at])=>at===cell);
    if(other){if(other[0]!==p.id){const occupant=current.characters.find(ch=>ch.id===other[0]);toast(`这里已有${occupant.name}；当前选择${p.name}，请点空格放置。`);}else toast(`${p.name}在${positionText(cell)}。点空格可移动。`);return;}
    if(!E.passable(current,cell))return toast(`${E.objectsAt(current,cell).map(o=>P.get(o.kind).name).join('、')}占据此格，不能放动物。`);
    if(game.mode==='place'){
      const problem=E.structural(current,game.placed,p.id,cell);if(problem)return toast(problem);
      if(!override&&(game.excluded[p.id]||[]).includes(cell)){pendingCell=cell;return modal('放在已排除的格子？',`<p>你曾把这里标为${p.name}不能出现的位置。仍要放置吗？这一步可以撤销。</p><button class="wood-btn primary full" data-action="override-place">仍然放置</button><button class="quiet-btn full" data-action="close-modal">保留标记</button>`);}
      mutate(()=>{game.placed[p.id]=cell;game.notes[p.id]=[];game.excluded[p.id]=[];});beep();
    }else{
      const field=game.mode==='note'?'notes':'excluded',opposite=field==='notes'?'excluded':'notes';
      mutate(()=>{const set=new Set(game[field][p.id]||[]);set.has(cell)?set.delete(cell):set.add(cell);game[field][p.id]=[...set];game[opposite][p.id]=(game[opposite][p.id]||[]).filter(i=>i!==cell);});beep(370);
    }
  }
  function showRules(){const list=P.kinds(current).map(P.get);modal('现场重建的规则',`<div class="rule-row"><b>一</b><p>每位动物只放一次，<strong>每行、每列恰好一位</strong>。受害者也要放，棋盘不需要填满。</p></div><div class="rule-row"><b>二</b><p>所有线索都是真实的。${list.filter(d=>d.occupiable).map(d=>d.name).join("、")}可以坐或站；${list.filter(d=>!d.occupiable).map(d=>d.name).join("、")}占格，不能站立。动物物种和表情不自动构成线索。</p></div><div class="rule-row"><b>三</b><p>“旁边”指<strong>同一区域的上下左右一格</strong>。斜角与跨区域都不算。</p></div><div class="mini-demo" aria-label="中央道具的四边相邻，四个斜角不相邻"><span class="no">×</span><span class="yes">✓</span><span class="no">×</span><span class="yes">✓</span><span>${propImage(P.theme(current).props.plant,'portrait')}</span><span class="yes">✓</span><span class="no">×</span><span class="yes">✓</span><span class="no">×</span></div><div class="rule-row"><b>四</b><p>案发时，<strong>受害者所在区域只有受害者和凶手</strong>。这是开局给定的案件条件。</p></div><div class="rule-row"><b>五</b><p>先选动物，再点空格放置。“候选”和“排除”是你的笔记；点“检查现场”后，再主动选择凶手。</p></div><p class="tiny muted">“地图外边缘”指最外一行或最外一列；“四个角之一”只指地图的四个角。大地图可放大后拖动查看。核对勾选是个人笔记，不等于系统验真。<br>“独处”表示区域里只有自己，受害者也不在；人数条件包括自己和受害者。“同一区域”不要求紧挨着。<br>“高一行/两行”只比较行，不要求同列；“所在列更靠左”只比较列，不要求同行。</p><button class="wood-btn full" data-action="close-modal">记住了</button>`);}
  function showLegend(){const t=P.theme(current);modal(t.name+' · 现场图例',`${P.kinds(current).map(k=>{const d=P.get(k);return `<div class="modal-cast-row">${propImage(k)}<div><strong>${d.name}</strong><p>${d.occupiable?'可以'+d.verb+'在这里，仍须满足行列与证词':'此道具占格，不可站立'}</p></div></div>`;}).join('')}<p class="tiny muted">每件道具占一格。粗线是区域边界，“旁边”只算同区上下左右一格。点证词中的道具名可以高亮地图上的同类道具。</p>`);}
  function showAllClues(){modal('全部已核实线索',current.characters.map(p=>`<div class="modal-cast-row">${img(p.kind)}<div><strong>${p.name}</strong> <span class="tiny muted">${KIND[p.kind]} · ${p.role}</span> ${p.victim?'<span class="victim-inline">受害者</span>':''}<p>${p.clue}</p>${game.placed[p.id]!==undefined?`<span class="clue-counter">已放置 · ${positionText(game.placed[p.id])}</span>`:''}</div></div>`).join(''));}
  function showTools(){modal('调查工具',`<div class="tools-list"><button class="wood-btn" data-action="delete-animal">删除当前动物</button><button class="wood-btn" data-action="redo">重做一步</button><button class="wood-btn" data-action="all-clues">全部线索</button><button class="wood-btn" data-action="legend">地图图例</button><button class="wood-btn" data-action="toggle-favorite">${disk.favorites.includes(current.id)?'取消收藏本案':'收藏本案'}</button><button class="wood-btn" data-action="save-manager">存档管理</button><button class="wood-btn" data-action="settings">声音与显示</button><button class="wood-btn" data-action="restart-confirm">重新调查本案</button></div><p class="tiny muted" style="margin-top:16px">移动、删除和笔记都可以撤销。重新调查会清空本案现场，已结案记录保留。</p>`);}
  function showSettings(){modal('声音与显示',`<label class="settings-row"><span>落子音效</span><input type="checkbox" data-setting="sound" ${disk.settings.sound?'checked':''}></label><label class="settings-row"><span>显示用时</span><input type="checkbox" data-setting="timer" ${disk.settings.timer?'checked':''}></label><label class="settings-row"><span>首案教学提示</span><input type="checkbox" data-setting="guide" ${disk.settings.guide?'checked':''}></label><label class="settings-row"><span>较大线索文字</span><input type="checkbox" data-setting="largeText" ${disk.settings.largeText?'checked':''}></label><label class="settings-row"><span>减少界面动效</span><input type="checkbox" data-setting="reducedMotion" ${disk.settings.reducedMotion?'checked':''}></label><p class="tiny muted">计时不影响结案，没有限时失败。进度和笔记保存在当前浏览器；清除浏览器数据会清除存档。</p><button class="wood-btn full" data-action="close-modal">保存设置</button>`);}
  function proofDetails(step){
    const rows=step.deductions||[];if(!rows.length)return '';
    const cells=indices=>indices.map(i=>{const [r,col]=E.pos(current,i);return `(${r},${col})`;}).join('、');
    return `<details class="deduction-proof"><summary>查看排除过程（${rows.length}步）</summary><p class="tiny muted">坐标依次为（行，列）。按当时剩余候选逐步推导。</p><ol>${rows.map(e=>`<li><strong>${esc(current.characters.find(p=>p.id===e.id).name)}的候选</strong><p>${esc(e.reason)}</p><p class="deduction-cells">排除：${cells(e.removed)}<br>剩余：${cells(e.remaining)}</p></li>`).join('')}</ol></details>`;
  }
  function showHint(stage=0){
    if(!E.solve(current,game.placed,1).length){
      const immediate=E.issues(current,game.placed)[0];
      let message=(immediate&&immediate.message);
      if(!message){const candidate=Object.keys(game.placed).find(id=>{const rest=Object.assign({},game.placed);delete rest[id];return E.solve(current,rest,1).length;});message=candidate?`当前落子无法同时满足全部线索。建议先复核${current.characters.find(p=>p.id===candidate).name}的位置，再继续推理。`:'当前落子中不止一处需要复核。先用撤销回到较早一步，再逐条检查线索。';}
      return modal('先复核当前现场',`<div class="hint-head">${img('owl')}<p>推理的前提需要先对齐。</p></div><div class="hint-explanation">${message}</div><p class="tiny muted">提示不会把手动候选或排除记号当成真实线索。</p><button class="wood-btn full" data-action="close-modal">回去检查</button>`);
    }
    const step=E.analyze(current,game.placed,E.MAX_STRATEGY).steps[0];
    if(!step)return toast('所有动物都已放好，可以检查现场并指认了。');
    if(stage===0){game.hints++;persist();}
    hint=Object.assign({},step,{stage});const p=current.characters.find(p=>p.id===step.id);
    modal('探长的提示',`<div class="hint-head">${img('owl')}<div><span class="eyebrow">${stage===0?'先看一条线索':'再推一步'}</span><p><strong>关注${p.name}</strong></p></div></div><div class="hint-explanation">${stage===0?`重新看看：<strong>${p.clue}</strong><br>结合已经放置的动物，哪些位置可以排除？`:step.why}</div>${stage===0?'':proofDetails(step)}<p class="tiny muted">提示只使用规则、线索与已放位置，手写标记不参与判断。</p><div class="hint-actions"><button class="wood-btn" data-action="close-modal">自己再想想</button><button class="wood-btn primary" data-action="${stage===0?'hint-explain':'hint-reveal'}">${stage===0?'解释下一步':'标出落点'}</button></div>`);
  }
  function check(){
    const problems=E.issues(current,game.placed,true);
    if(problems.length)return modal('现场还没有完全对上',`<div class="hint-head">${img('owl')}<p>位置放齐了，但有线索尚未满足。</p></div>${problems.slice(0,2).map(p=>`<div class="hint-explanation" style="margin-bottom:10px">${p.message}</div>`).join('')}<button class="wood-btn full" data-action="close-modal">回到现场</button>`);
    chosen=null;showAccusation();
  }
  function showAccusation(error=''){
    const v=current.characters.find(p=>p.victim);
    modal('谁与受害者独处？',`<p>现场已经满足全部线索。案发时，<strong>${v.name}所在区域只有两位动物</strong>。你要指认谁？</p><div class="accuse-grid">${current.characters.filter(p=>!p.victim).map(p=>`<button class="suspect-choice ${chosen===p.id?'chosen':''}" data-action="choose-culprit" data-id="${p.id}" aria-pressed="${chosen===p.id}">${img(p.kind)}<span><strong>${p.name}</strong><br><small>${p.role}</small></span></button>`).join('')}</div><p class="accuse-error" role="status">${error}</p><button class="wood-btn primary full" data-action="submit-culprit" ${chosen?'':'disabled'}>提交指认 ${icon('arrow')}</button><button class="quiet-btn full" data-action="close-modal">再看一眼现场</button>`);
  }
  function finish(){
    const culprit=E.culprit(current,game.placed);
    if(chosen!==culprit){game.wrongAccusations++;persist();const v=current.characters.find(p=>p.victim);return showAccusation(`再看看区域边界：你选择的动物没有与${v.name}单独处于同一区域。`);}
    if(!disk.completed.includes(current.id))disk.completed.push(current.id);
    game.attemptActive=false;const old=disk.records[current.id];disk.records[current.id]={solves:((old&&old.solves)||0)+1,bestSeconds:old?Math.min(old.bestSeconds,game.seconds):game.seconds,bestHints:old?Math.min(old.bestHints,game.hints):game.hints,lastFinishedAt:new Date().toISOString()};
    persist();closeModal();view='resolution';replayIndex=current.steps.length;render();window.scrollTo(0,0);beep(740);
  }
  function solution(){return Object.fromEntries(current.steps.map(s=>[s.id,s.cell]));}
  function resolution(){
    const solved=solution(),cid=E.culprit(current,solved),culprit=current.characters.find(p=>p.id===cid),victim=current.characters.find(p=>p.victim),area=E.areaAt(current,solved[victim.id]);
    const full=replayIndex>=current.steps.length,shown=full?solved:Object.fromEntries(current.steps.slice(0,replayIndex+1).map(s=>[s.id,s.cell]));
    const next=CASES[CASES.indexOf(current)+1];
    return `<section class="screen resolution"><header class="game-top paper"><button class="quiet-btn" data-action="home" aria-label="返回案卷">${icon('back')}</button><div><div class="eyebrow">${current.title}</div><h1>案件复盘</h1></div><span></span></header><article class="resolution-sheet paper"><span class="red-seal">案件已结</span>${img(culprit.kind,'big-portrait',culprit.name)}<h2>凶手是${culprit.name}</h2><p class="verdict">${area}里，只有${culprit.name}与${victim.name}。</p><p class="ending">${current.ending}</p>${current.level%5===0?`<p class="chapter-ending">${current.chapterEnding}</p>`:''}${disk.records[current.id]?`<p class="result-record">本次用时 ${timeText(game.seconds)} · 提示 ${game.hints} 次</p>`:''}${disk.completed.length===CASES.length?'<button class="wood-btn primary full" data-action="epilogue">翻到终章</button>':''}</article>
      <div class="replay-paper paper"><div class="replay-title"><span>${full?'完整现场':'第'+NUM[replayIndex+1]+'步定位'}</span><span class="tiny muted">${full?'全部线索已满足':(replayIndex+1)+'／'+current.steps.length}</span></div><div class="replay-board">${board(current,shown,false)}</div><div class="replay-step">${full?`每行每列恰好一位；全部线索成立。${area}只有${victim.name}与${culprit.name}，因此依据本案已知条件，${culprit.name}是凶手。`:current.steps[replayIndex].why}${full?'':proofDetails(current.steps[replayIndex])}</div><div class="replay-controls"><button class="wood-btn" data-action="replay-prev" ${replayIndex===0?'disabled':''}>${full?'逐步回看':'上一步'}</button><button class="wood-btn" data-action="replay-next" ${full?'disabled':''}>${replayIndex===current.steps.length-1?'查看全局':'下一步'}</button></div></div><div class="resolution-bottom"><button class="wood-btn" data-action="restart-confirm">重新调查</button><button class="wood-btn primary" data-action="${next?'open-case':'home'}" ${next?`data-case="${next.id}"`:''}>${next?'下一案':'返回案卷'} ${icon('arrow')}</button></div></section>`;
  }
  function showSaveManager(){
    modal('存档管理',`<p>进度会自动保存。当前使用此浏览器的本地存储。换设备或清理数据前，请先复制备份。</p><button class="wood-btn primary full" data-action="export-save">显示可复制的存档</button><label class="save-text-label">粘贴存档内容<textarea id="save-import-text" rows="5" maxlength="2000000" placeholder="在此粘贴同题库的 JSON 存档" spellcheck="false"></textarea></label><button class="wood-btn full" data-action="import-text">检查并导入</button><p class="tiny muted">请用系统的文本选择菜单手动复制或粘贴。导入会先显示确认；旧版题库不能导入。</p><button class="quiet-btn full" data-action="close-modal">返回游戏</button>`);
  }
  function exportSave(){
    persist();const text=window.FluffyWeb.compact(JSON.stringify(Object.assign({},disk,{exportedAt:new Date().toISOString()})));
    modal('备份调查记录',`<p>选择下面的存档文本，通过系统菜单手动复制并妥善保管。可以在存档管理中粘贴恢复。</p><textarea id="save-export-text" rows="8" readonly spellcheck="false">${esc(text)}</textarea><button class="wood-btn full" data-action="save-manager">返回存档管理</button>`);
    const field=document.getElementById('save-export-text');if(field&&typeof field.select==='function')field.select();
  }
  function importSaveText(){
    const field=document.getElementById('save-import-text'),text=field?field.value:'';
    try{pendingImport=S.parse(text,CASES);modal('确认导入存档',`<p>这份存档包含 ${Object.keys(pendingImport.games).length} 案现场、${pendingImport.completed.length} 案结案记录。</p><p>将合并结案记录；同名案件采用导入的现场，其他案件保留。</p><button class="wood-btn primary full" data-action="confirm-import">确认导入并合并</button><button class="quiet-btn full" data-action="cancel-import">保留当前存档</button>`);}catch(error){pendingImport=null;modal('无法导入',`<p>${esc(error.message)}</p><button class="wood-btn full" data-action="save-manager">返回存档管理</button>`);}
  }
  function confirmImport(){
    if(!pendingImport)return;
    disk=S.normalize(Object.assign({},disk,pendingImport,{games:Object.assign({},disk.games,pendingImport.games),completed:[...new Set([...disk.completed,...pendingImport.completed])],favorites:[...new Set([...disk.favorites,...pendingImport.favorites])],records:Object.assign({},disk.records,pendingImport.records)}),CASES);
    pendingImport=null;current=null;game=null;view='home';save();closeModal();render();window.scrollTo(0,0);toast('存档已导入，可以继续调查。');
  }
  function showJournal(){
    const rows=[...new Map(CASES.map(c=>[c.chapterIndex,c.chapter])).entries()].map(([i,title])=>{const items=CASES.filter(c=>c.chapterIndex===i),done=items.filter(c=>disk.completed.includes(c.id)).length;return `<div class="journal-row"><strong>${title}</strong><span>${done} / ${items.length}</span></div>`;}).join('');
    const complete=Object.values(disk.records),time=complete.reduce((n,r)=>n+r.bestSeconds,0),noHint=complete.filter(r=>r.bestHints===0).length;
    modal('调查记录',`<p class="journal-total">已结案 ${disk.completed.length} / ${CASES.length}</p>${rows}<p>已收藏 ${disk.favorites.length} 案；记录过 ${noHint} 案无提示结案。<br>有计时记录的案件最佳用时合计：${timeText(time)}。</p><p class="tiny muted">这里记录新版题目的进度，原版结案记录保存在原版中。计时和提示都不影响通关。</p>${disk.completed.length===CASES.length?'<button class="wood-btn primary full" data-action="epilogue">翻到终章</button>':''}<button class="wood-btn full" data-action="close-modal">继续调查</button>`);
  }
  function showEpilogue(){
    if(disk.completed.length!==CASES.length)return toast('三十案全部结案后，会展开最后一页。');
    modal('最后一页',`${chapterCover(5,'intro-cover')}<p>第三十份笔记被放回书架，窗外恰好天亮。</p><p>“我们没有靠表情判断谁可疑，也没有因为谁先开口就先相信谁。”探长把笔交还给你，“我们只是把每一句话，放回了它能成立的地方。”</p><p>三十个现场已经归档。你仍可以重玩任一案件、回看推导，或导出这份完整的调查记录。</p><p>谢谢你，完成了《毛茸茸的不在场证明》。</p><button class="wood-btn primary full" data-action="save-manager">备份我的调查记录</button><button class="quiet-btn full" data-action="close-modal">回到案卷</button>`);
  }
  function setZoom(next){
    const viewport=document.querySelector('.map-viewport'),old=game.zoom||1,x=(viewport&&viewport.scrollLeft)||0,y=(viewport&&viewport.scrollTop)||0;
    game.zoom=next;persist();render();const updated=document.querySelector('.map-viewport');if(updated){updated.scrollLeft=x*next/old;updated.scrollTop=y*next/old;}
  }
  function scrollToMap(){const target=document.querySelector('.hint-cell');if(target)target.scrollIntoView({block:'nearest',inline:'nearest'});}

  function timeText(seconds){return `${Math.floor(seconds/60)}分${String(seconds%60).padStart(2,'0')}秒`;}
  document.addEventListener('click',event=>{
    const el=event.target.closest('[data-action]');if(!el||el.disabled)return;
    if(event.target.closest('.clue-toggle'))return;
    const action=el.dataset.action;
    switch(action){
      case 'chapter':chapterTab=Number(el.dataset.chapter);render();break;
      case 'open-case':closeModal();openCase(el.dataset.case);break;
      case 'start-investigation':game.started=true;persist();closeModal();break;
      case 'home':persist();closeModal();view='home';render();window.scrollTo(0,0);break;
      case 'close-modal':closeModal();break;
      case 'select':select(el.dataset.id);break;
      case 'cell':tapCell(Number(el.dataset.cell));break;
      case 'mode':game.mode=el.dataset.mode;persist();render();break;
      case 'undo':undo();break;
      case 'redo':closeModal();undo(true);break;
      case 'rules':showRules();break;
      case 'legend':showLegend();break;
      case 'all-clues':showAllClues();break;
      case 'tools':showTools();break;
      case 'settings':showSettings();break;
      case 'dismiss-guide':disk.settings.guide=false;save();render();break;
      case 'highlight':if(el.dataset.owner&&game.selected!==el.dataset.owner){game.selected=el.dataset.owner;persist();}lit=(lit&&lit.type)===el.dataset.type&&(lit&&lit.key)===el.dataset.key?null:{type:el.dataset.type,key:el.dataset.key};render();break;
      case 'delete-animal':closeModal();if(game.placed[game.selected]===undefined)toast('当前动物还没有正式放置。');else{mutate(()=>delete game.placed[game.selected]);beep(300);}break;
      case 'override-place':closeModal();tapCell(pendingCell,true);break;
      case 'hint':showHint(0);break;
      case 'hint-explain':showHint(1);break;
      case 'hint-reveal':{const h=hint;if(!h)return;closeModal();game.selected=h.id;hintCell=h.cell;lit=null;persist();render();scrollToMap();toast(`${currentCharacter().name}的下一步落点已用虚线标出。`);break;}
      case 'check':check();break;
      case 'choose-culprit':chosen=el.dataset.id;showAccusation();break;
      case 'submit-culprit':finish();break;
      case 'replay-prev':replayIndex=replayIndex>=current.steps.length?0:Math.max(0,replayIndex-1);render();break;
      case 'replay-next':replayIndex=Math.min(current.steps.length,replayIndex+1);render();break;
      case 'restart-confirm':modal('重新调查这宗案件？',`<p>本案的落子、候选与排除笔记将清空。其他案件和已结案记录不受影响。</p><button class="wood-btn primary full" data-action="restart">重新调查</button><button class="quiet-btn full" data-action="close-modal">保留现场</button>`);break;
      case 'restart':game=fresh(current);disk.games[current.id]=game;closeModal();openCase(current.id,true);break;
      case 'save-manager':showSaveManager();break;
      case 'export-save':exportSave();break;
      case 'import-text':importSaveText();break;
      case 'confirm-import':confirmImport();break;
      case 'cancel-import':pendingImport=null;showSaveManager();break;
      case 'journal':showJournal();break;
      case 'epilogue':showEpilogue();break;
      case 'toggle-favorite':{const id=current.id;disk.favorites=disk.favorites.includes(id)?disk.favorites.filter(x=>x!==id):[...disk.favorites,id];save();showTools();break;}
      case 'zoom-in':setZoom((game.zoom||1)===1?1.5:2);break;
      case 'zoom-out':setZoom((game.zoom||1)===2?1.5:1);break;
      case 'zoom-reset':setZoom(1);break;
      case 'font-license':modal('像素字体许可',`<p>Fusion Pixel Font · TakWolf<br>字体采用 SIL Open Font License 1.1。字体及上游许可原文随本地包提供。</p><pre class="license-text">${esc(FONT_LICENSE)}</pre><button class="wood-btn full" data-action="close-modal">返回</button>`);break;
      case 'about':modal('关于作品',`${img('cover','opening-cover','毛茸茸的不在场证明竖版封面')}${img('owl','intro-portrait','探长')}<p><strong>毛茸茸的不在场证明</strong>是一款中文动物题材的空间逻辑推理游戏。本地完整版本包含六章、三十个独立案件，地图从 4×4 递进至 8×8，从四位动物的入门现场逐步递进。</p><p>参考 Murdoku 的行列、区域、物件与真实证词设计，案件和中文故事均为本项目内容。包括道具定位、区域人数、独处与同区关系、双位和三位行列组合、分层提示、逐步复盘、线索核对、收藏与存档备份。</p><p>16 套场景主题、64 件像素道具和简单动物昵称已经内置，证词与图例随场景切换。全部运行在本地，无账号、无联网服务；可以自由选择任一案件。</p><button class="wood-btn full" data-action="font-license">像素字体许可</button><button class="quiet-btn full" data-action="close-modal">回到案卷</button>`);break;
    }
  });
  document.addEventListener('change',event=>{if(event.target.matches('[data-filter]')){caseFilter=event.target.value;render();return;}if(event.target.dataset.clueCheck){const id=event.target.dataset.clueCheck;mutate(()=>{game.checked=game.checked.includes(id)?game.checked.filter(x=>x!==id):[...game.checked,id];});return;}const key=event.target.dataset.setting;if(!key)return;disk.settings[key]=event.target.checked;save();render();if(key==='sound')beep();});
  dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)closeModal();}});
  document.addEventListener('keydown',event=>{
    if(view!=='game'||dialog.open||event.target.matches('input,textarea'))return;
    if(event.key==='Enter'&&event.target.matches('.evidence-card')){event.preventDefault();select(event.target.dataset.id);return;}
    if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='z'){event.preventDefault();undo(event.shiftKey);return;}
    const cell=event.target.closest('[data-cell]');
    if(cell&&['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)){
      const i=Number(cell.dataset.cell),delta={ArrowLeft:-1,ArrowRight:1,ArrowUp:-current.size,ArrowDown:current.size}[event.key],next=i+delta;
      if((event.key!=='ArrowLeft'||i%current.size!==0)&&(event.key!=='ArrowRight'||i%current.size!==current.size-1)&&next>=0&&next<current.size**2){event.preventDefault();const focusTarget=app.querySelector(`[data-cell="${next}"]`);if(focusTarget)focusTarget.focus();}
    }
  });
  setInterval(()=>{if(view==='game'&&game.started&&!document.hidden&&!dialog.open){game.seconds++;const timer=document.querySelector('[data-elapsed]');if(timer)timer.textContent=timeText(game.seconds);if(game.seconds%15===0)persist();}},1000);
  window.addEventListener('pagehide',persist);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)persist();});
  window.addEventListener('resize',layoutInvestigation);
  if(window.visualViewport)window.visualViewport.addEventListener('resize',layoutInvestigation);
  render();
})();

}).catch(function(error){document.getElementById("app").textContent="案卷打开失败，请刷新后重试；原存档不会被清除。";});