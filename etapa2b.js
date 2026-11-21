/* CocoaCacao etapa 2B: categorías de recetas, ventana ReVenA y corrección de la masa requerida */
const _m2=migrate;migrate=function(){_m2();if(!S.rcats)S.rcats=[{id:'c1',n:'Tortas',c:'#E8590C'},{id:'c2',n:'Rellenos',c:'#FFC107'},{id:'c3',n:'Postres en vaso',c:'#1C7ED6'},{id:'c4',n:'Coberturas',c:'#2F9E44'},{id:'c5',n:'Otros',c:'#E03131'}]};

const st5=document.createElement('style');
st5.textContent='#toast{z-index:30}.rcb{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}.rc{width:auto;min-height:44px;padding:0 12px;margin:0;font-size:13px}.rc.on{outline:3px solid var(--ink)}.rc.pl{background:var(--card);color:var(--ink);font-size:22px;padding:0 16px}.rg{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}.rk{position:relative;min-height:92px;border:3px solid var(--line);border-radius:12px;padding:8px 8px 24px;display:flex;align-items:center;justify-content:center;text-align:center;background:var(--card);cursor:pointer;font-size:14px}.st{position:absolute;right:4px;bottom:0;font-size:24px;padding:2px 6px;color:#6B5A50}.st.on{color:#FFC107}.ln.q span:last-child{font-variant-numeric:tabular-nums;text-align:right;min-width:90px}';
document.head.appendChild(st5);

let rcF='',rv=null;
const txt=c=>{const h=c.replace('#',''),r=parseInt(h.slice(0,2),16),g=parseInt(h.slice(2,4),16),b=parseInt(h.slice(4,6),16);return(r*299+g*587+b*114)/1000>150?'#1a1a1a':'#fff'};
const rcol=id=>{const c=(S.rcats||[]).find(x=>x.id==id);return c?c.c:'var(--line)'};

/* Lista de recetas */
recV=function(){
 const C=S.rcats||[],L=S.rec.filter(r=>!rcF||r.cat==rcF);
 return `<button class="pri" onclick="newR()">Nueva receta</button>
 <div class="rcb">${C.map(c=>`<button class="rc ${rcF==c.id?'on':''}" style="background:${c.c};color:${txt(c.c)}" onclick="rcF=rcF=='${c.id}'?'':'${c.id}';R()">${esc(c.n)}</button>`).join('')}<button class="rc pl" onclick="rcNew()">+</button><button class="rc pl" onclick="rcDel()">×</button></div>
 <div class="rg">${L.map(r=>`<div class="rk" style="border-color:${rcol(r.cat)}" onclick="openRV('${r.id}')"><b>${esc(r.n)}</b><span class="st ${r.star?'on':''}" onclick="event.stopPropagation();togStar('${r.id}')">★</span></div>`).join('')}</div>`+
 (L.length?'':'<p class="m">No hay recetas en esta categoría.</p>');
};
T.rec[1]=recV;
function togStar(id){const r=rec(id);r.star=!r.star;save();R()}
function rcNew(){const n=(prompt('Nombre de la nueva categoría')||'').trim();if(!n)return;
 const P=['#E8590C','#FFC107','#1C7ED6','#2F9E44','#E03131','#9C36B5','#0CA678','#F76707'],u=S.rcats.map(x=>x.c),c=P.find(x=>!u.includes(x))||P[S.rcats.length%P.length];
 S.rcats.push({id:uid(),n:cap(n),c});save();R()}
function rcDel(){const c=S.rcats.find(x=>x.id==rcF);if(!c){toast('Toca primero la categoría que quieres borrar');return}
 if(!confirm('¿Borrar la categoría «'+c.n+'»? Las recetas quedarán sin categoría.'))return;
 S.rec.forEach(r=>{if(r.cat==c.id)r.cat=''});S.rcats=S.rcats.filter(x=>x.id!=c.id);rcF='';save();R()}
function setRC(id,v){rec(id).cat=v;save();R()}
newR=function(){const id=uid();S.rec.push({id,n:'Nueva receta',it:[],por:1,env:0,min:0,gas:0,proc:'',cat:rcF||''});save();rv={id,mode:'edit'};R();rvRender(1)};

