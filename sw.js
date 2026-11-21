var V="2026.11.22-0230", C="train9-"+V;
var CORE=["./","index.html","manifest.json","t9x-icon-192.png","t9x-icon-512.png","t9x-icon-180.png","vendor/supabase.js"];
self.addEventListener("install",function(e){ self.skipWaiting(); e.waitUntil(caches.open(C).then(function(c){ return Promise.all(CORE.map(function(u){ return fetch(u,{cache:"no-store"}).then(function(r){ if(r.ok) return c.put(u,r); }).catch(function(){}); })); })); });
self.addEventListener("activate",function(e){ e.waitUntil(caches.keys().then(function(ks){ return Promise.all(ks.filter(function(k){ return k!==C; }).map(function(k){ return caches.delete(k); })); }).then(function(){ return self.clients.claim(); })); });
self.addEventListener("message",function(e){ if(e.data==="skip") self.skipWaiting(); });
self.addEventListener("fetch",function(e){
  var u=new URL(e.request.url);
  if(e.request.method!=="GET"||u.hostname==="api.anthropic.com"||e.request.headers.has("range")) return;
  if(u.origin===location.origin){
    if(/version\.json$/.test(u.pathname)){ e.respondWith(fetch(e.request,{cache:"no-store"})); return; }
    e.respondWith(fetch(e.request,{cache:"no-store"}).then(function(r){ var cp=r.clone(); if(r.ok&&r.status===200) caches.open(C).then(function(c){ c.put(e.request,cp); }).catch(function(){}); return r; })
      .catch(function(){ return caches.match(e.request).then(function(r){ return r||caches.match("index.html"); }); }));
  } else if(/fonts\.(googleapis|gstatic)\.com/.test(u.hostname)){
    e.respondWith(caches.match(e.request).then(function(r){ return r||fetch(e.request).then(function(n){ var cp=n.clone(); caches.open(C).then(function(c){ c.put(e.request,cp); }); return n; }); }));
  }
});
self.addEventListener("push",function(e){
  var d={}; try{ d=e.data?e.data.json():{}; }catch(x){ d={ title:"Train9", body:e.data?e.data.text():"" }; }
  e.waitUntil(self.registration.showNotification(d.title||"Train9",{ body:d.body||"", icon:"t9x-icon-192.png", badge:"t9x-icon-192.png", tag:d.tag||"t9", renotify:true, data:{ url:d.url||"./" } }));
});
self.addEventListener("notificationclick",function(e){
  e.notification.close(); var url=(e.notification.data&&e.notification.data.url)||"./";
  e.waitUntil(clients.matchAll({ type:"window", includeUncontrolled:true }).then(function(cs){ for(var i=0;i<cs.length;i++){ if("focus" in cs[i]) return cs[i].focus(); } return clients.openWindow(url); }));
});
