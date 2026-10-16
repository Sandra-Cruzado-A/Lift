// Guarda la app en el móvil para que abra sin conexión y recibe los cambios en cuanto hay internet.
const CACHE = 'dia-a-dia-v6';
const SHELL = ['./', 'index.html', 'config.js', 'manifest.webmanifest', 'offline.html', 'vendor/d3.min.js', 'vendor/topojson-client.min.js', 'vendor/jszip.min.js', 'vendor/leaflet.js', 'vendor/googlemutant.js', 'vendor/leaflet.css', 'vendor/xlsx.mini.min.js', 'vendor/jspdf.umd.min.js', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/logo.svg'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;
  // La app y su configuración: primero lo último de internet; si no hay conexión, lo guardado.
  if (req.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname.endsWith('/') || url.pathname.endsWith('config.js')) {
    e.respondWith(fetch(req, { cache: 'no-cache' }).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req).then(r => r || caches.match('index.html'))));
    return;
  }
  e.respondWith(caches.match(req).then(r => r || fetch(req).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return res;
  })));
});