/* Ventana flotante de la receta (ReVenA) */
const _R4=R;R=function(t){_R4(t);rvRender()};
const _go=go;go=function(t){rv=null;_go(t)};
function openRV(id){rv={id,mode:'view'};rvRender(1)}
function rvRender(top){let o=$('#rv');
 if(!rv){if(o)o.remove();return}
 const r=rec(rv.id);if(!r){rv=null;if(o)o.remove();return}
 if(!o){o=document.createElement('div');o.id='rv';document.body.appendChild(o)}
 const hd=document.querySelector('header'),nv=document.querySelector('nav');
 o.style.cssText='position:fixed;left:0;right:0;z-index:15;overflow:auto;background:var(--bg);padding:12px 14px 20px;top:'+(hd?hd.offsetHeight:56)+'px;bottom:'+(nv?nv.offsetHeight:66)+'px';
 const y=o.scrollTop;o.innerHTML=rv.mode=='edit'?editH(r):viewH(r);o.scrollTop=top?0:y}

function viewH(r){
 return `<div class="r2"><button onclick="rv=null;R()">Volver a recetas</button><button onclick="rv.mode='edit';rvRender(1)">Editar receta</button></div>
 <h2 style="text-align:center;margin:6px 0 10px">${esc(r.n)}</h2>
 <div class="card"><h2>Cantidades para producir</h2><div id="qt">${qtyH(r)}</div></div>${presCard(r)}
 <div class="card"><h2>Costeo por absorción</h2><div id="cc">${costH(r)}</div></div>`}

function qtyH(r){
 if(!r.it.length)return '<p class="m">Esta receta aún no tiene ingredientes.</p>';
 const E=els(r),items=E.filter(e=>e.key[0]=='i'),hasB=items.some(e=>e.b),hi=r.it.findIndex(x=>/harina/i.test(nmI(x.i)));
 const bs=new Set(hasB?items.map((e,j)=>e.b?j:-1).filter(j=>j>=0):[hi>=0?hi:0]),idx=items.map((e,j)=>j);
 const row=(n,g,star,sub)=>`<div class="ln q"><span>${sub?'↳ ':''}${star?'★ ':''}${esc(n)}</span><span>${f(g,1)} g</span></div>`,used=new Set();let h='';
 idx.filter(j=>bs.has(j)).concat(idx.filter(j=>!bs.has(j))).forEach(j=>{const e=items[j],id=r.it[j].i;h+=row(e.n,e.g,bs.has(j),false);
  (r.sp||[]).forEach((s,a)=>{if(s.i==id&&!used.has(a)){used.add(a);s.parts.forEach((p,b)=>{const pe=E.find(x=>x.key=='s'+a+'.'+b);h+=row(p.n,pe?pe.g:0,false,true)})}})});
 const nq=id=>{const e=S.eq.find(x=>x.id==id);return e?e.n:'(sin elegir)'};
 if((r.ut||[]).length)h+='<p class="m" style="margin-top:12px"><b>Utensilios</b></p>'+r.ut.map(id=>`<div class="ln"><span>${esc(nq(id))}</span></div>`).join('');
 if((r.uso||[]).length)h+='<p class="m" style="margin-top:12px"><b>Equipos</b></p>'+r.uso.map(u=>`<div class="ln"><span>${esc(nq(u.e))}</span><span>${f(u.m,0)} min</span></div>`).join('');
 return h}

function ptH(r){const c=cost(r),P=r.pres||[];
 if(!P.length)return '<p class="m">Agrega una presentación para calcular la masa total.</p>';
 const per=c.T>0?(c.total-c.env)/c.T:0,mer=num(r.sob)>0?num(r.ex)-num(r.sob):0;
 return `<div class="ln t"><span>Masa total requerida</span><span>${f(c.T,0)} g</span></div>`+
  (mer?`<div class="ln"><span>Merma (adicional menos sobrante)</span><span>${f(mer,0)} g (${f(c.T>0?mer/c.T*100:0,1)} %)</span></div>`:'')+
  P.map(p=>{const q=num(p.q),u=per*num(p.w)+num(r.env);
   return `<div class="ln" style="${q>0?'':'opacity:.5'}"><span>${esc(p.n)}<br><small>${f(q,0)} u × ${f(p.w,0)} g = ${f(q*num(p.w),0)} g</small></span><span>Bs ${f(u*q)}<br><small>Bs ${f(u)} c/u</small></span></div>`}).join('')+
  `<div class="ln t"><span>Costo de la producción</span><span>Bs ${f(c.total)}</span></div>`}

