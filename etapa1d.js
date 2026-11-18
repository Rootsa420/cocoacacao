/* CocoaCacao etapa 1D v2: presentaciones, base de cálculo, suma de pesos y división de ingredientes */
const _c3=cost;
const tm=r=>(r.pres||[]).reduce((a,p)=>a+num(p.w)*num(p.q),0)+num(r.ex);
cost=function(r){const o=_c3(r),P=r.pres||[];if(!P.length)return o;
 const T=tm(r),k=o.peso>0?T/o.peso:1,q=P.reduce((a,p)=>a+num(p.q),0)||1;
 const mp=o.mp*k,env=num(r.env)*q,total=mp+env+o.mo+o.gas+o.ene+o.ind;
 return Object.assign(o,{mp,env,total,por:q,unit:total/q,peso:T,gpp:T/q,k,T})};

const nmI=id=>{const i=S.ins.find(z=>z.id===id);return i?i.n:'(sin elegir)'};
const spG=(r,s,k)=>r.it.filter(x=>x.i==s.i).reduce((t,x)=>t+num(x.g)*k,0);
const els=r=>{const k=cost(r).k||1,o=[];
 r.it.forEach((x,j)=>o.push({n:nmI(x.i),g:num(x.g)*k,key:'i'+j,b:!!x.b}));
 (r.sp||[]).forEach((s,a)=>{const t=spG(r,s,k);s.parts.forEach((p,b)=>o.push({n:nmI(s.i)+' ('+p.n+')',g:t*num(p.p)/100,key:'s'+a+'.'+b,b:!!p.b}))});return o};
const baseS=r=>{const E=els(r),M=E.filter(e=>e.b);
 if(M.length)return{s:M.reduce((a,e)=>a+e.g,0),auto:false,n:M.map(e=>e.n).join(' + ')};
 const h=r.it.find(x=>/harina/i.test(nmI(x.i)))||r.it[0];
 return{s:h?num(h.g)*(cost(r).k||1):0,auto:true,n:h?nmI(h.i):''}};

