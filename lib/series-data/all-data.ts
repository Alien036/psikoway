// lib/series-data/all-data.ts
// Arşiv / Ham kaynak verisi: Toplu yükleme ve veri tabanı tohumlama için kullanılır.
import { SeriesItem, CharacterAnalysisArticle } from "./types";
import { EXISTING_SERIES, EXISTING_CHARACTERS } from "./existing";
import { BATCH1_SERIES, BATCH1_CHARACTERS } from "./batch1";
import { BATCH2_SERIES, BATCH2_CHARACTERS } from "./batch2";
import { BATCH3_SERIES, BATCH3_CHARACTERS } from "./batch3";
import { PSYCHO_MOVIES_LIST, PSYCHO_MOVIES_CHARACTERS } from "./movies";

export const RAW_SERIES_LIST: SeriesItem[] = [
  ...PSYCHO_MOVIES_LIST,
  ...EXISTING_SERIES,
  ...BATCH1_SERIES,
  ...BATCH2_SERIES,
  ...BATCH3_SERIES,
];

export const RAW_CHARACTER_ANALYSES: CharacterAnalysisArticle[] = [
  ...EXISTING_CHARACTERS,
  ...BATCH1_CHARACTERS,
  ...BATCH2_CHARACTERS,
  ...BATCH3_CHARACTERS,
  ...PSYCHO_MOVIES_CHARACTERS,
];
