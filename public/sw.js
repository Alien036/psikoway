// PsikoWay High-Speed PWA Service Worker (Instant Article Cache + Background Prefetch)
const CACHE_NAME = "psikoway-assets-v4";

// Kurulum anında yalnızca temel kabuk (shell) dosyalarını önbelleğe al (Mobil bağlantıyı tıkamamak için)
const SHELL_ASSETS = [
  "/",
  "/analizler",
  "/hizmetler",
  "/manifest.json",
  "/logo.png",
  "/logo-emblem.png",
  "/icon-192.png",
  "/icon-512.png"
];

async function cacheInBatches(cache, urls, batchSize = 4) {
  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    await Promise.allSettled(
      batch.map(async (url) => {
        const existing = await cache.match(url);
        if (!existing) {
          const res = await fetch(url);
          if (res && res.ok) {
            await cache.put(url, res);
          }
        }
      })
    );
  }
}

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await cacheInBatches(cache, SHELL_ASSETS, 4);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
          })
        )
      )
      .then(() => self.clients.claim())
  );
});

// Bir makale okunurken diğer makaleleri arka planda sessizce önbelleğe al
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "PREFETCH_ARTICLES" && Array.isArray(event.data.urls)) {
    const urls = event.data.urls;
    event.waitUntil(
      caches.open(CACHE_NAME).then(async (cache) => {
        for (const url of urls) {
          try {
            const existing = await cache.match(url);
            if (!existing) {
              const res = await fetch(url, { credentials: "same-origin" });
              if (res && res.ok) {
                await cache.put(url, res.clone());
              }
            }
          } catch {}
        }
      })
    );
  }
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  // 1. Görseller (/series/, /characters/, /therapies/, .jpg, .png, .webp, .svg) için Cache-First
  const isImageAsset =
    url.pathname.startsWith("/series/") ||
    url.pathname.startsWith("/characters/") ||
    url.pathname.startsWith("/therapies/") ||
    /\.(jpg|jpeg|png|webp|svg|ico)$/i.test(url.pathname);

  if (isImageAsset) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(url.pathname);
        if (cached) {
          return cached;
        }
        try {
          const networkRes = await fetch(event.request);
          if (networkRes && networkRes.ok) {
            cache.put(url.pathname, networkRes.clone());
          }
          return networkRes;
        } catch (err) {
          return cached || Response.error();
        }
      })
    );
    return;
  }

  // 2. Makale Sayfaları (/analizler/karakter/*) için Stale-While-Revalidate (Önbellekte varsa 0ms anında aç!)
  if (url.pathname.startsWith("/analizler/karakter/")) {
    const cacheKey = url.pathname + url.search;
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = (await cache.match(cacheKey)) || (await cache.match(url.pathname));
        const networkFetch = fetch(event.request)
          .then((res) => {
            if (res && res.ok) {
              cache.put(cacheKey, res.clone());
            }
            return res;
          })
          .catch(() => cached);

        return cached || networkFetch;
      })
    );
    return;
  }

  // 3. Diğer sayfa geçişleri (navigate) için hızlı önbellek destekli yanıt
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          if (res && res.ok) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(url.pathname, clone));
          }
          return res;
        })
        .catch(async () => {
          const cache = await caches.open(CACHE_NAME);
          return (await cache.match(url.pathname)) || (await cache.match("/"));
        })
    );
  }
});
