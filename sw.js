var C="train9-v2";
var CORE=["./","index.html","manifest.json","icon-192.png","icon-512.png","icon-180.png"];
self.addEventListener("install",function(e){ e.waitUntil(caches.open(C).then(function(c){ return c.addAll(CORE); })); self.skipWaiting(); });
self.addEventListener("activate",function(e){ e.waitUntil(caches.keys().then(function(ks){ return Promise.all(ks.filter(function(k){ return k!==C; }).map(function(k){ return caches.delete(k); })); })); self.clients.claim(); });
self.addEventListener("fetch",function(e){
  var u=new URL(e.request.url);
  if(e.request.method!=="GET"||u.hostname==="api.anthropic.com") return;
  if(u.origin===location.origin){
    // network first for the page so updates arrive, cache fallback offline
    e.respondWith(fetch(e.request).then(function(r){ var cp=r.clone(); caches.open(C).then(function(c){ c.put(e.request,cp); }); return r; }).catch(function(){ return caches.match(e.request).then(function(r){ return r||caches.match("index.html"); }); }));
  } else if(/fonts\.(googleapis|gstatic)\.com/.test(u.hostname)){
    e.respondWith(caches.match(e.request).then(function(r){ return r||fetch(e.request).then(function(n){ var cp=n.clone(); caches.open(C).then(function(c){ c.put(e.request,cp); }); return n; }); }));
  }
});
