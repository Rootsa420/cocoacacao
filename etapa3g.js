/* CocoaCacao etapa 3G: cantidad final de la receta y reemplazo por intensidad (extractos, esencias y aromas) */
Object.assign(CHK,{etapa3g:()=>typeof intShow});

/* Cantidad final de la receta (pérdida al cocinar) */
const _c7=cost;
cost=function(r){const o=_c7(r);if(FORCE1)return o;
 const fin=num(r.fin),bp=r.it.reduce((a,x)=>a+num(x.g),0);if(!(fin>0)||!(bp>0))return o;
 if((r.pres||[]).length&&o.T>0){const k=bp/fin,d=o.mp*(k-1);return Object.assign({},o,{mp:o.mp*k,k:(o.k||1)*k,total:o.total+d,unit:(o.total+d)/o.por,per:o.per+d/o.T,fin,bp})}
 return Object.assign({},o,{peso:fin,gpp:fin/o.por,per:o.per*o.peso/fin,fin,bp})};
const _q3=qtyH;
qtyH=function(r){let h=_q3(r);if(!(num(r.fin)>0))return h;
 const c=cost(r),bp=r.it.reduce((a,x)=>a+num(x.g),0),mat=bp*(c.k||1),fin=(r.pres||[]).length&&c.T>0?c.T:num(r.fin),loss=mat-fin;
 const s=`<div class="ln q sm"><span>Suma de los materiales</span><span>${f(mat,1)} g</span></div><div class="ln q sm"><span>Cantidad final</span><span>${f(fin,1)} g</span></div>${loss>0.05?`<div class="ln q"><span>Pérdida al cocinar</span><span>${f(loss,1)} g (${f(mat>0?loss/mat*100:0,1)} %)</span></div>`:''}`;
 const a=h.search(/<p class="m" style="margin-top:12px"><b>(Utensilios|Equipos)<\/b><\/p>/);
 return a<0?h+s:h.slice(0,a)+s+h.slice(a)};
const _vh3=viewH;
viewH=function(r){const bp=r.it.reduce((a,x)=>a+num(x.g),0);
 return _vh3(r).replace('</div></div><div class="card"><h2>Presentaciones a producir</h2>',()=>`</div><label style="margin-top:10px">Cantidad final de la receta (g)<input inputmode="decimal" placeholder="${f(bp,0)}" value="${r.fin||''}" oninput="liveR('${r.id}','fin',this.value)"></label><p class="m">Si la receta pierde peso al cocinarse (como una mermelada), anota cuánto queda al terminar. Vacío = igual a la suma de los materiales.</p></div><div class="card"><h2>Presentaciones a producir</h2>`)};
const _tb=togB;
togB=function(id,k){const r=rec(id),kk=cost(r).k||1,will=!r.it[k].b&&(r.pres||[]).length&&Math.abs(kk-1)>1e-9,fin=num(r.fin);
 _tb(id,k);if(will&&fin>0){r.fin=Math.round(fin*kk*10)/10;save();R()}};
const _xs2=xlsxSheets;
xlsxSheets=function(){const sh=_xs2(),rr=sh[1].rows;rr[0].push('Cantidad final obtenida (g)');
 S.rec.forEach((r,k)=>{if(rr[k+1])rr[k+1].push(num(r.fin)>0?Math.round(num(r.fin)*10)/10:'')});return sh};

/* Reemplazo por intensidad: cambia la cantidad, no el líquido de la receta */
const INTRE=/vainilla|esencia|extracto|aroma|saborizante|licor|colorante/;
const matI=id=>S.ins.find(z=>z.id==id);
function intSave(){const x=rec(rw.id).it[rw.j],a=matI(x.i),b=matI(rw.tg);if(a)a.int=num(rw.ia)||1;if(b)b.int=num(rw.ib)||1;save()}
function modeBtns(){return `<div class="r2" style="margin:6px 0"><button class="x" style="width:100%;${rw.kind!='int'?ON:''}" onclick="rwMode('tec')">Técnico (grasa, agua, azúcar)</button><button class="x" style="width:100%;${rw.kind=='int'?ON:''}" onclick="rwMode('int')">Por intensidad</button></div>`}
function rwMode(m){const x=rec(rw.id).it[rw.j];
 if(m=='int'){if(rw.kind!='int')rw.kind0=rw.kind;rw.kind='int';rw.ia=num((matI(x.i)||{}).int)||1;rw.ib=num((matI(rw.tg)||{}).int)||1}
 else rw.kind=(rw.kind0&&rw.kind0!='int')?rw.kind0:repKind(nmI(x.i));
 repShow()}
