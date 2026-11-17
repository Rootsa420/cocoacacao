/* CocoaCacao etapa 1C: margen por producto, colores por categoría, buscador de ingredientes, reparto de gastos */
const _m=migrate;migrate=function(){_m();const c=S.cfg;if(c.rep==null)c.rep='lote';if(c.minMes==null)c.minMes=c.dias*c.hdia*60};

const _c=cost;
cost=function(r){const o=_c(r);
 if(S.cfg.rep=='min'){const x=(num(S.cfg.fijos)+num(S.cfg.mkt))/Math.max(1,num(S.cfg.minMes))*num(r.min);o.total+=x-o.ind;o.ind=x;o.unit=o.total/o.por}
 return o};

const st2=document.createElement('style');
st2.textContent='.c-mp{--cc:#E8590C}.c-ins{--cc:#1C7ED6}.c-man{--cc:#2F9E44}.card.c-mp,.card.c-ins,.card.c-man{border-left:10px solid var(--cc)}.ln.c-mp,.ln.c-ins,.ln.c-man{border-left:8px solid var(--cc);padding-left:8px}.ac.c-mp,.ac.c-ins,.ac.c-man{border-left:8px solid var(--cc)}.chip{font-size:11px;padding:2px 8px;border-radius:10px;border:1px solid var(--line);margin-left:6px}.cs{width:auto;min-height:38px;font-size:12px;margin:0 6px}.chp{display:inline-flex;width:auto;min-height:40px;padding:0 12px;margin:0 6px 8px 0;font-size:13px}';
document.head.appendChild(st2);

/* Inventario con categorías */
let catF='';
const CAT={mp:'Materia prima',ins:'Insumos y empaques',man:'Mantenimiento y operaciones'};
const dc=i=>i.cat||(i.u=='u'?'ins':'mp');
const co=v=>Object.keys(CAT).map(k=>`<option value="${k}" ${k==v?'selected':''}>${CAT[k]}</option>`).join('');
insV=function(){
 const L=S.ins.filter(i=>!catF||dc(i)==catF).sort((a,b)=>a.n.localeCompare(b.n,'es'));
 return lstCard()+`<div class="card"><h2>Nuevo insumo</h2>
 <label>Nombre<input id="an" placeholder="Harina de trigo"></label>
 <label>Categoría<select id="ac">${co('mp')}</select></label>
 <div class="r3"><label>Precio (Bs)<input id="ap" inputmode="decimal"></label><label>Cantidad<input id="aq" inputmode="decimal"></label><label>Unidad<select id="au"><option>g</option><option>ml</option><option value="u">unidades</option></select></label></div>
 <button class="pri" onclick="addI()">Guardar insumo</button>
 <p class="m">Piezas como huevos: anota el peso total del cartón en gramos.</p></div>
 <div>${[['','Todas']].concat(Object.entries(CAT)).map(a=>`<button class="x chp ${a[0]?'c-'+a[0]:''}" style="${catF==a[0]?'background:var(--cc,var(--acc));color:#fff':a[0]?'border-color:var(--cc)':''}" onclick="catF='${a[0]}';R()">${a[1]}</button>`).join('')}</div>`+
 (L.map(i=>{const v=i.prev&&i.prev!=i.p?(i.p/i.prev-1)*100:0;
 return `<div class="card c-${dc(i)}"><div class="rw"><b>${esc(i.n)}</b><select class="cs" onchange="setCat('${i.id}',this.value)">${co(dc(i))}</select><button class="x" onclick="del('ins','${i.id}')">Borrar</button></div>
 <div class="r3"><label>Precio Bs<input inputmode="decimal" value="${i.p}" onchange="updI('${i.id}','p',this.value)"></label>
 <label>Cantidad ${i.u}<input inputmode="decimal" value="${i.q}" onchange="updI('${i.id}','q',this.value)"></label>
 <div class="big">Bs ${f(ppg(i),4)}<small>por ${i.u}${v?` <span class="${v>0?'up':'dn'}">${v>0?'▲':'▼'} ${f(Math.abs(v),1)}%</span>`:''}</small></div></div></div>`}).join('')||'<p class="m">No hay insumos en esta categoría.</p>');
};
T.ins[1]=insV;
addI=function(){const n=$('#an').value.trim(),p=num($('#ap').value),q=num($('#aq').value);
 if(!n||q<=0){toast('Falta nombre o cantidad');return}
 S.ins.push({id:uid(),n,p,q,u:$('#au').value,cat:$('#ac').value});save();R();toast('Insumo guardado')};
function setCat(id,v){S.ins.find(x=>x.id===id).cat=v;save();R()}

