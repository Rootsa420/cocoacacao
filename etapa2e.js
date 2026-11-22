/* CocoaCacao etapa 2E: escáner mejorado (ingredientes sin peso, conversión a gramos, huevo 50 g, secciones y categorías) */
const CUP={harina:120,azucar:200,'azucar impalpable':120,'azucar glas':120,'azucar en polvo':120,'azucar morena':190,cocoa:85,cacao:85,maicena:130,mantequilla:227,manteca:205,aceite:218,leche:245,agua:240,crema:240,nata:240,miel:340,avena:90,'harina de almendra':96,'coco rallado':85,nuez:110,chips:170,arroz:185,yogur:245,'polvo de hornear':230,bicarbonato:230,sal:288,vainilla:208,canela:125,levadura:144,gelatina:150};
const DENS={aceite:.92,miel:1.42,leche:1.03,jarabe:1.33,melaza:1.4,glucosa:1.4};
const PIECE=[['yema',20],['clara',30],['huevo',50],['limon',60],['naranja',150],['banana',120],['platano',120],['manzana',180],['zanahoria',70]];
const keyIn=(M,n)=>Object.keys(M).sort((a,b)=>b.length-a.length).find(k=>n.includes(k));
const cupG=n=>{const k=keyIn(CUP,n);return k?CUP[k]:240};
const densOf=n=>{const k=keyIn(DENS,n);return k?DENS[k]:1};
const pieceG=n=>{const p=PIECE.find(a=>n.includes(a[0]));return p?p[1]:0};
const UT='kg|kilogramos?|kilos?|mg|miligramos?|mililitros?|ml|cc|gramos?|grs?|g|litros?|lts?|libras?|lbs?|l|onzas?|oz|tazas?|cups?|cucharaditas?|cdtas?|tsp|cucharadas?|cdas?|tbsp|pizcas?|unidades?|piezas?|dientes?|u';
const NQ='(\\d+(?:[.,]\\d+)?(?:\\s+\\d+/\\d+|/\\d+)?|[½¼¾])';
const VERB=/^(mezclar|mezcla|batir|bate|hornear|hornea|agregar|agrega|anadir|anade|incorporar|incorpora|derretir|derrite|calentar|calienta|cocinar|cocina|hervir|enfriar|refrigerar|colar|tamizar|amasar|verter|vierte|servir|sirve|decorar|cubrir|rellenar|licuar|procesar|preparar|prepara|montar|integrar|disolver|reposar|dejar|deja|precalentar|engrasar|desmoldar|cortar|pelar|lavar|untar|unta|espolvorear|coloca|colocar|lleva|pon|forra|forrar)$/;
const STOP=new Set(['de','del','la','el','los','las','con','en','y','para','al','entera','entero','granulado','granulada','fresco','fresca','tamizada','tamizado','troceado','troceada','picado','picada','rallado','rallada','derretida','derretido','blanda','suave','fria','frio','caliente','liquido','liquida','extra','natural']);
const toks=s=>norm(s).replace(/[^a-z0-9ñ ]/g,' ').split(/\s+/).filter(t=>t&&!STOP.has(t)).map(t=>t.length>3&&t.endsWith('s')?t.slice(0,-1):t);
function mt2(n){const A=toks(n);if(!A.length)return '';let best='',bs=0.5,bl=99;
 S.ins.forEach(i=>{const B=toks(i.n);if(!B.length)return;const it=B.filter(t=>A.includes(t)).length;if(!it)return;
  let sc=it/Math.max(A.length,B.length);if(it==B.length)sc=Math.max(sc,.6);if(it==A.length&&it==B.length)sc=1;
  if(sc>bs||(sc==bs&&best&&i.n.length<bl)){best=i.id;bs=sc;bl=i.n.length}});return best}
