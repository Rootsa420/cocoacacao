/* CocoaCacao etapa 2H: equipos con fuego y rayo, envase y minutos extra por presentación, nuevo Costos del lote */
const FIRE=on=>`<svg viewBox="0 0 24 24" width="24" height="24"><path d="M12 2c1 4 5 6 5 11a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5.2 1.6 1 2.5 2 2.5 0-3-1-5.5 1-9z" fill="${on?'#F4511E':'#8a8a8a'}"/><path d="M12 11c.6 2 3 3 3 5.5a3 3 0 0 1-6 0c0-1.2.8-2 1.5-2.8.2.9.7 1.3 1.5 1.3z" fill="${on?'#FFC107':'#c4c4c4'}"/></svg>`;
const BOLT=on=>`<svg viewBox="0 0 24 24" width="24" height="24"><path d="M12 3L22 20.5H2z" fill="${on?'#FFC107':'#bdbdbd'}" stroke="#111" stroke-width="1.6" stroke-linejoin="round"/><path d="M13 8.5l-3.2 5h2.4l-1.2 4.2 3.8-5.7h-2.4z" fill="#111"/></svg>`;

/* Migración: filas antiguas y minutos de gas de Costos del lote pasan a equipos */
const _m5=migrate;migrate=function(){_m5();
 S.rec.forEach(r=>(r.uso||[]).forEach(u=>{if(u.g===undefined&&u.l===undefined){u.l=true;u.g=false}}));
 if(!S.m2h){S.m2h=1;const c=S.cfg;let cc=null,hh=null;
  const mk=(n,gh)=>{let e=S.eq.find(x=>norm(x.n)==norm(n));if(!e){e={id:uid(),n,t:'equipo',w:0,p:0,gh};S.eq.push(e)}else if(!e.gh)e.gh=gh;return e};
  S.rec.forEach(r=>{
   if(num(r.gas)>0){cc=cc||mk('Cocina hogareña',c.gGh);(r.uso=r.uso||[]).push({e:cc.id,m:num(r.gas),g:true,l:false});r.gas=0}
   if(num(r.gasH)>0){hh=hh||mk('Horno semi industrial',c.gGhH);(r.uso=r.uso||[]).push({e:hh.id,m:num(r.gasH),g:true,l:false});r.gasH=0}});
  save()}};

/* Costo: gas y electricidad por equipo; envase y minutos extra por presentación */
const _c5=cost;
cost=function(r){const o=_c5(r),G=S.cfg,pg=G.gBs/(G.gKg*1000),rate=G.sueldo/(G.dias*G.hdia*60);
 let gas=0,ene=0;
 (r.uso||[]).forEach(u=>{const e=S.eq.find(x=>x.id==u.e);if(!e)return;const m=num(u.m);if(u.g)gas+=num(e.gh)*m/60*pg;if(u.l)ene+=num(e.w)/1000*m/60*(G.kwh??1)});
 const P=r.pres||[],base=o.mp+o.mo+gas+ene+o.ind;
 if(!P.length){const total=base+o.env;return Object.assign(o,{gas,ene,total,unit:total/o.por,per:o.peso>0?base/o.peso:0,rate,xl:0})}
 const q=P.reduce((a,p)=>a+num(p.q),0)||1,xl=P.reduce((a,p)=>a+num(p.q)*num(p.m)*rate,0),
  env=P.reduce((a,p)=>a+num(p.q)*((p.e!=null&&p.e!=='')?num(p.e):num(r.env)),0),total=base+xl+env;
 return Object.assign(o,{gas,ene,env,mo:o.mo+xl,total,por:q,unit:total/q,gpp:o.T/q,per:o.T>0?base/o.T:0,rate,xl})};
const uCost=(c,p,r)=>c.per*num(p.w)+((p.e!=null&&p.e!=='')?num(p.e):num(r.env))+num(p.m)*c.rate;

