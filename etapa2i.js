/* CocoaCacao etapa 2I: ítems compuestos, 100 % igual a la receta, base arriba con recálculo y precios por presentación */
let FORCE1=false;
const _c6=cost;cost=function(r){const o=_c6(r);return FORCE1?Object.assign({},o,{k:1}):o};
const withK1=fn=>function(){FORCE1=true;try{return fn.apply(this,arguments)}finally{FORCE1=false}};
ingH=withK1(ingH);derShow=withK1(derShow);

/* Ítems compuestos: derivados (huevo en yema y clara) y mezclas (goma xantana con agua) */
function compRefresh(){for(let pass=0;pass<3;pass++)S.ins.forEach(i=>{
 if(i.der){const p=S.ins.find(x=>x.id==i.der.from);if(p){i.p=num(p.p)*num(i.der.pct)/100;i.q=num(p.q)*num(i.der.pct)/100;i.u=p.u;i.cat=dc(p)}}
 else if(i.mix){let g=0,c=0;i.mix.forEach(m=>{const x=S.ins.find(z=>z.id==m.i);if(x){g+=num(m.g);c+=num(m.g)*ppg(x)}});i.q=g;i.p=c;i.u='g'}})}
const _m6=migrate;migrate=function(){_m6();compRefresh()};
const _del=del;del=function(t,id){
 if(t=='ins'){const kids=S.ins.filter(x=>x.der&&x.der.from==id);
  if(kids.length){if(!confirm('Este material tiene derivados ('+kids.map(k=>cap(k.n)).join(', ')+'). Si lo borras, también se borran. ¿Continuar?'))return;S.ins=S.ins.filter(x=>!(x.der&&x.der.from==id))}}
 _del(t,id)};
const parOf=i=>i.der?S.ins.find(x=>x.id==i.der.from):(i.mix&&i.mix[0]?S.ins.find(x=>x.id==i.mix[0].i):null);
function compH(c){const u=c.u=='u'?'u':c.u,d=c.der?`Derivado de «${esc(cap(nmI(c.der.from)))}» (${f(c.der.pct,1)} %)`:'Mezcla: '+c.mix.map(m=>esc(cap(nmI(m.i)))+' '+f(m.g,1)+' g').join(' + ');
 return `<div class="card c-${dc(c)}" style="margin-left:18px"><div class="rw"><b>${esc(cap(c.n))}</b><span class="m">Compuesto</span><button class="x" onclick="cmpEdit('${c.id}')">Editar</button></div><p class="m">${d}</p><div class="big">Bs ${f(ppg(c),4)} <small style="display:inline">por ${u}, cantidad ${f(c.q,1)} ${u}</small></div></div>`}
const _it=itemH;
itemH=function(i){const par=parOf(i);
 if(par&&(!catF||dc(par)==catF))return '';
 const kids=S.ins.filter(c=>(c.der&&c.der.from==i.id)||(c.mix&&c.mix[0]&&c.mix[0].i==i.id));
 return ((i.der||i.mix)?compH(i):_it(i))+kids.map(compH).join('')};
const _iv3=insV;
insV=function(){return _iv3().replace('<h2 style="text-align:center">Lista actualizada</h2>',`<div class="card gold"><h2 style="text-align:center">Ítems compuestos</h2><p class="m">Derivar un material en partes (huevo en yema y clara) o mezclar materiales (goma xantana con agua). Quedan debajo del primer material usado.</p><div class="r2"><button onclick="cmpNew('der')">Derivar un material</button><button onclick="cmpNew('mix')">Mezclar materiales</button></div></div><h2 style="text-align:center">Lista actualizada</h2>`)};
T.ins[1]=insV;

let cw=null;
function cmpNew(k){cw={k,id:'',par:'',name:'',cat:'mp',parts:[{n:'',p:50},{n:'',p:50}],comps:[{i:'',g:0},{i:'',g:0}]};cmpShow()}
function cmpEdit(id){const c=S.ins.find(x=>x.id==id);if(!c)return;
 if(c.der)cw={k:'der',id:'1',par:c.der.from,parts:S.ins.filter(x=>x.der&&x.der.from==c.der.from).map(x=>({n:x.n,p:x.der.pct,id:x.id}))};
 else cw={k:'mix',id,name:c.n,cat:c.cat||'mp',comps:c.mix.map(m=>({i:m.i,g:m.g}))};cmpShow()}
const byName=v=>{const a=norm(v);return S.ins.find(x=>norm(x.n)==a)||(S.ins.filter(x=>norm(x.n).includes(a)).length==1?S.ins.find(x=>norm(x.n).includes(a)):null)};
function cwPar(v){const p=byName(v);if(!p){toast('Ese material no existe');cmpShow();return}cw.par=p.id;
 if(/huevo/.test(norm(p.n))&&cw.parts.every(x=>!x.n))cw.parts=[{n:'Yema',p:34},{n:'Clara',p:66}];cmpShow()}
