export interface SeriesItem {
  id: string;
  title: string;
  genre: string;
  seasons: string;
  coverImage: string;
  tagline: string;
  psychologicalTheme: string;
  characterCount: number;
  characterIds: string[];
}

export interface CharacterAnalysisArticle {
  id: string;
  seriesId: string;
  characterName: string;
  series: string;
  actor: string;
  role: "main" | "supporting";
  roleBadge: string;
  image: string;
  category: "narsisizm" | "travma" | "antisosyal" | "anhedoni" | "obsesif";
  categoryBadge: string;
  badge: string;
  tagline: string;
  readTime: string;
  psychologicalProfile: {
    primaryDiagnosis: string;
    archetype: string;
    defenseMechanisms: string[];
    coreConflict: string;
  };
  summary: string;
  fullContent: {
    lead: string;
    quote?: {
      text: string;
      context?: string;
    };
    sections: {
      heading: string;
      body: string;
    }[];
    clinicalTakeaway: string;
    therapeuticApproach: string;
  };
}

export interface CharacterSummaryItem {
  id: string;
  seriesId: string;
  characterName: string;
  series: string;
  actor: string;
  role: "main" | "supporting";
  roleBadge: string;
  image: string;
  badge: string;
  categoryBadge: string;
  tagline: string;
  readTime: string;
  psychologicalProfile: {
    primaryDiagnosis: string;
    archetype?: string;
    defenseMechanisms?: string[];
    coreConflict?: string;
  };
}