/* Presentaciones con envase propio y minutos extra */
liveP=function(id,k,c,v){const p=pres(id)[k];if(c=='n')p.n=v;else if(c=='e'&&String(v).trim()==='')delete p.e;else p[c]=num(v);save();ptRefresh(id)};
presCard=function(r){const P=r.pres||[];
 return `<div class="card"><h2>Presentaciones a producir</h2><p class="m">Nombre, peso por unidad (g) y cantidad. Debajo: envase por unidad (vacío = usa el de «Costos del lote») y minutos extra de trabajo por unidad.</p>
 ${P.map((p,j)=>`<div class="ir" style="grid-template-columns:1fr 70px 56px 44px"><input value="${esc(p.n)}" oninput="liveP('${r.id}',${j},'n',this.value)"><input inputmode="decimal" value="${p.w}" oninput="liveP('${r.id}',${j},'w',this.value)"><input inputmode="decimal" value="${p.q}" oninput="liveP('${r.id}',${j},'q',this.value)"><button class="x" onclick="rmP('${r.id}',${j})">✕</button></div>
 <div class="r2" style="margin-bottom:10px"><label>Envase (Bs por unidad)<input inputmode="decimal" placeholder="${num(r.env)}" value="${p.e??''}" oninput="liveP('${r.id}',${j},'e',this.value)"></label><label>Min. extra por unidad<input inputmode="decimal" value="${p.m||0}" oninput="liveP('${r.id}',${j},'m',this.value)"></label></div>`).join('')}
 <button onclick="addP('${r.id}')">Agregar presentación</button>
 <label>Masa adicional de seguridad (g)<input inputmode="decimal" value="${r.ex||0}" oninput="liveR('${r.id}','ex',this.value)"></label>
 <label>Sobrante real en molde pequeño (g)<input inputmode="decimal" value="${r.sob||''}" oninput="liveR('${r.id}','sob',this.value)"></label>
 <div id="pt">${ptH(r)}</div></div>`};
ptH=function(r){const c=cost(r),P=r.pres||[];
 if(!P.length)return '<p class="m">Agrega una presentación para calcular la masa total.</p>';
 const mer=num(r.sob)>0?num(r.ex)-num(r.sob):0;
 return `<div class="ln t"><span>Masa total requerida</span><span>${f(c.T,0)} g</span></div>`+
  (mer?`<div class="ln"><span>Merma (adicional menos sobrante)</span><span>${f(mer,0)} g (${f(c.T>0?mer/c.T*100:0,1)} %)</span></div>`:'')+
  P.map(p=>{const q=num(p.q),u=uCost(c,p,r);
   return `<div class="ln" style="${q>0?'':'opacity:.5'}"><span>${esc(p.n)}<br><small>${f(q,0)} u × ${f(p.w,0)} g = ${f(q*num(p.w),0)} g</small></span><span>Bs ${f(u*q)}<br><small>Bs ${f(u)} c/u</small></span></div>`}).join('')+
  (num(r.ex)>0?`<div class="ln"><span>Masa adicional de seguridad</span><span>Bs ${f(c.per*num(r.ex))}</span></div>`:'')+
  `<div class="ln t"><span>Costo de la producción</span><span>Bs ${f(c.total)}</span></div>`};
const _pv3=preV;
preV=function(){let h=_pv3();const a=h.indexOf('<div class="card"><h2>Precio por presentación</h2>');if(a>=0)h=h.slice(0,a);
 const r=rec(S.sel)||S.rec[0];if(!r||!(r.pres||[]).length)return h;
 const c=cost(r),G=S.cfg,m1=r.m1!=null?r.m1:G.m1,m2=r.m2!=null?r.m2:G.m2;
 return h+`<div class="card"><h2>Precio por presentación</h2>${r.pres.map(p=>{const u=uCost(c,p,r);return `<div class="ln"><span>${esc(p.n)} (${f(p.w,0)} g)<br><small>costo Bs ${f(u)}</small></span><span>Bs ${f(price(u,m1))} / Bs ${f(price(u,m2))}</span></div>`}).join('')}<p class="m">Con margen ${f(m1,0)} % y ${f(m2,0)} %.</p></div>`};
