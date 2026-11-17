/* CocoaCacao etapa 1: gas separado, equipos, energía y conversión de medidas */
function migrate(){const c=S.cfg;if(c.gGhH==null)c.gGhH=600;if(c.kwh==null)c.kwh=1;if(!S.eq)S.eq=[]}
const _R=R;R=function(t){migrate();_R(t)};

cost=function(r){
 const c=S.cfg,pi=id=>S.ins.find(i=>i.id===id);
 const peso=r.it.reduce((a,x)=>a+num(x.g),0);
 const mp=r.it.reduce((a,x)=>{const i=pi(x.i);return a+(i?num(x.g)*ppg(i):0)},0);
 const por=Math.max(1,num(r.por)),env=num(r.env)*por;
 const mo=c.sueldo/(c.dias*c.hdia*60)*num(r.min);
 const gas=(num(r.gas)*c.gGh+num(r.gasH)*(c.gGhH??600))/60*(c.gBs/(c.gKg*1000));
 const ene=(r.uso||[]).reduce((a,u)=>{const e=(S.eq||[]).find(x=>x.id===u.e);return a+(e?num(e.w)/1000*num(u.m)/60*(c.kwh??1):0)},0);
 const ind=(num(c.fijos)+num(c.mkt))/Math.max(1,c.lotes);
 const total=mp+env+mo+gas+ene+ind;
 return{peso,mp,env,mo,gas,ene,ind,total,por,unit:total/por,gpp:peso/por};
};

/* Ajustes: gas por separado y electricidad */
const _cv=cfgV;
cfgV=function(){
 let h=_cv();const s=h.indexOf('<div class="card"><h2>Gas (garrafa)</h2>');if(s<0)return h;
 const e=h.indexOf('</div></div>',s)+12;
 return h.slice(0,s)+`<div class="card"><h2>Gas (garrafa)</h2><div class="r2">${cf('gBs','Precio garrafa (Bs)')}${cf('gKg','Peso del gas (kg)')}${cf('gGh','Cocina hogareña (g/h)')}${cf('gGhH','Horno semi industrial (g/h)')}</div>
 <p class="m">Para medir el consumo: pesa la garrafa, usa el equipo 1 hora y vuelve a pesarla. La diferencia en gramos es el consumo por hora.</p></div>
 <div class="card"><h2>Electricidad</h2>${cf('kwh','Tarifa (Bs por kWh)')}<p class="m">Búscala en tu factura de luz. Los vatios de cada equipo se anotan en la pestaña Equipos.</p></div>`+h.slice(e);
};
T.cfg[1]=cfgV;

/* Recetas: horno y equipos eléctricos */
const _ev=editV;
editV=function(r){
 let h=_ev(r);const U=r.uso||[],c=cost(r);
 const ops=sel=>'<option value="">Elegir equipo</option>'+S.eq.filter(e=>e.t!='utensilio').map(e=>`<option value="${e.id}" ${e.id==sel?'selected':''}>${esc(e.n)}</option>`).join('');
 const card=`<div class="card"><h2>Horno semi industrial</h2><label>Tiempo encendido (min)<input inputmode="decimal" value="${r.gasH||0}" onchange="updR('${r.id}','gasH',this.value)"></label></div>
 <div class="card"><h2>Equipos eléctricos usados</h2>
 ${U.map((u,k)=>`<div class="ir" style="grid-template-columns:1fr 70px 34px 44px"><select onchange="setUso('${r.id}',${k},'e',this.value)">${ops(u.e)}</select><input inputmode="decimal" value="${u.m}" onchange="setUso('${r.id}',${k},'m',this.value)"><span style="font-size:11px">min</span><button class="x" onclick="rmUso('${r.id}',${k})">✕</button></div>`).join('')}
 <button onclick="addUso('${r.id}')">Agregar equipo</button><p class="m">Consumo eléctrico del lote: Bs ${f(c.ene)}</p></div>`;
 return h.replace('<div class="card"><h2>Costeo por absorción</h2>',card+'<div class="card"><h2>Costeo por absorción</h2>')
  .replace('Hornalla encendida (min)','Cocina hogareña encendida (min)')
  .replace('Gas de hornalla','Gas (cocina y horno)')
  .replace('<div class="ln"><span>Gastos fijos y marketing</span>',`<div class="ln"><span>Energía eléctrica</span><span>Bs ${f(c.ene)}</span></div><div class="ln"><span>Gastos fijos y marketing</span>`);
};
const uso=id=>{const r=rec(id);return r.uso=r.uso||[]};
function addUso(id){uso(id).push({e:'',m:0});save();R()}
function setUso(id,k,c,v){uso(id)[k][c]=c=='m'?num(v):v;save();R()}
function rmUso(id,k){uso(id).splice(k,1);save();R()}

