const V='cuaderno-v6',SHELL=['./','index.html','leaflet.min.js','shim.js','manifest.webmanifest','icon.svg','icon-192.png','icon-512.png','seed-species.json'];
self.addEventListener('install',e=>{e.waitUntil((async()=>{const c=await caches.open(V);await Promise.all(SHELL.map(u=>c.add(u).catch(()=>{})));
 try{const s=await (await fetch('seed-species.json',{cache:'no-cache'})).json();await Promise.all(s.files.map(f=>c.add('img/'+f).catch(()=>{})))}catch(_){}
 self.skipWaiting()})())});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{for(const k of await caches.keys())if(k!==V&&k.startsWith('cuaderno-'))await caches.delete(k);await self.clients.claim()})())});
const TILE=/(tile|basemaps|arcgisonline|openstreetmap|fonts\.(googleapis|gstatic))/;
self.addEventListener('fetch',e=>{
 const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 if(u.hostname==='api.github.com'||u.hostname.endsWith('githubusercontent.com'))return;
 const same=u.origin===location.origin;
 if(!same&&!TILE.test(u.hostname+u.pathname))return;
 e.respondWith((async()=>{
  const c=await caches.open(V);const hit=await c.match(r,{ignoreSearch:same});
  const net=fetch(r).then(res=>{if(res&&(res.ok||res.type==='opaque'))c.put(r,res.clone()).catch(()=>{});return res}).catch(()=>null);
  if(hit){e.waitUntil(net);return hit}
  const res=await net;if(res)return res;
  if(r.mode==='navigate')return (await c.match('index.html'))||(await c.match('./'))||Response.error();
  return Response.error()})())});
