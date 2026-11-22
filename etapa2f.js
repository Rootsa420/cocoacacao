/* CocoaCacao etapa 2F: sumar pesos entre ingredientes, derivados y utensilios */
const ex=(r,key)=>{const t=key[0],v=key.slice(2);return t=='i'?r.it.some(z=>z.u==v):t=='d'?(r.sp||[]).some(s=>s.parts.some(p=>p.id==v)):t=='t'?(r.ut||[]).includes(v):false};
const _m4=migrate;migrate=function(){_m4();S.rec.forEach(r=>{(r.sp||[]).forEach(s=>s.parts.forEach(p=>{if(!p.id)p.id=uid()}));
 if(r.gs)r.gs=r.gs.map(G=>G.map(k=>/^[idt]:/.test(k)?k:'i:'+k).filter(k=>ex(r,k))).filter(G=>G.length>1)})};
function mem(r,key){const k=cost(r).k||1,t=key[0],v=key.slice(2);
 if(t=='i'){const x=r.it.find(z=>z.u==v);return x?{n:nmI(x.i),g:num(x.g)*k,tag:''}:null}
 if(t=='d'){for(const s of r.sp||[]){const p=s.parts.find(z=>z.id==v);if(p)return{n:p.n+' ('+nmI(s.i)+')',g:spG(r,s,k)*num(p.p)/100,tag:'derivado'}}return null}
 if(t=='t'){const e=S.eq.find(z=>z.id==v);return e&&(r.ut||[]).includes(v)?{n:e.n,g:num(e.p),tag:'utensilio'}:null}
 return null}

const st7=document.createElement('style');
st7.textContent='.dv{grid-template-columns:1fr 46px 62px 34px 34px!important}.rw>span{flex:1}.rw .x{margin-left:6px}';
document.head.appendChild(st7);

ingH=function(r){const k=cost(r).k||1,used=new Set();
 const sb=key=>{const inG=(r.gs||[]).some(G=>G.includes(key)),arm=gd&&gd.id==r.id&&gd.u.includes(key);return inG?ON:arm?'outline:3px solid var(--acc)':''};
 return r.it.map((x,j)=>{const i=S.ins.find(z=>z.id==x.i),cc=i?'c-'+dc(i):'';
  let h=`<div class="ig" id="ig-${x.u}" data-u="${x.u}"><div class="ib ${cc}"><div class="hd" onpointerdown="dgS(event,'${x.u}')"></div><div class="bd">
  <input class="ac0" list="dl-ins" placeholder="Escribe para buscar…" value="${i?esc(i.n):''}" onchange="pickIt('${r.id}',${j},this.value)">
  <div class="b5"><input inputmode="decimal" value="${x.g}" onchange="setIt('${r.id}',${j},'g',this.value)"><span>g</span>
  <button style="${x.b?ON:''}" onclick="togB('${r.id}',${j})">B</button>
  <button style="${sb('i:'+x.u)}" onclick="sigma('${r.id}','i:${x.u}')">Σ</button>
  <button onclick="repWin('${r.id}',${j})">${ICO(false)}</button>
  <button onclick="derWin('${r.id}',${j})">÷</button>
  <button onclick="rmIt('${r.id}',${j})">✕</button></div></div></div>`;
  const s=x.i&&!used.has(x.i)?(r.sp||[]).find(s=>s.i==x.i):null;
  if(s){used.add(x.i);const t=spG(r,s,k);h+=s.parts.map((p,b)=>`<div class="dv"><span>↳ ${esc(p.n)}</span><span>${f(p.p,1)} %</span><b>${f(t*num(p.p)/100,1)} g</b><button style="${sb('d:'+p.id)}" onclick="sigma('${r.id}','d:${p.id}')">Σ</button><button onclick="dPartDel('${r.id}','${x.i}',${b})">✕</button></div>`).join('')}
  return h+'</div>'}).join('')};

const _eh=editH;
editH=function(r){let h=_eh(r);
 return h.replace(/<button class="x" onclick="utTog\('([^']+)','([^']+)'\)">✕<\/button><\/div>/g,(m,id,u)=>{const key='t:'+u,inG=(r.gs||[]).some(G=>G.includes(key)),arm=gd&&gd.id==r.id&&gd.u.includes(key);
  return `<button class="x" style="${inG?ON:arm?'outline:3px solid var(--acc)':''}" onclick="sigma('${id}','${key}')">Σ</button>`+m})};

/* Sumar: ingredientes, derivados y utensilios (varios grupos) */
function sigma(id,key){const r=rec(id),gi=(r.gs||[]).findIndex(G=>G.includes(key));
 if(gd&&gd.id==id){
  if(gd.u.includes(key)){if(gd.u.length==1&&gd.g<0){gd=null;R();return}sumWin();return}
  if(gi>=0){toast('Ese elemento ya está en otro grupo');return}
  gd.u.push(key);sumWin();return}
 if(gi>=0){gd={id,u:[...r.gs[gi]],g:gi};sumWin();return}
 gd={id,u:[key],g:-1};toast('Ahora toca Σ en otro elemento');R()}
