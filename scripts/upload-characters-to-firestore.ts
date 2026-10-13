// scripts/upload-characters-to-firestore.ts
import { initializeApp } from "firebase/app";
import { getFirestore, doc, writeBatch, getDoc, collection, getDocs } from "firebase/firestore";
import { SERIES_LIST, CHARACTER_ANALYSES } from "../lib/series-data/index";

const firebaseConfig = {
  apiKey: "AIzaSyDEgDXgQgxuh7YplU5aEeoaG6NmSiGP7Fw",
  authDomain: "psikoway.firebaseapp.com",
  databaseURL: "https://psikoway-default-rtdb.firebaseio.com",
  projectId: "psikoway",
  storageBucket: "psikoway.firebasestorage.app",
  messagingSenderId: "298711576178",
  appId: "1:298711576178:web:54f26f7b26a6aba9c8dceb",
  measurementId: "G-47WCBGM06S"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

function sanitize<T>(obj: T): any {
  return JSON.parse(JSON.stringify(obj, (_, v) => (v === undefined ? null : v)));
}

async function uploadAll() {
  console.log("=== Dizi, Film ve Karakter Verilerini Firestore'a Aktarma Başlatılıyor ===");
  console.log(`Toplam Yapım (Dizi/Film): ${SERIES_LIST.length}`);
  console.log(`Toplam Karakter Analizi: ${CHARACTER_ANALYSES.length}`);

  // 1. Dizi / Film Listesini Firestore 'series' Koleksiyonuna Yükle
  console.log("\n[1/3] 'series' koleksiyonu güncelleniyor...");
  const seriesBatch = writeBatch(firestore);
  for (const s of SERIES_LIST) {
    const ref = doc(firestore, "series", s.id);
    seriesBatch.set(ref, sanitize(s), { merge: true });
  }
  await seriesBatch.commit();
  console.log(`✓ ${SERIES_LIST.length} adet dizi/film kaydı 'series' koleksiyonuna yüklendi.`);

  // 2. Karakter Analizlerini Firestore 'characters' Koleksiyonuna Parçalar Halinde Yükle (Batch boyutu: 200)
  console.log("\n[2/3] 'characters' koleksiyonu güncelleniyor...");
  const BATCH_SIZE = 200;
  for (let i = 0; i < CHARACTER_ANALYSES.length; i += BATCH_SIZE) {
    const chunk = CHARACTER_ANALYSES.slice(i, i + BATCH_SIZE);
    const batch = writeBatch(firestore);
    for (const char of chunk) {
      const ref = doc(firestore, "characters", char.id);
      batch.set(ref, sanitize(char), { merge: true });
    }
    await batch.commit();
    console.log(`✓ Karakterler ${i + 1} - ${Math.min(i + BATCH_SIZE, CHARACTER_ANALYSES.length)} yüklendi.`);
  }

  // 3. Doğrulama
  console.log("\n[3/3] Yükleme doğrulanıyor...");
  const seriesSnap = await getDocs(collection(firestore, "series"));
  const charSnap = await getDocs(collection(firestore, "characters"));
  console.log(`Firestore'daki Güncel 'series' Sayısı: ${seriesSnap.size}`);
  console.log(`Firestore'daki Güncel 'characters' Sayısı: ${charSnap.size}`);

  // Örnek bir karakter oku ve doğrula
  const sampleDoc = await getDoc(doc(firestore, "characters", "walter-white"));
  if (sampleDoc.exists()) {
    console.log(`✓ Örnek kontrol başarılı: walter-white (${sampleDoc.data().characterName})`);
  } else {
    console.warn("! Örnek kontrol bulunamadı.");
  }

  console.log("\n=== TÜM VERİLER CLOUD FIRESTORE'A EKSİKSİZ TAŞINDI! ===");
}

uploadAll().catch(err => {
  console.error("Yükleme sırasında hata oluştu:", err);
  process.exit(1);
});
