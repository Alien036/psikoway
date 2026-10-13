// scripts/create-catalog-static.ts
import fs from "fs";
import { SERIES_LIST, CHARACTER_ANALYSES } from "../lib/series-data/index";

const charactersSummary = CHARACTER_ANALYSES.map((c) => ({
  id: c.id,
  seriesId: c.seriesId,
  characterName: c.characterName,
  series: c.series,
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
    archetype: c.psychologicalProfile?.archetype || "",
    defenseMechanisms: c.psychologicalProfile?.defenseMechanisms || [],
    coreConflict: c.psychologicalProfile?.coreConflict || "",
  },
}));

const catalog = {
  series: SERIES_LIST,
  characters: charactersSummary,
};

fs.writeFileSync("lib/series-data/catalog-static.json", JSON.stringify(catalog, null, 2), "utf-8");
console.log("Static catalog written to lib/series-data/catalog-static.json");
const stat = fs.statSync("lib/series-data/catalog-static.json");
console.log("Size of catalog-static.json:", (stat.size / 1024).toFixed(1), "KB");