function costH(r){const c=cost(r),L=(k,n,v)=>`<div class="ln c-${k}"><span>${n}</span><span>Bs ${f(v)}</span></div>`;
 return L('mp','Materia prima',c.mp)+L('ins','Envases',c.env)+L('man','Mano de obra',c.mo)+L('man','Gas (cocina y horno)',c.gas)+L('man','Energía eléctrica',c.ene)+L('man','Gastos fijos y marketing',c.ind)+
  `<div class="ln t"><span>Costo del lote</span><span>Bs ${f(c.total)}</span></div><div class="ln t"><span>${(r.pres||[]).length?'Costo promedio por unidad':'Costo por porción'}</span><span>Bs ${f(c.unit)}</span></div>`}

function presCard(r){const P=r.pres||[];
 return `<div class="card"><h2>Presentaciones a producir</h2><p class="m">Nombre, peso por unidad (g) y cantidad.</p>
 ${P.map((p,j)=>`<div class="ir" style="grid-template-columns:1fr 70px 56px 44px"><input value="${esc(p.n)}" oninput="liveP('${r.id}',${j},'n',this.value)"><input inputmode="decimal" value="${p.w}" oninput="liveP('${r.id}',${j},'w',this.value)"><input inputmode="decimal" value="${p.q}" oninput="liveP('${r.id}',${j},'q',this.value)"><button class="x" onclick="rmP('${r.id}',${j})">✕</button></div>`).join('')}
 <button onclick="addP('${r.id}')">Agregar presentación</button>
 <label>Masa adicional de seguridad (g)<input inputmode="decimal" value="${r.ex||0}" oninput="liveR('${r.id}','ex',this.value)"></label>
 <label>Sobrante real en molde pequeño (g)<input inputmode="decimal" value="${r.sob||''}" oninput="liveR('${r.id}','sob',this.value)"></label>
 <div id="pt">${ptH(r)}</div></div>`}
function ptRefresh(id){const r=rec(id);[['qt',qtyH],['pt',ptH],['cc',costH]].forEach(a=>{const e=$('#'+a[0]);if(e)e.innerHTML=a[1](r)})}
function liveP(id,k,c,v){pres(id)[k][c]=c=='n'?v:num(v);save();ptRefresh(id)}
function liveR(id,k,v){rec(id)[k]=num(v);save();ptRefresh(id)}

/* Ventana de edición (provisional hasta la etapa 2C) */
function editH(r){
 let h=editV(r);
 h=h.replace('<button onclick="ed=null;R(1)">Volver a recetas</button>','');
 const a=h.indexOf('<div class="card"><h2>Presentaciones a producir</h2>'),b=h.indexOf('<div class="card"><h2>Dividir ingredientes por etapa</h2>');
 if(a>=0&&b>a)h=h.slice(0,a)+h.slice(b);
 const c=h.indexOf('<div class="card"><h2>Costeo por absorción</h2>'),d=h.indexOf('<button class="pri" onclick="S.sel=');
 if(c>=0&&d>c)h=h.slice(0,c)+h.slice(d);
 const cats=`<div class="card"><label>Categoría de la receta<select onchange="setRC('${r.id}',this.value)"><option value="">Sin categoría</option>${(S.rcats||[]).map(x=>`<option value="${x.id}" ${x.id==r.cat?'selected':''}>${esc(x.n)}</option>`).join('')}</select></label></div>`;
 return `<div class="r2"><button onclick="rv.mode='view';rvRender(1)">Salir de edición</button><button onclick="procPop('${r.id}')">Procedimiento</button></div>`+cats+h}
function procPop(id){const r=rec(id);pop(`<h2>Procedimiento</h2><textarea style="min-height:220px" onchange="updR('${id}','proc',this.value,1)">${esc(r.proc||'')}</textarea>`)}
R();
