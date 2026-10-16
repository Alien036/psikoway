// lib/analyses-data.ts
// Statik Dizi ve Karakter Psikolojik Analizleri Veri Katmanı
// Firestore okuma kotasını korumak ve 0ms anında açılış hızı sağlamak için
// tüm analizler bellek içi TypeScript tip korumalı yapı olarak sunulur.

import { RAW_SERIES_LIST, RAW_CHARACTER_ANALYSES } from "./series-data/all-data";
import { SeriesItem, CharacterAnalysisArticle, CharacterSummaryItem } from "./series-data/types";

// Re-export original types for seamless compatibility
export * from "./series-data/types";

/**
 * Alıntı veri yapısı
 */
export interface AnalysisQuote {
  text: string;
  context?: string;
}

/**
 * Analiz alt bölüm yapısı
 */
export interface AnalysisSection {
  heading: string;
  body: string;
}

/**
 * Klinik ve Jungian psikolojik profil
 */
export interface AnalysisPsychologicalProfile {
  primaryDiagnosis: string;
  archetype: string;
  defenseMechanisms: string[];
  coreConflict: string;
}

/**
 * Tip korumalı Dizi & Karakter Analiz Makalesi (Tam Veri Modeli)
 */
export interface AnalysisArticle extends CharacterAnalysisArticle {
  id: string;
  slug: string;
  title: string;
  seriesName: string;
  series: string;
  seriesId: string;
  character: string;
  characterName: string;
  actor: string;
  role: "main" | "supporting";
  roleBadge: string;
  image: string;
  category: "narsisizm" | "travma" | "antisosyal" | "anhedoni" | "obsesif";
  categoryBadge: string;
  badge: string;
  tagline: string;
  readTime: string;
  tags: string[];
  content: string;
  summary: string;
  psychologicalProfile: AnalysisPsychologicalProfile;
  fullContent: {
    lead: string;
    quote?: AnalysisQuote;
    sections: AnalysisSection[];
    clinicalTakeaway: string;
    therapeuticApproach: string;
  };
}

/**
 * Ham karakter analiz verisini genişletilmiş AnalysisArticle tipine dönüştürür.
 */
function buildAnalysisArticle(raw: CharacterAnalysisArticle): AnalysisArticle {
  const tags: string[] = [
    raw.series,
    raw.categoryBadge,
    raw.roleBadge,
    raw.badge,
    ...(raw.psychologicalProfile?.defenseMechanisms || []),
    raw.psychologicalProfile?.archetype,
  ].filter(Boolean) as string[];

  // Tekrarlayan etiketleri temizle
  const uniqueTags = Array.from(new Set(tags));

  return {
    id: raw.id,
    slug: raw.id,
    title: `${raw.characterName} — ${raw.series} Psikolojik Analizi`,
    seriesName: raw.series,
    series: raw.series,
    seriesId: raw.seriesId,
    character: raw.characterName,
    characterName: raw.characterName,
    actor: raw.actor,
    role: raw.role,
    roleBadge: raw.roleBadge,
    image: raw.image,
    category: raw.category,
    categoryBadge: raw.categoryBadge,
    badge: raw.badge,
    tagline: raw.tagline,
    readTime: raw.readTime,
    tags: uniqueTags,
    content: raw.summary || raw.fullContent?.lead || "",
    summary: raw.summary,
    psychologicalProfile: raw.psychologicalProfile,
    fullContent: raw.fullContent,
  };
}

// 1. Tip korumalı statik analiz listesi (Tüm 461 karakter analizi)
export const ANALYSES_DATA: AnalysisArticle[] = RAW_CHARACTER_ANALYSES.map(buildAnalysisArticle);

// 2. Statik Dizi & Yapım Listesi (70 dizi ve film)
export const SERIES_DATA: SeriesItem[] = RAW_SERIES_LIST;
export const SERIES_LIST: SeriesItem[] = RAW_SERIES_LIST;

