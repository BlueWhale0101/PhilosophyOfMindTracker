
const CACHE_NAME = "philosophy-of-mind-tracker-v2";
const ASSETS = [
  "./",
  "./index.html",
  "./detail.html",
  "./styles.css",
  "./data.js",
  "./script.js",
  "./detail.js",
  "./manifest.webmanifest",
  "./apple-touch-icon-180x180.png",
  "./apple-touch-icon-167x167.png",
  "./apple-touch-icon-152x152.png",
  "./apple-touch-icon-120x120.png",
  "./apple-touch-icon.png",
  "./icons/icon-180.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => caches.match("./index.html"));
    })
  );
});
