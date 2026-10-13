import { doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { firestore, auth } from "./firebase";
import { UserProfile, UserStats } from "../types/user";
import { getStoredPosts, getLocalShadowPosts } from "./forum-data";
import { SEED_COMMUNITY_USERS } from "./community-stats";
import { ForumPost } from "../types/forum";

/**
 * Emoji karakterini yüksek kaliteli, her tarayıcıda çalışan SVG Data URL'sine dönüştürür.
 */
export const createEmojiAvatar = (emoji: string, bg: string = "#1e293b"): string => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="50" fill="${bg}"/><text x="50%" y="54%" dominant-baseline="central" text-anchor="middle" font-size="52">${emoji}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export interface PresetEmojiAvatar {
  id: string;
  label: string;
  emoji: string;
  gender: "erkek" | "kiz";
  bgColor: string;
  url: string;
}

export const MALE_EMOJI_AVATARS: PresetEmojiAvatar[] = [
  { id: "male-1", label: "Genç Erkek", emoji: "👨", gender: "erkek", bgColor: "#1e293b", url: createEmojiAvatar("👨", "#1e293b") },
  { id: "male-2", label: "Genç / Çocuk Erkek", emoji: "👦", gender: "erkek", bgColor: "#1e3a5f", url: createEmojiAvatar("👦", "#1e3a5f") },
  { id: "male-3", label: "Sakallı Erkek", emoji: "🧔", gender: "erkek", bgColor: "#2d283e", url: createEmojiAvatar("🧔", "#2d283e") },
  { id: "male-4", label: "Meslek / İş İnsanı", emoji: "👨‍💼", gender: "erkek", bgColor: "#243242", url: createEmojiAvatar("👨‍💼", "#243242") },
  { id: "male-5", label: "Kıvırcık Saçlı Erkek", emoji: "👨‍🦱", gender: "erkek", bgColor: "#1f332a", url: createEmojiAvatar("👨‍🦱", "#1f332a") },
  { id: "male-6", label: "Sarı Saçlı Erkek", emoji: "👱‍♂️", gender: "erkek", bgColor: "#382f1d", url: createEmojiAvatar("👱‍♂️", "#382f1d") },
  { id: "male-7", label: "Öğrenci / Düşünür", emoji: "🧑‍🎓", gender: "erkek", bgColor: "#2b233a", url: createEmojiAvatar("🧑‍🎓", "#2b233a") },
  { id: "male-8", label: "Eğitmen / Danışman", emoji: "👨‍🏫", gender: "erkek", bgColor: "#362428", url: createEmojiAvatar("👨‍🏫", "#362428") },
];

export const FEMALE_EMOJI_AVATARS: PresetEmojiAvatar[] = [
  { id: "female-1", label: "Genç Kadın", emoji: "👩", gender: "kiz", bgColor: "#2e2038", url: createEmojiAvatar("👩", "#2e2038") },
  { id: "female-2", label: "Genç / Çocuk Kız", emoji: "👧", gender: "kiz", bgColor: "#3b1e32", url: createEmojiAvatar("👧", "#3b1e32") },
  { id: "female-3", label: "Meslek / İş Kadını", emoji: "👩‍💼", gender: "kiz", bgColor: "#232d3d", url: createEmojiAvatar("👩‍💼", "#232d3d") },
  { id: "female-4", label: "Kıvırcık Saçlı Kadın", emoji: "👩‍🦱", gender: "kiz", bgColor: "#1e3328", url: createEmojiAvatar("👩‍🦱", "#1e3328") },
  { id: "female-5", label: "Sarı Saçlı Kadın", emoji: "👱‍♀️", gender: "kiz", bgColor: "#3a2d1d", url: createEmojiAvatar("👱‍♀️", "#3a2d1d") },
  { id: "female-6", label: "Kızıl Saçlı Kadın", emoji: "👩‍🦰", gender: "kiz", bgColor: "#3d221e", url: createEmojiAvatar("👩‍🦰", "#3d221e") },
  { id: "female-7", label: "Öğrenci / Düşünür Kadın", emoji: "👩‍🎓", gender: "kiz", bgColor: "#26243d", url: createEmojiAvatar("👩‍🎓", "#26243d") },
  { id: "female-8", label: "Eğitmen / Danışman Kadın", emoji: "👩‍🏫", gender: "kiz", bgColor: "#331f2b", url: createEmojiAvatar("👩‍🏫", "#331f2b") },
];

export const PRESET_AVATARS = [...MALE_EMOJI_AVATARS, ...FEMALE_EMOJI_AVATARS];

const PROFILE_CACHE_PREFIX = "psikoway_user_profile_";

/**
 * Instagram Kullanıcı Adı veya Linkini Geçerli URL'ye Dönüştürür
 */
export const getInstagramUrl = (handleOrUrl?: string): string => {
  if (!handleOrUrl) return "";
  const trimmed = handleOrUrl.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  const clean = trimmed.replace(/^@/, "");
  return `https://www.instagram.com/${clean}`;
};

/**
 * Instagram Kullanıcı Adını Görüntüleme Formatına Çevirir (örn: @username)
 */
export const getInstagramHandle = (handleOrUrl?: string): string => {
  if (!handleOrUrl) return "";
  const trimmed = handleOrUrl.trim();
  if (trimmed.includes("instagram.com/")) {
    const parts = trimmed.split("instagram.com/")[1].split(/[/?#]/);
    return parts[0] ? `@${parts[0]}` : trimmed;
  }
  return trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
};

/**
 * YouTube Kanal Adı veya Linkini Geçerli URL'ye Dönüştürür
 */
export const getYouTubeUrl = (handleOrUrl?: string): string => {
  if (!handleOrUrl) return "";
  const trimmed = handleOrUrl.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  const clean = trimmed.replace(/^@/, "");
  return `https://www.youtube.com/@${clean}`;
};

/**
 * YouTube Kanal Adını Görüntüleme Formatına Çevirir (örn: @kanaladi)
 */
export const getYouTubeHandle = (handleOrUrl?: string): string => {
  if (!handleOrUrl) return "";
  const trimmed = handleOrUrl.trim();
  if (trimmed.includes("youtube.com/")) {
    const parts = trimmed.split("youtube.com/")[1].split(/[/?#]/);
    return parts[0] ? (parts[0].startsWith("@") ? parts[0] : `@${parts[0]}`) : trimmed;
  }
  return trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
};

/**
 * Kullanıcı profilini Cloud Firestore'dan getirir.
 * Realtime Database'de eski kullanıcı verisi kalmışsa otomatik olarak Firestore'a taşır.
 */
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  if (!uid) return null;

  // 1. Cloud Firestore'dan çek (Ana Kullanıcı Depolama Alanı)
  try {
    const userDocRef = doc(firestore, "users", uid);
    const snapshot = await getDoc(userDocRef);
    if (snapshot.exists()) {
      const data = snapshot.data() as UserProfile;
      if (typeof window !== "undefined") {
        localStorage.setItem(`${PROFILE_CACHE_PREFIX}${uid}`, JSON.stringify(data));
      }
      return data;
    }
  } catch (err) {
    console.warn("Firestore user profile fetch warning:", err);
  }

  // 2. LocalStorage Cache Fallback
  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem(`${PROFILE_CACHE_PREFIX}${uid}`);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch {}
  }

  // 4. Topluluğun Kurucu / Seed Üyeleri Kontrolü
  if (SEED_COMMUNITY_USERS[uid]) {
    const seed = SEED_COMMUNITY_USERS[uid];
    const seedProfile: UserProfile = {
      uid: seed.uid || uid,
      email: seed.email || "",
      displayName: seed.displayName || "PsikoWay Düşünürü",
      photoURL: seed.photoURL || "",
      profession: seed.profession || "Düşünce Kaşifi",
      bio: seed.bio || "Psikoloji ve insan zihnini keşfetmeyi seven bir topluluk üyesi.",
      instagram: seed.instagram || "",
      youtube: seed.youtube || "",
      createdAt: seed.createdAt || new Date().toISOString(),
      isAnonymous: false,
    };
    // Arka planda Firestore'a da kaydet
    setDoc(doc(firestore, "users", uid), seedProfile, { merge: true }).catch(() => {});
    if (typeof window !== "undefined") {
      localStorage.setItem(`${PROFILE_CACHE_PREFIX}${uid}`, JSON.stringify(seedProfile));
    }
    return seedProfile;
  }

  // 5. Mevcut Firebase Auth oturumundan temel profil oluştur
  const currentUser = auth.currentUser;
  if (currentUser && currentUser.uid === uid) {
    const fallbackProfile: UserProfile = {
      uid,
      email: currentUser.email || "",
      displayName: currentUser.displayName || (currentUser.isAnonymous ? "Misafir Düşünür" : "PsikoWay Üyesi"),
      photoURL: currentUser.photoURL || "",
      profession: "Düşünce Kaşifi",
      bio: "Psikoloji ve insan zihnini keşfetmeyi seven bir topluluk üyesi.",
      instagram: "",
      youtube: "",
      createdAt: new Date().toISOString(),
      isAnonymous: currentUser.isAnonymous,
    };
    // Firestore'a kaydet
    setDoc(doc(firestore, "users", uid), fallbackProfile, { merge: true }).catch(() => {});
    return fallbackProfile;
  }

  // 6. Forum gönderilerinde bu yazar var mı? (Geriye dönük uyumluluk)
  const posts = getStoredPosts();
  const authorPost = posts.find((p) => p.authorId === uid && !p.isAnonymous);
  if (authorPost) {
    const postFallbackProfile: UserProfile = {
      uid,
      email: "",
      displayName: authorPost.authorName || "PsikoWay Düşünürü",
      photoURL: authorPost.authorAvatar || undefined,
      profession: authorPost.authorProfession || "Düşünce Kaşifi",
      bio: authorPost.authorBio || "Psikoloji ve düşünce dünyasında aktif bir topluluk üyesi.",
      instagram: "",
      youtube: "",
      createdAt: authorPost.createdAt || new Date().toISOString(),
      isAnonymous: false,
    };
    return postFallbackProfile;
  }

  return null;
};

/**
 * Kullanıcı profilini Cloud Firestore'a kaydeder.
 * (Realtime Database artık kullanıcılar için kullanılmaz, sadece forum mesajları içindir)
 */
export const saveUserProfile = async (profile: UserProfile): Promise<UserProfile> => {
  if (!profile.uid) throw new Error("Kullanıcı ID'si eksik.");

  // Firestore "undefined" alanları kabul etmez. Tüm alanları eksiksiz ve geçerli tiplerle hazırlarız:
  const cleanProfile: UserProfile = {
    uid: profile.uid,
    email: (profile.email || "").trim(),
    displayName: (profile.displayName || "PsikoWay Üyesi").trim(),
    photoURL: profile.photoURL || "",
    profession: (profile.profession || "Düşünce Kaşifi").trim(),
    bio: (profile.bio || "").trim(),
    instagram: (profile.instagram || "").trim(),
    youtube: (profile.youtube || "").trim(),
    createdAt: profile.createdAt || new Date().toISOString(),
    isAnonymous: Boolean(profile.isAnonymous),
  };

  // 1. Firebase Auth Profilini Güncelle (displayName & photoURL)
  if (auth.currentUser && auth.currentUser.uid === profile.uid) {
    try {
      await updateProfile(auth.currentUser, {
        displayName: cleanProfile.displayName,
        photoURL: cleanProfile.photoURL || null,
      });
    } catch (err) {
      console.warn("updateProfile error:", err);
    }
  }

  // 2. Cloud Firestore'a eksiksiz kaydet
  try {
    const userDocRef = doc(firestore, "users", profile.uid);
    await setDoc(userDocRef, {
      ...cleanProfile,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    console.log(`[Firestore] Kullanıcı başarıyla kaydedildi: ${cleanProfile.displayName} (${cleanProfile.uid})`);
  } catch (err) {
    console.error("Firestore profile save error:", err);
    throw err;
  }

  // 3. LocalStorage'a kaydet
  if (typeof window !== "undefined") {
    localStorage.setItem(`${PROFILE_CACHE_PREFIX}${profile.uid}`, JSON.stringify(cleanProfile));
  }

  return cleanProfile;
};

/**
 * Cloud Firestore'daki tüm kullanıcı profillerini doğrular ve günceller.
 */
export const migrateAllUsersFromRTDBToFirestore = async (): Promise<{ success: boolean; count: number; error?: string }> => {
  try {
    const list = await getAllUsersFromFirestore();
    if (typeof window !== "undefined") {
      localStorage.setItem("psikoway_rtdb_to_firestore_migrated", "true");
    }
    return { success: true, count: list.length };
  } catch (err: any) {
    console.error("migrateAllUsersFromRTDBToFirestore error:", err);
    return { success: false, count: 0, error: err?.message || "Bilinmeyen hata" };
  }
};


/**
 * Cloud Firestore'dan kayıtlı tüm kullanıcı profillerini çeker.
 */
export const getAllUsersFromFirestore = async (): Promise<UserProfile[]> => {
  try {
    const usersCol = collection(firestore, "users");
    const snap = await getDocs(usersCol);
    const users: UserProfile[] = [];
    snap.forEach((d) => {
      users.push(d.data() as UserProfile);
    });
    return users;
  } catch (err) {
    console.warn("getAllUsersFromFirestore warning:", err);
    return [];
  }
};


export const getUserCommunityStats = (uid: string): UserStats => {
  const posts = getStoredPosts();
  let postsCount = 0;
  let commentsCount = 0;
  let likesReceived = 0;

  posts.forEach((p) => {
    if (p.authorId === uid) {
      postsCount++;
      likesReceived += p.likes.length;
    }
    p.comments.forEach((c) => {
      if (c.authorId === uid) {
        commentsCount++;
        likesReceived += c.likes.length;
      }
    });
  });

  return { postsCount, commentsCount, likesReceived };
};

export interface UserProfileComment {
  commentId: string;
  postId: string;
  postTitle: string;
  postCategory?: string;
  content: string;
  createdAt: string;
  likesCount: number;
  isAnonymous: boolean;
  isShadowbanned?: boolean;
}

export const getUserPosts = (uid: string, includeAnonymous: boolean = false): ForumPost[] => {
  const posts = getStoredPosts();
  const localShadow = getLocalShadowPosts();
  const map = new Map<string, ForumPost>();
  posts.forEach((p) => map.set(p.id, p));
  localShadow.forEach((lp) => {
    if (!map.has(lp.id)) map.set(lp.id, lp);
  });
  const all = Array.from(map.values());
  return all.filter((p) => p.authorId === uid && (includeAnonymous || !p.isAnonymous));
};

export const getUserComments = (uid: string): UserProfileComment[] => {
  const posts = getStoredPosts();
  const list: UserProfileComment[] = [];

  posts.forEach((p) => {
    (p.comments || []).forEach((c) => {
      if (c.authorId === uid) {
        list.push({
          commentId: c.id,
          postId: p.id,
          postTitle: p.title,
          postCategory: p.category,
          content: c.content,
          createdAt: c.createdAt,
          likesCount: (c.likes || []).length,
          isAnonymous: Boolean(c.isAnonymous),
          isShadowbanned: Boolean(c.isShadowbanned),
        });
      }
    });
  });

  list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return list;
};