// 3. Hafif Özet Karakter Listesi (Katalog & Arama görünümü için)
export const CHARACTER_ANALYSES: CharacterSummaryItem[] = ANALYSES_DATA.map((c) => ({
  id: c.id,
  seriesId: c.seriesId,
  characterName: c.characterName,
  series: c.seriesName,
  actor: c.actor,
  role: c.role,
  roleBadge: c.roleBadge,
  image: c.image,
  badge: c.badge,
  categoryBadge: c.categoryBadge,
  tagline: c.tagline,
  readTime: c.readTime,
  psychologicalProfile: {
    primaryDiagnosis: c.psychologicalProfile?.primaryDiagnosis || "",
    archetype: c.psychologicalProfile?.archetype,
    defenseMechanisms: c.psychologicalProfile?.defenseMechanisms,
    coreConflict: c.psychologicalProfile?.coreConflict,
  },
}));

// 4. Hızlı O(1) indeks haritaları (0ms lookup)
const ANALYSES_BY_ID = new Map<string, AnalysisArticle>();
const ANALYSES_BY_SERIES = new Map<string, AnalysisArticle[]>();
const SERIES_BY_ID = new Map<string, SeriesItem>();

for (const analysis of ANALYSES_DATA) {
  ANALYSES_BY_ID.set(analysis.id, analysis);
  ANALYSES_BY_ID.set(analysis.slug, analysis);

  const seriesGroup = ANALYSES_BY_SERIES.get(analysis.seriesId) || [];
  seriesGroup.push(analysis);
  ANALYSES_BY_SERIES.set(analysis.seriesId, seriesGroup);
}

for (const series of SERIES_DATA) {
  SERIES_BY_ID.set(series.id, series);
}

// ============================================================================
// SENKRON VE HIZLI YARDIMCI FONKSİYONLAR (Firestore'a ihtiyaç duymadan 0ms)
// ============================================================================

/**
 * ID veya Slug değerine göre karakter analizini senkron olarak anında getirir.
 */
export function getAnalysisById(idOrSlug: string): AnalysisArticle | null {
  if (!idOrSlug) return null;
  return ANALYSES_BY_ID.get(idOrSlug) || null;
}

/**
 * Tüm analiz makalelerini getirir.
 */
export function getAllAnalyses(): AnalysisArticle[] {
  return ANALYSES_DATA;
}

/**
 * Tüm yapımları (dizi/film) getirir.
 */
export function getAllSeries(): SeriesItem[] {
  return SERIES_DATA;
}

/**
 * ID değerine göre dizi veya film bilgisini getirir.
 */
export function getSeriesById(seriesId: string): SeriesItem | null {
  if (!seriesId) return null;
  return SERIES_BY_ID.get(seriesId) || null;
}

/**
 * Aynı dizide yer alan diğer analizleri getirir.
 */
export function getRelatedAnalyses(seriesId: string, excludeId?: string): AnalysisArticle[] {
  const group = ANALYSES_BY_SERIES.get(seriesId) || [];
  if (!excludeId) return group;
  return group.filter((item) => item.id !== excludeId && item.slug !== excludeId);
}

/**
 * Geriye dönük uyumluluk: Karakter analizini senkron/anında döndürür.
 */
export function getCharacterById(id: string): CharacterAnalysisArticle | null {
  return getAnalysisById(id);
}

/**
 * Geriye dönük uyumluluk: Dizideki diğer karakterlerin özet listesini döndürür.
 */
export function getRelatedCharacters(
  seriesId: string,
  excludeCharacterId?: string
): CharacterSummaryItem[] {
  const related = getRelatedAnalyses(seriesId, excludeCharacterId);
  return related.map((c) => ({
    id: c.id,
    seriesId: c.seriesId,
    characterName: c.characterName,
    series: c.seriesName,
    actor: c.actor,
    role: c.role,
    roleBadge: c.roleBadge,
    image: c.image,
    badge: c.badge,
    categoryBadge: c.categoryBadge,
    tagline: c.tagline,
    readTime: c.readTime,
    psychologicalProfile: {
      primaryDiagnosis: c.psychologicalProfile?.primaryDiagnosis || "",
      archetype: c.psychologicalProfile?.archetype,
      defenseMechanisms: c.psychologicalProfile?.defenseMechanisms,
      coreConflict: c.psychologicalProfile?.coreConflict,
    },
  }));
}

/**
 * Firestore'a sorgu atmadan doğrudan statik kataloğu senkron döndüren uyumluluk fonksiyonu.
 */
export function fetchCatalogFromFirestore(): Promise<{
  series: SeriesItem[];
  characters: CharacterSummaryItem[];
}> {
  return Promise.resolve({
    series: SERIES_DATA,
    characters: CHARACTER_ANALYSES,
  });
}
