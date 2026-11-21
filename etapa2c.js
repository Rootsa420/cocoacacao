/* CocoaCacao etapa 2C: ventana de edición con 5 botones por ingrediente, sumas, derivados, reemplazo (maqueta), utensilios y orden por arrastre */
const _m3=migrate;migrate=function(){_m3();S.rec.forEach(r=>{r.it.forEach(x=>{if(!x.u)x.u=uid()});(r.sp||[]).forEach(s=>{if(s.parts.length)fixP(s.parts)})})};
function fixP(P){const o=P.slice(0,-1).reduce((a,p)=>a+num(p.p),0);P[P.length-1].p=Math.max(0,Math.round((100-o)*100)/100)}

const st6=document.createElement('style');
st6.textContent='.ig{margin-bottom:12px}.ib{display:flex;border:2px solid var(--line);border-radius:12px;overflow:hidden;background:var(--card)}.hd{width:20px;flex:none;background:var(--cc,var(--line));touch-action:none}.bd{flex:1;padding:8px;min-width:0}.ac0{margin:0 0 6px}.b5{display:grid;grid-template-columns:minmax(0,1fr) 10px repeat(5,36px);gap:4px;align-items:center}.b5 input{margin:0;min-height:40px;padding:4px 6px}.b5 button{margin:0;padding:0;min-height:40px;font-size:15px;box-shadow:none}.dv{display:grid;grid-template-columns:1fr 56px 74px 34px;gap:4px;align-items:center;margin:4px 0 0 28px;font-size:14px}.dv button{margin:0;padding:0;min-height:34px;box-shadow:none}.dwr{display:grid;grid-template-columns:1fr 62px 72px 36px;gap:4px;align-items:center;margin-bottom:6px}.dwr input{margin:0;min-height:42px;padding:4px 6px}.dwr button{margin:0}.grp{border:2px dashed var(--acc);border-radius:10px;padding:2px 8px;margin:6px 0}.ln.q.sm{font-weight:800}';
document.head.appendChild(st6);
const ICO=on=>`<svg viewBox="0 0 24 24" width="22" height="22"><circle cx="12" cy="12" r="11" fill="${on?'#16A05B':'#7a7a7a'}"/><path d="M6.5 11a5.5 5.5 0 0 1 9.3-3.3L17 6v4.5h-4.5l1.7-1.7A3.7 3.7 0 0 0 8.4 11z M17.5 13a5.5 5.5 0 0 1-9.3 3.3L7 18v-4.5h4.5l-1.7 1.7a3.7 3.7 0 0 0 5.8-2.2z" fill="#fff"/></svg>`;

