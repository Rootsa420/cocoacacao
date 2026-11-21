/* CocoaCacao etapa 2A: Materiales y Suministros */
const cap=s=>{s=String(s).trim();return s.charAt(0).toUpperCase()+s.slice(1)};
const _ui=updI;updI=function(id,k,v){const i=S.ins.find(x=>x.id===id);if(i)i.t=Date.now();_ui(id,k,v)};
const _ar=applyRows;
applyRows=function(rows){const r=_ar(rows);rows.forEach(x=>{const i=lstMatch(x.n);if(i){i.t=Date.now();i.n=cap(i.n)}});save();return r};

const st4=document.createElement('style');
st4.textContent='.gold{border-color:#FFC107}.gb{border-color:#FFC107;text-align:center;padding:4px}.mgr{display:grid;grid-template-columns:1fr 54px;gap:8px}.mgr input,.mgr button{margin:0;min-height:46px}#mn:focus::placeholder{color:transparent}.rojo{background:#E03131;color:#fff;padding:0}.verde{background:#8CD04E;color:#1a2e05;padding:0 10px}.mcg{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin:10px 0}.mcb{min-height:54px;font-size:12px;margin:0;background:transparent;border-color:var(--cc);padding:4px;box-shadow:none}.mcb.sel{background:var(--cc);color:#fff}.mrow{display:grid;grid-template-columns:1fr 1fr 1.2fr auto;gap:6px}.mrow input,.mrow select,.mrow button{margin:0;min-height:46px;padding:4px 6px;font-size:14px}.sgi{display:flex;justify-content:space-between;width:100%;min-height:44px;margin:4px 0 0;padding:0 10px;border-left:8px solid var(--cc);box-shadow:none;font-weight:600}.mg{display:grid;grid-template-columns:minmax(0,1fr) 72px 72px 60px;gap:6px;align-items:end}.mg label{margin:0;font-size:11px}.mg input{min-height:40px;padding:4px 6px;font-size:14px}.nm{font-size:15px;word-break:break-word}.mg .x{min-height:40px;padding:0 6px;font-size:12px}nav button[data-t=ins]{font-size:9.5px;line-height:1.1}';
document.head.appendChild(st4);

let mcat='';
const upd=()=>S.ins.length;
function itemH(i){const v=i.prev&&i.prev!=i.p?(i.p/i.prev-1)*100:0,u=i.u=='u'?'u':i.u;
 return `<div class="card c-${dc(i)}"><div class="mg"><b class="nm">${esc(cap(i.n))}</b>
 <label>Precio Bs<input inputmode="decimal" value="${i.p}" onchange="updI('${i.id}','p',this.value)"></label>
 <label>Cantidad ${u}<input inputmode="decimal" value="${i.q}" onchange="updI('${i.id}','q',this.value)"></label>
 <button class="x" onclick="del('ins','${i.id}')">Borrar</button></div>
 <div class="big">Bs ${f(ppg(i),4)} <small style="display:inline">por ${u}${v?` <span class="${v>0?'up':'dn'}">${v>0?'▲':'▼'} ${f(Math.abs(v),1)}%</span>`:''}</small></div></div>`}

insV=function(){
 const L=S.ins.filter(i=>!catF||dc(i)==catF).sort((a,b)=>catF?cap(a.n).localeCompare(cap(b.n),'es'):((b.t||0)-(a.t||0))||cap(a.n).localeCompare(cap(b.n),'es'));
 const g=`<label class="btn gb">Fotografiar lista<input type="file" accept="image/*" capture="environment" hidden onchange="lstGo(this.files[0])"></label>`;
 return `<div class="card gold"><h2 style="text-align:center">Actualizar lista de suministros mediante</h2>
 <div class="r2">${g}<label class="btn gb">Imagen de galería<input type="file" accept="image/*" hidden onchange="lstGo(this.files[0])"></label></div></div>
 <div class="card gold"><h2 style="text-align:center">Materiales y suministros</h2>
 <div class="mgr"><input id="mn" placeholder="Nombre del material o suministro…" autocomplete="off" oninput="mnSug()" onfocus="this.setSelectionRange(0,0)"><button class="x rojo" onclick="mnClr()">X</button></div>
 <div id="sg"></div>
 <div class="mcg">${Object.entries(CAT).map(a=>`<button class="mcb c-${a[0]}" id="mc-${a[0]}" onclick="setMc('${a[0]}')">${a[1]}</button>`).join('')}</div>
 <div class="mrow"><input id="ap" placeholder="Precio" inputmode="decimal"><input id="aq" placeholder="Cantidad" inputmode="decimal"><select id="au"><option value="g">Gramos</option><option value="ml">ml</option><option value="u">Unidades</option></select><button class="verde" onclick="mnSave()">Guardar</button></div></div>
 <h2 style="text-align:center">Lista actualizada</h2>
 <div class="mcg">${Object.entries(CAT).map(a=>`<button class="mcb c-${a[0]} ${catF==a[0]?'sel':''}" onclick="catF=catF=='${a[0]}'?'':'${a[0]}';R()">${a[1]}</button>`).join('')}</div>`+
 (L.map(itemH).join('')||'<p class="m">No hay materiales en esta categoría.</p>');
};
T.ins[0]='Materiales y suministros';T.ins[1]=insV;

