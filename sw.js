var V="2026.11.21-1936", C="train9-"+V;
var CORE=["./","index.html","manifest.json","t9n-icon-192.png","t9n-icon-512.png","t9n-icon-180.png"];
self.addEventListener("install",function(e){ self.skipWaiting(); e.waitUntil(caches.open(C).then(function(c){ return Promise.all(CORE.map(function(u){ return fetch(u,{cache:"no-store"}).then(function(r){ if(r.ok) return c.put(u,r); }).catch(function(){}); })); })); });
self.addEventListener("activate",function(e){ e.waitUntil(caches.keys().then(function(ks){ return Promise.all(ks.filter(function(k){ return k!==C; }).map(function(k){ return caches.delete(k); })); }).then(function(){ return self.clients.claim(); })); });
self.addEventListener("message",function(e){ if(e.data==="skip") self.skipWaiting(); });
self.addEventListener("fetch",function(e){
  var u=new URL(e.request.url);
  if(e.request.method!=="GET"||u.hostname==="api.anthropic.com") return;
  if(u.origin===location.origin){
    if(/version\.json$/.test(u.pathname)){ e.respondWith(fetch(e.request,{cache:"no-store"})); return; }
    // always try the network first, skipping the browser cache, so new versions land immediately
    e.respondWith(fetch(e.request,{cache:"no-store"}).then(function(r){ var cp=r.clone(); if(r.ok) caches.open(C).then(function(c){ c.put(e.request,cp); }); return r; })
      .catch(function(){ return caches.match(e.request).then(function(r){ return r||caches.match("index.html"); }); }));
  } else if(/fonts\.(googleapis|gstatic)\.com/.test(u.hostname)){
    e.respondWith(caches.match(e.request).then(function(r){ return r||fetch(e.request).then(function(n){ var cp=n.clone(); caches.open(C).then(function(c){ c.put(e.request,cp); }); return n; }); }));
  }
});