function popx(html){let p=$('#pop');if(!p){p=document.createElement('div');p.id='pop';p.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:20;display:flex;align-items:center;justify-content:center;padding:16px';p.onclick=e=>{if(e.target==p)p.remove()};document.body.appendChild(p)}
 p.innerHTML=`<div class="card" style="width:100%;max-width:440px;max-height:85vh;overflow:auto;margin:0">${html}</div>`}
const clp=()=>{const p=$('#pop');if(p)p.remove()};

addIt=function(id){rec(id).it.push({i:'',g:0,u:uid()});save();R()};
rmIt=function(id,k){const r=rec(id),x=r.it[k];r.it.splice(k,1);if(x&&r.gs)r.gs=r.gs.map(G=>G.filter(u=>u!=x.u)).filter(G=>G.length>1);save();R()};
togB=function(id,k){const r=rec(id),was=r.it[k].b;r.it.forEach(y=>y.b=false);(r.sp||[]).forEach(s=>s.parts.forEach(p=>p.b=false));r.it[k].b=!was;save();R()};

/* Ventana de edición */
function ingH(r){const k=cost(r).k||1,used=new Set();
 return r.it.map((x,j)=>{const i=S.ins.find(z=>z.id==x.i),cc=i?'c-'+dc(i):'';
  const inG=(r.gs||[]).some(G=>G.includes(x.u)),arm=gd&&gd.id==r.id&&gd.u.includes(x.u);
  let h=`<div class="ig" id="ig-${x.u}" data-u="${x.u}"><div class="ib ${cc}"><div class="hd" onpointerdown="dgS(event,'${x.u}')"></div><div class="bd">
  <input class="ac0" list="dl-ins" placeholder="Escribe para buscar…" value="${i?esc(i.n):''}" onchange="pickIt('${r.id}',${j},this.value)">
  <div class="b5"><input inputmode="decimal" value="${x.g}" onchange="setIt('${r.id}',${j},'g',this.value)"><span>g</span>
  <button style="${x.b?ON:''}" onclick="togB('${r.id}',${j})">B</button>
  <button style="${inG?ON:arm?'outline:3px solid var(--acc)':''}" onclick="sigma('${r.id}',${j})">Σ</button>
  <button onclick="repWin('${r.id}',${j})">${ICO(false)}</button>
  <button onclick="derWin('${r.id}',${j})">÷</button>
  <button onclick="rmIt('${r.id}',${j})">✕</button></div></div></div>`;
  const s=x.i&&!used.has(x.i)?(r.sp||[]).find(s=>s.i==x.i):null;
  if(s){used.add(x.i);const t=spG(r,s,k);h+=s.parts.map((p,b)=>`<div class="dv"><span>↳ ${esc(p.n)}</span><span>${f(p.p,1)} %</span><b>${f(t*num(p.p)/100,1)} g</b><button onclick="dPartDel('${r.id}','${x.i}',${b})">✕</button></div>`).join('')}
  return h+'</div>'}).join('')}

editH=function(r){
 const h=editV(r),a=h.indexOf('<div class="card"><h2>Costos del lote</h2>'),b=h.indexOf('<div class="card"><h2>Presentaciones a producir</h2>'),c=h.indexOf('<button class="pri" onclick="S.sel=');
 const mid=a>=0&&b>a?h.slice(a,b):'',end=c>=0?h.slice(c):'';
 const nu=(r.ut||[]).map(id=>{const e=S.eq.find(x=>x.id==id);return `<div class="rw"><span>${esc(e?e.n:'(sin nombre)')}</span><button class="x" onclick="utTog('${r.id}','${id}')">✕</button></div>`}).join('');
 return `<div class="r2"><button onclick="rv.mode='view';rvRender(1)">Salir de edición</button><button onclick="procPop('${r.id}')">Procedimiento</button></div>
 <div class="card"><label>Nombre<input value="${esc(r.n)}" onchange="updR('${r.id}','n',this.value,1)"></label>
 <label>Categoría de la receta<select onchange="setRC('${r.id}',this.value)"><option value="">Sin categoría</option>${(S.rcats||[]).map(x=>`<option value="${x.id}" ${x.id==r.cat?'selected':''}>${esc(x.n)}</option>`).join('')}</select></label></div>
 <div class="card"><h2>Ingredientes (g)</h2><p class="m">B base · Σ sumar · ⟳ reemplazar · ÷ derivar · ✕ quitar. Mantén presionada la franja de color y arrastra para cambiar el orden.</p>
 <div id="ilist">${ingH(r)}</div><button onclick="addIt('${r.id}')">Agregar ingrediente</button><button onclick="utWin('${r.id}')">Agregar utensilios</button></div>
 ${nu?`<div class="card"><h2>Utensilios</h2>${nu}</div>`:''}`+mid+end};

/* Arrastrar para ordenar */
let dg=null;
function dgS(e,u){const el=e.currentTarget;dg={u,x:e.clientX,y:e.clientY,on:false,t:setTimeout(()=>{if(!dg)return;dg.on=true;try{el.setPointerCapture(e.pointerId)}catch(_){}const m=$('#ig-'+u);if(m)m.style.opacity='.6';if(navigator.vibrate)navigator.vibrate(25)},350)};
 el.onpointermove=dgM;el.onpointerup=el.onpointercancel=dgE}
function dgM(e){if(!dg)return;
 if(!dg.on){if(Math.abs(e.clientY-dg.y)>10||Math.abs(e.clientX-dg.x)>10){clearTimeout(dg.t);dg=null}return}
 e.preventDefault();const w=document.elementFromPoint(window.innerWidth/2,e.clientY),t=w&&w.closest?w.closest('.ig'):null,me=$('#ig-'+dg.u);
 if(t&&me&&t!==me){const b=t.getBoundingClientRect();t.parentNode.insertBefore(me,e.clientY<b.top+b.height/2?t:t.nextSibling)}
 const o=$('#rv');if(o){const q=o.getBoundingClientRect();if(e.clientY<q.top+50)o.scrollTop-=10;else if(e.clientY>q.bottom-50)o.scrollTop+=10}}
function dgE(){if(!dg)return;clearTimeout(dg.t);const on=dg.on,m=$('#ig-'+dg.u);dg=null;if(!on)return;
 if(m)m.style.opacity='';reord(rec(rv.id),[...document.querySelectorAll('#ilist .ig')].map(e=>e.dataset.u));save();R()}
function reord(r,order){r.it.sort((a,b)=>order.indexOf(a.u)-order.indexOf(b.u))}

/* Sumar pesos (varios grupos) */
let gd=null;
function sigma(id,k){const r=rec(id),x=r.it[k],gi=(r.gs||[]).findIndex(G=>G.includes(x.u));
 if(gd&&gd.id==id){
  if(gd.u.includes(x.u)){if(gd.u.length==1&&gd.g<0){gd=null;R();return}sumWin();return}
  if(gi>=0){toast('Ese ingrediente ya está en otro grupo');return}
  gd.u.push(x.u);sumWin();return}
 if(gi>=0){gd={id,u:[...r.gs[gi]],g:gi};sumWin();return}
 gd={id,u:[x.u],g:-1};toast('Ahora toca Σ en otro ingrediente');R()}
function sumWin(){const r=rec(gd.id),k=cost(r).k||1,M=gd.u.map(u=>r.it.find(x=>x.u==u)).filter(Boolean),tot=M.reduce((a,x)=>a+num(x.g)*k,0);
 popx(`<h2>Sumar pesos</h2>${M.map(x=>`<div class="ln"><span>${esc(nmI(x.i))}</span><span>${f(num(x.g)*k,1)} g</span></div>`).join('')}
 <div class="ln t"><span>Suma total</span><span>${f(tot,1)} g</span></div>
 <p class="m">Solo sirve para igualar densidades; no cambia el cálculo de la receta. Al cerrar, estos ingredientes se agrupan en «Cantidades para producir».</p>
 <div class="r2"><button onclick="sumClose()">Cerrar</button><button onclick="sumMore()">Sumar otro ingrediente</button></div>
 ${gd.g>=0?'<button onclick="sumKill()">Quitar este grupo</button>':''}`)}
function sumClose(){const r=rec(gd.id);if(gd.u.length>=2){r.gs=r.gs||[];if(gd.g>=0)r.gs[gd.g]=gd.u;else r.gs.push(gd.u)}gd=null;save();clp();R()}
function sumMore(){clp();toast('Toca Σ en el siguiente ingrediente');R()}
function sumKill(){const r=rec(gd.id);if(gd.g>=0)r.gs.splice(gd.g,1);gd=null;save();clp();R()}
const _rr=rvRender;rvRender=function(t){if(!rv||rv.mode!='edit')gd=null;_rr(t)};

/* Derivados */
let dw=null;
function derWin(id,j){const r=rec(id),x=r.it[j];if(!x.i){toast('Elige primero el ingrediente');return}
 const s=(r.sp||[]).find(s=>s.i==x.i);
 dw={id,i:x.i,ex:!!s,parts:s?s.parts.map(p=>({n:p.n,p:p.p})):[{n:'Derivado 1',p:50},{n:'Derivado 2',p:50}]};derShow()}
function derShow(){const r=rec(dw.id),k=cost(r).k||1,t=r.it.filter(x=>x.i==dw.i).reduce((a,x)=>a+num(x.g)*k,0),P=dw.parts;fixP(P);
 const over=P.slice(0,-1).reduce((a,p)=>a+num(p.p),0)>100;
 popx(`<h2>Derivar «${esc(nmI(dw.i))}»</h2><p class="m">Total: ${f(t,1)} g. El último porcentaje se completa solo para sumar 100 %.</p>
 ${P.map((p,b)=>`<div class="dwr"><input list="dl-nm" value="${esc(p.n)}" onchange="dw.parts[${b}].n=this.value;derShow()"><input inputmode="decimal" ${b==P.length-1?'readonly style="opacity:.6"':''} value="${p.p}" onchange="dw.parts[${b}].p=num(this.value);derShow()"><b>${f(t*num(p.p)/100,1)} g</b><button class="x" onclick="dwDel(${b})">✕</button></div>`).join('')}
 <datalist id="dl-nm">${r.it.map(x=>`<option value="${esc(nmI(x.i))}">`).join('')}</datalist>
 ${over?'<p class="m up">Los porcentajes ya superan 100 %: corrige alguno.</p>':''}
 <button onclick="dwAdd()">Agregar derivado</button>
 <div class="r2"><button class="pri" onclick="dwSave()">Guardar</button><button onclick="clp()">Cancelar</button></div>
 ${dw.ex?'<button onclick="dwKill()">Quitar derivación</button>':''}`)}
function dwAdd(){dw.parts.push({n:'Derivado '+(dw.parts.length+1),p:0});derShow()}
function dwDel(b){if(dw.parts.length<=2){toast('Una derivación necesita al menos 2 partes');return}dw.parts.splice(b,1);derShow()}
function dwSave(){const r=rec(dw.id);fixP(dw.parts);r.sp=r.sp||[];const s=r.sp.find(s=>s.i==dw.i);if(s)s.parts=dw.parts;else r.sp.push({i:dw.i,parts:dw.parts});save();clp();R()}
function dwKill(){const r=rec(dw.id);r.sp=(r.sp||[]).filter(s=>s.i!=dw.i);save();clp();R()}
function dPartDel(id,iid,b){const r=rec(id),s=(r.sp||[]).find(s=>s.i==iid);if(!s)return;
 if(s.parts.length>2){s.parts.splice(b,1);fixP(s.parts)}
 else{if(!confirm('Una derivación necesita al menos 2 partes. ¿Quitar la derivación completa?'))return;r.sp=r.sp.filter(z=>z!==s)}
 save();R()}

/* Reemplazo (maqueta con mantequilla y aceite) */
let rpw={dir:'bo',g:100,f:82,a:16,s:2};
function repWin(id,j){const x=rec(id).it[j];rpw.dir=norm(nmI(x.i)).includes('aceite')?'ob':'bo';rpw.g=num(x.g)||100;repShow()}
function repShow(){const d=rpw.dir,g=rpw.g,F=Math.max(rpw.f,1)/100,A=rpw.a/100,Sd=rpw.s/100,tot=rpw.f+rpw.a+rpw.s;
 const res=d=='bo'?`<div class="ln t"><span>Aceite</span><span>${f(g*F,1)} g</span></div><div class="ln"><span>Agua o leche (reemplaza el suero)</span><span>+ ${f(g*A,1)} g</span></div><div class="ln"><span>Sólidos lácteos que se pierden</span><span>${f(g*Sd,1)} g</span></div>`:
  `<div class="ln t"><span>Mantequilla</span><span>${f(g/F,1)} g</span></div><div class="ln"><span>Líquido a restar de la receta</span><span>− ${f(g/F*A,1)} g</span></div><div class="ln"><span>Sólidos lácteos que se suman</span><span>${f(g/F*Sd,1)} g</span></div>`;
 popx(`<h2>Reemplazar ingrediente</h2><p class="m"><b>Maqueta de ejemplo</b>: todavía no cambia tu receta.</p>
 <div class="r2"><button class="x" style="width:100%;${d=='bo'?ON:''}" onclick="rpw.dir='bo';repShow()">Mantequilla a aceite</button><button class="x" style="width:100%;${d=='ob'?ON:''}" onclick="rpw.dir='ob';repShow()">Aceite a mantequilla</button></div>
 <label style="margin-top:8px">Gramos de ${d=='bo'?'mantequilla':'aceite'} a reemplazar<input inputmode="decimal" value="${g}" onchange="rpw.g=num(this.value);repShow()"></label>
 <p class="m">El aceite es 100 % grasa. La mantequilla tiene grasa, agua (suero) y sólidos lácteos; revisa los porcentajes en tu etiqueta.</p>
 <div class="r3"><label>% grasa<input inputmode="decimal" value="${rpw.f}" onchange="rpw.f=num(this.value);repShow()"></label><label>% agua<input inputmode="decimal" value="${rpw.a}" onchange="rpw.a=num(this.value);repShow()"></label><label>% sólidos<input inputmode="decimal" value="${rpw.s}" onchange="rpw.s=num(this.value);repShow()"></label></div>
 <p class="m ${Math.abs(tot-100)<0.5?'':'up'}">Suma: ${f(tot,1)} %</p>${res}<button onclick="clp()">Cerrar</button>`)}

/* Utensilios */
function utWin(id){const r=rec(id),U=S.eq.filter(e=>e.t=='utensilio'),has=u=>(r.ut||[]).includes(u);
 popx(`<h2>Agregar utensilios</h2>${U.map(u=>`<div class="rw"><span>${esc(u.n)}</span><button class="x" style="${has(u.id)?ON:''}" onclick="utTog('${id}','${u.id}')">${has(u.id)?'Quitar':'Agregar'}</button></div>`).join('')||'<p class="m">Aún no hay utensilios. Crea uno aquí abajo o en la pestaña Equipos.</p>'}
 <label>Nuevo utensilio<input id="un" placeholder="Bowl grande"></label><button onclick="utNew('${id}')">Crear y agregar</button><button onclick="clp()">Cerrar</button>`)}
function utTog(id,u){const r=rec(id);r.ut=r.ut||[];const i=r.ut.indexOf(u);if(i>=0)r.ut.splice(i,1);else r.ut.push(u);save();R();if($('#pop'))utWin(id)}
function utNew(id){const n=cap($('#un').value);if(!n){toast('Escribe el nombre');return}const e={id:uid(),n,t:'utensilio',w:0,p:0};S.eq.push(e);utTog(id,e.id)}

/* Cantidades para producir: base primero, sumas agrupadas, derivados debajo */
qtyH=function(r){
 if(!r.it.length)return '<p class="m">Esta receta aún no tiene ingredientes.</p>';
 const k=cost(r).k||1,gs=r.gs||[],hi=r.it.findIndex(x=>/harina/i.test(nmI(x.i))),bi=r.it.findIndex(x=>x.b),base=bi>=0?bi:(hi>=0?hi:0);
 const order=[base].concat(r.it.map((x,j)=>j).filter(j=>j!=base)),done=new Set(),usedS=new Set();let h='';
 const one=(j,star)=>{const x=r.it[j];let t=`<div class="ln q"><span>${star?'★ ':''}${esc(nmI(x.i))}</span><span>${f(num(x.g)*k,1)} g</span></div>`;
  (r.sp||[]).forEach((s,a)=>{if(s.i==x.i&&!usedS.has(a)){usedS.add(a);const tt=spG(r,s,k);s.parts.forEach(p=>{t+=`<div class="ln q"><span>↳ ${esc(p.n)}</span><span>${f(tt*num(p.p)/100,1)} g</span></div>`})}});return t};
 order.forEach(j=>{if(done.has(j))return;const G=gs.find(G=>G.includes(r.it[j].u));
  if(G){const js=G.map(u=>r.it.findIndex(x=>x.u==u)).filter(i=>i>=0);js.sort((a,b)=>(b==base)-(a==base));js.forEach(i=>done.add(i));
   h+='<div class="grp">'+js.map(i=>one(i,i==base)).join('')+`<div class="ln q sm"><span>Suma</span><span>${f(js.reduce((a,i)=>a+num(r.it[i].g)*k,0),1)} g</span></div></div>`}
  else{done.add(j);h+=one(j,j==base)}});
 const nq=id=>{const e=S.eq.find(x=>x.id==id);return e?e.n:'(sin elegir)'};
 if((r.ut||[]).length)h+='<p class="m" style="margin-top:12px"><b>Utensilios</b></p>'+r.ut.map(id=>`<div class="ln"><span>${esc(nq(id))}</span></div>`).join('');
 if((r.uso||[]).length)h+='<p class="m" style="margin-top:12px"><b>Equipos</b></p>'+r.uso.map(u=>`<div class="ln"><span>${esc(nq(u.e))}</span><span>${f(u.m,0)} min</span></div>`).join('');
 return h};
R();
