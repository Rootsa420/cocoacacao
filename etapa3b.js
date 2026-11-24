/* CocoaCacao etapa 3B: fotos como íconos de receta y fotos/videos en los pasos del tutor */
Object.assign(CHK,{etapa3b:()=>typeof sqPhoto});

/* Íconos cuadrados con foto y título pequeño */
const st9=document.createElement('style');
st9.textContent='.rg{grid-template-columns:repeat(3,1fr)!important}.rk{padding:0!important;aspect-ratio:1/1;min-height:0!important;overflow:hidden;background-size:cover;background-position:center}.rk .tt{position:absolute;left:0;right:0;bottom:0;background:rgba(0,0,0,.7);color:#fff;font-size:10.5px;font-weight:700;line-height:1.15;padding:3px 4px;text-align:center;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.rk .ph{position:absolute;left:0;right:0;top:0;bottom:30px;display:flex;align-items:center;justify-content:center;font-size:36px;font-weight:800;color:var(--mut);opacity:.5}.rk .st{top:2px;right:2px;bottom:auto;background:rgba(0,0,0,.5);border-radius:50%;font-size:19px;padding:0 5px;line-height:1.3}.mdb{display:flex;flex-wrap:wrap;gap:4px;margin:4px 0}';
document.head.appendChild(st9);
function sqPhoto(file,n,cb){const im=new Image();im.onload=()=>{const m=Math.min(im.width,im.height),c=document.createElement('canvas');c.width=c.height=n;c.getContext('2d').drawImage(im,(im.width-m)/2,(im.height-m)/2,m,m,0,0,n,n);cb(c.toDataURL('image/jpeg',.72));URL.revokeObjectURL(im.src)};im.src=URL.createObjectURL(file)}
recV=function(){
 const C=S.rcats||[],L=S.rec.filter(r=>!rcF||r.cat==rcF);
 return `<button class="pri" onclick="newR()">Nueva receta</button>
 <div class="rcb">${C.map(c=>`<button class="rc ${rcF==c.id?'on':''}" style="background:${c.c};color:${txt(c.c)}" onclick="rcF=rcF=='${c.id}'?'':'${c.id}';R()">${esc(c.n)}</button>`).join('')}<button class="rc pl" onclick="rcNew()">+</button><button class="rc pl" onclick="rcDel()">×</button></div>
 <div class="rg">${L.map(r=>`<div class="rk" style="border-color:${rcol(r.cat)};${r.img?`background-image:url(${r.img})`:''}" onclick="openRV('${r.id}')">${r.img?'':`<span class="ph">${esc((r.n||'?').trim().charAt(0).toUpperCase())}</span>`}<span class="tt">${esc(r.n)}</span><span class="st ${r.star?'on':''}" onclick="event.stopPropagation();togStar('${r.id}')">★</span></div>`).join('')}</div>`+(L.length?'':'<p class="m">No hay recetas en esta categoría.</p>')};
T.rec[1]=recV;
function photoCard(r){return `<div class="card"><h2>Foto de la receta</h2><div class="r2"><div>${r.img?`<img class="pv" style="margin:0;aspect-ratio:1/1;object-fit:cover" src="${r.img}" alt="">`:'<p class="m">Sin foto. En la lista se muestra la inicial del nombre.</p>'}</div><div><label class="btn">Tomar foto<input type="file" accept="image/*" capture="environment" hidden onchange="setRimg('${r.id}',this.files[0])"></label><label class="btn">De la galería<input type="file" accept="image/*" hidden onchange="setRimg('${r.id}',this.files[0])"></label>${r.img?`<button onclick="delRimg('${r.id}')">Quitar foto</button>`:''}</div></div></div>`}
function setRimg(id,f){if(f)sqPhoto(f,320,d=>{rec(id).img=d;save();R();toast('Foto guardada')})}
function delRimg(id){delete rec(id).img;save();R()}
const _eh4=editH;
editH=function(r){return _eh4(r).replace('<div class="card"><h2>Ingredientes (g)</h2>',()=>photoCard(r)+'<div class="card"><h2>Ingredientes (g)</h2>')};