function cwComp(j,v){const p=byName(v);if(p)cw.comps[j].i=p.id;else toast('Ese material no existe');cmpShow()}
function cwDel(j){if(cw.parts.length<=2){toast('Se necesitan al menos 2 partes');return}cw.parts.splice(j,1);cmpShow()}
function cwDelC(j){if(cw.comps.length<=2){toast('Se necesitan al menos 2 materiales');return}cw.comps.splice(j,1);cmpShow()}
function cmpShow(){
 const dl=`<datalist id="dl-cmp">${S.ins.filter(x=>!(cw.k=='mix'&&x.id==cw.id)).map(x=>`<option value="${esc(cap(x.n))}">`).join('')}</datalist>`;
 if(cw.k=='der'){const P=cw.parts,par=S.ins.find(x=>x.id==cw.par);fixP(P);
  popx(`<h2>Derivar un material</h2><p class="m">Ejemplo: Huevo en Yema y Clara. Cada parte queda como un material nuevo para tus recetas, con el mismo precio por gramo que el material de origen.</p>
  <label>Material de origen<input list="dl-cmp" ${cw.id?'readonly style="opacity:.6"':''} value="${esc(par?cap(par.n):'')}" onchange="cwPar(this.value)"></label>
  ${P.map((p,j)=>`<div class="dwr"><input value="${esc(p.n)}" placeholder="Yema" onchange="cw.parts[${j}].n=this.value;cmpShow()"><input inputmode="decimal" ${j==P.length-1?'readonly style="opacity:.6"':''} value="${p.p}" onchange="cw.parts[${j}].p=num(this.value);cmpShow()"><b>${par?f(num(par.q)*num(p.p)/100,1)+' '+par.u:''}</b><button class="x" onclick="cwDel(${j})">✕</button></div>`).join('')}
  <p class="m">El último porcentaje se completa solo para sumar 100 %.</p>
  <button onclick="cw.parts.push({n:'',p:0});cmpShow()">Agregar parte</button>
  <div class="r2"><button class="pri" onclick="cwSave()">Guardar</button><button onclick="clp()">Cancelar</button></div>${cw.id?'<button onclick="cwKillD()">Quitar todos los derivados</button>':''}${dl}`)}
 else{const C=cw.comps,tot=C.reduce((a,m)=>a+num(m.g),0),cs=C.reduce((a,m)=>{const x=S.ins.find(z=>z.id==m.i);return a+(x?num(m.g)*ppg(x):0)},0);
  popx(`<h2>Mezclar materiales</h2><p class="m">Ejemplo: Goma xantana + Agua = Hidrogel de goma xantana. El precio sale de la suma de los materiales.</p>
  <label>Nombre del ítem compuesto<input value="${esc(cw.name)}" onchange="cw.name=this.value"></label>
  <label>Categoría<select onchange="cw.cat=this.value">${co(cw.cat)}</select></label>
  ${C.map((m,j)=>`<div class="dwr"><input list="dl-cmp" placeholder="Material" value="${esc(m.i?cap(nmI(m.i)):'')}" onchange="cwComp(${j},this.value)"><input inputmode="decimal" value="${m.g}" onchange="cw.comps[${j}].g=num(this.value);cmpShow()"><b>g</b><button class="x" onclick="cwDelC(${j})">✕</button></div>`).join('')}
  <button onclick="cw.comps.push({i:'',g:0});cmpShow()">Agregar material</button>
  <div class="ln t"><span>Total</span><span>${f(tot,1)} g</span></div><div class="ln"><span>Costo</span><span>Bs ${f(cs)} (Bs ${f(tot>0?cs/tot:0,4)} por g)</span></div>
  <div class="r2"><button class="pri" onclick="cwSave()">Guardar</button><button onclick="clp()">Cancelar</button></div>${cw.id?'<button onclick="cwKill()">Borrar este ítem</button>':''}${dl}`)}}
function cwSave(){
 if(cw.k=='der'){const par=S.ins.find(x=>x.id==cw.par);if(!par){toast('Elige el material de origen');return}
  const P=cw.parts.filter(p=>p.n.trim());if(P.length<2){toast('Una derivación necesita al menos 2 partes con nombre');return}
  fixP(P);const keep=new Set();
  P.forEach(p=>{let it=p.id&&S.ins.find(x=>x.id==p.id);if(!it){it={id:uid(),n:'',p:0,q:0,u:par.u,cat:dc(par),auto:true};S.ins.push(it)}
   it.n=cap(p.n);it.der={from:par.id,pct:num(p.p)};delete it.mix;it.t=Date.now();keep.add(it.id)});
  S.ins=S.ins.filter(x=>!(x.der&&x.der.from==par.id)||keep.has(x.id))}
 else{const comps=cw.comps.filter(m=>m.i&&num(m.g)>0);if(!cw.name.trim()||comps.length<2){toast('Escribe el nombre y al menos 2 materiales con gramos');return}
  let it=cw.id&&S.ins.find(x=>x.id==cw.id);if(!it){it={id:uid(),n:'',p:0,q:0,u:'g',auto:true};S.ins.push(it)}
  it.n=cap(cw.name);it.cat=cw.cat;it.mix=comps.map(m=>({i:m.i,g:num(m.g)}));delete it.der;it.t=Date.now()}
 save();clp();R();toast('Ítem compuesto guardado')}
