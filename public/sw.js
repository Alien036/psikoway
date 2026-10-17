// PsikoWay Lightweight PWA Service Worker
const CACHE_NAME = "psikoway-pwa-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Tarayıcıların (Chrome / Edge / Samsung Internet) "Uygulamayı Yükle" (beforeinstallprompt)
// özelliğini aktif etmesi için gerekli hafif fetch dinleyicisi.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  // Doğrudan ağ üzerinden devam et (performans kaybı yaratmaz)
  return;
});
