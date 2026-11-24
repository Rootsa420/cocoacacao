/* CocoaCacao etapa 3C: ventas diarias y reportes con gráficos */
Object.assign(CHK,{etapa3c:()=>typeof venV});
const _m8=migrate;migrate=function(){_m8();if(!S.sales)S.sales={};S.rec.forEach(r=>(r.pres||[]).forEach(p=>{if(!p.id)p.id=uid()}))};
const st10=document.createElement('style');
st10.textContent='nav{overflow-x:auto}nav button{flex:0 0 auto!important;min-width:74px;padding:0 6px!important}';
document.head.appendChild(st10);

const tdy=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const addD=(s,n)=>{const d=new Date(s+'T12:00:00');d.setDate(d.getDate()+n);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
let vd=tdy(),vm='dia',vp=30,vr='';

function prods(){const o=[],G=S.cfg;
 S.rec.forEach(r=>{const c=cost(r),P=(r.pres||[]).filter(p=>num(p.w)>0),m1=r.m1!=null?r.m1:G.m1;
  if(P.length)P.forEach(p=>{const u=uCost(c,p,r),pr=num(p.pv)>0?num(p.pv):price(u,m1);o.push({k:r.id+'|'+p.id,n:r.n+' - '+p.n+' '+f(p.w,0)+' g',pr:Math.round(pr*100)/100,u})});
  else o.push({k:r.id+'|0',n:r.n,pr:Math.round((num(r.pv)>0?num(r.pv):price(c.unit,m1))*100)/100,u:c.unit})});return o}

function venV(){return `<div class="r2"><button class="${vm=='dia'?'pri':''}" onclick="vm='dia';R()">Registro diario</button><button class="${vm=='rep'?'pri':''}" onclick="vm='rep';R()">Reportes</button></div>`+(vm=='dia'?diaH():repH())}
T.ven=['Ventas',venV];
function diaH(){const D=S.sales[vd]||[],P=prods();let un=0,ti=0,tc=0;
 const rows=D.map((x,j)=>{const ven=(x.fin===''||x.fin==null)?null:num(x.ini)+num(x.prod)-num(x.fin),tot=ven==null?0:ven*num(x.pr);
  if(ven!=null&&ven>0){un+=ven;ti+=tot;tc+=ven*num(x.u)}
  return `<div class="card"><div class="rw"><b>${esc(x.n)}</b><button class="x" onclick="venDel(${j})">✕</button></div>
  <div class="r2"><label>Inventario inicial<input inputmode="decimal" value="${x.ini}" onchange="venSet(${j},'ini',this.value)"></label><label>Producido hoy<input inputmode="decimal" value="${x.prod}" onchange="venSet(${j},'prod',this.value)"></label></div>
  <div class="r2"><label>Inventario final<input inputmode="decimal" value="${x.fin==null?'':x.fin}" onchange="venSet(${j},'fin',this.value)"></label><label>Precio (Bs)<input inputmode="decimal" value="${x.pr}" onchange="venSet(${j},'pr',this.value)"></label></div>
  ${ven==null?'<p class="m">Anota el inventario final al cerrar el día para calcular lo vendido.</p>':`<div class="ln"><span>Vendido</span><span class="${ven<0?'up':''}">${f(ven,0)} u</span></div><div class="ln t"><span>Total</span><span>Bs ${f(tot)}</span></div>${ven<0?'<p class="m up">Revisa: el final es mayor que inicial + producido.</p>':''}`}</div>`}).join('');
 return `<div class="card"><label>Fecha<input type="date" value="${vd}" onchange="vd=this.value||tdy();R()"></label>
 <div class="r3"><button class="x" style="width:100%" onclick="vd=addD(vd,-1);R()">Día anterior</button><button class="x" style="width:100%" onclick="vd=tdy();R()">Hoy</button><button class="x" style="width:100%" onclick="vd=addD(vd,1);R()">Día siguiente</button></div>
 <label>Agregar producto<input list="dl-prod" placeholder="Escribe para buscar…" onchange="venAdd(this.value)"></label><datalist id="dl-prod">${P.map(p=>`<option value="${esc(p.n)}">`).join('')}</datalist>
 <button onclick="venPrev()">Traer productos del día anterior</button></div>${rows||'<p class="m">Aún no hay productos en este día.</p>'}
 ${D.length?`<div class="card"><h2>Resumen del día</h2><div class="ln"><span>Unidades vendidas</span><span>${f(un,0)}</span></div><div class="ln"><span>Ingresos</span><span>Bs ${f(ti)}</span></div><div class="ln"><span>Costo de lo vendido</span><span>Bs ${f(tc)}</span></div><div class="ln t"><span>Ganancia</span><span>Bs ${f(ti-tc)}</span></div></div>`:''}`}
function venAdd(v){const a=norm(v),p=prods().find(x=>norm(x.n)==a)||prods().find(x=>norm(x.n).includes(a));if(!p){toast('Ese producto no existe');return}
 const D=S.sales[vd]=S.sales[vd]||[];if(D.some(x=>x.k==p.k)){toast('Ya está en este día');return}
 D.push({k:p.k,n:p.n,ini:0,prod:0,fin:'',pr:p.pr,u:p.u});save();R()}
function venSet(j,c,v){const x=S.sales[vd][j];x[c]=(c=='fin'&&String(v).trim()==='')?'':num(v);save();R()}
function venDel(j){S.sales[vd].splice(j,1);save();R()}
function venPrev(){const prev=S.sales[addD(vd,-1)]||[];if(!prev.length){toast('El día anterior no tiene registros');return}
 const D=S.sales[vd]=S.sales[vd]||[],P=prods();let n=0;
 prev.forEach(x=>{if(D.some(y=>y.k==x.k))return;const p=P.find(z=>z.k==x.k);D.push({k:x.k,n:p?p.n:x.n,ini:(x.fin===''||x.fin==null)?num(x.ini)+num(x.prod):num(x.fin),prod:0,fin:'',pr:x.pr,u:p?p.u:x.u});n++});
 save();R();toast(n+' productos traídos con su inventario final como inicial')}

/* Reportes */
function barsV(data){const W=330,H=130,pd=30,m=Math.max(1,...data.map(d=>d.s)),sl=(W-pd)/data.length,bw=Math.max(2,sl-2);
 return `<svg viewBox="0 0 ${W} ${H+20}" width="100%"><text x="0" y="10" font-size="9" fill="var(--mut)">Bs ${f(m,0)}</text>${data.map((d,i)=>{const h=d.s/m*H,x=pd+i*sl;return `<rect x="${x}" y="${H-h}" width="${bw}" height="${h}" fill="var(--acc)"/>${(data.length<=15||i%Math.ceil(data.length/10)==0)?`<text x="${x+bw/2}" y="${H+13}" font-size="8" text-anchor="middle" fill="var(--mut)">${d.d.slice(8)}</text>`:''}`}).join('')}</svg>`}
function hbars(data){const m=Math.max(1,...data.map(d=>Math.abs(d.v)));
 return data.map(d=>`<div style="margin:6px 0"><div class="ln" style="border:0;padding:0"><span>${esc(d.n)}</span><span>Bs ${f(d.v)}</span></div><div style="height:12px;background:var(--grid);border-radius:6px"><div style="height:12px;width:${Math.max(2,Math.abs(d.v)/m*100)}%;background:${d.v<0?'#E03131':'var(--ok)'};border-radius:6px"></div></div></div>`).join('')}
function repH(){const end=tdy(),days=[];for(let i=vp-1;i>=0;i--)days.push(addD(end,-i));
 let ing=0,cs=0,un=0;const byP={},byD=days.map(d=>{let s=0;(S.sales[d]||[]).forEach(x=>{if(x.fin===''||x.fin==null)return;const v=num(x.ini)+num(x.prod)-num(x.fin);if(v<=0)return;const t=v*num(x.pr),c=v*num(x.u);s+=t;ing+=t;cs+=c;un+=v;const b=byP[x.n]=byP[x.n]||{n:x.n,t:0,c:0};b.t+=t;b.c+=c});return{d,s}});
 const top=Object.values(byP).map(b=>({n:b.n,v:b.t-b.c})).sort((a,b)=>b.v-a.v).slice(0,8),r=rec(vr)||S.rec[0],c=r?cost(r):null;
 const parts=c?[['Materia prima',c.mp,'#E8590C'],['Envases',c.env,'#1C7ED6'],['Mano de obra',c.mo,'#2F9E44'],['Gas',c.gas,'#F4511E'],['Electricidad',c.ene,'#FFC107'],['Gastos fijos y marketing',c.ind,'#9C36B5']]:[];
 return `<div class="card"><label>Período<select onchange="vp=num(this.value);R()">${[7,30,90].map(n=>`<option value="${n}" ${vp==n?'selected':''}>Últimos ${n} días</option>`).join('')}</select></label>
 <div class="ln"><span>Ingresos</span><span>Bs ${f(ing)}</span></div><div class="ln"><span>Costo de lo vendido</span><span>Bs ${f(cs)}</span></div><div class="ln t"><span>Ganancia</span><span>Bs ${f(ing-cs)}</span></div>
 <div class="ln"><span>Margen sobre ventas</span><span>${f(ing>0?(ing-cs)/ing*100:0,1)} %</span></div><div class="ln"><span>Unidades vendidas</span><span>${f(un,0)}</span></div></div>
 <div class="card"><h2>Ventas por día</h2>${ing>0?barsV(byD):'<p class="m">Aún no hay días cerrados en este período. Anota el inventario final en el registro diario.</p>'}</div>
 <div class="card"><h2>Ganancia por producto</h2>${top.length?hbars(top):'<p class="m">Sin datos todavía.</p>'}</div>
 ${r?`<div class="card"><h2>Composición del costo</h2><label>Receta<select onchange="vr=this.value;R()">${S.rec.map(x=>`<option value="${x.id}" ${x.id==r.id?'selected':''}>${esc(x.n)}</option>`).join('')}</select></label>
 <div style="display:flex;height:22px;border-radius:6px;overflow:hidden;margin:8px 0">${parts.map(p=>`<div style="width:${c.total>0?p[1]/c.total*100:0}%;background:${p[2]}"></div>`).join('')}</div>
 ${parts.map(p=>`<div class="ln"><span><span style="display:inline-block;width:10px;height:10px;background:${p[2]};margin-right:6px"></span>${p[0]}</span><span>Bs ${f(p[1])} (${f(c.total>0?p[1]/c.total*100:0,1)} %)</span></div>`).join('')}
 <div class="ln t"><span>Costo del lote</span><span>Bs ${f(c.total)}</span></div></div>`:''}`}
const nvv=document.createElement('button');nvv.dataset.t='ven';nvv.textContent='Ventas';nvv.onclick=()=>go('ven');
document.querySelector('nav button[data-t=pre]').after(nvv);
R();
