// scripts/upload-catalog.ts
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { RAW_SERIES_LIST, RAW_CHARACTER_ANALYSES } from "../lib/series-data/all-data";

const firebaseConfig = {
  apiKey: "AIzaSyDEgDXgQgxuh7YplU5aEeoaG6NmSiGP7Fw",
  authDomain: "psikoway.firebaseapp.com",
  projectId: "psikoway"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function sanitize<T>(obj: T): any {
  return JSON.parse(JSON.stringify(obj, (_, v) => (v === undefined ? null : v)));
}

async function run() {
  console.log("Katalog özeti hazırlanıyor...");
  const charactersSummary = RAW_CHARACTER_ANALYSES.map((c) => ({
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

  console.log(`Dizi sayısı: ${RAW_SERIES_LIST.length}, Karakter özeti: ${charactersSummary.length}`);

  const payload = {
    series: sanitize(RAW_SERIES_LIST),
    characters: sanitize(charactersSummary),
    updatedAt: new Date().toISOString(),
  };

  await setDoc(doc(db, "catalog", "main"), payload, { merge: true });
  console.log("✓ 'catalog/main' Firestore'a güncellenmiş ve arketip bilgileriyle başarıyla kaydedildi!");

  const snap = await getDoc(doc(db, "catalog", "main"));
  if (snap.exists()) {
    const data = snap.data();
    console.log(`Doğrulandı: ${data.series.length} dizi, ${data.characters.length} karakter özeti mevcut.`);
    console.log(`Örnek kontrol: ${data.characters[0].characterName} -> arketip: ${data.characters[0].psychologicalProfile.archetype}`);
  }
}

run().catch((err) => {
  console.error("Hata:", err);
  process.exit(1);
});