T.pre[1]=preV;

/* Edición: consumo de equipos con fuego y rayo, y Costos del lote reducido */
const addU=id=>{(rec(id).uso=rec(id).uso||[]).push({e:'',m:0,g:false,l:false});save();R()};
function setU(id,k,c,v){rec(id).uso[k][c]=c=='m'?num(v):v;save();R()}
function togU(id,k,c){const u=rec(id).uso[k];u[c]=!u[c];save();R()}
function rmU(id,k){rec(id).uso.splice(k,1);save();R()}
function energyCard(r){const U=r.uso||[],c=cost(r),
 opts=sel=>'<option value="">Elegir equipo</option>'+S.eq.filter(e=>e.t!='utensilio').map(e=>`<option value="${e.id}" ${e.id==sel?'selected':''}>${esc(cap(e.n))}</option>`).join('');
 return `<div class="card"><h2>Consumo energético de los equipos utilizados en receta</h2>
 ${U.map((u,k)=>{const e=S.eq.find(x=>x.id==u.e),w1=u.l&&e&&!num(e.w)?'Anota los vatios del equipo en Equipos. ':'',w2=u.g&&e&&!num(e.gh)?'Anota el consumo de gas (g/h) del equipo en Equipos. ':'';
  return `<div class="er"><select onchange="setU('${r.id}',${k},'e',this.value)">${opts(u.e)}</select><input inputmode="decimal" value="${u.m}" onchange="setU('${r.id}',${k},'m',this.value)"><button onclick="togU('${r.id}',${k},'g')">${FIRE(u.g)}</button><button onclick="togU('${r.id}',${k},'l')">${BOLT(u.l)}</button><button onclick="rmU('${r.id}',${k})">✕</button></div>${w1||w2?`<p class="m up">${w1}${w2}</p>`:''}`}).join('')}
 <button onclick="addU('${r.id}')">Agregar equipo</button>
 <p class="m">Minutos de uso. Toca el fuego (gas) y el rayo (electricidad) para elegir el consumo. Si un horno usa ambos, agrégalo dos veces.</p>
 <div class="ln"><span>Gas</span><span>Bs ${f(c.gas)}</span></div><div class="ln"><span>Electricidad</span><span>Bs ${f(c.ene)}</span></div></div>`}
function costsCard(r){return `<div class="card"><h2>Costos del lote</h2><div class="r2"><label>Mano de obra (min)<input inputmode="decimal" value="${r.min}" onchange="updR('${r.id}','min',this.value)"></label><label>Envase por porción (Bs)<input inputmode="decimal" value="${r.env}" onchange="updR('${r.id}','env',this.value)"></label></div>
 <p class="m">Cada presentación puede tener su propio envase y minutos extra en la ventana de la receta.</p></div>`}
const _eh3=editH;
editH=function(r){const h=_eh3(r),a=h.indexOf('<div class="card"><h2>Costos del lote</h2>'),b=h.indexOf('<button class="pri" onclick="S.sel=');
 return a<0||b<a?h:h.slice(0,a)+energyCard(r)+costsCard(r)+h.slice(b)};
const _st8=document.createElement('style');
_st8.textContent='.er{display:grid;grid-template-columns:minmax(0,1fr) 54px 40px 40px 36px;gap:4px;align-items:center;margin-bottom:6px}.er select,.er input{margin:0;min-height:42px;padding:4px 6px}.er button{margin:0;padding:0;min-height:42px;box-shadow:none}';
document.head.appendChild(_st8);

