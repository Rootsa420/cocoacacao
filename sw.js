const V='cc-v5',OCR='cc-ocr',SHELL=['./','index.html','etapa1.js','etapa1b.js','etapa1c.js','manifest.webmanifest','icon.svg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V&&x!==OCR).map(x=>caches.delete(x)))).then(()=>clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const own=new URL(e.request.url).origin===location.origin;
  e.respondWith(caches.open(own?V:OCR).then(ch=>ch.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{
    if(r.ok||r.type==='opaque')ch.put(e.request,r.clone());return r}).catch(()=>hit))));
});
