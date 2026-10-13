import { collection, onSnapshot, getDocs, doc, setDoc } from "firebase/firestore";
import { firestore } from "./firebase";
import { UserProfile } from "../types/user";

const createSeedEmojiSvg = (emoji: string, bg: string = "#1e293b"): string => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="50" fill="${bg}"/><text x="50%" y="54%" dominant-baseline="central" text-anchor="middle" font-size="52">${emoji}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

// Topluluğun kurucu düşünür profilleri (Firestore boşsa başlangıç çekirdeği)
export const SEED_COMMUNITY_USERS: Record<string, Partial<UserProfile>> = {
  "seed-user-1": {
    uid: "seed-user-1",
    displayName: "Dr. Selin Yılmaz",
    email: "selin.yilmaz@psikoway.com",
    photoURL: createSeedEmojiSvg("👩‍⚕️", "#2e2038"),
    profession: "Klinik Psikolog & Psikoterapist",
    bio: "Bilişsel Davranışçı Terapi ve şema terapisi üzerine çalışan zihin araştırmacısı.",
    instagram: "drselinyilmaz",
    youtube: "@selinyilmaz_psikoloji",
    isAnonymous: false,
    createdAt: "2026-10-10T09:00:00Z",
  },
  "seed-user-admin": {
    uid: "seed-user-admin",
    displayName: "PsikoWay Moderatör",
    email: "admin@psikoway.com",
    photoURL: createSeedEmojiSvg("🧑‍🎓", "#243242"),
    profession: "PsikoWay Editörü & Moderasyon",
    bio: "Topluluk kuralları ve empatik paylaşım ilkeleri sorumlusu.",
    instagram: "psikoway",
    youtube: "@psikoway",
    isAnonymous: false,
    createdAt: "2026-10-01T00:00:00Z",
  },
  "seed-user-2": {
    uid: "seed-user-2",
    displayName: "Kaan Aras",
    email: "kaan.aras@example.com",
    photoURL: createSeedEmojiSvg("👨‍🏫", "#1e3a5f"),
    profession: "Felsefe Öğretmeni",
    bio: "Varoluşçu psikoloji ve stoacı düşünce meraklısı.",
    instagram: "kaan.aras.felsefe",
    youtube: "@felsefedersleri",
    isAnonymous: false,
    createdAt: "2026-10-08T10:00:00Z",
  },
  "seed-user-3": {
    uid: "seed-user-3",
    displayName: "Elif Demir",
    email: "elif.demir@example.com",
    photoURL: createSeedEmojiSvg("👩‍💼", "#3b1e32"),
    profession: "Yazar & Danışman",
    bio: "İnsan ilişkileri ve bağlanma dinamikleri araştırmacısı.",
    instagram: "elifdemir.yazar",
    youtube: "@elifledemiryolculuk",
    isAnonymous: false,
    createdAt: "2026-10-07T11:00:00Z",
  },
  "seed-user-4": {
    uid: "seed-user-4",
    displayName: "Mert Karaca",
    email: "mert.karaca@example.com",
    photoURL: createSeedEmojiSvg("👨", "#1e293b"),
    profession: "Felsefe Araştırmacısı",
    bio: "Jung arketip kuramı ve analitik psikoloji kaşifi.",
    instagram: "mertkaraca.jung",
    youtube: "@analitikpsikoloji",
    isAnonymous: false,
    createdAt: "2026-10-09T14:00:00Z",
  },
  "seed-user-8": {
    uid: "seed-user-8",
    displayName: "Burak Kaya",
    email: "burak.kaya@example.com",
    photoURL: createSeedEmojiSvg("🧔", "#2d283e"),
    profession: "Edebiyatçı",
    bio: "Edebiyat ve psikoloji kesişiminde anlam arayışı yazarı.",
    instagram: "burakkaya.edebiyat",
    youtube: "@anlamarayisi",
    isAnonymous: false,
    createdAt: "2026-10-06T15:00:00Z",
  },
};

/**
 * Cloud Firestore'daki 'users' koleksiyonunu kontrol eder; boşsa seed üyeleri yazar.
 */
