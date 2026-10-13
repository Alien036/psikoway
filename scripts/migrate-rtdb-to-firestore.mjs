// scripts/migrate-rtdb-to-firestore.mjs
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import fs from "fs";

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

async function runMigration() {
  console.log("=== Realtime Database -> Cloud Firestore Taşıma Başlatıldı ===");

  const rtdbUrl = "https://psikoway-default-rtdb.firebaseio.com/users.json";
  let rtdbUsers = null;

  // 1. Önce Realtime Database'den dene
  try {
    const res = await fetch(rtdbUrl);
    rtdbUsers = await res.json();
  } catch (err) {
    console.warn("RTDB fetch warning:", err);
  }

  // 2. RTDB boşsa veya hata verdiyse yedek dosyasından al
  if (!rtdbUsers || rtdbUsers.error || Object.keys(rtdbUsers).length === 0) {
    if (fs.existsSync("scripts/backup-users.json")) {
      console.log("Yerel yedek dosyasından (scripts/backup-users.json) veriler okunuyor...");
      rtdbUsers = JSON.parse(fs.readFileSync("scripts/backup-users.json", "utf-8"));
    }
  }

  if (!rtdbUsers || Object.keys(rtdbUsers).length === 0) {
    console.log("Taşınacak kullanıcı bulunamadı.");
    return;
  }

  const entries = Object.entries(rtdbUsers);
  console.log(`Taşınacak kullanıcı sayısı: ${entries.length}`);

  let successCount = 0;
  let failedCount = 0;

  for (const [uid, userData] of entries) {
    try {
      const userDocRef = doc(firestore, "users", uid);
      await setDoc(userDocRef, userData, { merge: true });
      console.log(`[OK] Firestore'a başarıyla yazıldı: ${userData.displayName || uid} (${uid})`);
      successCount++;
    } catch (err) {
      console.error(`[HATA] Firestore'a yazılamadı (${uid}):`, err.message || err);
      failedCount++;
    }
  }

  console.log(`\nSonuç: ${successCount} başarılı, ${failedCount} başarısız.`);

  if (successCount > 0 && failedCount === 0) {
    console.log("Tüm kullanıcılar Cloud Firestore'a kaydedildi. Realtime Database 'users' düğümü temizleniyor...");
    try {
      await fetch(rtdbUrl, { method: "DELETE" });
      console.log("[BAŞARILI] Realtime Database'deki 'users' düğümü tamamen silindi ve temizlendi!");
    } catch (delErr) {
      console.warn("RTDB silinirken hata:", delErr);
    }
  } else if (failedCount > 0) {
    console.warn("\n[DİKKAT] Firestore'da PERMISSION_DENIED (Erişim Engellendi) hatası alındı!");
    console.warn("Lütfen Firebase Console -> Firestore Database -> Kurallar (Rules) sekmesinden okuma/yazma iznini açınız.");
    console.warn("Veri kaybını önlemek için Realtime DB henüz silinmedi.");
  }
}

runMigration().catch(console.error);