/* Equipos que se muestran en la receta, con sus íconos */
const _q2=qtyH;
qtyH=function(r){let h=_q2(r);const a=h.indexOf('<p class="m" style="margin-top:12px"><b>Equipos</b></p>');if(a<0)return h;h=h.slice(0,a);
 const U=(r.uso||[]).filter(u=>u.e);if(!U.length)return h;
 return h+'<p class="m" style="margin-top:12px"><b>Equipos</b></p>'+U.map(u=>{const e=S.eq.find(x=>x.id==u.e);return `<div class="ln"><span style="display:flex;align-items:center;gap:6px">${esc(e?cap(e.n):'(sin elegir)')} ${u.g?FIRE(true):''}${u.l?BOLT(true):''}</span><span>${f(u.m,0)} min</span></div>`}).join('')};

/* Pestaña Equipos con consumo de gas */
eqV=function(){const L=[...S.eq].sort((a,b)=>cap(a.n).localeCompare(cap(b.n),'es')),
 tp=v=>`<option value="equipo" ${v=='equipo'?'selected':''}>Equipo</option><option value="utensilio" ${v=='utensilio'?'selected':''}>Utensilio</option>`;
 return `<div class="card"><h2>Nuevo equipo o utensilio</h2><label>Nombre<input id="en" placeholder="Batidora de pedestal"></label>
 <div class="r2"><label>Tipo<select id="et">${tp('equipo')}</select></label><label>Peso vacío (g)<input id="ep" inputmode="decimal"></label></div>
 <div class="r2"><label>Potencia eléctrica (W)<input id="ew" inputmode="decimal"></label><label>Consumo de gas (g/h)<input id="eg" inputmode="decimal"></label></div>
 <button class="pri" onclick="addE()">Guardar</button><p class="m">Anota solo lo que use: vatios si es eléctrico, g/h si usa gas. Un horno que usa ambos lleva los dos.</p></div>`+
 (L.map(e=>`<div class="card"><div class="rw"><b>${esc(cap(e.n))}</b><span>${e.t=='utensilio'?'':FIRE(num(e.gh)>0)+BOLT(num(e.w)>0)}</span><button class="x" onclick="del('eq','${e.id}')">Borrar</button></div>
 ${e.f?`<img class="pv" src="${e.f}" alt="">`:''}
 <label class="btn" style="margin-top:8px">${e.f?'Cambiar foto':'Tomar foto'}<input type="file" accept="image/*" capture="environment" hidden onchange="foto('${e.id}',this.files[0])"></label>
 <div class="r2"><label>Tipo<select onchange="updE('${e.id}','t',this.value,1)">${tp(e.t)}</select></label><label>Peso vacío (g)<input inputmode="decimal" value="${e.p||0}" onchange="updE('${e.id}','p',this.value)"></label></div>
 <div class="r2"><label>Potencia (W)<input inputmode="decimal" value="${e.w||0}" onchange="updE('${e.id}','w',this.value)"></label><label>Gas (g/h)<input inputmode="decimal" value="${e.gh||0}" onchange="updE('${e.id}','gh',this.value)"></label></div>
 <label>Lectura de la balanza con el equipo (g)<input inputmode="decimal" oninput="this.parentNode.nextElementSibling.firstElementChild.textContent=f(Math.max(0,num(this.value)-${num(e.p)}),1)+' g'"></label>
 <p class="m">Peso neto del contenido: <b>0 g</b></p></div>`).join('')||'<p class="m">Aún no hay equipos.</p>')};
T.eq[1]=eqV;
addE=function(){const n=cap($('#en').value);if(!n){toast('Falta el nombre');return}S.eq.push({id:uid(),n,t:$('#et').value,w:num($('#ew').value),p:num($('#ep').value),gh:num($('#eg').value)});save();R();toast('Guardado')};

/* Ajustes: el consumo de gas pasó a cada equipo */
const _cv4=cfgV;
cfgV=function(){return _cv4().replace(/<label>Cocina hogareña \(g\/h\)[\s\S]*?<\/label>/,'').replace(/<label>Horno semi industrial \(g\/h\)[\s\S]*?<\/label>/,'').replace('Para medir el consumo:','El consumo de gas de cada equipo (g/h) se anota ahora en la pestaña Equipos. Para medirlo:')};
T.cfg[1]=cfgV;
R();