/* Almacén de fotos y videos de los pasos (IndexedDB) */
const idb=()=>idb.p||(idb.p=new Promise((ok,no)=>{const q=indexedDB.open('cocoa-media',1);q.onupgradeneeded=()=>q.result.createObjectStore('m',{keyPath:'id'});q.onsuccess=()=>ok(q.result);q.onerror=()=>no(q.error)}));
const mTx=async(mode,fn)=>{const d=await idb();return new Promise((ok,no)=>{const t=d.transaction('m',mode),r=fn(t.objectStore('m'));t.oncomplete=()=>ok(r&&r.result);t.onerror=()=>no(t.error)})};
const mPut=(id,blob,type)=>mTx('readwrite',s=>s.put({id,blob,type}));
const mGet=id=>mTx('readonly',s=>s.get(id));
const mDel=id=>mTx('readwrite',s=>s.delete(id));
function bigPhoto(file){return new Promise(ok=>{const im=new Image();im.onload=()=>{const k=Math.min(1,1280/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);c.getContext('2d').drawImage(im,0,0,c.width,c.height);c.toBlob(b=>{URL.revokeObjectURL(im.src);ok(b)},'image/jpeg',.8)};im.src=URL.createObjectURL(file)})}
async function stMedia(id,j,file){if(!file)return;const vid=/^video/.test(file.type);
 if(vid&&file.size>80e6){toast('El video pesa más de 80 MB: grábalo más corto');return}
 try{const blob=vid?file:await bigPhoto(file),mid=uid();await mPut(mid,blob,vid?'vid':'img');const s=stp(id)[j];(s.md=s.md||[]).push({id:mid,t:vid?'vid':'img'});save();stShow(id);toast(vid?'Video guardado':'Foto guardada')}catch(e){toast('No se pudo guardar el archivo')}}
async function stMdDel(id,j,k){const s=stp(id)[j],m=s.md[k];try{await mDel(m.id)}catch(e){}s.md.splice(k,1);save();stShow(id)}
function mediaH(id,j){const L=stp(id)[j].md||[];
 return `<div class="mdb">${L.map((m,k)=>`<span class="chip">${m.t=='vid'?'Video':'Foto'} ${k+1} <a onclick="stMdDel('${id}',${j},${k})" style="margin-left:6px;cursor:pointer">✕</a></span>`).join('')}</div>
 <div class="r3" style="margin:6px 0"><label class="btn x" style="margin:0">Foto<input type="file" accept="image/*" capture="environment" hidden onchange="stMedia('${id}',${j},this.files[0])"></label><label class="btn x" style="margin:0">Video<input type="file" accept="video/*" capture="environment" hidden onchange="stMedia('${id}',${j},this.files[0])"></label><label class="btn x" style="margin:0">Galería<input type="file" accept="image/*,video/*" hidden onchange="stMedia('${id}',${j},this.files[0])"></label></div>`}
const _px=popx;
popx=function(h){if(/stSet\('[^']+',0,'t'/.test(h))h=h.replace(/(<textarea[^>]*stSet\('([^']+)',(\d+),'t'[^>]*>[\s\S]*?<\/textarea>)/g,(a,ta,id,j)=>ta+mediaH(id,+j));_px(h)};
const _sd=stDel;
stDel=function(id,j){const s=stp(id)[j];if(s)(s.md||[]).forEach(m=>mDel(m.id).catch(()=>{}));_sd(id,j)};

/* Fotos y videos dentro del tutor */
let tuUrls=[];
const _td=tutDraw;
tutDraw=function(){_td();const o=$('#tu');if(!o)return;const s=rec(tu.id).steps[tu.i];
 if(!(s.md||[]).length)return;
 o.innerHTML=o.innerHTML.replace('<p class="m">Tiempo en este paso','<div id="tu-md"></div><p class="m">Tiempo en este paso');
 tutMedia(tu.id,tu.i)};
async function tutMedia(id,i){tuUrls.forEach(u=>URL.revokeObjectURL(u));tuUrls=[];const s=rec(id).steps[i];let h='';
 for(const m of s.md||[]){try{const r=await mGet(m.id);if(!r)continue;const u=URL.createObjectURL(r.blob);tuUrls.push(u);
  h+=m.t=='vid'?`<video src="${u}" controls playsinline style="width:100%;border-radius:12px;margin-bottom:8px"></video>`:`<img src="${u}" style="width:100%;border-radius:12px;margin-bottom:8px" alt="">`}catch(e){}}
 const b=$('#tu-md');if(b&&tu&&tu.i==i)b.innerHTML=h}
const _te=tutEnd;
tutEnd=function(){tuUrls.forEach(u=>URL.revokeObjectURL(u));tuUrls=[];_te()};
R();