/* Equipos y utensilios */
const eq=id=>S.eq.find(e=>e.id===id);
function shrink(file,cb){const i=new Image();i.onload=()=>{const k=Math.min(1,480/Math.max(i.width,i.height)),c=document.createElement('canvas');c.width=i.width*k;c.height=i.height*k;c.getContext('2d').drawImage(i,0,0,c.width,c.height);cb(c.toDataURL('image/jpeg',.6));URL.revokeObjectURL(i.src)};i.src=URL.createObjectURL(file)}
function eqV(){
 const L=[...S.eq].sort((a,b)=>a.n.localeCompare(b.n,'es'));
 const tp=v=>`<option value="equipo" ${v=='equipo'?'selected':''}>Equipo eléctrico</option><option value="utensilio" ${v=='utensilio'?'selected':''}>Utensilio</option>`;
 return `<div class="card"><h2>Nuevo equipo o utensilio</h2>
 <label>Nombre<input id="en" placeholder="Batidora de pedestal"></label>
 <div class="r3"><label>Tipo<select id="et">${tp('equipo')}</select></label><label>Potencia (W)<input id="ew" inputmode="decimal"></label><label>Peso vacío (g)<input id="ep" inputmode="decimal"></label></div>
 <button class="pri" onclick="addE()">Guardar</button>
 <p class="m">La potencia (W) está en la etiqueta del equipo. Los utensilios no la necesitan.</p></div>`+
 (L.map(e=>`<div class="card"><div class="rw"><b>${esc(e.n)}</b><button class="x" onclick="del('eq','${e.id}')">Borrar</button></div>
 ${e.f?`<img class="pv" src="${e.f}" alt="">`:''}
 <label class="btn" style="margin-top:8px">${e.f?'Cambiar foto':'Tomar foto'}<input type="file" accept="image/*" capture="environment" hidden onchange="foto('${e.id}',this.files[0])"></label>
 <div class="r3"><label>Tipo<select onchange="updE('${e.id}','t',this.value,1)">${tp(e.t)}</select></label><label>Potencia W<input inputmode="decimal" value="${e.w}" onchange="updE('${e.id}','w',this.value)"></label><label>Peso vacío g<input inputmode="decimal" value="${e.p}" onchange="updE('${e.id}','p',this.value)"></label></div>
 <label>Lectura de la balanza con el equipo (g)<input inputmode="decimal" oninput="this.parentNode.nextElementSibling.firstElementChild.textContent=f(Math.max(0,num(this.value)-${num(e.p)}),1)+' g'"></label>
 <p class="m">Peso neto del contenido: <b>0 g</b></p></div>`).join('')||'<p class="m">Aún no hay equipos.</p>');
}
function addE(){const n=$('#en').value.trim();if(!n){toast('Falta el nombre');return}S.eq.push({id:uid(),n,t:$('#et').value,w:num($('#ew').value),p:num($('#ep').value)});save();R();toast('Guardado')}
function updE(id,k,v,txt){eq(id)[k]=txt?v:num(v);save();R()}
function foto(id,file){if(file)shrink(file,d=>{eq(id).f=d;save();R()})}
T.eq=['Equipos y utensilios',eqV];

/* Escáner: onzas, libras, fracciones */
const UN={kg:1000,kilo:1000,kilos:1000,l:1000,lt:1000,litro:1000,litros:1000,oz:28.3495,onza:28.3495,onzas:28.3495,lb:453.592,lbs:453.592,libra:453.592,libras:453.592};
function qn(s){s=s.replace('½','1/2').replace('¼','1/4').replace('¾','3/4').trim();let t=0;s.split(/\s+/).forEach(p=>{if(p.includes('/')){const a=p.split('/');t+=num(a[0])/(num(a[1])||1)}else t+=num(p)});return t}
parse=function(t){
 const rows=[],temp=[],mins=[],N='(\\d+(?:[.,]\\d+)?(?:\\s+\\d+/\\d+|/\\d+)?|[½¼¾])',U='(kg|kilos?|gr?s?|gramos?|ml|lbs?|libras?|oz|onzas?|lt|l|litros?)';
 t.split('\n').forEach(l=>{l=l.trim();if(!l)return;
  (l.match(/\d{2,3}\s*(?:°|º|grados)/gi)||[]).forEach(x=>temp.push(parseInt(x)));
  (l.match(/\d+\s*(?:min|minutos)\b/gi)||[]).forEach(x=>mins.push(parseInt(x)));
  let m=l.match(new RegExp('^[-•*\\s]*'+N+'\\s*'+U+'\\b\\.?\\s*(?:de\\s+)?(.+)$','i')),n,q,u;
  if(m){q=m[1];u=m[2];n=m[3]}else{m=l.match(new RegExp('^[-•*\\s]*(.+?)[:\\s.]+'+N+'\\s*'+U+'\\b','i'));if(m){n=m[1];q=m[2];u=m[3]}}
  if(!m)return;
  rows.push({n:n.replace(/[.,;:]+$/,'').trim(),g:Math.round(qn(q)*(UN[u.toLowerCase()]||1)*10)/10,i:mt(n)});
 });
 return{rows,temp,mins};
};

/* Barra inferior: botón Equipos */
const st=document.createElement('style');st.textContent='nav button{font-size:11px;padding:0}';document.head.appendChild(st);
const nb=document.createElement('button');nb.dataset.t='eq';nb.textContent='Equipos';nb.onclick=()=>go('eq');
document.querySelector('nav button[data-t=rec]').after(nb);
R();
