/* CocoaCacao etapa 3D: respaldo en Excel (.xlsx) y ficha técnica imprimible */
Object.assign(CHK,{etapa3d:()=>typeof xlsxBuild});

/* Escritor de .xlsx sin librerías (zip sin compresión) */
const CRCT=(()=>{const t=[];for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0}return t})();
const crc32=b=>{let c=0xFFFFFFFF;for(let i=0;i<b.length;i++)c=CRCT[(c^b[i])&255]^(c>>>8);return(c^0xFFFFFFFF)>>>0};
function zipStore(files){const enc=new TextEncoder(),out=[],cd=[],u16=v=>[v&255,(v>>>8)&255],u32=v=>[v&255,(v>>>8)&255,(v>>>16)&255,(v>>>24)&255];let off=0;
 files.forEach(f=>{const nm=enc.encode(f.name),d=enc.encode(f.data),c=crc32(d),
  lh=[0x50,0x4b,3,4,20,0,0,0,0,0,0,0,0x21,0,...u32(c),...u32(d.length),...u32(d.length),...u16(nm.length),0,0];
  out.push(new Uint8Array(lh),nm,d);
  cd.push(new Uint8Array([0x50,0x4b,1,2,20,0,20,0,0,0,0,0,0,0,0x21,0,...u32(c),...u32(d.length),...u32(d.length),...u16(nm.length),0,0,0,0,0,0,0,0,0,0,0,0,...u32(off)]),nm);
  off+=lh.length+nm.length+d.length});
 const cs=cd.reduce((a,b)=>a+b.length,0),end=new Uint8Array([0x50,0x4b,5,6,0,0,0,0,...u16(files.length),...u16(files.length),...u32(cs),...u32(off),0,0]),
  all=[...out,...cd,end],res=new Uint8Array(all.reduce((a,b)=>a+b.length,0));let p=0;all.forEach(b=>{res.set(b,p);p+=b.length});return res}
const xe=s=>String(s).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const colN=n=>{let s='';n++;while(n>0){const m=(n-1)%26;s=String.fromCharCode(65+m)+s;n=Math.floor((n-1)/26)}return s};
function sheetX(rows){const w=rows.reduce((a,r)=>Math.max(a,r.length),1);
 return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><cols><col min="1" max="'+w+'" width="22" customWidth="1"/></cols><sheetData>'+rows.map((r,i)=>'<row r="'+(i+1)+'">'+r.map((v,j)=>{if(v===''||v==null)return '';const ref=colN(j)+(i+1),s=i==0?' s="1"':'';
  if(typeof v=='number'&&isFinite(v))return '<c r="'+ref+'"'+s+'><v>'+v+'</v></c>';
  return '<c r="'+ref+'" t="inlineStr"'+s+'><is><t xml:space="preserve">'+xe(v)+'</t></is></c>'}).join('')+'</row>').join('')+'</sheetData></worksheet>'}
function xlsxBuild(sheets){const NS='http://schemas.openxmlformats.org/spreadsheetml/2006/main',RN='http://schemas.openxmlformats.org/officeDocument/2006/relationships',H='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
 const files=[
 {name:'[Content_Types].xml',data:H+'<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>'+sheets.map((s,i)=>'<Override PartName="/xl/worksheets/sheet'+(i+1)+'.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>').join('')+'</Types>'},
 {name:'_rels/.rels',data:H+'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="'+RN+'/officeDocument" Target="xl/workbook.xml"/></Relationships>'},
 {name:'xl/workbook.xml',data:H+'<workbook xmlns="'+NS+'" xmlns:r="'+RN+'"><sheets>'+sheets.map((s,i)=>'<sheet name="'+xe(s.name.slice(0,31))+'" sheetId="'+(i+1)+'" r:id="rId'+(i+1)+'"/>').join('')+'</sheets></workbook>'},
 {name:'xl/_rels/workbook.xml.rels',data:H+'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'+sheets.map((s,i)=>'<Relationship Id="rId'+(i+1)+'" Type="'+RN+'/worksheet" Target="worksheets/sheet'+(i+1)+'.xml"/>').join('')+'<Relationship Id="rId'+(sheets.length+1)+'" Type="'+RN+'/styles" Target="styles.xml"/></Relationships>'},
 {name:'xl/styles.xml',data:H+'<styleSheet xmlns="'+NS+'"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts><fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/></cellXfs></styleSheet>'}]
 .concat(sheets.map((s,i)=>({name:'xl/worksheets/sheet'+(i+1)+'.xml',data:sheetX(s.rows)})));
 return zipStore(files)}

