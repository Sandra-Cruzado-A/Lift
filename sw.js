/* Lift: funcionamiento sin conexión. Cambia VERSION cada vez que subas cambios. */
const VERSION = "lift-3.8.0";
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./icon-maskable-512.png", "./apple-touch-icon.png", "./favicon.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // La página: primero la red (para recibir actualizaciones) y, sin conexión, la copia guardada.
  if (req.mode === "navigate") {
    e.respondWith(fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put("./index.html", copy)); }
      return res;
    }).catch(() => caches.match("./index.html").then(r => r || caches.match("./"))));
    return;
  }
  // Iconos y tipografía: copia guardada al instante y se refresca en segundo plano.
  const same = url.origin === self.location.origin;
  if (same && url.pathname.endsWith("/avisos.json")) return; // la configuración de avisos siempre se lee de la red
  const font = url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";
  if (!same && !font) return;
  e.respondWith(caches.match(req).then(hit => {
    const net = fetch(req).then(res => {
      if (res && (res.ok || res.type === "opaque")) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => hit);
    return hit || net;
  }));
});

/* ---------- Avisos del reto diario ---------- */
self.addEventListener("push", e => {
  e.waitUntil((async () => {
    let st = {};
    try { const c = await caches.open("lift-state"); const r = await c.match("./state.json"); if (r) st = await r.json(); } catch (err) {}
    const now = new Date();
    const today = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0") + "-" + String(now.getDate()).padStart(2, "0");
    const streak = st.streak || 0;
    let title, body;
    if (st.lastDaily === today) { title = "Reto de hoy completado ✓"; body = "¡Bien hecho! Mañana tendrás un reto nuevo."; }
    else if (now.getHours() < 15) { title = "Tu reto de hoy te espera"; body = streak > 0 ? `Unos 15 minutos de inglés y sumas el día ${streak + 1} de tu racha 🔥` : "Unos 15 minutos de inglés para empezar bien el día 💬"; }
    else { title = "Aún estás a tiempo"; body = streak > 0 ? `Haz el reto de hoy para no perder tu racha de ${streak} ${streak === 1 ? "día" : "días"} 🔥` : "Haz el reto de hoy antes de dormir: solo unos 15 minutos 💬"; }
    await self.registration.showNotification(title, { body, icon: "./icon-192.png", tag: "lift-daily", renotify: true, data: { url: "./" } });
  })());
});
self.addEventListener("notificationclick", e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(list => {
    for (const c of list) { if ("focus" in c) return c.focus(); }
    return self.clients.openWindow("./");
  }));
});
