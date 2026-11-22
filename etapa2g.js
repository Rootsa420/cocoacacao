/* CocoaCacao etapa 2G: tablas reales de conversión a gramos, orden de ingredientes con dos toques y estado de la app */
(()=>{const set=(o,n)=>{Object.keys(o).forEach(k=>delete o[k]);Object.assign(o,n)};
 set(CUP,{harina:120,'harina de almendra':96,maicena:120,almidon:120,azucar:198,'azucar morena':200,'azucar impalpable':120,'azucar glas':120,'azucar en polvo':120,'azucar flor':120,cocoa:85,cacao:85,mantequilla:227,margarina:227,manteca:200,'queso crema':227,yogur:227,'crema agria':227,'coco rallado':85,avena:85,nuez:113,chips:170,arroz:185});
 set(DENS,{agua:1,leche:1.03,'leche evaporada':1.07,'leche condensada':1.29,crema:.994,'crema de leche':.994,nata:.994,'crema ligera':1.012,'suero de leche':1.022,aceite:.92,'aceite de oliva':.91,'aceite de coco':.924,miel:1.42,'jarabe de arce':1.33,'jarabe de maiz':1.33,'jarabe de glucosa':1.33,jugo:1.05,zumo:1.05,licor:1.03,vino:.99});
 PIECE.length=0;PIECE.push(['yema',17],['clara',33],['huevo',50],['limon',58],['naranja',131],['banana',118],['platano',118],['manzana',182],['zanahoria',61])})();
const TSP={'polvo de hornear':4,bicarbonato:6,sal:6,vainilla:4.2,canela:2.6,levadura:3,cocoa:2,cacao:2,maicena:2.6,azucar:4.2};
const dOf=n=>{const k=keyIn(DENS,n);return k?DENS[k]:1};
const cupS=n=>{const k=keyIn(CUP,n);return k?CUP[k]:0};
const tspS=n=>{const k=keyIn(TSP,n);return k?TSP[k]:0};
toG=function(q,u,n){u=(u||'').toLowerCase().replace('.','');const nn=norm(n),d=dOf(nn),e=d!=1;
 if(/^(kg|kilo)/.test(u))return{g:q*1000};
 if(/^(mg|miligramo)/.test(u))return{g:q/1000};
 if(/^(g|gr|gramo)/.test(u))return{g:q};
 if(/^(oz|onza)/.test(u))return{g:q*28.3495};
 if(/^(lb|libra)/.test(u))return{g:q*453.592};
 if(/^(ml|mililitro|cc)/.test(u))return{g:q*d,est:e};
 if(/^(l|lt|litro)/.test(u))return{g:q*1000*d,est:e};
 const c=cupS(nn),t=tspS(nn);
 if(/^(taza|cup)/.test(u))return{g:q*(c||240*d),est:true};
 if(/^(cucharadita|cdta|tsp)/.test(u))return{g:q*(t||(c?c/48:5*d)),est:true};
 if(/^(cucharada|cda|tbsp)/.test(u))return{g:q*(t?t*3:(c?c/16:15*d)),est:true};
 if(/^pizca/.test(u))return{g:q*0.4,est:true};
 if(/^diente/.test(u))return{g:q*5,est:true};
 const p=pieceG(nn);return p?{g:q*p,est:true}:{g:0}};

/* Cambiar el orden: toca la franja de color de un ingrediente y luego la de otro */
let mvSel=null;
function mvTap(u){const r=rec(rv.id);
 if(!mvSel){mvSel=u;toast('Ahora toca la franja de color del ingrediente que quedará debajo');R();return}
 if(mvSel==u){mvSel=null;R();return}
 const a=r.it.findIndex(x=>x.u==mvSel);if(a<0){mvSel=null;R();return}
 const it=r.it.splice(a,1)[0],b=r.it.findIndex(x=>x.u==u);r.it.splice(b<0?r.it.length:b,0,it);mvSel=null;save();R()}
const _ih2=ingH;
ingH=function(r){return _ih2(r).replace(/onpointerdown="dgS\(event,'([^']+)'\)"/g,(m,u)=>`onclick="mvTap('${u}')" style="width:30px;cursor:pointer;${mvSel==u?'outline:3px solid var(--acc);outline-offset:-3px;filter:brightness(1.5)':''}"`)};
const _eh2=editH;
editH=function(r){return _eh2(r).replace('Mantén presionada la franja de color y arrastra para cambiar el orden.','Para cambiar el orden: toca la franja de color de un ingrediente y luego la de otro; el primero queda encima del segundo.')};
const _rr2=rvRender;rvRender=function(t){if(!rv||rv.mode!='edit')mvSel=null;_rr2(t)};

/* Estado de la app (qué archivos cargaron) */
const CHK={etapa1:()=>typeof eqV,etapa1b:()=>typeof lstMatch,etapa1c:()=>typeof pickIt,etapa1d:()=>typeof baseS,etapa2a:()=>typeof mnSave,etapa2b:()=>typeof openRV,etapa2c:()=>typeof utWin,etapa2e:()=>typeof sc2Parse,etapa2f:()=>typeof mem,etapa2g:()=>typeof mvTap,etapa2h:()=>typeof energyCard};
const _cv5=cfgV;
cfgV=function(){return _cv5().replace('<div class="card"><h2>Respaldo de datos</h2>',`<div class="card"><h2>Estado de la app</h2>${Object.keys(CHK).map(k=>{const ok=CHK[k]()!='undefined';return `<div class="ln"><span>${k}</span><span>${ok?'✅ cargado':'❌ no cargó'}</span></div>`}).join('')}<p class="m">Si algún módulo dice «no cargó», revisa que el archivo exista y que su línea esté en index.html.</p></div><div class="card"><h2>Respaldo de datos</h2>`)};
T.cfg[1]=cfgV;
R();