function pop(html){let p=$('#pop');if(!p){p=document.createElement('div');p.id='pop';p.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:20;display:flex;align-items:center;justify-content:center;padding:16px';p.onclick=e=>{if(e.target==p)p.remove()};document.body.appendChild(p)}
 p.innerHTML=`<div class="card" style="width:100%;max-width:420px;margin:0">${html}<button onclick="$('#pop').remove()">Cerrar</button></div>`}
function sumH(id,ka,kb){const E=els(rec(id)),A=E.find(e=>e.key==ka),O=E.filter(e=>e.key!=ka);
 if(!A||!O.length)return '<h2>Sumar pesos</h2><p>Agrega otro ingrediente para poder sumar.</p>';
 const B=O.find(e=>e.key==kb)||O[0];
 return `<h2>Sumar pesos</h2><p>${esc(A.n)}: <b>${f(A.g,1)} g</b></p>
 <label>Sumar con<select onchange="pop(sumH('${id}','${ka}',this.value))">${O.map(e=>`<option value="${e.key}" ${e.key==B.key?'selected':''}>${esc(e.n)} (${f(e.g,1)} g)</option>`).join('')}</select></label>
 <div class="ln t"><span>Suma</span><span>${f(A.g+B.g,1)} g</span></div><p class="m">Solo sirve para igualar densidades; no cambia el cálculo de la base.</p>`}
function sumP(id,ka){pop(sumH(id,ka,''))}
function togB(id,k){const x=rec(id).it[k];x.b=!x.b;save();R()}
function togBs(id,a,b){const p=spl(id)[a].parts[b];p.b=!p.b;save();R()}

const st3=document.createElement('style');
st3.textContent='.i6{grid-template-columns:1fr 14px 42px 42px 42px!important;margin-bottom:12px}.i6>.ac{grid-column:1/-1}.i6 .x{padding:0;width:100%;min-height:42px}';
document.head.appendChild(st3);
const ON='background:var(--acc);color:var(--on)';

const _ev3=editV;
editV=function(r){
 let h=_ev3(r);const c=cost(r),k=c.k||1,P=r.pres||[];
 const ids=[...new Set(r.it.map(x=>x.i).filter(Boolean))];
 const opt=sel=>'<option value="">Elegir</option>'+ids.map(i=>`<option value="${i}" ${i==sel?'selected':''}>${esc(nmI(i))}</option>`).join('');
 h=h.replace(/<div class="ir"><input class="ac/g,'<div class="ir i6"><input class="ac')
  .replace(/<button class="x" onclick="rmIt\('([^']+)',(\d+)\)">✕<\/button><\/div>/g,(m,id,j)=>`<button class="x" style="${r.it[+j].b?ON:''}" onclick="togB('${id}',${j})">B</button><button class="x" onclick="sumP('${id}','i${j}')">Σ</button>`+m);
 const mer=num(r.sob)>0?num(r.ex)-num(r.sob):0;
 const pc=`<div class="card"><h2>Presentaciones a producir</h2>
 <p class="m">En cada ingrediente: B marca la base del cálculo, Σ suma pesos y ✕ lo quita.</p>
 <p class="m">Presentación: nombre, peso por unidad (g) y cantidad.</p>
 ${P.map((p,j)=>`<div class="ir" style="grid-template-columns:1fr 70px 56px 44px"><input value="${esc(p.n)}" onchange="setP('${r.id}',${j},'n',this.value)"><input inputmode="decimal" value="${p.w}" onchange="setP('${r.id}',${j},'w',this.value)"><input inputmode="decimal" value="${p.q}" onchange="setP('${r.id}',${j},'q',this.value)"><button class="x" onclick="rmP('${r.id}',${j})">✕</button></div>`).join('')}
 <button onclick="addP('${r.id}')">Agregar presentación</button>
 <label>Masa adicional de seguridad (g)<input inputmode="decimal" value="${r.ex||0}" onchange="updR('${r.id}','ex',this.value)"></label>
 <label>Sobrante real en molde pequeño (g)<input inputmode="decimal" value="${r.sob||''}" onchange="updR('${r.id}','sob',this.value)"></label>
 ${P.length?`<div class="ln t"><span>Masa total requerida</span><span>${f(c.T,0)} g</span></div>`+(mer?`<div class="ln"><span>Merma (adicional menos sobrante)</span><span>${f(mer,0)} g (${f(mer/c.T*100,1)} %)</span></div>`:'')+
  P.map(p=>`<div class="ln"><span>${esc(p.n)} ${f(p.w,0)} g</span><span>Bs ${f((c.total-c.env)/c.T*num(p.w)+num(r.env))}</span></div>`).join(''):''}</div>`;
 const B=baseS(r),tot=P.length?c.T:r.it.reduce((a,x)=>a+num(x.g),0);
 const sc=r.it.length&&B.s>0?`<div class="card"><h2>Cantidades para producir</h2>
 <p class="m">${B.auto?`Base automática: ${esc(B.n)}. Marca B en otro ingrediente para cambiarla.`:`Base (100 %): ${esc(B.n)}`} = ${f(B.s,1)} g, el ${f(B.s/tot*100,2)} % de la masa.</p>
 ${els(r).map(e=>`<div class="ln"><span>${e.key[0]=='s'?'↳ ':''}${e.b?'★ ':''}${esc(e.n)}</span><span>${f(e.g,1)} g, ${f(e.g/B.s*100,1)} %</span></div>`).join('')}</div>`:'';
 const sp=`<div class="card"><h2>Dividir ingredientes por etapa</h2>
 ${(r.sp||[]).map((s,a)=>{const t=spG(r,s,k),sum=s.parts.reduce((x,p)=>x+num(p.p),0),ok=Math.round(sum*100)==10000;
 return `<div class="card" style="box-shadow:none"><label>Ingrediente<select onchange="setSi('${r.id}',${a},this.value)">${opt(s.i)}</select></label>
 <p class="m">Total: ${f(t,1)} g</p>
 ${s.parts.map((p,b)=>`<div class="ir" style="grid-template-columns:1fr 60px 84px"><input value="${esc(p.n)}" onchange="setSp('${r.id}',${a},${b},'n',this.value)"><input inputmode="decimal" value="${p.p}" onchange="setSp('${r.id}',${a},${b},'p',this.value)"><b>${f(t*num(p.p)/100,1)} g</b></div>
 <div class="r3" style="margin-bottom:10px"><button class="x" style="width:100%;${p.b?ON:''}" onclick="togBs('${r.id}',${a},${b})">B</button><button class="x" style="width:100%" onclick="sumP('${r.id}','s${a}.${b}')">Σ</button><button class="x" style="width:100%" onclick="rmSp('${r.id}',${a},${b})">✕</button></div>`).join('')}
 <p class="m ${ok?'':'up'}">Suma: ${f(sum,1)} %${ok?'':' (debe sumar 100 %)'}</p>
 <button onclick="addSp('${r.id}',${a})">Agregar etapa</button><button class="x" onclick="rmS('${r.id}',${a})">Quitar división</button></div>`}).join('')}
 <button onclick="addS('${r.id}')">Dividir un ingrediente</button>
 <p class="m">Ejemplo: azúcar en yemas, claras y líquidos. En cada etapa: B marca la base, Σ suma pesos y ✕ la quita.</p></div>`;
 return h.replace('<div class="card"><h2>Costeo por absorción</h2>',()=>pc+sc+sp+'<div class="card"><h2>Costeo por absorción</h2>');
};
const pres=id=>{const r=rec(id);return r.pres=r.pres||[]};
function addP(id){pres(id).push({n:'Queque',w:0,q:1});save();R()}
function setP(id,k,c,v){pres(id)[k][c]=c=='n'?v:num(v);save();R()}
function rmP(id,k){pres(id).splice(k,1);save();R()}
const spl=id=>{const r=rec(id);return r.sp=r.sp||[]};
function addS(id){spl(id).push({i:'',parts:[{n:'Etapa 1',p:50},{n:'Etapa 2',p:50}]});save();R()}
function rmS(id,a){spl(id).splice(a,1);save();R()}
function setSi(id,a,v){spl(id)[a].i=v;save();R()}
function setSp(id,a,b,c,v){spl(id)[a].parts[b][c]=c=='n'?v:num(v);save();R()}
function addSp(id,a){const p=spl(id)[a].parts;p.push({n:'Etapa '+(p.length+1),p:0});save();R()}
function rmSp(id,a,b){spl(id)[a].parts.splice(b,1);save();R()}

/* Precios por presentación */
const _pv2=preV;
preV=function(){let h=_pv2();const r=rec(S.sel)||S.rec[0];if(!r||!(r.pres||[]).length)return h;
 const c=cost(r),G=S.cfg,m1=r.m1!=null?r.m1:G.m1,m2=r.m2!=null?r.m2:G.m2;
 return h+`<div class="card"><h2>Precio por presentación</h2>${r.pres.map(p=>{const u=(c.total-c.env)/c.T*num(p.w)+num(r.env);
 return `<div class="ln"><span>${esc(p.n)} (${f(p.w,0)} g)<br><small>costo Bs ${f(u)}</small></span><span>Bs ${f(price(u,m1))} / Bs ${f(price(u,m2))}</span></div>`}).join('')}<p class="m">Con margen ${f(m1,0)} % y ${f(m2,0)} %.</p></div>`};
T.pre[1]=preV;
R();
