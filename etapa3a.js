/* CocoaCacao etapa 3A: procedimiento por pasos y tutor de receta (lectura, cronómetro y órdenes por voz) */
Object.assign(CHK,{etapa2i:()=>typeof compRefresh,etapa3a:()=>typeof tutStart});

const stAuto=t=>{const n=normProc(t),m=n.match(/(\d+(?:[.,]\d+)?)\s*min/i),c=n.match(/(\d{2,3})\s*(?:°\s*C|grados)/i);return{m:m?num(m[1]):0,c:c?num(c[1]):0}};
const splitSteps=txt=>String(txt||'').split('\n').map(l=>l.replace(/^\s*(?:\d+\s*[.)\-]|[-•*·●▪◦])\s*/,'').trim()).filter(Boolean).map(t=>{const a=stAuto(t);return{id:uid(),t:normProc(t),m:a.m,c:a.c}});
const _m7=migrate;migrate=function(){_m7();S.rec.forEach(r=>{if(!r.steps)r.steps=splitSteps(r.proc)})};

/* Ventana de procedimiento */
const stp=id=>{const r=rec(id);return r.steps=r.steps||[]};
function stShow(id){const L=stp(id),old=$('#pop'),y=old&&old.firstElementChild?old.firstElementChild.scrollTop:0;
 popx(`<h2>Procedimiento</h2><p class="m">Un paso por tarjeta. Pon los minutos si el paso necesita cronómetro y los °C si usa el horno.</p>
 ${L.map((s,j)=>`<div class="card" style="box-shadow:none;margin:8px 0"><div class="rw"><b>Paso ${j+1}</b><span style="text-align:right"><button class="x" onclick="stMove('${id}',${j},-1)">▲</button><button class="x" onclick="stMove('${id}',${j},1)">▼</button><button class="x" onclick="stDel('${id}',${j})">✕</button></span></div>
 <textarea style="min-height:70px" onchange="stSet('${id}',${j},'t',this.value)">${esc(s.t)}</textarea>
 <div class="r2"><label>Cronómetro (min)<input inputmode="decimal" value="${s.m||0}" onchange="stSet('${id}',${j},'m',this.value)"></label><label>Horno (°C)<input inputmode="decimal" value="${s.c||0}" onchange="stSet('${id}',${j},'c',this.value)"></label></div>
 ${s.a?`<p class="m">Último tiempo real: ${f(s.a,1)} min${s.h?', pediste ayuda '+s.h+' vez(es)':''}</p>`:''}</div>`).join('')||'<p class="m">Aún no hay pasos.</p>'}
 <button onclick="stAdd('${id}')">Agregar paso</button><button onclick="stImp('${id}')">Dividir un texto en pasos</button><button onclick="clp()">Cerrar</button>`);
 const p=$('#pop');if(p&&p.firstElementChild)p.firstElementChild.scrollTop=y}
function stSet(id,j,c,v){stp(id)[j][c]=c=='t'?v:num(v);save();stShow(id)}
function stMove(id,j,d){const L=stp(id),k=j+d;if(k<0||k>=L.length)return;[L[j],L[k]]=[L[k],L[j]];save();stShow(id)}
function stDel(id,j){stp(id).splice(j,1);save();stShow(id)}
function stAdd(id){stp(id).push({id:uid(),t:'',m:0,c:0});save();stShow(id)}
function stImp(id){popx(`<h2>Dividir un texto en pasos</h2><p class="m">Pega la receta: cada línea será un paso. Los minutos y los °C se detectan solos.</p><textarea id="sti" style="min-height:180px"></textarea><div class="r2"><button class="pri" onclick="stImpOk('${id}')">Crear pasos</button><button onclick="stShow('${id}')">Volver</button></div>`)}
function stImpOk(id){const a=splitSteps($('#sti').value);if(!a.length){toast('No hay texto');return}stp(id).push(...a);save();stShow(id)}
procPop=function(id){stShow(id)};

/* Procedimiento visible en la ventana de la receta y botón del tutor */
const _vh=viewH;
viewH=function(r){const L=r.steps||[];
 return _vh(r).replace('<div class="card"><h2>Cantidades para producir</h2>',`<button class="pri" onclick="tutStart('${r.id}')">Iniciar tutor de receta</button><div class="card"><h2>Cantidades para producir</h2>`)+
 (L.length?`<div class="card"><h2>Procedimiento</h2>${L.map((s,j)=>`<div class="ln"><span>${j+1}. ${esc(s.t)}</span><span>${s.m?f(s.m,0)+' min':''}${s.c?'<br>'+f(s.c,0)+' °C':''}</span></div>`).join('')}</div>`:'')};

