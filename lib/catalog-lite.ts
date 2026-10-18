// lib/catalog-lite.ts
// Mobil ve istemci tarafı için ultra-hafif katalog verisi.
// 1.25 MB boyutundaki tam makale metinlerini istemci paketine dahil etmeden
// 70 dizi/film ve 461 karakter özetini anında (0ms) sunar.

import catalogStatic from "./series-data/catalog-static.json";
import { SeriesItem, CharacterSummaryItem } from "./series-data/types";

export type { SeriesItem, CharacterSummaryItem };

export const SERIES_LIST: SeriesItem[] = catalogStatic.series as SeriesItem[];

export const CHARACTER_ANALYSES: CharacterSummaryItem[] =
  catalogStatic.characters as CharacterSummaryItem[];
