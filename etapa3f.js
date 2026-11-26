/* CocoaCacao etapa 3F: barra inferior, ítems compuestos con mano de obra y energía, y productos de receta como ítems compuestos */
Object.assign(CHK,{etapa3f:()=>typeof prodWin});

/* Barra inferior: caben todas las pestañas */
const st12=document.createElement('style');
st12.textContent='nav{overflow-x:auto}nav button{flex:1 1 auto!important;min-width:0!important;padding:0 3px!important;font-size:9.5px!important;line-height:1.1!important;white-space:normal}';
document.head.appendChild(st12);
const nbm=document.querySelector('nav button[data-t=ins]');if(nbm)nbm.textContent='Materiales';

/* Costo de mano de obra y energía de un ítem compuesto */
const dxC=dx=>{if(!dx)return 0;const G=S.cfg,pg=G.gBs/(G.gKg*1000),rate=G.sueldo/Math.max(1,G.dias*G.hdia*60);let c=num(dx.min)*rate;
 (dx.uso||[]).forEach(u=>{const e=S.eq.find(x=>x.id==u.e);if(!e)return;const m=num(u.m);if(u.g)c+=num(e.gh)*m/60*pg;if(u.l)c+=num(e.w)/1000*m/60*(G.kwh??1)});return c};
compRefresh=function(){for(let pass=0;pass<3;pass++)S.ins.forEach(i=>{
 if(i.der){const p=S.ins.find(x=>x.id==i.der.from);if(p){const pc=num(i.der.pct)/100;i.p=num(p.p)*pc+dxC(i.dx)*pc;i.q=num(p.q)*pc;i.u=p.u;i.cat=dc(p)}}
 else if(i.mix){let g=0,c=0;i.mix.forEach(m=>{const x=S.ins.find(z=>z.id==m.i);if(x){g+=num(m.g);c+=num(m.g)*ppg(x)}});i.q=g;i.p=c+dxC(i.dx);i.u='g'}
 else if(i.prod){const r=S.rec.find(x=>x.id==i.prod.r),p=r&&(r.pres||[]).find(x=>x.id==i.prod.p);
  if(r&&p&&num(p.w)>0){const q=Math.max(1,num(p.q)),u=uCost(cost(r),p,r);i.q=num(p.w)*q;i.p=u*q;i.u='g'}}})};

/* Tarjeta de ítem compuesto (derivado, mezcla o producto de receta) */
compH=function(c){const u=c.u=='u'?'u':c.u,x=dxC(c.dx),rc=c.prod?S.rec.find(z=>z.id==c.prod.r):null,pp=rc?(rc.pres||[]).find(z=>z.id==c.prod.p):null;
 const d=c.der?`Derivado de «${esc(cap(nmI(c.der.from)))}» (${f(c.der.pct,1)} %)`:c.mix?'Mezcla: '+c.mix.map(m=>esc(cap(nmI(m.i)))+' '+f(m.g,1)+' g').join(' + '):`Producido en «${esc(rc?rc.n:'(receta borrada)')}»: ${esc(pp?pp.n:'')}`;
 return `<div class="card c-${dc(c)}" style="margin-left:${c.prod?0:18}px"><div class="rw"><b>${esc(cap(c.n))}</b><span class="m">Compuesto</span>${c.prod?`<button class="x" onclick="del('ins','${c.id}')">Quitar</button>`:`<button class="x" onclick="cmpEdit('${c.id}')">Editar</button>`}</div><p class="m">${d}</p>${x>0?`<p class="m">Incluye mano de obra y energía: Bs ${f(x)}</p>`:''}<div class="big">Bs ${f(ppg(c),4)} <small style="display:inline">por ${u}, cantidad ${f(c.q,1)} ${u}</small></div></div>`};
const _it3=itemH;itemH=function(i){return i.prod?compH(i):_it3(i)};