const fixOcr=t=>String(t).replace(/\r/g,'').replace(/[º˚]/g,'°').replace(/(\d)[oO](?=\d)/g,(m,a)=>a+'0').replace(/(^|\s)[lI](?=\d)/gm,(m,a)=>a+'1');
function normProc(s){return s.replace(/(\d{2,3})\s*°?\s*F\b/g,(m,a)=>Math.round((a-32)*5/9)+' °C')
 .replace(/(\d+)\s*(?:horas?|hs?)\b(?:\s*y)?\s*(?:(\d+)\s*(?:minutos?|min)\b)?/gi,(m,h,mi)=>(num(h)*60+num(mi||0))+' min')}
function qn2(s){s=s.replace('½','1/2').replace('¼','1/4').replace('¾','3/4').trim();let t=0;s.split(/\s+/).forEach(p=>{if(p.includes('/')){const a=p.split('/');t+=num(a[0])/(num(a[1])||1)}else t+=num(p)});return t}
function toG(q,u,n){u=(u||'').toLowerCase().replace('.','');const nn=norm(n);
 if(/^(kg|kilo)/.test(u))return{g:q*1000};
 if(/^(mg|miligramo)/.test(u))return{g:q/1000};
 if(/^(g|gr|gramo)/.test(u))return{g:q};
 if(/^(oz|onza)/.test(u))return{g:q*28.3495};
 if(/^(lb|libra)/.test(u))return{g:q*453.592};
 if(/^(ml|mililitro|cc|l|lt|litro)/.test(u)){const ml=/^(ml|mililitro|cc)/.test(u)?q:q*1000,d=densOf(nn);return{g:ml*d,est:d!=1}}
 if(/^(taza|cup)/.test(u))return{g:q*cupG(nn),est:true};
 if(/^(cucharadita|cdta|tsp)/.test(u))return{g:q*cupG(nn)/48,est:true};
 if(/^(cucharada|cda|tbsp)/.test(u))return{g:q*cupG(nn)/16,est:true};
 if(/^pizca/.test(u))return{g:q*0.4,est:true};
 if(/^diente/.test(u))return{g:q*5,est:true};
 const p=pieceG(nn);return p?{g:q*p,est:true}:{g:0}}

function pLine(l,mode){
 let s=l.replace(/^[\s\-–—•*·●▪◦■□✓✔►▸>]+/,'').replace(/(\d)\s*%/g,'$1pct').trim();
 if(!s||s.length>90||/^\d+\s*[.)]\s+\S/.test(s))return null;
 let m,n,q,u,strong=false;
 m=s.match(new RegExp('^'+NQ+'(?:\\s*[-–]\\s*\\d+(?:[.,]\\d+)?)?\\s*('+UT+')?\\b\\.?\\s*(?:de\\s+|d\\s+)?(.+)$','i'));
 if(m){q=m[1];u=m[2];n=m[3];strong=!!u&&s.split(/\s+/).length<=6}
 else{m=s.match(new RegExp('^(.+?)[\\s:.\\-–,;|]+'+NQ+'\\s*('+UT+')?\\.?$','i'));if(m){n=m[1];q=m[2];u=m[3]}}
 if(!m){m=s.match(/^(.+?)\s*\((\d+(?:[.,]\d+)?)\)\s*$/);if(m){n=m[1];q=m[2];u=''}}
 const hasQ=!!m;if(!hasQ){n=s;q=null}
 n=n.replace(/\s*\(\d+(?:[.,]\d+)?\)\s*$/,'').replace(/pct/g,'%').replace(/\s*\b(al gusto|a gusto|c\/n|cantidad necesaria|opcional)\b\s*$/i,'').replace(/[.,;:]+$/,'').trim();
 if(!n||!/[a-záéíóúñ]/i.test(n)||VERB.test(norm(n).split(' ')[0]))return null;
 if(!hasQ&&!(mode=='ing'&&n.split(/\s+/).length<=8)&&!mt2(n))return null;
 const nn=norm(n),pc=pieceG(nn);let g=0,est=false;
 if(hasQ){const v=qn2(q);if(u&&!/^(u|unidad|pieza)/i.test(u)){const r=toG(v,u,n);g=r.g;est=!!r.est}else if(pc){g=v*pc;est=true}}
 else if(pc){g=pc;est=true}
 g=Math.round(g*10)/10;return{n:cap(n),g,est,miss:g<=0,raw:l.trim(),strong}}