rwTg=function(v){const p=byName(v);if(!p){toast('Ese material no existe');repShow();return}rw.tg=p.id;if(rw.kind=='int')rw.ib=num(p.int)||1;repShow()};
const _rwn=repWin;
repWin=function(id,j){_rwn(id,j);const x=rec(id).it[j];rw.kind0=rw.kind;
 if(INTRE.test(norm(nmI(x.i)))){rw.kind='int';rw.tg='';rw.ia=num((matI(x.i)||{}).int)||1;rw.ib=1}repShow()};
const _rs=repShow;
repShow=function(){if(rw.kind=='int')return intShow();
 const px=popx;popx=function(h){px(h.replace(/(<h2>Reemplazar «[^<]*»<\/h2>)/,m=>m+modeBtns()))};try{_rs()}finally{popx=px}};
function intShow(){const r=rec(rw.id),x=r.it[rw.j],tg=matI(rw.tg),A=num(x.g),ia=num(rw.ia)||1,ib=num(rw.ib)||1,B=Math.round(A*ia/ib*10)/10;
 popx(`<h2>Reemplazar «${esc(cap(nmI(x.i)))}»</h2>${modeBtns()}
 ${x.rp?`<p class="m">Ya fue reemplazado. Original: ${esc(cap(nmI(x.rp.from)))} ${f(x.rp.g,1)} g.</p><button onclick="repUndo()">Deshacer reemplazo</button>`:''}
 <p class="m">Para extractos, esencias, licores y aromas: cambia solo la cantidad según la intensidad de cada uno. <b>No cambia el líquido de la receta.</b></p>
 <label>Reemplazar por<input list="dl-rp" value="${tg?esc(cap(tg.n)):''}" onchange="rwTg(this.value)"></label><datalist id="dl-rp">${S.ins.map(z=>`<option value="${esc(cap(z.n))}">`).join('')}</datalist>
 <div class="r2"><label>Intensidad de «${esc(cap(nmI(x.i)))}»<input inputmode="decimal" value="${ia}" onchange="rw.ia=num(this.value);intSave();repShow()"></label><label>Intensidad del nuevo<input inputmode="decimal" value="${ib}" onchange="rw.ib=num(this.value);intSave();repShow()"></label></div>
 <p class="m">Escala relativa: 1 = extracto simple. Un extracto doble vale 2 y uno más suave 0,5. Se guarda en cada material para la próxima vez.</p>
 <div class="ln"><span>Antes</span><span>${esc(cap(nmI(x.i)))} ${f(A,1)} g</span></div>
 <div class="ln t"><span>Después</span><span>${tg?esc(cap(tg.n)):'(elige el nuevo)'} ${f(B,1)} g</span></div>
 <div class="r2"><button class="pri" onclick="repApply()">Aplicar reemplazo</button><button onclick="clp()">Cancelar</button></div>`)}
const _ra=repApply;
repApply=function(){if(rw.kind!='int')return _ra();
 const r=rec(rw.id),x=r.it[rw.j];
 if(!rw.tg){toast('Elige por cuál ingrediente reemplazar');return}
 if(x.rp){toast('Primero deshaz el reemplazo anterior');return}
 const B=Math.round(num(x.g)*(num(rw.ia)||1)/(num(rw.ib)||1)*10)/10;
 intSave();x.rp={from:x.i,g:num(x.g),ld:null};x.i=rw.tg;x.g=B;save();clp();R();toast('Reemplazo aplicado: el líquido de la receta no cambió')};
R();
