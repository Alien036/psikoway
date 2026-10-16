// lib/series-data/index.ts
import { SeriesItem, CharacterAnalysisArticle, CharacterSummaryItem } from "./types";
import catalogStatic from "./catalog-static.json";
import { RAW_CHARACTER_ANALYSES, RAW_SERIES_LIST } from "./all-data";

export * from "./types";

// 1. Statik Özet Verisi (Hızlı İlk Yükleme ve Arama İçin)
export const SERIES_LIST: SeriesItem[] = (RAW_SERIES_LIST && RAW_SERIES_LIST.length > 0)
  ? RAW_SERIES_LIST
  : (catalogStatic.series as SeriesItem[]);

export const CHARACTER_ANALYSES: CharacterSummaryItem[] = catalogStatic.characters as CharacterSummaryItem[];

// 2. Statik Karakter Analizleri Haritası (0ms Senkron Erişim)
const staticCharacterMap = new Map<string, CharacterAnalysisArticle>();
for (const char of RAW_CHARACTER_ANALYSES) {
  staticCharacterMap.set(char.id, char);
}

const seriesMap = new Map<string, SeriesItem>();
for (const series of SERIES_LIST) {
  seriesMap.set(series.id, series);
}

/**
 * Statik dizi ve karakter kataloğu özetini senkron döndürür (Firestore kotası harcamaz).
 */
export async function fetchCatalogFromFirestore(): Promise<{
  series: SeriesItem[];
  characters: CharacterSummaryItem[];
}> {
  return {
    series: SERIES_LIST,
    characters: CHARACTER_ANALYSES,
  };
}

/**
 * Karakterin detaylı klinik analiz dosyasını yerel statik bellekten anında (0ms) getirir.
 * Firestore okuma kotası harcanmaz.
 */
export async function getCharacterById(id: string): Promise<CharacterAnalysisArticle | null> {
  if (!id) return null;
  return staticCharacterMap.get(id) || null;
}

/**
 * Karakterin detaylı klinik analiz dosyasını senkron olarak getirir.
 */
export function getCharacterByIdSync(id: string): CharacterAnalysisArticle | null {
  if (!id) return null;
  return staticCharacterMap.get(id) || null;
}

/**
 * Aynı dizideki diğer karakterleri senkron getirir.
 */
export async function getRelatedCharacters(
  seriesId: string,
  excludeCharacterId?: string
): Promise<CharacterSummaryItem[]> {
  return CHARACTER_ANALYSES.filter(
    (c) => c.seriesId === seriesId && c.id !== excludeCharacterId
  );
}

/**
 * Belirtilen ID'ye sahip dizi/film bilgisini getirir.
 */
export async function getSeriesById(seriesId: string): Promise<SeriesItem | null> {
  if (!seriesId) return null;
  return seriesMap.get(seriesId) || null;
}