export const ensureSeedUsersInFirestore = async (): Promise<void> => {
  try {
    const usersCol = collection(firestore, "users");
    const snap = await getDocs(usersCol);
    if (snap.empty) {
      for (const [uid, seedUser] of Object.entries(SEED_COMMUNITY_USERS)) {
        await setDoc(doc(firestore, "users", uid), seedUser, { merge: true });
      }
    }
  } catch (err) {
    console.warn("ensureSeedUsersInFirestore warning:", err);
  }
};

// Geriye dönük uyumluluk için takma ad
export const ensureSeedUsersInFirebase = ensureSeedUsersInFirestore;

/**
 * Ana sayfa ve sayaçlar için Cloud Firestore'dan GERÇEK kullanıcı sayısını canlı olarak dinler.
 */
export const subscribeToRealUserCount = (
  callback: (count: number) => void
): (() => void) => {
  ensureSeedUsersInFirestore();

  try {
    const usersCol = collection(firestore, "users");
    const unsubscribe = onSnapshot(
      usersCol,
      (snapshot) => {
        if (!snapshot.empty) {
          callback(snapshot.size);
        } else {
          callback(1);
        }
      },
      (err) => {
        console.warn("subscribeToRealUserCount Firestore error:", err);
        callback(1);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn("subscribeToRealUserCount init error:", err);
    callback(1);
    return () => {};
  }
};

export interface CommunityPulseStats {
  postsCount: number;
  commentsCount: number;
  usersCount: number;
}

/**
 * Forum sayfasındaki 'Topluluk Nabzı' bileşeni için GERÇEK zamanlı istatistik dinleyicisi.
 * - Paylaşılan Fikir (gerçek gönderi sayısı - Cloud Firestore)
 * - Tartışma Yanıtı (gerçek yorum sayısı - Cloud Firestore)
 * - Zihin Kaşifi (gerçek kayıtlı üye sayısı - Cloud Firestore)
 */
export const subscribeToCommunityPulse = (
  callback: (stats: CommunityPulseStats) => void
): (() => void) => {
  let currentPostsCount = 0;
  let currentCommentsCount = 0;
  let currentUsersCount = 0;

  const emit = () => {
    callback({
      postsCount: currentPostsCount,
      commentsCount: currentCommentsCount,
      usersCount: currentUsersCount,
    });
  };

  ensureSeedUsersInFirestore();

  // 1. Gönderiler ve Yorumları Dinle (Cloud Firestore - forum_posts)
  let unsubPosts = () => {};
  try {
    const postsCol = collection(firestore, "forum_posts");
    unsubPosts = onSnapshot(
      postsCol,
      (snap) => {
        if (!snap.empty) {
          currentPostsCount = snap.size;
          let totalComments = 0;
          snap.forEach((d) => {
            const p = d.data();
            if (p && Array.isArray(p.comments)) {
              totalComments += p.comments.length;
            }
          });
          currentCommentsCount = totalComments;
        } else {
          currentPostsCount = 0;
          currentCommentsCount = 0;
        }
        emit();
      },
      (err) => {
        console.warn("subscribeToCommunityPulse posts snapshot error:", err);
        emit();
      }
    );
  } catch (err) {
    console.warn("subscribeToCommunityPulse posts init error:", err);
  }

  // 2. Kullanıcıları Dinle (Cloud Firestore - users)
  let unsubUsers = () => {};
  try {
    const usersCol = collection(firestore, "users");
    unsubUsers = onSnapshot(
      usersCol,
      (snap) => {
        currentUsersCount = snap.empty ? 1 : snap.size;
        emit();
      },
      (err) => {
        console.warn("subscribeToCommunityPulse Firestore user snapshot warning:", err);
        currentUsersCount = 1;
        emit();
      }
    );
  } catch (err) {
    console.warn("subscribeToCommunityPulse Firestore user init warning:", err);
  }

  return () => {
    unsubPosts();
    unsubUsers();
  };
};

/**
 * İstatistik sayılarını şık ve gerçekçi biçimlendirir.
 * 1000'den küçükse tam sayıyı gösterir (Örn: 6, 24, 85).
 * 1000 ve üzeriyse 'K' formatına çevirir (Örn: 1.2K).
 */
export const formatCommunityStat = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};