/* Mano de obra y energía al crear un ítem compuesto */
function dxH(){const dx=cw.dx=cw.dx||{min:0,uso:[]},
 opts=sel=>'<option value="">Elegir equipo</option>'+S.eq.filter(e=>e.t!='utensilio').map(e=>`<option value="${e.id}" ${e.id==sel?'selected':''}>${esc(cap(e.n))}</option>`).join('');
 return `<div class="card" style="box-shadow:none;margin:10px 0"><h2>Mano de obra y energía</h2><p class="m">${cw.k=='der'?'Para procesar todo el material de origen (por ejemplo, separar yemas y claras).':'Para preparar toda la mezcla.'}</p>
 <label>Mano de obra (min)<input inputmode="decimal" value="${dx.min||0}" onchange="cw.dx.min=num(this.value);cmpShow()"></label>
 ${dx.uso.map((u,k)=>`<div class="er"><select onchange="cw.dx.uso[${k}].e=this.value;cmpShow()">${opts(u.e)}</select><input inputmode="decimal" value="${u.m}" onchange="cw.dx.uso[${k}].m=num(this.value);cmpShow()"><button onclick="cw.dx.uso[${k}].g=!cw.dx.uso[${k}].g;cmpShow()">${FIRE(u.g)}</button><button onclick="cw.dx.uso[${k}].l=!cw.dx.uso[${k}].l;cmpShow()">${BOLT(u.l)}</button><button onclick="cw.dx.uso.splice(${k},1);cmpShow()">✕</button></div>`).join('')}
 <button onclick="cw.dx.uso.push({e:'',m:0,g:false,l:false});cmpShow()">Agregar equipo</button>
 <div class="ln"><span>Costo de mano de obra y energía</span><span>Bs ${f(dxC(dx))}</span></div></div>`}
const _cn=cmpNew;cmpNew=function(k){_cn(k);cw.dx={min:0,uso:[]};cmpShow()};
const _ce=cmpEdit;cmpEdit=function(id){_ce(id);const c=S.ins.find(x=>x.id==id);cw.dx=c&&c.dx?JSON.parse(JSON.stringify(c.dx)):{min:0,uso:[]};cmpShow()};
const _cs=cmpShow;
cmpShow=function(){const px=popx;popx=function(h){px(h.replace(/<div class="r2"><button class="pri" onclick="cwSave\(\)">Guardar<\/button>/,m=>dxH()+m))};try{_cs()}finally{popx=px}};
cwSave=function(){const dx=cw.dx||{min:0,uso:[]},cp=()=>JSON.parse(JSON.stringify(dx));
 if(cw.k=='der'){const par=S.ins.find(x=>x.id==cw.par);if(!par){toast('Elige el material de origen');return}
  const P=cw.parts.filter(p=>p.n.trim());if(P.length<2){toast('Una derivación necesita al menos 2 partes con nombre');return}
  fixP(P);const keep=new Set();
  P.forEach(p=>{let it=p.id&&S.ins.find(x=>x.id==p.id);if(!it){it={id:uid(),n:'',p:0,q:0,u:par.u,cat:dc(par),auto:true};S.ins.push(it)}
   it.n=cap(p.n);it.der={from:par.id,pct:num(p.p)};delete it.mix;it.dx=cp();it.t=Date.now();keep.add(it.id)});
  S.ins=S.ins.filter(x=>!(x.der&&x.der.from==par.id)||keep.has(x.id))}
 else{const comps=cw.comps.filter(m=>m.i&&num(m.g)>0);if(!cw.name.trim()||comps.length<2){toast('Escribe el nombre y al menos 2 materiales con gramos');return}
  let it=cw.id&&S.ins.find(x=>x.id==cw.id);if(!it){it={id:uid(),n:'',p:0,q:0,u:'g',auto:true};S.ins.push(it)}
  it.n=cap(cw.name);it.cat=cw.cat;it.mix=comps.map(m=>({i:m.i,g:num(m.g)}));delete it.der;it.dx=cp();it.t=Date.now()}
 save();clp();R();toast('Ítem compuesto guardado')};

/* Botón en cada presentación: convertir el producto en ítem compuesto */
const prodItem=(rid,pid)=>S.ins.find(i=>i.prod&&i.prod.r==rid&&i.prod.p==pid);
let pw=null;
function prodWin(rid,pid){const r=rec(rid),p=(r.pres||[]).find(x=>x.id==pid);if(!p)return;
 if(num(p.w)<=0){toast('Primero anota el peso de la presentación');return}
 const it=prodItem(rid,pid),c=cost(r),u=uCost(c,p,r);pw={rid,pid};
 popx(`<h2>Convertir en ítem compuesto</h2><p class="m">«${esc(p.n)}» pasa a Materiales y suministros con su costo por gramo, para usarlo como ingrediente en otras recetas (por ejemplo, una galleta para un alfajor). Se actualiza solo si cambia el costo de la receta.</p>
 <label>Nombre<input id="pn" value="${esc(it?cap(it.n):cap(p.n))}"></label>
 <label>Categoría<select id="pcat">${co(it?it.cat||'mp':'mp')}</select></label>
 <div class="ln"><span>Peso por unidad</span><span>${f(p.w,0)} g</span></div><div class="ln t"><span>Costo por unidad</span><span>Bs ${f(u)}</span></div><div class="ln"><span>Costo por gramo</span><span>Bs ${f(u/num(p.w),4)}</span></div>
 <div class="r2"><button class="pri" onclick="prodSave()">${it?'Actualizar':'Crear ítem'}</button><button onclick="clp()">Cancelar</button></div>${it?'<button onclick="prodKill()">Quitar ítem compuesto</button>':''}`)}