/* Tutor de receta */
let tu=null;
const mmss=s=>{s=Math.max(0,Math.round(s));return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')};
function say(t){try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='es-ES';u.rate=.95;speechSynthesis.speak(u)}catch(e){}}
function beep(){try{const A=window.AudioContext||window.webkitAudioContext,c=new A();[0,.4,.8].forEach(d=>{const o=c.createOscillator();o.connect(c.destination);o.frequency.value=880;o.start(c.currentTime+d);o.stop(c.currentTime+d+.25)});if(navigator.vibrate)navigator.vibrate([300,150,300,150,300])}catch(e){}}
function tutStart(id){const r=rec(id);if(!(r.steps||[]).length){toast('Primero agrega los pasos en Editar receta, botón Procedimiento');return}
 if(tu)tutEnd();tu={id,i:0,t0:Date.now(),left:0,end:0,run:false,auto:true,voice:false,rc:null,wl:null,iv:setInterval(tutTick,250)};tutStep();
 try{navigator.wakeLock.request('screen').then(l=>{if(tu)tu.wl=l}).catch(()=>{})}catch(e){}}
function tutStep(){const s=rec(tu.id).steps[tu.i];tu.t0=Date.now();tu.run=false;tu.left=num(s.m)*60;tutDraw();if(tu.auto)tutSay()}
function tutSay(){const s=rec(tu.id).steps[tu.i];say('Paso '+(tu.i+1)+'. '+s.t+(s.c?'. Horno a '+Math.round(s.c)+' grados.':'')+(s.m?'. Cronómetro de '+s.m+' minutos.':''))}
function tutDraw(){let o=$('#tu');if(!o){o=document.createElement('div');o.id='tu';document.body.appendChild(o)}
 o.style.cssText='position:fixed;inset:0;z-index:18;background:var(--bg);overflow:auto;padding:calc(12px + env(safe-area-inset-top,0px)) 16px calc(16px + env(safe-area-inset-bottom,0px))';
 const r=rec(tu.id),n=r.steps.length,s=r.steps[tu.i];
 o.innerHTML=`<div class="rw"><b>${esc(r.n)}</b><button class="x" onclick="tutEnd()">Salir</button></div><p class="m">Paso ${tu.i+1} de ${n}</p>
 <div class="card"><div style="font-size:24px;line-height:1.4">${esc(s.t)}</div>${s.c?`<p class="big" style="margin-top:10px">Horno: ${f(s.c,0)} °C</p>`:''}</div>
 ${num(s.m)>0?`<div class="card"><div class="big" id="tu-t" style="font-size:44px;text-align:center">${mmss(tu.left)}</div><div class="r3"><button onclick="tutT('go')" ${tu.run?'style="opacity:.5"':''}>Iniciar</button><button onclick="tutT('pause')">Pausa</button><button onclick="tutT('reset')">Reiniciar</button></div></div>`:''}
 <p class="m">Tiempo en este paso: <b id="tu-r">00:00</b></p>
 <div class="r3"><button onclick="tutGo(-1)">Anterior</button><button onclick="tutSay()">Leer</button><button class="pri" onclick="tutGo(1)">${tu.i==n-1?'Terminar':'Siguiente'}</button></div>
 <div class="r2"><button onclick="tutHelp()">Necesito ayuda</button><button onclick="tutQty()">Ver cantidades</button></div>
 <div class="r2"><button onclick="tu.auto=!tu.auto;tutDraw()">Lectura automática: ${tu.auto?'sí':'no'}</button><button onclick="tutVoice()">Órdenes por voz: ${tu.voice?'sí':'no'}</button></div>
 ${tu.voice?'<p class="m">Di: siguiente, anterior, repite, inicia cronómetro, pausa, ayuda, cantidades.</p>':''}`}
function tutTick(){if(!tu)return;const s=rec(tu.id).steps[tu.i],e=$('#tu-r');if(e)e.textContent=mmss((Date.now()-tu.t0)/1000);
 if(tu.run){tu.left=Math.max(0,(tu.end-Date.now())/1000);const t=$('#tu-t');if(t)t.textContent=mmss(tu.left);
  if(tu.left<=0){tu.run=false;beep();say('Tiempo cumplido. '+s.t);tutDraw()}}}
