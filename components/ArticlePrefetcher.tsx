"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface ArticlePrefetcherProps {
  currentId: string;
  relatedIds: string[];
  relatedImages?: string[];
  nextBatchIds?: string[];
}

/**
 * Bir makale okunurken aynı dizideki diğer makaleleri ve sıradaki karakter analizlerini
 * arka planda sessizce önbelleğe (Next.js Router Cache + Service Worker + Görsel Önbelleği) yükler.
 * Böylece kullanıcı bir sonraki makaleye tıkladığında telefonda beklemeden 0ms içinde açılır.
 */
export default function ArticlePrefetcher({
  currentId,
  relatedIds,
  relatedImages = [],
  nextBatchIds = [],
}: ArticlePrefetcherProps) {
  const router = useRouter();

  useEffect(() => {
    let isCancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    // 1. Aşama: Mevcut makale ekrana çizildikten hemen sonra (120ms)
    // aynı dizideki diğer karakterlerin makalelerini ve görsellerini arka planda yükle
    const primaryTimer = setTimeout(() => {
      if (isCancelled) return;

      const priorityUrls: string[] = [];

      relatedIds.forEach((id, index) => {
        if (!id || id === currentId) return;
        const url = `/analizler/karakter/${id}`;
        priorityUrls.push(url);

        // Kısa aralıklarla Next.js RSC önbelleğine al
        const t = setTimeout(() => {
          if (isCancelled) return;
          try {
            router.prefetch(url);
          } catch {}
        }, index * 120);
        timers.push(t);
      });

      // İlgili karakterlerin portre görsellerini arka planda belleğe al
      relatedImages.forEach((imgSrc, index) => {
        if (!imgSrc) return;
        const t = setTimeout(() => {
          if (isCancelled) return;
          const img = new Image();
          img.decoding = "async";
          img.src = imgSrc;
        }, 200 + index * 100);
        timers.push(t);
      });

      // Service Worker aktifse arka planda HTML/RSC yanıtlarını da önbelleğe almasını bildir
      if (
        typeof navigator !== "undefined" &&
        "serviceWorker" in navigator &&
        navigator.serviceWorker.controller &&
        priorityUrls.length > 0
      ) {
        try {
          navigator.serviceWorker.controller.postMessage({
            type: "PREFETCH_ARTICLES",
            urls: priorityUrls,
          });
        } catch {}
      }
    }, 120);

    timers.push(primaryTimer);

    // 2. Aşama: Kullanıcı makaleyi okumaya devam ederken (1.5sn sonra başlayarak)
    // diğer popüler makaleleri sırayla arka planda yükle
    if (nextBatchIds.length > 0) {
      const secondaryTimer = setTimeout(() => {
        if (isCancelled) return;

        const batchUrls: string[] = [];
        nextBatchIds.slice(0, 18).forEach((id, idx) => {
          if (!id || id === currentId || relatedIds.includes(id)) return;
          const url = `/analizler/karakter/${id}`;
          batchUrls.push(url);

          const t = setTimeout(() => {
            if (isCancelled) return;
            try {
              router.prefetch(url);
            } catch {}
          }, idx * 350);
          timers.push(t);
        });

        if (
          typeof navigator !== "undefined" &&
          "serviceWorker" in navigator &&
          navigator.serviceWorker.controller &&
          batchUrls.length > 0
        ) {
          try {
            navigator.serviceWorker.controller.postMessage({
              type: "PREFETCH_ARTICLES",
              urls: batchUrls,
            });
          } catch {}
        }
      }, 1500);

      timers.push(secondaryTimer);
    }

    return () => {
      isCancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [currentId, relatedIds, relatedImages, nextBatchIds, router]);

  return null;
}