function prodSave(){const n=cap($('#pn').value);if(!n){toast('Escribe el nombre');return}
 let it=prodItem(pw.rid,pw.pid);if(!it){it={id:uid(),n:'',p:0,q:0,u:'g',auto:true,prod:{r:pw.rid,p:pw.pid}};S.ins.push(it)}
 it.n=n;it.cat=$('#pcat').value;it.t=Date.now();save();clp();R();toast('Ítem compuesto listo en Materiales y suministros')}
function prodKill(){S.ins=S.ins.filter(i=>!(i.prod&&i.prod.r==pw.rid&&i.prod.p==pw.pid));save();clp();R()}
presCard=function(r){const P=r.pres||[],
 ico=on=>`<svg viewBox="0 0 24 24" width="22" height="22"><path d="M12 2l9 5v10l-9 5-9-5V7z" fill="none" stroke="${on?'#16A05B':'currentColor'}" stroke-width="1.8" stroke-linejoin="round"/><path d="M3 7l9 5 9-5M12 12v10" fill="none" stroke="${on?'#16A05B':'currentColor'}" stroke-width="1.8"/></svg>`;
 return `<div class="card"><h2>Presentaciones a producir</h2><p class="m">Nombre, peso por unidad (g) y cantidad. Debajo: envase por unidad (vacío = usa el de «Costos del lote»), minutos extra por unidad y, a la derecha, el botón que convierte el producto en ítem compuesto.</p>
 ${P.map((p,j)=>`<div class="ir" style="grid-template-columns:1fr 70px 56px 44px"><input value="${esc(p.n)}" oninput="liveP('${r.id}',${j},'n',this.value)"><input inputmode="decimal" value="${p.w}" oninput="liveP('${r.id}',${j},'w',this.value)"><input inputmode="decimal" value="${p.q}" oninput="liveP('${r.id}',${j},'q',this.value)"><button class="x" onclick="rmP('${r.id}',${j})">✕</button></div>
 <div style="display:grid;grid-template-columns:1fr 1fr 44px;gap:8px;align-items:end;margin-bottom:10px"><label style="margin:0">Envase (Bs por unidad)<input inputmode="decimal" placeholder="${num(r.env)}" value="${p.e??''}" oninput="liveP('${r.id}',${j},'e',this.value)"></label><label style="margin:0">Min. extra por unidad<input inputmode="decimal" value="${p.m||0}" oninput="liveP('${r.id}',${j},'m',this.value)"></label><button class="x" style="width:44px;min-height:46px;padding:0;margin:0" title="Convertir en ítem compuesto" onclick="prodWin('${r.id}','${p.id||''}')">${ico(!!prodItem(r.id,p.id))}</button></div>`).join('')}
 <button onclick="addP('${r.id}')">Agregar presentación</button>
 <label>Masa adicional de seguridad (g)<input inputmode="decimal" value="${r.ex||0}" oninput="liveR('${r.id}','ex',this.value)"></label>
 <label>Sobrante real en molde pequeño (g)<input inputmode="decimal" value="${r.sob||''}" oninput="liveR('${r.id}','sob',this.value)"></label>
 <div id="pt">${ptH(r)}</div></div>`};

/* El Excel indica los productos de receta y el costo de mano de obra y energía */
const _xs=xlsxSheets;
xlsxSheets=function(){const sh=_xs(),m=sh[0].rows;
 S.ins.forEach((i,k)=>{const r=m[k+1];if(!r)return;
  if(i.prod){const rc=S.rec.find(x=>x.id==i.prod.r);r[6]='Producto de receta';r[7]=rc?rc.n:''}
  const x=dxC(i.dx);if(x>0)r[7]=(r[7]?r[7]+' | ':'')+'Incluye mano de obra y energía Bs '+(Math.round(x*100)/100)});
 return sh};
R();
