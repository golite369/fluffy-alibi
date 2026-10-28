(function(){
 'use strict';
 if(typeof Object.fromEntries!=='function')Object.fromEntries=function(entries){const out={};for(const item of entries)Object.defineProperty(out,item[0],{value:item[1],enumerable:true,writable:true,configurable:true});return out;};
 if(typeof Array.prototype.flatMap!=='function')Object.defineProperty(Array.prototype,'flatMap',{value:function(fn,that){const out=[];for(let i=0;i<this.length;i++)if(i in this){const value=fn.call(that,this[i],i,this);if(Array.isArray(value)){for(let j=0;j<value.length;j++)if(j in value)out.push(value[j]);}else out.push(value);}return out;},writable:true,configurable:true});
})();(function(){
 const flex=document.createElement('div');flex.style.position='absolute';flex.style.visibility='hidden';flex.style.display='flex';flex.style.flexDirection='column';flex.style.rowGap='1px';flex.appendChild(document.createElement('div'));flex.appendChild(document.createElement('div'));document.body.appendChild(flex);const supported=flex.scrollHeight===1;document.body.removeChild(flex);document.documentElement.classList.toggle('no-flex-gap',!supported);
 function viewport(){const height=window.visualViewport&&window.visualViewport.height||window.innerHeight;if(Number.isFinite(height)&&height>0)document.documentElement.style.setProperty('--app-height',height+'px');}
 viewport();window.addEventListener('resize',viewport);if(window.visualViewport&&typeof window.visualViewport.addEventListener==='function')window.visualViewport.addEventListener('resize',viewport);
})();