function secTitle(l){const t=l.replace(/^[\s\-–—•*·●▪◦■□>]+/,'').trim();if(!t||/\d/.test(t)||t.split(/\s+/).length>6)return null;
 const m=t.match(/^para\s+(?:el|la|los|las)\s+(.+?)[:.]?$/i);if(m)return cap(m[1]);
 if(/:$/.test(t)&&!/^ingredientes?:?$/i.test(t))return cap(t.replace(/:$/,''));
 if(/^[A-ZÁÉÍÓÚÑ\s]{3,30}$/.test(t)&&!/^INGREDIENTES?$/.test(t))return cap(t.toLowerCase());return null}

let sc2={text:'',img:'',st:'',name:'',cat:'',secs:[]};
const PROC=/^(preparaci[oó]n|procedimiento|elaboraci[oó]n|modo de (hacer|preparaci[oó]n)|instrucciones|pasos)\b/i;
function sc2Parse(){
 const lines=fixOcr(sc2.text).split('\n').map(l=>l.trim()).filter(Boolean),secs=[];
 let mode=lines.some(l=>/^ingredientes?\b/i.test(l))?'pre':'free';
 const cur=()=>{if(!secs.length)secs.push({n:'',rows:[],proc:[]});return secs[secs.length-1]};
 lines.forEach(l=>{
  if(PROC.test(l)){mode='proc';return}
  if(/^ingredientes?\b/i.test(l)){mode='ing';return}
  const t=secTitle(l);
  if(t!==null){if(mode=='pre'){if(!secs.length)secs.push({n:t,rows:[],proc:[]});return}secs.push({n:t,rows:[],proc:[]});if(mode!='proc'||true)mode='ing';return}
  if(mode=='pre'){if(!secs.length&&!/\d/.test(l)&&l.split(/\s+/).length<=6)secs.push({n:cap(l.replace(/[:.]$/,'')),rows:[],proc:[]});return}
  const s=cur();
  if(mode=='proc'){const q=pLine(l,'proc');if(q&&q.strong)s.rows.push(q);else s.proc.push(normProc(l));return}
  const q=pLine(l,mode);if(q)s.rows.push(q);else if(l.split(/\s+/).length>4)s.proc.push(normProc(l))});
 const out=secs.filter(s=>s.rows.length||s.proc.length);
 out.forEach((s,a)=>{if(!s.n&&out.length>1)s.n='Sección '+(a+1);s.rows.forEach(r=>{r.i=mt2(r.n);const i=S.ins.find(x=>x.id==r.i);r.cat=i?dc(i):'mp'});
  const tx=s.proc.join(' ');s.temp=[...new Set((tx.match(/\d{2,3}(?=\s*°C)/g)||[]))];s.mins=(tx.match(/\d+(?=\s*min)/g)||[])});
 sc2.secs=out;
 const n=out.reduce((a,s)=>a+s.rows.length,0),f0=out.reduce((a,s)=>a+s.rows.filter(r=>r.miss).length,0);
 sc2.st=n?n+' ingredientes en '+out.length+(out.length==1?' sección':' secciones')+(f0?'. Faltan pesos en '+f0+'.':'.'):'No encontré ingredientes. Corrige el texto.';R()}

