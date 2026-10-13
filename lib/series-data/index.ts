// lib/series-data/index.ts
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../firebase";
import { SeriesItem, CharacterAnalysisArticle, CharacterSummaryItem } from "./types";
import catalogStatic from "./catalog-static.json";

export * from "./types";

// 1. Statik Özet Verisi (Hızlı İlk Yükleme ve Arama İçin Hafif Veri)
export const SERIES_LIST: SeriesItem[] = catalogStatic.series as SeriesItem[];
export const CHARACTER_ANALYSES: CharacterSummaryItem[] = catalogStatic.characters as CharacterSummaryItem[];

// 2. Bellek İçi Önbellek (Hızlı Tekrar Erişim)
const characterDetailCache = new Map<string, CharacterAnalysisArticle>();
let dynamicCatalogCache: { series: SeriesItem[]; characters: CharacterSummaryItem[] } | null = null;

/**
 * Cloud Firestore'dan güncel dizi ve karakter kataloğu özetini çeker (ve yerel önbellekler).
 */
export async function fetchCatalogFromFirestore(): Promise<{
  series: SeriesItem[];
  characters: CharacterSummaryItem[];
}> {
  if (dynamicCatalogCache) {
    return dynamicCatalogCache;
  }

  if (typeof window !== "undefined") {
    try {
      const local = localStorage.getItem("psikoway_catalog_cache_v2");
      if (local) {
        dynamicCatalogCache = JSON.parse(local);
        return dynamicCatalogCache!;
      }
    } catch {}
  }

  try {
    const catalogDoc = await getDoc(doc(firestore, "catalog", "main"));
    if (catalogDoc.exists()) {
      const data = catalogDoc.data() as { series: SeriesItem[]; characters: CharacterSummaryItem[] };
      dynamicCatalogCache = data;
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("psikoway_catalog_cache_v2", JSON.stringify(data));
        } catch {}
      }
      return data;
    }
  } catch (err) {
    console.warn("Firestore fetchCatalogFromFirestore notice:", err);
  }

  return {
    series: SERIES_LIST,
    characters: CHARACTER_ANALYSES,
  };
}

/**
 * Karakterin detaylı klinik analiz dosyasını Cloud Firestore'dan çeker.
 * Bellek ve localStorage önbelleklemesi ile anında (0ms) hızlı açılır.
 */
export async function getCharacterById(id: string): Promise<CharacterAnalysisArticle | null> {
  if (!id) return null;

  // 1. RAM Önbelleği
  if (characterDetailCache.has(id)) {
    return characterDetailCache.get(id)!;
  }

  // 2. LocalStorage Önbelleği
  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem(`psikoway_char_dossier_${id}`);
      if (cached) {
        const parsed = JSON.parse(cached) as CharacterAnalysisArticle;
        characterDetailCache.set(id, parsed);
        return parsed;
      }
    } catch {}
  }

  // 3. Cloud Firestore'dan Canlı Çekim
  try {
    const charDoc = await getDoc(doc(firestore, "characters", id));
    if (charDoc.exists()) {
      const data = charDoc.data() as CharacterAnalysisArticle;
      characterDetailCache.set(id, data);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(`psikoway_char_dossier_${id}`, JSON.stringify(data));
        } catch {}
      }
      return data;
    }
  } catch (err) {
    console.error(`Firestore getCharacterById (${id}) hatası:`, err);
  }

  return null;
}

/**
 * Aynı dizideki diğer karakterleri getirir.
 */
export async function getRelatedCharacters(
  seriesId: string,
  excludeCharacterId?: string
): Promise<CharacterSummaryItem[]> {
  const catalog = await fetchCatalogFromFirestore();
  return catalog.characters.filter(
    (c) => c.seriesId === seriesId && c.id !== excludeCharacterId
  );
}

/**
 * Belirtilen ID'ye sahip dizi/film bilgisini getirir.
 */
export async function getSeriesById(seriesId: string): Promise<SeriesItem | null> {
  const catalog = await fetchCatalogFromFirestore();
  const found = catalog.series.find((s) => s.id === seriesId);
  return found || null;
}