/* Datos de todas las tablas de la app */
function xlsxSheets(){const G=S.cfg,CN={mp:'Materia prima',ins:'Insumos y empaques',man:'Mantenimiento y operaciones'},n2=v=>Math.round(num(v)*100)/100,n4=v=>Math.round(num(v)*10000)/10000,
 cn=id=>((S.rcats||[]).find(x=>x.id==id)||{}).n||'',nm=id=>cap(nmI(id));
 const mat=[['Material','Categoría','Formato','Cantidad','Precio Bs','Bs por unidad','Tipo','Origen o componentes']].concat(S.ins.map(i=>[cap(i.n),CN[dc(i)],i.u=='u'?'unidades':i.u,n2(i.q),n2(i.p),n4(ppg(i)),i.der?'Derivado':i.mix?'Mezcla':'Simple',i.der?nm(i.der.from)+' '+i.der.pct+' %':i.mix?i.mix.map(m=>nm(m.i)+' '+m.g+' g').join(' + '):'']));
 const rec=[['Receta','Categoría','Tendencia','Masa total (g)','Costo del lote (Bs)','Costo promedio por unidad (Bs)','Mano de obra (min)','Envase por porción (Bs)','Gas (Bs)','Electricidad (Bs)','Masa adicional (g)']],ing=[['Receta','Orden','Ingrediente','Categoría','Gramos de la receta','Gramos para producir','Costo (Bs)','Es base','Grupo de suma','Reemplazo']],
 der=[['Receta','Ingrediente','Derivado','Porcentaje','Gramos para producir']],pre=[['Receta','Presentación','Peso (g)','Cantidad','Envase (Bs)','Minutos extra','Costo por unidad (Bs)','Precio margen 1','Precio margen 2','Precio aplicado']],
 pas=[['Receta','Paso','Descripción','Cronómetro (min)','Horno (°C)','Último tiempo real (min)','Veces que pidió ayuda','Fotos y videos']],con=[['Receta','Equipo','Minutos','Gas','Electricidad','Costo gas (Bs)','Costo electricidad (Bs)']],ute=[['Receta','Utensilio','Peso vacío (g)']];
 S.rec.forEach(r=>{const c=cost(r),k=c.k||1;
  rec.push([r.n,cn(r.cat),r.star?'Sí':'',n2(c.peso),n2(c.total),n2(c.unit),n2(r.min),n2(r.env),n2(c.gas),n2(c.ene),n2(r.ex)]);
  r.it.forEach((x,j)=>{const i=S.ins.find(z=>z.id==x.i),g=num(x.g)*k,gi=(r.gs||[]).findIndex(G2=>G2.includes('i:'+x.u));
   ing.push([r.n,j+1,i?cap(i.n):'(sin elegir)',i?CN[dc(i)]:'',n2(x.g),n2(g),n2(i?g*ppg(i):0),x.b?'Sí':'',gi>=0?gi+1:'',x.rp?'Reemplazó a '+nm(x.rp.from)+' '+x.rp.g+' g':''])});
  (r.sp||[]).forEach(s=>{const t=spG(r,s,k);s.parts.forEach(p=>der.push([r.n,nm(s.i),p.n,n2(p.p),n2(t*num(p.p)/100)]))});
  (r.pres||[]).forEach(p=>{const u=uCost(c,p,r),m1=r.m1!=null?r.m1:G.m1,m2=r.m2!=null?r.m2:G.m2;pre.push([r.n,p.n,n2(p.w),n2(p.q),n2((p.e!=null&&p.e!=='')?p.e:r.env),n2(p.m),n2(u),n2(price(u,m1)),n2(price(u,m2)),n2(p.pv)])});
  (r.steps||[]).forEach((s,j)=>pas.push([r.n,j+1,s.t,n2(s.m),n2(s.c),n2(s.a),s.h||0,(s.md||[]).length]));
  (r.uso||[]).forEach(u=>{const e=S.eq.find(x=>x.id==u.e);if(!e)return;con.push([r.n,cap(e.n),n2(u.m),u.g?'Sí':'',u.l?'Sí':'',u.g?n2(num(e.gh)*num(u.m)/60*G.gBs/(G.gKg*1000)):0,u.l?n2(num(e.w)/1000*num(u.m)/60*(G.kwh??1)):0])});
  (r.ut||[]).forEach(id=>{const e=S.eq.find(x=>x.id==id);ute.push([r.n,e?cap(e.n):'',n2(e&&e.p)])})});
 const eq=[['Equipo','Tipo','Potencia (W)','Gas (g/h)','Peso vacío (g)']].concat(S.eq.map(e=>[cap(e.n),e.t=='utensilio'?'Utensilio':'Equipo',n2(e.w),n2(e.gh),n2(e.p)]));
 const ven=[['Fecha','Producto','Inicial','Producido','Final','Vendido','Precio (Bs)','Total (Bs)','Costo unitario (Bs)']];
 Object.keys(S.sales||{}).sort().forEach(d=>S.sales[d].forEach(x=>{const v=(x.fin===''||x.fin==null)?'':num(x.ini)+num(x.prod)-num(x.fin);ven.push([d,x.n,n2(x.ini),n2(x.prod),x.fin===''||x.fin==null?'':n2(x.fin),v===''?'':n2(v),n2(x.pr),v===''?'':n2(v*num(x.pr)),n2(x.u)])}));
 const L={sueldo:'Sueldo mensual (Bs)',dias:'Días al mes',hdia:'Horas al día',gBs:'Precio garrafa (Bs)',gKg:'Peso del gas (kg)',kwh:'Tarifa (Bs por kWh)',fijos:'Gastos fijos al mes (Bs)',mkt:'Marketing al mes (Bs)',lotes:'Lotes al mes',com:'Comisión de pagos (%)',m1:'Margen general 1 (%)',m2:'Margen general 2 (%)',rep:'Reparto de gastos',minMes:'Minutos de trabajo al mes'};
 const aj=[['Parámetro','Valor']].concat(Object.keys(L).filter(k=>G[k]!=null).map(k=>[L[k],typeof G[k]=='number'?n2(G[k]):G[k]]));
 return[{name:'Materiales',rows:mat},{name:'Recetas',rows:rec},{name:'Ingredientes',rows:ing},{name:'Derivados',rows:der},{name:'Presentaciones',rows:pre},{name:'Pasos',rows:pas},{name:'Equipos',rows:eq},{name:'Consumo de equipos',rows:con},{name:'Utensilios',rows:ute},{name:'Ventas',rows:ven},{name:'Ajustes',rows:aj}]}
