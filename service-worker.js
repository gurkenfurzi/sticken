const CACHE = "auftragshelfer-v23-permanent-login";
const ASSETS = ["./","./index.html","./styles.css?v=23","./app.js?v=23","./manifest.json?v=23","./google-sync-config.js?v=23","./icons/icon-32.png?v=23","./icons/icon-180-opaque.png?v=23","./icons/icon-192.png?v=23","./icons/icon-192-opaque.png?v=23","./icons/icon-512-opaque.png?v=23"];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", event => {
  if(event.request.method !== "GET") return;
  event.respondWith(fetch(event.request).then(response => {
    const copy = response.clone();
    caches.open(CACHE).then(cache => cache.put(event.request, copy)).catch(() => {});
    return response;
  }).catch(() => caches.match(event.request).then(r => r || caches.match("./index.html"))));
});