/* Recetas: buscador de ingredientes y colores */
const _ev2=editV;
editV=function(r){
 let h=_ev2(r);
 h=h.replace(/<select onchange="setIt\('([^']+)',(\d+),'i',this\.value\)">[\s\S]*?<\/select>/g,(m,id,k)=>{
  const i=S.ins.find(z=>z.id===r.it[k].i);
  return `<input class="ac ${i?'c-'+dc(i):''}" list="dl-ins" placeholder="Escribe para buscar…" value="${i?esc(i.n):''}" onchange="pickIt('${id}',${k},this.value)">`});
 [['Materia prima','mp'],['Envases','ins'],['Mano de obra','man'],['Gas (cocina y horno)','man'],['Energía eléctrica','man'],['Gastos fijos y marketing','man']].forEach(a=>{
  h=h.replace(`<div class="ln"><span>${a[0]}</span>`,`<div class="ln c-${a[1]}"><span>${a[0]}</span>`)});
 return h+`<datalist id="dl-ins">${S.ins.map(i=>`<option value="${esc(i.n)}">`).join('')}</datalist>`;
};
function pickIt(id,k,v){const r=rec(id),a=norm(v);
 if(!a){r.it[k].i='';save();R();return}
 let i=S.ins.find(x=>norm(x.n)===a);
 if(!i){const c=S.ins.filter(x=>norm(x.n).includes(a));if(c.length==1)i=c[0]}
 if(!i){if(!confirm('«'+v.trim()+'» no está en Insumos. ¿Crearlo con precio 0?')){R();return}
  i={id:uid(),n:v.trim(),p:0,q:1000,u:'g',cat:'mp'};S.ins.push(i)}
 r.it[k].i=i.id;save();R()}

/* Precios: margen por producto */
function setM(id,k,v){const r=rec(id);if(v==='')delete r[k];else r[k]=num(v);save();R()}
function setPv(id,v){rec(id).pv=num(v);save();R()}
preV=function(){
 if(!S.rec.length)return '<p class="m">Primero crea una receta.</p>';
 const r=rec(S.sel)||S.rec[0],c=cost(r),G=S.cfg,b=c.unit*(1+G.com/100);
 const card=(k,t)=>{const own=r[k]!=null,mm=own?r[k]:G[k],p=price(c.unit,mm);
  return `<div class="card"><div class="rw"><span><b>${t}</b><span class="chip" ${own?'style="background:var(--acc);color:var(--on)"':''}>${own?'Este producto':'General'}</span></span><span class="big">Bs ${f(p)}</span></div>
  <label>Margen neto aplicado (%)<input inputmode="decimal" value="${mm}" onchange="setM('${r.id}','${k}',this.value)"></label>
  <div class="ln"><span>Ganancia por porción</span><span>Bs ${f(p-b)}</span></div>
  <div class="ln"><span>Ganancia por lote</span><span>Bs ${f((p-b)*c.por)}</span></div>
  ${own?`<button class="x" style="margin-top:8px" onclick="setM('${r.id}','${k}','')">Volver al margen general (${f(G[k],0)}%)</button>`:''}</div>`};
 const pv=num(r.pv),real=pv>0?(pv-b)/pv*100:0;
 return `<div class="card"><label>Receta<select onchange="S.sel=this.value;save();R()">${S.rec.map(x=>`<option value="${x.id}" ${x.id==r.id?'selected':''}>${esc(x.n)}</option>`).join('')}</select></label>
 <div class="big">Bs ${f(c.unit)}<small>costo por porción (${f(c.gpp,0)} g). Con comisión de pago ${f(G.com,1)}%: Bs ${f(b)}</small></div></div>
 ${card('m1','Margen 1')}${card('m2','Margen 2')}
 <div class="card"><label>Precio de venta que aplicarás (Bs)<input inputmode="decimal" value="${pv||''}" onchange="setPv('${r.id}',this.value)"></label>
 ${pv>0?`<div class="ln t"><span>Margen neto real</span><span>${f(real,1)}%</span></div>`:'<p class="m">Anota el precio que cobrarás para ver tu margen real.</p>'}</div>
 <p class="m">Precio = (costo + comisión) ÷ (1 − margen neto). Cada producto puede tener su propio margen.</p>`;
};
T.pre[1]=preV;

/* Ajustes: márgenes generales y reparto de gastos */
const _cv2=cfgV;
cfgV=function(){
 const G=S.cfg;
 return _cv2().replace('Lotes al mes','Lotes al mes (todos los productos)').replace('<div class="card"><h2>Respaldo de datos</h2>',
 `<div class="card"><h2>Reparto de gastos indirectos</h2><label>Método<select onchange="S.cfg.rep=this.value;save();R()"><option value="lote" ${G.rep=='lote'?'selected':''}>Por lote</option><option value="min" ${G.rep=='min'?'selected':''}>Por minutos de trabajo</option></select></label>${cf('minMes','Minutos de trabajo al mes')}
 <p class="m">Por minutos, cada receta carga gastos según el tiempo de mano de obra que anotes en ella.</p></div>
 <div class="card"><h2>Márgenes generales</h2><div class="r2">${cf('m1','Margen 1 (%)')}${cf('m2','Margen 2 (%)')}</div>
 <p class="m">Valen para todos los productos, salvo los que tengan su propio margen en Precios.</p></div>
 <div class="card"><h2>Respaldo de datos</h2>`);
};
T.cfg[1]=cfgV;
R();