function expXlsx(){try{const b=new Blob([xlsxBuild(xlsxSheets())],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='cocoacacao-respaldo-'+tdy()+'.xlsx';a.click();toast('Excel generado en Descargas')}catch(e){toast('No se pudo generar el Excel')}}
const _cv6=cfgV;
cfgV=function(){return _cv6().replace('<button onclick="exp()">Exportar copia (.json)</button>','<button onclick="exp()">Exportar copia (.json)</button><button onclick="expXlsx()">Exportar todo a Excel (.xlsx)</button>')};
T.cfg[1]=cfgV;

/* Ficha técnica imprimible */
const st11=document.createElement('style');
st11.textContent='#ft{position:fixed;inset:0;z-index:25;background:#fff;color:#111;overflow:auto;padding:14px;font-size:13px}#ft table{width:100%;border-collapse:collapse;margin:6px 0 14px;font-size:12px}#ft th,#ft td{border:1px solid #888;padding:3px 5px;text-align:left;vertical-align:top}#ft th{background:#eee}#ft h1{font-size:18px;margin:0}#ft h3{font-size:14px;margin:12px 0 4px;border-bottom:2px solid #333}#ft button{background:#B0124F;color:#fff;border:0;border-radius:8px;padding:10px 14px;margin:0 8px 8px 0;font-weight:700;width:auto}#ft .nl{height:22px;border-bottom:1px solid #888}@media print{body>*:not(#ft){display:none!important}#ft{position:static!important;overflow:visible!important}.noprint{display:none!important}}';
document.head.appendChild(st11);
function fichaH(r){const c=cost(r),k=c.k||1,G=S.cfg,CN={mp:'Materia prima',ins:'Insumos y empaques',man:'Mantenimiento y operaciones'},P=(r.pres||[]).filter(p=>num(p.w)>0),cat=((S.rcats||[]).find(x=>x.id==r.cat)||{}).n||'Sin categoría',gs=r.gs||[];
 const T2=(h,rows)=>`<table><thead><tr>${h.map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody>${rows.map(a=>`<tr>${a.map(x=>`<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
 const ing=r.it.map((x,j)=>{const i=S.ins.find(z=>z.id==x.i),g=num(x.g)*k,gi=gs.findIndex(G2=>G2.includes('i:'+x.u));return [j+1,esc(i?cap(i.n):'(sin elegir)')+(x.b?' (base)':'')+(gi>=0?' [grupo '+(gi+1)+']':''),i?CN[dc(i)]:'',f(x.g,1),f(g,1),f(c.peso>0?num(x.g)/c.peso*100:0,1)+' %','Bs '+f(i?g*ppg(i):0)]});
 const dv=[];(r.sp||[]).forEach(s=>{const t=spG(r,s,k);s.parts.forEach(p=>dv.push([esc(cap(nmI(s.i))),esc(p.n),f(p.p,1)+' %',f(t*num(p.p)/100,1)]))});
 const eqr=(r.uso||[]).map(u=>{const e=S.eq.find(x=>x.id==u.e);return [esc(e?cap(e.n):'(sin elegir)'),f(u.m,0),(u.g?'Gas':'')+(u.g&&u.l?' y ':'')+(u.l?'Electricidad':'')]});
 return `<div class="noprint"><button onclick="window.print()">Imprimir o guardar como PDF</button><button onclick="ftClose()">Cerrar</button></div>
 <h1>CocoaCacao – repostería artesanal</h1><div><b>FICHA TÉCNICA DE PRODUCCIÓN</b> · ${tdy()}</div>
 <h3>Datos generales</h3>${T2(['Receta','Categoría','Masa total','Mano de obra','Costo del lote'],[[esc(r.n),esc(cat),f(c.peso,0)+' g',f(r.min,0)+' min','Bs '+f(c.total)]])}
 ${r.img?`<img src="${r.img}" style="width:110px;height:110px;object-fit:cover;border:1px solid #888;float:right;margin:0 0 8px 8px" alt="">`:''}
 ${P.length?`<h3>Presentaciones</h3>${T2(['Presentación','Peso (g)','Cantidad','Envase (Bs)','Costo por unidad (Bs)','Precio aplicado (Bs)'],P.map(p=>[esc(p.n),f(p.w,0),f(p.q,0),f((p.e!=null&&p.e!=='')?p.e:r.env),f(uCost(c,p,r)),p.pv>0?f(p.pv):'']))}`:''}
 <h3>Ingredientes</h3>${T2(['N°','Ingrediente','Categoría','Receta (g)','Para producir (g)','% de la masa','Costo'],ing)}
 ${dv.length?`<h3>Derivados</h3>${T2(['Ingrediente','Derivado','Porcentaje','Gramos para producir'],dv)}`:''}
 ${(r.ut||[]).length?`<h3>Utensilios</h3>${T2(['Utensilio','Peso vacío (g)'],r.ut.map(id=>{const e=S.eq.find(x=>x.id==id);return [esc(e?cap(e.n):''),f(e&&e.p,0)]}))}`:''}
 ${eqr.length?`<h3>Equipos</h3>${T2(['Equipo','Minutos','Energía'],eqr)}`:''}
 <h3>Procedimiento</h3>${(r.steps||[]).length?T2(['N°','Descripción','Tiempo (min)','Horno (°C)'],r.steps.map((s,j)=>[j+1,esc(s.t),s.m?f(s.m,0):'',s.c?f(s.c,0):''])):'<div class="nl"></div><div class="nl"></div><div class="nl"></div>'}
 <h3>Costos</h3>${T2(['Concepto','Bs'],[['Materia prima',f(c.mp)],['Envases',f(c.env)],['Mano de obra',f(c.mo)],['Gas',f(c.gas)],['Electricidad',f(c.ene)],['Gastos fijos y marketing',f(c.ind)],['<b>Costo del lote</b>','<b>'+f(c.total)+'</b>'],['Costo promedio por unidad',f(c.unit)]])}
 <h3>Observaciones</h3><div class="nl"></div><div class="nl"></div><div class="nl"></div>
 <table><tr><td style="height:46px">Elaborado por:</td><td>Revisado por:</td></tr></table>`}
function fichaOpen(id){let o=$('#ft');if(!o){o=document.createElement('div');o.id='ft';document.body.appendChild(o)}o.innerHTML=fichaH(rec(id));o.scrollTop=0}
function ftClose(){const o=$('#ft');if(o)o.remove()}
const _vh2=viewH;
viewH=function(r){return _vh2(r).replace(/(<button class="pri" onclick="tutStart\('[^']+'\)">Iniciar tutor de receta<\/button>)/,(m)=>m+`<button onclick="fichaOpen('${r.id}')">Ficha técnica (imprimir o PDF)</button>`)};
R();
