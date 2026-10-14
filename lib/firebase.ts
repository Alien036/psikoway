// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeAppCheck, ReCaptchaV3Provider, AppCheck } from "firebase/app-check";

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

// Next.js (React) ortamında uygulamanın birden fazla kez başlatılmasını önlemek için güvenlik kontrolü
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
// Cloud Firestore: Tüm site verileri (kullanıcılar, forum, iletişim, moderasyon)
const firestore = getFirestore(app);
const db = firestore;

// ========================================================
// 2. FIREBASE APP CHECK ENTEGRASYONU (reCAPTCHA v3)
// ========================================================
let appCheck: AppCheck | null = null;

if (typeof window !== "undefined") {
  // Geliştirme ortamında debug token desteği
  if (process.env.NODE_ENV === "development") {
    (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  }

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (siteKey) {
    try {
      appCheck = initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(siteKey),
        isTokenAutoRefreshEnabled: true,
      });
      console.log("[Firebase App Check] reCAPTCHA v3 sağlayıcısı ile aktif edildi.");
    } catch (err) {
      console.warn("[Firebase App Check] Başlatma uyarısı:", err);
    }
  } else if (process.env.NODE_ENV === "development") {
    console.info(
      "[Firebase App Check] NEXT_PUBLIC_RECAPTCHA_SITE_KEY env değişkeni tanımlanmadığı için App Check geliştirme modunda beklemede."
    );
  }
}

export { app, auth, googleProvider, firestore, db, appCheck };