function sumWin(){const r=rec(gd.id),M=gd.u.map(k=>mem(r,k)).filter(Boolean);let acc=0;
 popx(`<h2>Sumar pesos</h2>${M.map(m=>{acc+=m.g;return `<div class="ln"><span>${esc(m.n)}${m.tag?` <small>(${m.tag})</small>`:''}${m.tag=='utensilio'&&!m.g?'<br><small class="up">sin peso vacío: anótalo en Equipos</small>':''}</span><span>${f(m.g,1)} g<br><small>acumulado ${f(acc,1)} g</small></span></div>`}).join('')}
 <div class="ln t"><span>Suma total</span><span>${f(acc,1)} g</span></div>
 <p class="m">Los utensilios suman su peso vacío, así la suma coincide con la lectura de tu balanza. No cambia el cálculo de la receta. Al cerrar, el grupo aparece en «Cantidades para producir».</p>
 <div class="r2"><button onclick="sumClose()">Cerrar</button><button onclick="sumMore()">Sumar otro elemento</button></div>
 ${gd.g>=0?'<button onclick="sumKill()">Quitar este grupo</button>':''}`)}

/* Derivados con identificador propio (para poder agruparlos) */
function derWin(id,j){const r=rec(id),x=r.it[j];if(!x.i){toast('Elige primero el ingrediente');return}
 const s=(r.sp||[]).find(s=>s.i==x.i);
 dw={id,i:x.i,ex:!!s,parts:s?s.parts.map(p=>({n:p.n,p:p.p,id:p.id||uid()})):[{n:'Derivado 1',p:50,id:uid()},{n:'Derivado 2',p:50,id:uid()}]};derShow()}
function dwAdd(){dw.parts.push({n:'Derivado '+(dw.parts.length+1),p:0,id:uid()});derShow()}

/* Cantidades para producir con grupos mixtos */
qtyH=function(r){
 if(!r.it.length)return '<p class="m">Esta receta aún no tiene ingredientes.</p>';
 const k=cost(r).k||1,gs=r.gs||[],gk=new Set([].concat(...gs)),hi=r.it.findIndex(x=>/harina/i.test(nmI(x.i))),bi=r.it.findIndex(x=>x.b),base=bi>=0?bi:(hi>=0?hi:0);
 const order=[base].concat(r.it.map((x,j)=>j).filter(j=>j!=base)),done=new Set(),em=new Set(),us=new Set(),bk='i:'+r.it[base].u;let h='';
 const row=(n,g,star,sub)=>`<div class="ln q"><span>${sub?'↳ ':''}${star?'★ ':''}${esc(n)}</span><span>${f(g,1)} g</span></div>`;
 const parts=j=>{const x=r.it[j];let t='';(r.sp||[]).forEach((s,a)=>{if(s.i==x.i&&!us.has(a)){us.add(a);const tt=spG(r,s,k);s.parts.forEach(p=>{if(!gk.has('d:'+p.id))t+=row(p.n,tt*num(p.p)/100,false,true)})}});return t};
 const grp=gi=>{em.add(gi);const M=gs[gi].map(key=>({key,m:mem(r,key)})).filter(a=>a.m);
  return '<div class="grp">'+M.map(a=>row(a.m.n+(a.m.tag=='utensilio'?' (utensilio)':''),a.m.g,a.key==bk,false)).join('')+`<div class="ln q sm"><span>Suma</span><span>${f(M.reduce((t,a)=>t+a.m.g,0),1)} g</span></div></div>`};
 order.forEach(j=>{if(done.has(j))return;done.add(j);const key='i:'+r.it[j].u,gi=gs.findIndex(G=>G.includes(key));
  if(gi>=0){if(!em.has(gi)){h+=grp(gi);gs[gi].filter(kk=>kk[0]=='i').forEach(kk=>{const jj=r.it.findIndex(z=>'i:'+z.u==kk);if(jj>=0){done.add(jj);h+=parts(jj)}})}}
  else h+=row(nmI(r.it[j].i),num(r.it[j].g)*k,j==base,false)+parts(j)});
 gs.forEach((G,gi)=>{if(!em.has(gi))h+=grp(gi)});
 const nq=id=>{const e=S.eq.find(x=>x.id==id);return e?e.n:'(sin elegir)'},ut=(r.ut||[]).filter(id=>!gk.has('t:'+id));
 if(ut.length)h+='<p class="m" style="margin-top:12px"><b>Utensilios</b></p>'+ut.map(id=>`<div class="ln"><span>${esc(nq(id))}</span></div>`).join('');
 if((r.uso||[]).length)h+='<p class="m" style="margin-top:12px"><b>Equipos</b></p>'+r.uso.map(u=>`<div class="ln"><span>${esc(nq(u.e))}</span><span>${f(u.m,0)} min</span></div>`).join('');
 return h};
R();
