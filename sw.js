const V='cc-v14',OCR='cc-ocr',SHELL=['./','index.html','etapa1.js','etapa1b.js','etapa1c.js','etapa1d.js','etapa2a.js','etapa2b.js','etapa2c.js','etapa2e.js','etapa2f.js','etapa2g.js','etapa2h.js','etapa2i.js','etapa3a.js','manifest.webmanifest','icon.svg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V&&x!==OCR).map(x=>caches.delete(x)))).then(()=>clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const own=new URL(e.request.url).origin===location.origin;
  e.respondWith(caches.open(own?V:OCR).then(ch=>ch.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{
    if(r.ok||r.type==='opaque')ch.put(e.request,r.clone());return r}).catch(()=>hit))));
});