async function prep2(file){const b=await createImageBitmap(file),m=Math.max(b.width,b.height),k=m<1400?Math.min(2.5,1600/m):Math.min(1,2200/m),c=document.createElement('canvas');
 c.width=Math.round(b.width*k);c.height=Math.round(b.height*k);const x=c.getContext('2d');x.imageSmoothingQuality='high';
 const t=document.createElement('canvas');t.width=t.height=48;const y=t.getContext('2d');y.drawImage(b,0,0,48,48);
 const d=y.getImageData(0,0,48,48).data;let s=0;for(let i=0;i<d.length;i+=4)s+=(d[i]+d[i+1]+d[i+2])/3;
 const dark=s/(d.length/4)<110;x.filter='grayscale(1)'+(dark?' invert(1)':'')+' contrast(1.35)';x.drawImage(b,0,0,c.width,c.height);
 return new Promise(r=>c.toBlob(r,'image/png'))}
async function sc2Go(file){
 if(!file)return;sc2.img=URL.createObjectURL(file);sc2.st='Preparando imagen…';R();
 const st=t=>{sc2.st=t;const e=$('#sst');if(e)e.textContent=t};
 try{const blob=await prep2(file);
  if(!window.Tesseract){st('Cargando motor OCR (solo la primera vez)…');await new Promise((ok,no)=>{const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js';s.onload=ok;s.onerror=no;document.head.appendChild(s)})}
  const w=await Tesseract.createWorker('spa',1,{logger:m=>st(m.status+' '+Math.round((m.progress||0)*100)+'%')});
  try{await w.setParameters({tessedit_pageseg_mode:'4',preserve_interword_spaces:'1'})}catch(_){}
  const r=await w.recognize(blob);try{await w.terminate()}catch(_){}
  sc2.text=fixOcr(r.data.text);sc2Parse();
 }catch(e){sc2.st='No se pudo leer la imagen. El OCR necesita internet la primera vez; pega el texto abajo.';R()}}

function rowH(a,b,r){const i=S.ins.find(x=>x.id==r.i),cs=i&&i.p>0?r.g*ppg(i):null;
 const co=v=>Object.entries(CAT).map(c=>`<option value="${c[0]}" ${c[0]==v?'selected':''}>${c[1]}</option>`).join('');
 return `<div class="card" style="box-shadow:none;margin:6px 0;${r.miss?'border-color:#E03131':''}"><label>Ingrediente<input value="${esc(r.n)}" onchange="sc2Row(${a},${b},'n',this.value)"></label>
 <div class="r2"><label>Cantidad (g)<input inputmode="decimal" value="${r.g}" onchange="sc2Row(${a},${b},'g',this.value)"></label><label>Categoría<select onchange="sc2Row(${a},${b},'cat',this.value)">${co(r.cat)}</select></label></div>
 <label>Material<select onchange="sc2Row(${a},${b},'i',this.value)"><option value="">Crear nuevo</option>${S.ins.map(x=>`<option value="${x.id}" ${x.id==r.i?'selected':''}>${esc(cap(x.n))}</option>`).join('')}</select></label>
 <p class="m ${r.miss?'up':''}">${r.miss?'⚠ Falta el peso: escríbelo. ':''}${r.est?'≈ Peso estimado. ':''}Leído: «${esc(r.raw)}»${cs!=null?' · Costo ≈ Bs '+f(cs):(r.i?' · Sin precio en Materiales':' · Material nuevo (precio 0)')}</p>
 <button class="x" onclick="sc2.secs[${a}].rows.splice(${b},1);R()">Quitar</button></div>`}
function secH(s,a){const ct=s.rows.reduce((t,r)=>{const i=S.ins.find(x=>x.id==r.i);return t+(i?r.g*ppg(i):0)},0);
 return `<div class="card"><label>Receta o sección<input value="${esc(s.n)}" onchange="sc2.secs[${a}].n=this.value;R()"></label>
 ${s.rows.map((r,b)=>rowH(a,b,r)).join('')}
 <div class="ln t"><span>Materia prima ≈</span><span>Bs ${f(ct)}</span></div>
 ${s.temp.length||s.mins.length?`<p class="m">${s.temp.length?'Horno: '+s.temp.join(', ')+' °C. ':''}${s.mins.length?'Tiempos: '+s.mins.join(', ')+' min.':''}</p>`:''}
 <label>Procedimiento detectado<textarea onchange="sc2.secs[${a}].proc=this.value.split('\\n');R()">${esc(s.proc.join('\n'))}</textarea></label>
 <button class="x" onclick="sc2.secs.splice(${a},1);R()">Quitar sección</button></div>`}
scanV=function(){
 return `<div class="card gold"><h2 style="text-align:center">Capturar receta mediante</h2>
 <div class="r2"><label class="btn gb">Cámara<input type="file" accept="image/*" capture="environment" hidden onchange="sc2Go(this.files[0])"></label><label class="btn gb">Imagen de galería<input type="file" accept="image/*" hidden onchange="sc2Go(this.files[0])"></label></div>
 <p id="sst" class="m">${esc(sc2.st)||'Buena luz y letra clara mejoran la lectura. También sirven capturas de pantalla.'}</p>${sc2.img?`<img class="pv" src="${sc2.img}" alt="Receta">`:''}</div>
 <div class="card"><h2>Texto reconocido</h2><textarea placeholder="2 tazas de harina&#10;3 huevos&#10;250 ml de aceite&#10;sal" oninput="sc2.text=this.value">${esc(sc2.text)}</textarea><button onclick="sc2Parse()">Extraer ingredientes</button></div>`+
 (sc2.secs.length?`<div class="card"><label>Nombre de la receta (si no tiene título)<input value="${esc(sc2.name)}" onchange="sc2.name=this.value"></label>
 <label>Categoría de la receta<select onchange="sc2.cat=this.value"><option value="">Sin categoría</option>${(S.rcats||[]).map(c=>`<option value="${c.id}" ${c.id==sc2.cat?'selected':''}>${esc(c.n)}</option>`).join('')}</select></label>
 <button class="x" style="width:100%" onclick="rcNew()">Crear categoría nueva</button></div>`+sc2.secs.map(secH).join('')+`<button class="pri" onclick="sc2Create()">Crear ${sc2.secs.length>1?sc2.secs.length+' recetas':'receta'}</button>`:'');
};
T.scan[1]=scanV;
function sc2Row(a,b,c,v){const r=sc2.secs[a].rows[b];
 if(c=='g'){r.g=num(v);r.miss=r.g<=0;r.est=false}
 else if(c=='n'){r.n=cap(v);r.i=mt2(v);const i=S.ins.find(x=>x.id==r.i);if(i)r.cat=dc(i)}
 else if(c=='i'){r.i=v;const i=S.ins.find(x=>x.id==v);if(i)r.cat=dc(i)}
 else r[c]=v;R()}
function sc2Create(){let nw=0;const made=[];
 sc2.secs.forEach(s=>{if(!s.rows.length)return;
  const it=s.rows.map(r=>{let id=r.i||((S.ins.find(x=>norm(x.n)==norm(r.n))||{}).id);
   if(!id){id=uid();S.ins.push({id,n:cap(r.n),p:0,q:1000,u:'g',cat:r.cat||'mp',t:Date.now()});nw++}
   return{i:id,g:r.g,u:uid()}});
  const id=uid();S.rec.push({id,n:cap(s.n||sc2.name||'Receta escaneada'),it,por:1,env:0,min:0,gas:0,proc:s.proc.join('\n'),cat:sc2.cat||''});made.push(id)});
 if(!made.length){toast('No hay ingredientes para crear');return}
 save();sc2={text:'',img:'',st:'',name:'',cat:'',secs:[]};tab='rec';R(1);openRV(made[0]);toast(made.length+(made.length>1?' recetas creadas':' receta creada')+(nw?'. '+nw+' materiales nuevos con precio 0.':''))}
R();
