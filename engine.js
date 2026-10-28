(function (root) {
  'use strict';
  const pos = (c, i) => [Math.floor(i / c.size) + 1, i % c.size + 1];
  const index = (c, r, col) => (r - 1) * c.size + col - 1;
  const maps=new WeakMap();
  function mapFor(c){if(!maps.has(c)){const areas=[],objects=[];for(const a of c.areas)for(const cell of a.cells)areas[cell]=a.id;for(const o of c.objects)(objects[o.cell]||(objects[o.cell]=[])).push(o);maps.set(c,{areas,objects});}return maps.get(c);}
  const areaAt = (c, i) => mapFor(c).areas[i];
  const objectsAt = (c, i) => mapFor(c).objects[i]||[];
  const passable = (c, i) => Number.isInteger(i) && i >= 0 && i < c.size ** 2 && !objectsAt(c, i).some(o => !o.occupiable);
  function staticMatch(c, cell, rule) {
    if (rule.type === 'any') return rule.rules.some(r=>staticMatch(c,cell,r));
    if (rule.type === 'edge') { const [r,col]=pos(c,cell);return r===1||col===1||r===c.size||col===c.size; }
    if (rule.type === 'corner') { const [r,col]=pos(c,cell);return (r===1||r===c.size)&&(col===1||col===c.size); }
    if (rule.type === 'not-beside') return !staticMatch(c,cell,{type:'beside',kind:rule.kind});
    if (rule.type === 'on') return c.objects.some(o => o.cell === cell && o.kind === rule.kind && (!rule.area || areaAt(c, cell) === rule.area));
    if (rule.type === 'in') return areaAt(c, cell) === rule.area;
    if (rule.type === 'not-in') return areaAt(c, cell) !== rule.area;
    if (rule.type === 'not-on') return !c.objects.some(o => o.cell === cell && o.kind === rule.kind);
    if (rule.type === 'beside') return c.objects.some(o => {
      const [r, col] = pos(c, cell), [or, oc] = pos(c, o.cell);
      return o.kind === rule.kind && areaAt(c, cell) === areaAt(c, o.cell) && Math.abs(r - or) + Math.abs(col - oc) === 1;
    });
    if (['with','apart','above','left','alone','count'].includes(rule.type)) return true;
    throw new Error('未知线索规则：'+rule.type);
  }
  function compatible(c,a,at,b,bt){
    const [ar,ac]=pos(c,at),[br,bc]=pos(c,bt);
    if(ar===br||ac===bc)return false;
    for(const [p,cell,q,other] of [[a,at,b,bt],[b,bt,a,at]])for(const r of p.rules){
      if(r.type==='alone'&&areaAt(c,cell)===areaAt(c,other))return false;
      if(r.other!==q.id)continue;
      if(r.type==='with'&&areaAt(c,cell)!==areaAt(c,other))return false;
      if(r.type==='apart'&&areaAt(c,cell)===areaAt(c,other))return false;
      if(r.type==='above'&&pos(c,cell)[0]!==pos(c,other)[0]-r.rows)return false;
      if(r.type==='left'&&pos(c,cell)[1]>=pos(c,other)[1])return false;
    }
    return true;
  }
  function domain(c, char) {
    return Array.from({ length: c.size ** 2 }, (_, i) => i).filter(i => passable(c, i) && char.rules.every(rule => staticMatch(c, i, rule)));
  }
  function issues(c, placed, complete = false, knownDomains) {
    const result = [], occupants = Object.entries(placed);
    for (const [id, cell] of occupants) {
      const char = c.characters.find(p => p.id === id);
      if (!char || !passable(c, cell)) { result.push({ id, message: '该位置不能放置动物。' }); continue; }
      for (const rule of char.rules) {
        let valid = staticMatch(c, cell, rule);
        if (rule.type === 'alone') valid = !occupants.some(([other, at]) => other !== id && areaAt(c, at) === areaAt(c, cell));
        if (rule.type === 'with' && placed[rule.other] !== undefined) valid = areaAt(c, placed[rule.other]) === areaAt(c, cell);
        if (rule.type === 'above' && placed[rule.other] !== undefined) valid = pos(c, cell)[0] === pos(c, placed[rule.other])[0] - rule.rows;
        if (rule.type === 'left' && placed[rule.other] !== undefined) valid = pos(c, cell)[1] < pos(c, placed[rule.other])[1];
        if (rule.type === 'apart' && placed[rule.other] !== undefined) valid = areaAt(c, placed[rule.other]) !== areaAt(c, cell);
        if(rule.type==='count'){
          const n=occupants.filter(([,at])=>areaAt(c,at)===areaAt(c,cell)).length;
          valid=n<=rule.count&&(!complete||n===rule.count);
        }
        if (!valid) result.push({ id, message: `${char.name}的位置不符合线索：${char.clue}` });
      }
    }
    for (let a = 0; a < occupants.length; a++) for (let b = a + 1; b < occupants.length; b++) {
      const [aid, ai] = occupants[a], [bid, bi] = occupants[b];
      const [ar, ac] = pos(c, ai), [br, bc] = pos(c, bi);
      if (ar === br || ac === bc) result.push({ id: aid, other: bid, message: ar === br ? '同一行只能有一位动物。' : '同一列只能有一位动物。' });
    }
    const victim = c.characters.find(p => p.victim);
    if (placed[victim.id] !== undefined) {
      const count = occupants.filter(([, cell]) => areaAt(c, cell) === areaAt(c, placed[victim.id])).length;
      if (count > 2 || (complete && count !== 2)) result.push({ id: victim.id, message: '案发区域内必须只有受害者和凶手。' });
    }
    if (complete && occupants.length !== c.characters.length) result.push({ message: '请先放齐所有动物，包括受害者。' });
    for(const g of c.generalClues||[]){
      const matched=occupants.filter(([,cell])=>staticMatch(c,cell,g.where)).length;let minimum=matched,maximum=matched;
      for(const p of c.characters)if(placed[p.id]===undefined){const options=(knownDomains?knownDomains[p.id]:domain(c,p)).filter(i=>!structural(c,placed,p.id,i));if(options.length&&options.every(i=>staticMatch(c,i,g.where)))minimum++;if(options.some(i=>staticMatch(c,i,g.where)))maximum++;}
      if(minimum>g.count||maximum<g.count||(complete&&matched!==g.count))result.push({general:g.id,message:'通用线索未满足：'+g.text});
    }
    return result;
  }
  function structural(c, placed, id, cell) {
    if (!passable(c, cell)) return '此道具占据了格子，不能站立；可查看本案图例。';
    const [r, col] = pos(c, cell);
    for (const [other, at] of Object.entries(placed)) {
      if (other === id) continue;
      const [or, oc] = pos(c, at);
      if (at === cell) return '这个格子已经有动物。';
      if (r === or) return '同一行只能有一位动物。';
      if (col === oc) return '同一列只能有一位动物。';
    }
    return null;
  }
  function solve(c, given = {}, limit = 2) {
    const domains = Object.fromEntries(c.characters.map(p => [p.id, domain(c, p)]));
    if (issues(c, given, false, domains).length) return [];
    const answers = [];
    function search(placed) {
      if (answers.length >= limit) return;
      if (Object.keys(placed).length === c.characters.length) {
        if (!issues(c, placed, true).length) answers.push(Object.assign({},placed));
        return;
      }
      const todo = c.characters.filter(p => placed[p.id] === undefined).map(p => ({ p, options: domains[p.id].filter(cell => !structural(c, placed, p.id, cell) && !issues(c, Object.assign({},placed,{[p.id]:cell}), false, domains).length) })).sort((a, b) => a.options.length - b.options.length);
      const next = todo[0];
      for (const cell of next.options) search(Object.assign({},placed,{[next.p.id]:cell}));
    }
    search(Object.assign({},given));
    return answers;
  }
  const coord=(c,i)=>{const [r,col]=pos(c,i);return `第${r}行第${col}列`;};
  const MAX_STRATEGY=4;
  function analyze(c,given={},maxStrategy=MAX_STRATEGY){
    const chars=c.characters,domains=Object.fromEntries(chars.map(p=>[p.id,given[p.id]===undefined?domain(c,p):[given[p.id]]])),placed=Object.assign({},given),steps=[],events=[],why={};
    const metrics={initialCandidates:Object.values(domains).reduce((n,a)=>n+a.length,0),maxStrategy:0,relationReductions:0,pairReductions:0,tripleReductions:0,quadReductions:0,jointReductions:0,globalReductions:0,eliminations:0};
    const positions=Object.fromEntries(chars.map((p,i)=>[p.id,i])),pairCache=new Map(),cells=c.size*c.size;
    const canPair=(p,i,q,j)=>{let a=positions[p.id],b=positions[q.id];if(a>b){[a,b]=[b,a];[i,j]=[j,i];[p,q]=[q,p];}const key=((a*chars.length+b)*cells+i)*cells+j;let value=pairCache.get(key);if(value===undefined){value=compatible(c,p,i,q,j);pairCache.set(key,value);}return value;};
    let changed=true,round=0,eventCursor=0;
    const reduce=(p,keep,reason,rank,technique='',witness=null)=>{
      const before=domains[p.id],next=before.filter(keep);if(next.length===before.length)return false;
      domains[p.id]=next;why[p.id]=reason;changed=true;metrics.maxStrategy=Math.max(metrics.maxStrategy,rank);metrics.eliminations+=before.length-next.length;
      if(rank===1)metrics.relationReductions++;if(rank===2)metrics.pairReductions++;if(rank===3)metrics.tripleReductions++;
      if(technique==='quad')metrics.quadReductions++;if(technique==='joint')metrics.jointReductions++;
      if(technique==='global')metrics.globalReductions++;
      events.push({id:p.id,rank,technique,witness,reason,removed:before.filter(i=>!next.includes(i)),remaining:[...next]});return true;
    };
    while(changed&&round++<120){
      changed=false;
      for(const p of chars){
        if(!domains[p.id].length)return {solved:false,contradiction:true,domains,steps,events,metrics};
        if(domains[p.id].length===1&&placed[p.id]===undefined){
          const cell=domains[p.id][0];placed[p.id]=cell;
          const deductions=events.slice(eventCursor).map(e=>({id:e.id,rank:e.rank,reason:e.reason,removed:[...e.removed],remaining:[...e.remaining]}));eventCursor=events.length;
          steps.push({id:p.id,cell,why:(why[p.id]?why[p.id]+' ':'')+`${p.name}只剩${coord(c,cell)}。`,strategy:metrics.maxStrategy,deductions});changed=true;
        }
      }
      for(const p of chars)if(placed[p.id]===undefined)reduce(p,i=>!structural(c,placed,p.id,i),`已放动物占据的行列不能再放其他动物，结合「${p.clue}」排除冲突格。`,0);
      for(let line=1;line<=c.size;line++)for(const axis of [0,1]){
        if(Object.values(placed).some(i=>pos(c,i)[axis]===line))continue;
        const options=chars.filter(p=>placed[p.id]===undefined).flatMap(p=>domains[p.id].filter(i=>pos(c,i)[axis]===line).map(i=>({p,i})));
        if(options.length===1){const {p,i}=options[0];reduce(p,x=>x===i,`第${line}${axis===0?'行':'列'}必须有一位动物，而这一行列只剩${p.name}能在${coord(c,i)}。`,0);}
      }
      if(changed)continue;
      if(maxStrategy>=1)for(const g of c.generalClues||[])for(const p of chars){
        const others=chars.filter(q=>q!==p),minimum=others.filter(q=>domains[q.id].length&&domains[q.id].every(i=>staticMatch(c,i,g.where))).length,maximum=others.filter(q=>domains[q.id].some(i=>staticMatch(c,i,g.where))).length;
        reduce(p,i=>{const own=staticMatch(c,i,g.where)?1:0;return minimum+own<=g.count&&maximum+own>=g.count;},'结合通用线索「'+g.text+'」，比较已确定与可能符合条件的动物数。',1,'global',{id:g.id});
      }
      if(changed)continue;
      if(maxStrategy>=1){
        for(const p of chars)for(const q of chars){
          if(p===q)continue;
          const relevant=p.rules.some(r=>r.other===q.id||r.type==='alone')||q.rules.some(r=>r.other===p.id||r.type==='alone');
          if(!relevant)continue;
          const relation=p.rules.find(r=>r.other===q.id||r.type==='alone')?p:q;
          reduce(p,i=>domains[q.id].some(j=>canPair(p,i,q,j)),`联动线索「${relation.clue}」与${q.name}的候选位置，排除不能同时成立的位置。`,1);
        }
        for(const p of chars){
          const count=p.victim?2:(p.rules.find(r=>r.type==='count')||{}).count;
          if(!count)continue;
          reduce(p,i=>{
            const a=areaAt(c,i),other=chars.filter(q=>q!==p);
            const min=1+other.filter(q=>domains[q.id].length&&domains[q.id].every(j=>areaAt(c,j)===a)).length;
            const max=1+other.filter(q=>domains[q.id].some(j=>areaAt(c,j)===a)).length;
            return min<=count&&max>=count;
          },(p.victim?'案发区域内只有受害者和凶手，总共2位':`${p.name}所在区域必须恰有${count}位动物，包含自己`)+`；比较各区域可能与必须出现的动物数。`,1);
          const candidateAreas=[...new Set(domains[p.id].map(i=>areaAt(c,i)))];
          if(candidateAreas.length===1){
            const a=candidateAreas[0],forced=chars.filter(q=>domains[q.id].length&&domains[q.id].every(i=>areaAt(c,i)===a)),possible=chars.filter(q=>domains[q.id].some(i=>areaAt(c,i)===a));
            if(forced.length===count)for(const q of chars.filter(q=>!forced.includes(q)))reduce(q,i=>areaAt(c,i)!==a,`${a}的${count}位动物名额已由${forced.map(q=>q.name).join('、')}占据，其余动物必须在别处。`,1);
            if(possible.length===count)for(const q of possible)reduce(q,i=>areaAt(c,i)===a,`${a}需要${count}位动物，而只有${possible.map(q=>q.name).join('、')}可能进入，因此这些动物都在此区域。`,1);
          }
        }
      }
      if(changed)continue;
      if(maxStrategy>=2){
        const todo=chars.filter(p=>placed[p.id]===undefined);
        for(let a=0;a<todo.length;a++)for(let b=a+1;b<todo.length;b++)for(const axis of [0,1]){
          const p=todo[a],q=todo[b],lines=[...new Set([...domains[p.id],...domains[q.id]].map(i=>pos(c,i)[axis]))];
          if(lines.length!==2)continue;
          for(const other of todo.filter(r=>r!==p&&r!==q))reduce(other,i=>!lines.includes(pos(c,i)[axis]),`${p.name}和${q.name}只能占据第${lines.sort((a,b)=>a-b).join('、')}${axis===0?'行':'列'}，这两条行列必须留给它们。`,2);
        }
        for(const p of todo)if(domains[p.id].length>1)for(const q of todo.filter(q=>q!==p))reduce(q,i=>domains[p.id].some(j=>{const [r,co]=pos(c,i),[rr,cc]=pos(c,j);return r!==rr&&co!==cc;}),`无论${p.name}落在哪个候选格，与它所有候选都冲突的交叉位置都不能再放${q.name}。`,2);
      }
      if(changed)continue;
      if(maxStrategy>=3){
        const todo=chars.filter(p=>placed[p.id]===undefined);
        for(let a=0;a<todo.length;a++)for(let b=a+1;b<todo.length;b++)for(let d=b+1;d<todo.length;d++)for(const axis of [0,1]){
          const group=[todo[a],todo[b],todo[d]],lines=[...new Set(group.flatMap(p=>domains[p.id]).map(i=>pos(c,i)[axis]))];
          if(lines.length!==3)continue;
          for(const other of todo.filter(p=>!group.includes(p)))reduce(other,i=>!lines.includes(pos(c,i)[axis]),`${group.map(p=>p.name).join('、')}三位动物只能落在第${lines.sort((a,b)=>a-b).join('、')}${axis===0?'行':'列'}，三条行列被它们恰好占满，其余动物必须让开。`,3);
        }
      }
      if(changed)continue;
      if(maxStrategy>=4){
        const todo=chars.filter(p=>placed[p.id]===undefined);
        for(let a=0;a<todo.length;a++)for(let b=a+1;b<todo.length;b++)for(let d=b+1;d<todo.length;d++)for(let e=d+1;e<todo.length;e++)for(const axis of [0,1]){
          const group=[todo[a],todo[b],todo[d],todo[e]],lines=[...new Set(group.flatMap(p=>domains[p.id]).map(i=>pos(c,i)[axis]))];
          if(lines.length!==4)continue;
          for(const other of todo.filter(p=>!group.includes(p)))reduce(other,i=>!lines.includes(pos(c,i)[axis]),`${group.map(p=>p.name).join('、')}四位动物只能占据第${lines.sort((a,b)=>a-b).join('、')}${axis===0?'行':'列'}；四条行列恰好占满，其他动物必须在别处。`,4,'quad',{group:group.map(p=>p.id),axis,lines:[...lines]});
        }
        if(changed)continue;
        for(const p of todo)for(let a=0;a<todo.length;a++)for(let b=a+1;b<todo.length;b++){
          const q=todo[a],r=todo[b];if(p===q||p===r)continue;
          const group=[p,q,r];if(!group.some(x=>x.rules.some(rule=>rule.other&&group.some(y=>y.id===rule.other))))continue;
          const rejected=[];
          for(const i of domains[p.id]){
            const qs=domains[q.id].filter(j=>canPair(p,i,q,j)),rs=domains[r.id].filter(k=>canPair(p,i,r,k));
            if(!qs.some(j=>rs.some(k=>canPair(q,j,r,k))))rejected.push(i);
          }
          if(!rejected.length)continue;
          const blocked=new Set(rejected),where=rejected.slice(0,3).map(i=>coord(c,i)).join('、')+(rejected.length>3?'等位置':'');
          reduce(p,i=>!blocked.has(i),`把${p.name}与${q.name}、${r.name}的证词合看：若${p.name}在${coord(c,rejected[0])}，另外两位找不到同时符合证词且不同行同列的一组位置。因此排除${where}。`,4,'joint',{partners:[q.id,r.id]});
        }
      }
    }
    const solved=Object.keys(placed).length===chars.length&&!issues(c,placed,true).length;
    return {solved,contradiction:Object.values(domains).some(d=>!d.length),placed,domains,steps,events,metrics};
  }
  function culprit(c, placed) {
    if (issues(c, placed, true).length) return null;
    const victim = c.characters.find(p => p.victim);
    return (c.characters.find(p => !p.victim && areaAt(c, placed[p.id]) === areaAt(c, placed[victim.id]))||{}).id || null;
  }
  const api = { pos, index, areaAt, objectsAt, passable, matches:staticMatch, domain, issues, structural, solve, culprit, compatible, analyze, MAX_STRATEGY };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.ForestEngine = api;
})(typeof window !== 'undefined' ? window : this);
