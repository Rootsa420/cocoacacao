/* CocoaCacao etapa 3E: reemplazo técnico de ingredientes (mantequilla y aceite, azúcar invertido y azúcar) */
Object.assign(CHK,{etapa3e:()=>typeof repApply});
const LIQ=/leche|agua|suero|jugo|crema|licor|cafe|vino|nata/;
const TGT={b2o:'aceite',o2b:'mantequilla',i2s:'azucar',s2i:'azucar invertido',gen:''};
function repKind(n){n=norm(n);return /mantequilla|margarina|manteca/.test(n)?'b2o':/aceite/.test(n)?'o2b':/invertido/.test(n)?'i2s':/azucar/.test(n)?'s2i':'gen'}
let rw=null;
function repWin(id,j){const r=rec(id),x=r.it[j];if(!x.i){toast('Elige primero el ingrediente');return}
 const kind=repKind(nmI(x.i)),t=TGT[kind],tg=t?(S.ins.find(z=>norm(z.n)==t)||S.ins.find(z=>norm(z.n).includes(t))):null,
  lq=r.it.find(y=>y!==x&&LIQ.test(norm(nmI(y.i))));
 rw={id,j,kind,tg:tg?tg.id:'',f:82,a:16,s:80,fac:100,lq:lq?lq.u:'water'};repShow()}
function repCalc(){const r=rec(rw.id),x=r.it[rw.j],A=num(x.g),F=Math.max(rw.f,1)/100,W=rw.a/100,Sd=Math.max(rw.s,1)/100;let B=A,L=0;
 if(rw.kind=='b2o'){B=A*F;L=A*W}else if(rw.kind=='o2b'){B=A/F;L=-B*W}else if(rw.kind=='i2s'){B=A*Sd;L=A*(1-Sd)}else if(rw.kind=='s2i'){B=A/Sd;L=-B*(1-Sd)}else B=A*rw.fac/100;
 return{A,B:Math.round(B*10)/10,L:Math.round(L*10)/10}}
function rwTg(v){const p=byName(v);if(!p){toast('Ese material no existe');repShow();return}rw.tg=p.id;repShow()}
function repShow(){const r=rec(rw.id),x=r.it[rw.j],k=rw.kind,c=repCalc(),tg=S.ins.find(z=>z.id==rw.tg);
 const opts='<option value="water">Agregar agua como ingrediente</option>'+r.it.filter(y=>y!==x).map(y=>`<option value="${y.u}" ${y.u==rw.lq?'selected':''}>${esc(cap(nmI(y.i)))} (${f(y.g,1)} g)</option>`).join('');
 const lt=k=='b2o'?'Líquido que se suma (reemplaza el suero)':k=='i2s'?'Líquido que se suma (el agua del invertido)':'Líquido que se resta de la receta';
 popx(`<h2>Reemplazar «${esc(cap(nmI(x.i)))}»</h2>
 ${x.rp?`<p class="m">Ya fue reemplazado. Original: ${esc(cap(nmI(x.rp.from)))} ${f(x.rp.g,1)} g.</p><button onclick="repUndo()">Deshacer reemplazo</button>`:''}
 <label>Reemplazar por<input list="dl-rp" value="${esc(tg?cap(tg.n):'')}" onchange="rwTg(this.value)"></label><datalist id="dl-rp">${S.ins.map(z=>`<option value="${esc(cap(z.n))}">`).join('')}</datalist>
 ${k=='b2o'||k=='o2b'?`<p class="m">El aceite es 100 % grasa. La mantequilla tiene grasa, agua (suero) y sólidos lácteos. Revisa los porcentajes en tu etiqueta.</p><div class="r3"><label>% grasa<input inputmode="decimal" value="${rw.f}" onchange="rw.f=num(this.value);repShow()"></label><label>% agua<input inputmode="decimal" value="${rw.a}" onchange="rw.a=num(this.value);repShow()"></label><label>% sólidos<input value="${f(100-rw.f-rw.a,1)}" readonly style="opacity:.6"></label></div>`:''}
 ${k=='i2s'||k=='s2i'?`<label>% de sólidos del azúcar invertido (80 % es típico)<input inputmode="decimal" value="${rw.s}" onchange="rw.s=num(this.value);repShow()"></label>`:''}
 ${k=='gen'?`<label>Gramos del nuevo por cada 100 g<input inputmode="decimal" value="${rw.fac}" onchange="rw.fac=num(this.value);repShow()"></label>`:''}
 <div class="ln"><span>Antes</span><span>${esc(cap(nmI(x.i)))} ${f(c.A,1)} g</span></div>
 <div class="ln t"><span>Después</span><span>${tg?esc(cap(tg.n)):'(elige el nuevo)'} ${f(c.B,1)} g</span></div>
 ${k=='gen'?'':`<label style="margin-top:8px">${lt}<select onchange="rw.lq=this.value;repShow()">${opts}</select></label><div class="ln"><span>${c.L>=0?'Sumar':'Restar'} líquido</span><span>${f(Math.abs(c.L),1)} g</span></div>`}
 <p class="m">Los valores son aproximados: no replican por completo la textura, el dorado ni la humectación.</p>
 <div class="r2"><button class="pri" onclick="repApply()">Aplicar reemplazo</button><button onclick="clp()">Cancelar</button></div>`)}
function repApply(){const r=rec(rw.id),x=r.it[rw.j];
 if(!rw.tg){toast('Elige por cuál ingrediente reemplazar');return}
 if(x.rp){toast('Primero deshaz el reemplazo anterior');return}
 const c=repCalc(),lq=rw.kind=='gen'?null:rw.lq;let ld=null;
 if(lq&&Math.abs(c.L)>0){
  if(lq=='water'){const w=S.ins.find(z=>norm(z.n)=='agua');
   if(!w){toast('No existe el material «Agua»: créalo en Materiales');return}
   if(c.L<0){toast('Para restar, elige un líquido de la receta');return}
   const e=r.it.find(y=>y.i==w.id);
   if(e){e.g=Math.round((num(e.g)+c.L)*10)/10;ld={u:e.u,d:c.L}}else{const n={i:w.id,g:c.L,u:uid()};r.it.push(n);ld={u:n.u,d:c.L,add:true}}}
  else{const e=r.it.find(y=>y.u==lq);if(e){const nv=Math.round((num(e.g)+c.L)*10)/10;if(nv<0){toast('Ese líquido no alcanza para restar '+f(-c.L,1)+' g');return}e.g=nv;ld={u:e.u,d:c.L}}}}
 x.rp={from:x.i,g:num(x.g),ld};x.i=rw.tg;x.g=c.B;save();clp();R();toast('Reemplazo aplicado')}
function repUndo(){const r=rec(rw.id),x=r.it[rw.j];if(!x.rp)return;const ld=x.rp.ld;
 if(ld){const e=r.it.find(y=>y.u==ld.u);if(e){if(ld.add)r.it=r.it.filter(y=>y!==e);else e.g=Math.max(0,Math.round((num(e.g)-ld.d)*10)/10)}}
 x.i=x.rp.from;x.g=x.rp.g;delete x.rp;save();clp();R();toast('Reemplazo deshecho')}
const _ih4=ingH;
ingH=function(r){let h=_ih4(r);r.it.forEach((x,j)=>{if(x.rp)h=h.replace(new RegExp('(onclick="repWin\\(\'[^\']+\','+j+'\\)">)<svg[\\s\\S]*?</svg>'),(m,a)=>a+ICO(true))});return h};
R();