function cwKill(){S.ins=S.ins.filter(x=>x.id!=cw.id);save();clp();R()}
function cwKillD(){S.ins=S.ins.filter(x=>!(x.der&&x.der.from==cw.par));save();clp();R()}

/* Base: sube a la cima y la receta se recalcula con las cantidades para producir */
togB=function(id,k){const r=rec(id),was=r.it[k].b;r.it.forEach(y=>y.b=false);(r.sp||[]).forEach(s=>s.parts.forEach(p=>p.b=false));
 if(was){save();R();return}
 const kk=cost(r).k||1,x=r.it.splice(k,1)[0];x.b=true;r.it.unshift(x);
 if((r.pres||[]).length&&Math.abs(kk-1)>1e-9){r.it.forEach(y=>y.g=Math.round(num(y.g)*kk*10)/10);toast('Receta recalculada para producir '+f(tm(r),0)+' g')}
 save();R()};

/* Precios por presentación: cada una con su propio costo, margen y precio */
function setPpv(id,j,v){rec(id).pres[j].pv=num(v);save();R()}
const _pv4=preV;
preV=function(){const r=rec(S.sel)||S.rec[0];
 if(!r||!(r.pres||[]).some(p=>num(p.w)>0))return _pv4();
 const c=cost(r),G=S.cfg,own=k=>r[k]!=null,mm=k=>own(k)?r[k]:G[k],mc=(k,t)=>`<label>${t}<span class="chip" ${own(k)?'style="background:var(--acc);color:var(--on)"':''}>${own(k)?'Este producto':'General'}</span><input inputmode="decimal" value="${mm(k)}" onchange="setM('${r.id}','${k}',this.value)"></label>`;
 let ing=0,gan=0;
 const cards=r.pres.map((p,j)=>{if(num(p.w)<=0)return '';const q=num(p.q),u=uCost(c,p,r),b=u*(1+G.com/100),p1=price(u,mm('m1')),p2=price(u,mm('m2')),pv=num(p.pv);
  if(pv>0&&q>0){ing+=pv*q;gan+=(pv-b)*q}
  return `<div class="card" style="${q>0?'':'opacity:.75'}"><div class="rw"><b>${esc(p.n)} ${f(p.w,0)} g</b><span class="m">${f(q,0)} unidades</span></div>
  <div class="ln"><span>Costo por unidad</span><span>Bs ${f(u)}</span></div>
  ${G.com>0?`<div class="ln"><span>Costo con comisión (${f(G.com,1)} %)</span><span>Bs ${f(b)}</span></div>`:''}
  <div class="ln"><span>Precio con margen ${f(mm('m1'),0)} %</span><span><b>Bs ${f(p1)}</b></span></div>
  <div class="ln"><span>Precio con margen ${f(mm('m2'),0)} %</span><span><b>Bs ${f(p2)}</b></span></div>
  <label style="margin-top:8px">Precio que aplicarás (Bs)<input inputmode="decimal" value="${p.pv||''}" onchange="setPpv('${r.id}',${j},this.value)"></label>
  ${pv>0?`<div class="ln t"><span>Margen neto real</span><span>${f((pv-b)/pv*100,1)} %</span></div><div class="ln"><span>Ganancia por unidad</span><span>Bs ${f(pv-b)}</span></div>${q>0?`<div class="ln"><span>Ganancia de las ${f(q,0)} unidades</span><span>Bs ${f((pv-b)*q)}</span></div>`:''}`:''}</div>`}).join('');
 return `<div class="card"><label>Receta<select onchange="S.sel=this.value;save();R()">${S.rec.map(x=>`<option value="${x.id}" ${x.id==r.id?'selected':''}>${esc(x.n)}</option>`).join('')}</select></label>
 <p class="m">Cada presentación usa su propio costo: costo por gramo × peso + su envase + sus minutos extra.</p></div>
 <div class="r2">${mc('m1','Margen 1 (%)')}${mc('m2','Margen 2 (%)')}</div>${cards}
 ${ing>0?`<div class="card"><h2>Resumen con tus precios</h2><div class="ln"><span>Ingreso estimado</span><span>Bs ${f(ing)}</span></div><div class="ln t"><span>Ganancia estimada</span><span>Bs ${f(gan)}</span></div></div>`:''}
 <p class="m">Precio = (costo + comisión) ÷ (1 − margen neto), con el costo de cada presentación.</p>`};
T.pre[1]=preV;
R();
