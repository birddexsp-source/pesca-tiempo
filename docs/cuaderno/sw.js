const V='cuaderno-v22',SHELL=['./','index.html','leaflet.min.js','shim.js','manifest.webmanifest','icon.svg','icon-192.png','icon-512.png','seed-species.json','gear-seed.json','gear-seed2.json','gear-seed3.json','gear-seed4.json','gear-seed5.json','img/bait/anchovy.webp','img/gear/own-yuki.webp','img/bait/crank.webp','img/bait/cuttle.webp','img/bait/grub.webp','img/bait/jig.webp','img/bait/mackerel.webp','img/bait/minnow.webp','img/bait/mussel.webp','img/bait/popper.webp','img/bait/prawn.webp','img/bait/sardine.webp','img/bait/scrab.webp','img/bait/shad.webp','img/bait/shrimp.webp','img/bait/shrimpb.webp','img/bait/slug.webp','img/bait/spoon.webp','img/bait/squid.webp','img/bait/squid2.webp','img/bait/sshrimp.webp','img/bait/stick.webp','img/bait/swim.webp','img/bait/sworm.webp','img/bait/vib.webp','img/bait/crab.webp','img/bait/worm.webp','img/bait/worm2.webp','img/bait/limpet.webp','img/bait/razor.webp'];
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