function setMc(k){mcat=k;['mp','ins','man'].forEach(x=>{const e=$('#mc-'+x);if(e)e.classList.toggle('sel',x==k)})}
function mnSug(){const v=norm($('#mn').value),b=$('#sg');
 if(v.length<2){b.innerHTML='';return}
 const m=S.ins.filter(i=>norm(i.n).includes(v)).sort((a,c)=>(norm(a.n).startsWith(v)?0:1)-(norm(c.n).startsWith(v)?0:1)||cap(a.n).localeCompare(cap(c.n),'es')).slice(0,6);
 b.innerHTML=m.length?m.map(i=>`<button class="sgi c-${dc(i)}" onclick="mnPick('${i.id}')"><span>${esc(cap(i.n))}</span><small>${CAT[dc(i)]}</small></button>`).join(''):'<p class="m">No existe: se creará como nuevo.</p>'}
function mnPick(id){const i=S.ins.find(x=>x.id===id);if(!i)return;
 $('#mn').value=cap(i.n);$('#ap').value=i.p;$('#aq').value=i.q;$('#au').value=i.u;setMc(dc(i));$('#sg').innerHTML=''}
function mnClr(){['#mn','#ap','#aq'].forEach(s=>$(s).value='');$('#au').value='g';$('#sg').innerHTML='';setMc('')}
function mnSave(){const n=cap($('#mn').value),p=num($('#ap').value),q=num($('#aq').value),u=$('#au').value;
 if(!n||q<=0){toast('Falta el nombre o la cantidad');return}
 if(!mcat){toast('Elige una categoría');return}
 const i=S.ins.find(x=>norm(x.n)==norm(n));
 if(i){if(p!=i.p){i.prev=i.p;i.p=p}i.q=q;i.u=u;i.cat=mcat;i.t=Date.now()}
 else S.ins.push({id:uid(),n,p,q,u,cat:mcat,t:Date.now()});
 save();mcat='';R();toast(i?'Actualizado':'Guardado')}

/* Ventana flotante de lectura de lista */
function lm(){pop(`<div style="max-height:72vh;overflow:auto"><h2>Lista leída</h2><p class="m" id="lms">${esc(lst.st)}</p>
 <textarea id="lt" oninput="lst.text=this.value" placeholder="Azúcar 85 11500&#10;Harina 180 25000">${esc(lst.text)}</textarea>
 <button onclick="lstAn()">Analizar lista</button>
 ${lst.rows.map((r,k)=>{const i=lstMatch(r.n);return `<div class="card" style="box-shadow:none;margin:8px 0"><label>Material<input value="${esc(r.n)}" onchange="lstSet2(${k},'n',this.value)"></label>
 <div class="r2"><label>Precio Bs<input inputmode="decimal" value="${r.p}" onchange="lstSet2(${k},'p',this.value)"></label><label>Cantidad<input inputmode="decimal" value="${r.q}" onchange="lstSet2(${k},'q',this.value)"></label></div>
 <p class="m">${i?`Actualiza «${esc(cap(i.n))}»: Bs ${f(i.p)} a Bs ${f(r.p)}`:'Material nuevo'}</p><button class="x" onclick="lst.rows.splice(${k},1);lm()">Quitar</button></div>`}).join('')}
 <button class="pri" onclick="lstSave2()">Cargar a mi lista</button></div>`)}
function lstSet2(k,c,v){lst.rows[k][c]=c=='n'?cap(v):num(v);lm()}
function lstAn(){const rows=[];
 lst.text.split('\n').forEach(l=>{l=l.trim();if(!l)return;
  const m=l.match(/^(.+?)[\s|;\t]+(\d+(?:[.,]\d+)?)[\s|;\t]+(\d+(?:[.,]\d+)?)\s*(?:g|gr|grs|ml|u)?\.?$/i);
  if(m)rows.push({n:cap(m[1].trim()),p:num(m[2]),q:num(m[3])})});
 lst.rows=rows;lst.st=rows.length?rows.length+' líneas detectadas. Revisa y toca Cargar a mi lista.':'No encontré líneas con nombre, precio y cantidad. Corrige el texto.';lm()}
function lstSave2(){if(!lst.rows.length){toast('Primero toca Analizar lista');return}
 const r=applyRows(lst.rows);lst={rows:[],text:'',st:''};const p=$('#pop');if(p)p.remove();R();toast(r[0]+' actualizados, '+r[1]+' nuevos')}
async function lstGo(file){
 if(!file)return;lst={rows:[],text:'',st:'Leyendo imagen…'};lm();
 const st=t=>{lst.st=t;const e=$('#lms');if(e)e.textContent=t};
 try{const blob=await prep(file);
  if(!window.Tesseract){st('Cargando motor OCR (solo la primera vez)…');await new Promise((ok,no)=>{const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js';s.onload=ok;s.onerror=no;document.head.appendChild(s)})}
  const r=await Tesseract.recognize(blob,'spa',{logger:m=>st(m.status+' '+Math.round((m.progress||0)*100)+'%')});
  lst.text=r.data.text;lst.st='Texto leído. Revísalo y toca Analizar lista.';lm();
 }catch(e){lst.st='No se pudo leer la imagen. Pega abajo el texto copiado de tu Excel.';lm()}}

const nb0=document.querySelector('nav button[data-t=ins]');if(nb0)nb0.textContent='Materiales y suministros';
R();
