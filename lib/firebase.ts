// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

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

export { app, auth, googleProvider, firestore, db };