function tutT(a){const s=rec(tu.id).steps[tu.i];
 if(a=='go'){if(num(s.m)<=0){toast('Este paso no tiene cronómetro');return}if(tu.left<=0)tu.left=num(s.m)*60;tu.end=Date.now()+tu.left*1000;tu.run=true}
 else if(a=='pause'){tu.run=false}
 else{tu.left=num(s.m)*60;tu.run=false}
 tutDraw()}
function tutGo(d){const r=rec(tu.id);
 if(d>0){r.steps[tu.i].a=Math.round((Date.now()-tu.t0)/6000)/10;save()}
 const j=tu.i+d;if(j<0)return;if(j>=r.steps.length){tutDone();return}tu.i=j;tutStep()}
function tutHelp(){const s=rec(tu.id).steps[tu.i];s.h=(s.h||0)+1;save();toast('Anotado: este paso necesitó ayuda')}
function tutQty(){popx('<h2>Cantidades para producir</h2>'+qtyH(rec(tu.id))+'<button onclick="clp()">Cerrar</button>')}
function tutDone(){const r=rec(tu.id),T0=r.steps.reduce((a,s)=>a+num(s.a),0),fl=r.steps.map((s,j)=>({s,j})).filter(o=>o.s.h>0||(o.s.m>0&&num(o.s.a)>o.s.m*1.25));
 popx(`<h2>Receta terminada</h2><div class="ln t"><span>Tiempo real total</span><span>${f(T0,1)} min</span></div><div class="ln"><span>Mano de obra anotada</span><span>${f(r.min,0)} min</span></div>
 ${fl.length?'<p class="m"><b>Pasos que necesitaron ayuda o tardaron más de lo previsto:</b></p>'+fl.map(o=>`<div class="ln"><span>Paso ${o.j+1}: ${esc(o.s.t.slice(0,60))}</span><span>${f(o.s.a,1)} min${o.s.m?' de '+f(o.s.m,0)+' previstos':''}</span></div>`).join(''):'<p class="m">Ningún paso necesitó ayuda.</p>'}
 <button class="pri" onclick="tutUse()">Usar como mano de obra</button><button onclick="tutEnd();clp()">Cerrar tutor</button>`)}
function tutUse(){const r=rec(tu.id);r.min=Math.round(r.steps.reduce((a,s)=>a+num(s.a),0));save();R();toast('Mano de obra: '+r.min+' min')}
function tutVoice(){const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
 if(tu.voice){tu.voice=false;try{tu.rc.stop()}catch(e){}tutDraw();return}
 if(!SR){toast('Este dispositivo no permite órdenes por voz');return}
 const rc=new SR();rc.lang='es-ES';rc.continuous=true;rc.interimResults=false;
 rc.onresult=e=>{if(!tu||speechSynthesis.speaking)return;tutCmd(norm(e.results[e.results.length-1][0].transcript))};
 rc.onend=()=>{if(tu&&tu.voice)try{rc.start()}catch(_){}};
 rc.onerror=ev=>{if(tu&&(ev.error=='not-allowed'||ev.error=='service-not-allowed')){tu.voice=false;toast('Permite el micrófono para usar la voz');tutDraw()}};
 tu.rc=rc;tu.voice=true;try{rc.start()}catch(_){}tutDraw()}
function tutCmd(t){
 if(/siguiente|adelante|continua/.test(t))tutGo(1);
 else if(/anterior|atras|regresa/.test(t))tutGo(-1);
 else if(/repite|repetir|lee|leer/.test(t))tutSay();
 else if(/(inicia|empieza|comienza|arranca|activa).*(cronometro|tiempo)|^cronometro/.test(t))tutT('go');
 else if(/pausa|pausar|deten/.test(t))tutT('pause');
 else if(/ayuda/.test(t))tutHelp();
 else if(/cantidades|ingredientes/.test(t))tutQty()}
function tutEnd(){if(!tu)return;clearInterval(tu.iv);tu.voice=false;try{if(tu.rc)tu.rc.stop()}catch(e){}try{if(tu.wl)tu.wl.release()}catch(e){}try{speechSynthesis.cancel()}catch(e){}const o=$('#tu');if(o)o.remove();tu=null}
R();
