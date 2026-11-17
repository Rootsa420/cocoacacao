/* CocoaCacao etapa 1B: lista inicial y actualización de insumos por foto o texto */
T.cfg[1]=cfgV;

const LISTA=`Azúcar morena|7|1000
Harina|180|25000
Harina de almendra|140|1000
Azúcar|85|11500
Azúcar en polvo|12|1000
Café|14|55
Cacao|30|500
Cocoa|27|160
Cremor tártaro|5|20
Crema de leche|45|1000
Gelatina|6.5|40
Dulce de leche|17|400
Harina 0000|15|1000
Huevo|30|30
Licor de café|40|700
Maicena|14|1000
Mandioca|7|500
Manteca|32|1000
Mantequilla|50|1000
Mantequilla sin sal|50|1000
Vainilla|282.5|1000
Vainilla Telchi|52|1000
Sal|4|500
Polvo de hornear|48|1000
Chocolate para fundir|80|1000
Chips de chocolate|36|1000
Leche en polvo|100|1000
Leche condensada|10|395
Leche|8|950
Aceite|90|3815
Vinagre|8|750
Nuez|140|1000
Bicarbonato|35|1000
Canela molida|2|6
Banana|4|960
Arroz estaquilla|10|1000
Arroz popular|17|1000
Agua|7|1000
Frutilla|16|1000
Queso crema|10|300
Ácido cítrico|7.5|250
Maní|30|1000
Galleta María|3|90
Limón|1|45
Mangos|1|80
Jarabe de glucosa|18|500
Pectina|5|10
Café soluble|8.6|40
Coco rallado|9|250
Mascarpone|14|358
Margarina|18|1000
MassCream|34|1000
Mermelada|15|500
Gelatina roja|8|250
Colorante en polvo|2|5
Goma xantana|19|250
Hidrogel de goma xantana|4.41|512
Azúcar invertido|13.7|700
Harina de coco|52|1000
Suero de leche|8.9|1700
Nuez moscada|3|5
Zanahoria|4|680
Maltodextrina|19|1000
CMC (carboximetilcelulosa)|19|250
Zumo de naranja|1|80`;
const ENV=`Envase cuadrado|50|100
Vaso genérico 180 ml|7|100
Vaso genérico 500 ml|6|50
Vaso genérico 150|8|100
Obleas 18 cm|36|100
Bolsa de celofán 30x40|22|100
Pirotín|10|100
Platillos|7|25
Cucharilla|6|50
Bolsas con agarre|6|100
Base rectangular|59|100`;
const seedRows=()=>{const o=[];[[LISTA,'g'],[ENV,'u']].forEach(g=>g[0].split('\n').forEach(l=>{const a=l.split('|');if(a[0])o.push({n:a[0],p:+a[1],q:+a[2],u:g[1]})}));return o};

function applyRows(rows){let a=0,n=0;
 rows.forEach(r=>{const i=lstMatch(r.n);
  if(i){if(r.p!=i.p){i.prev=i.p;i.p=r.p}i.q=r.q;a++}
  else{S.ins.push({id:uid(),n:r.n,p:r.p,q:r.q,u:r.u||'g'});n++}});
 save();return[a,n]}
const lstMatch=n=>S.ins.find(x=>norm(x.n)===norm(n));

let lst={rows:[],text:'',st:''};
const _iv=insV;
insV=function(){return lstCard()+_iv().replace('<option>g</option><option>ml</option>','<option>g</option><option>ml</option><option value="u">unidades</option>')};
T.ins[1]=insV;

function lstCard(){
 return `<div class="card"><h2>Actualizar lista de insumos</h2>
 <label class="btn pri">Fotografiar lista<input type="file" accept="image/*" capture="environment" hidden onchange="lstOcr(this.files[0])"></label>
 <label class="btn">Elegir imagen guardada<input type="file" accept="image/*" hidden onchange="lstOcr(this.files[0])"></label>
 <p id="lst" class="m">${esc(lst.st)||'Mejor resultado: copia las celdas de tu Excel y pégalas abajo (nombre, precio y cantidad).'}</p>
 <textarea id="lt" placeholder="Azúcar 85 11500&#10;Harina 180 25000" oninput="lst.text=this.value">${esc(lst.text)}</textarea>
 <button onclick="lstParse()">Analizar lista</button>
 <button onclick="lstSeed()">Cargar mi lista inicial</button></div>`+
 (lst.rows.length?`<div class="card"><h2>Cambios detectados</h2>`+lst.rows.map((r,k)=>{const i=lstMatch(r.n);
  return `<div class="card" style="box-shadow:none;margin-bottom:8px"><label>Insumo<input value="${esc(r.n)}" onchange="lstSet(${k},'n',this.value)"></label>
  <div class="r2"><label>Precio Bs<input inputmode="decimal" value="${r.p}" onchange="lstSet(${k},'p',this.value)"></label><label>Cantidad<input inputmode="decimal" value="${r.q}" onchange="lstSet(${k},'q',this.value)"></label></div>
  <p class="m">${i?`Actualiza «${esc(i.n)}»: Bs ${f(i.p)} a Bs ${f(r.p)}`:'Insumo nuevo'}</p><button class="x" onclick="lst.rows.splice(${k},1);R()">Quitar</button></div>`}).join('')+
  `<button class="pri" onclick="lstSave()">Guardar ${lst.rows.length} cambios</button></div>`:'');
}
function lstParse(){
 const rows=[];lst.text.split('\n').forEach(l=>{l=l.trim();if(!l)return;
  const m=l.match(/^(.+?)[\s|;\t]+(\d+(?:[.,]\d+)?)[\s|;\t]+(\d+(?:[.,]\d+)?)\s*(?:g|gr|grs|ml|u)?\.?$/i);
  if(m)rows.push({n:m[1].trim(),p:num(m[2]),q:num(m[3])})});
 lst.rows=rows;if(!rows.length)toast('No encontré líneas con nombre, precio y cantidad');R()}
function lstSet(k,c,v){lst.rows[k][c]=c=='n'?v:num(v);R()}
function lstSave(){const r=applyRows(lst.rows);lst={rows:[],text:'',st:''};R();toast(r[0]+' actualizados, '+r[1]+' nuevos')}
function lstSeed(){if(!confirm('Se cargarán o actualizarán '+seedRows().length+' insumos. Los que ya existen con el mismo nombre cambiarán su precio y cantidad. ¿Continuar?'))return;
 const r=applyRows(seedRows());R();toast(r[0]+' actualizados, '+r[1]+' nuevos')}
async function lstOcr(file){
 if(!file)return;const st=t=>{lst.st=t;const e=$('#lst');if(e)e.textContent=t};
 try{st('Preparando imagen…');const blob=await prep(file);
  if(!window.Tesseract){st('Cargando motor OCR (solo la primera vez)…');await new Promise((ok,no)=>{const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js';s.onload=ok;s.onerror=no;document.head.appendChild(s)})}
  const r=await Tesseract.recognize(blob,'spa',{logger:m=>st(m.status+' '+Math.round((m.progress||0)*100)+'%')});
  lst.text=r.data.text;lst.st='Texto leído: revísalo y toca Analizar lista.';R();
 }catch(e){st('No se pudo leer la imagen. Pega abajo el texto copiado de tu Excel.')}}
R();
