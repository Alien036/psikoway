import { doc, getDoc, setDoc, collection, getDocs, query, where } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { firestore, auth } from "./firebase";
import { UserProfile, UserStats } from "../types/user";
import { getStoredPosts, getLocalShadowPosts } from "./forum-data";
import { SEED_COMMUNITY_USERS } from "./community-stats";
import { ForumPost } from "../types/forum";

/**
 * Kullanıcı adını veya görünen ismi URL-dostu temiz bir kullanıcı adı slug'ına dönüştürür.
 * Örn: "Dr. Selin Yılmaz" -> "dr-selin-yilmaz"
 */
export const toUsernameSlug = (input?: string): string => {
  if (!input) return "dusunur";
  const slug = input
    .trim()
    .toLowerCase()
    .replace(/^@+/, "")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/i̇/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[.-]+|[.-]+$/g, "");
  return slug || "dusunur";
};

/**
 * Kullanıcı profiline giderken ID yerine kullanıcı adıyla temiz URL üretir.
 * Örn: "/profil/dr-selin-yilmaz"
 */
export const getProfileUrl = (params: {
  username?: string;
  displayName?: string;
  authorName?: string;
  uid?: string;
  authorId?: string;
}): string => {
  const rawName = params.username || params.displayName || params.authorName || "";
  if (rawName && rawName.trim() && rawName !== "Anonim Düşünür") {
    return `/profil/${encodeURIComponent(toUsernameSlug(rawName))}`;
  }
  const fallbackId = params.uid || params.authorId || "";
  return fallbackId ? `/profil/${encodeURIComponent(fallbackId)}` : "/profil";
};

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
 * Kullanıcı profilini kullanıcı adı (username slug), görünen isim (displayName) veya UID ile getirir.
 */
export const getUserProfile = async (identifier: string): Promise<UserProfile | null> => {
  if (!identifier) return null;

  let decoded = identifier;
  try {
    decoded = decodeURIComponent(identifier).trim();
  } catch {
    decoded = identifier.trim();
  }

  const targetSlug = toUsernameSlug(decoded);

  // 1. Önce doğrudan UID ile veya username sorgusuyla Cloud Firestore'dan çek
  try {
    // 1a. Doğrudan belge ID'si (UID) olarak dene
    const userDocRef = doc(firestore, "users", decoded);
    const snapshot = await getDoc(userDocRef);
    if (snapshot.exists()) {
      const raw = snapshot.data() as UserProfile;
      const data: UserProfile = {
        ...raw,
        uid: raw.uid || snapshot.id,
        username: raw.username || toUsernameSlug(raw.displayName),
      };
      if (typeof window !== "undefined") {
        localStorage.setItem(`${PROFILE_CACHE_PREFIX}${data.uid}`, JSON.stringify(data));
        localStorage.setItem(`${PROFILE_CACHE_PREFIX}${data.username}`, JSON.stringify(data));
      }
      return data;
    }

    // 1b. Firestore 'username' alanına göre sorgula
    const usersCol = collection(firestore, "users");
    const qUsername = query(usersCol, where("username", "==", targetSlug));
    const qSnap = await getDocs(qUsername);
    if (!qSnap.empty) {
      const docSnap = qSnap.docs[0];
      const raw = docSnap.data() as UserProfile;
      const data: UserProfile = {
        ...raw,
        uid: raw.uid || docSnap.id,
        username: raw.username || targetSlug,
      };
      if (typeof window !== "undefined") {
        localStorage.setItem(`${PROFILE_CACHE_PREFIX}${data.uid}`, JSON.stringify(data));
        localStorage.setItem(`${PROFILE_CACHE_PREFIX}${data.username}`, JSON.stringify(data));
      }
      return data;
    }

    // 1c. Eski kayıtlarda 'username' alanı henüz yoksa tüm kullanıcılar içinde displayName slug'ı ile eşleştir
    const allUsersSnap = await getDocs(usersCol);
    for (const d of allUsersSnap.docs) {
      const raw = d.data() as UserProfile;
      const docSlug = toUsernameSlug(raw.username || raw.displayName);
      if (
        docSlug === targetSlug ||
        (raw.displayName && raw.displayName.trim().toLowerCase() === decoded.toLowerCase())
      ) {
        const data: UserProfile = {
          ...raw,
          uid: raw.uid || d.id,
          username: docSlug,
        };
        // Eksik username alanını arka planda tamamla
        if (!raw.username) {
          setDoc(doc(firestore, "users", data.uid), { username: docSlug }, { merge: true }).catch(() => {});
        }
        if (typeof window !== "undefined") {
          localStorage.setItem(`${PROFILE_CACHE_PREFIX}${data.uid}`, JSON.stringify(data));
          localStorage.setItem(`${PROFILE_CACHE_PREFIX}${docSlug}`, JSON.stringify(data));
        }
        return data;
      }
    }
  } catch (err) {
    console.warn("Firestore user profile fetch warning:", err);
  }

  // 2. LocalStorage Cache Fallback (hem raw anahtar hem slug ile kontrol)
  if (typeof window !== "undefined") {
    try {
      const cached =
        localStorage.getItem(`${PROFILE_CACHE_PREFIX}${decoded}`) ||
        localStorage.getItem(`${PROFILE_CACHE_PREFIX}${targetSlug}`);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch {}
  }

  // 3. Topluluğun Kurucu / Seed Üyeleri Kontrolü (Hem UID hem Kullanıcı Adı Slug ile)
  const matchedSeedEntry = Object.entries(SEED_COMMUNITY_USERS).find(([seedKey, seedVal]) => {
    return (
      seedKey === decoded ||
      seedVal.uid === decoded ||
      toUsernameSlug(seedVal.username || seedVal.displayName) === targetSlug
    );
  });

  if (matchedSeedEntry) {
    const [seedKey, seed] = matchedSeedEntry;
    const resolvedUid = seed.uid || seedKey;
    const resolvedUsername = toUsernameSlug(seed.username || seed.displayName);
    const seedProfile: UserProfile = {
      uid: resolvedUid,
      username: resolvedUsername,
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
    setDoc(doc(firestore, "users", resolvedUid), seedProfile, { merge: true }).catch(() => {});
    if (typeof window !== "undefined") {
      localStorage.setItem(`${PROFILE_CACHE_PREFIX}${resolvedUid}`, JSON.stringify(seedProfile));
      localStorage.setItem(`${PROFILE_CACHE_PREFIX}${resolvedUsername}`, JSON.stringify(seedProfile));
    }
    return seedProfile;
  }

  // 4. Mevcut Firebase Auth oturumundan temel profil oluştur
  const currentUser = auth.currentUser;
  if (
    currentUser &&
    (currentUser.uid === decoded ||
      toUsernameSlug(currentUser.displayName || "") === targetSlug)
  ) {
    const fallbackName =
      currentUser.displayName || (currentUser.isAnonymous ? "Misafir Düşünür" : "PsikoWay Üyesi");
    const fallbackProfile: UserProfile = {
      uid: currentUser.uid,
      username: toUsernameSlug(fallbackName),
      email: currentUser.email || "",
      displayName: fallbackName,
      photoURL: currentUser.photoURL || "",
      profession: "Düşünce Kaşifi",
      bio: "Psikoloji ve insan zihnini keşfetmeyi seven bir topluluk üyesi.",
      instagram: "",
      youtube: "",
      createdAt: new Date().toISOString(),
      isAnonymous: currentUser.isAnonymous,
    };
    setDoc(doc(firestore, "users", currentUser.uid), fallbackProfile, { merge: true }).catch(() => {});
    return fallbackProfile;
  }

  // 5. Forum gönderilerinde veya yorumlarında bu yazar var mı? (Hem authorId hem authorName slug ile)
  const posts = getStoredPosts();
  const authorPost = posts.find(
    (p) =>
      !p.isAnonymous &&
      (p.authorId === decoded || toUsernameSlug(p.authorName) === targetSlug)
  );
  if (authorPost) {
    const postFallbackProfile: UserProfile = {
      uid: authorPost.authorId,
      username: toUsernameSlug(authorPost.authorName),
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

  // Yorum yazarlarından da kontrol et
  for (const p of posts) {
    const matchedComm = (p.comments || []).find(
      (c) =>
        !c.isAnonymous &&
        (c.authorId === decoded || toUsernameSlug(c.authorName) === targetSlug)
    );
    if (matchedComm) {
      return {
        uid: matchedComm.authorId,
        username: toUsernameSlug(matchedComm.authorName),
        email: "",
        displayName: matchedComm.authorName || "PsikoWay Düşünürü",
        photoURL: matchedComm.authorAvatar || undefined,
        profession: matchedComm.authorProfession || "Düşünce Kaşifi",
        bio: "PsikoWay düşünce topluluğu üyesi.",
        instagram: "",
        youtube: "",
        createdAt: matchedComm.createdAt || new Date().toISOString(),
        isAnonymous: false,
      };
    }
  }

  return null;
};

/**
 * Kullanıcı profilini Cloud Firestore'a kaydeder.
 * (Realtime Database artık kullanıcılar için kullanılmaz, sadece forum mesajları içindir)
 */
export const saveUserProfile = async (profile: UserProfile): Promise<UserProfile> => {
  if (!profile.uid) throw new Error("Kullanıcı ID'si eksik.");

  const resolvedDisplayName = (profile.displayName || "PsikoWay Üyesi").trim();
  const resolvedUsername = toUsernameSlug(profile.username || resolvedDisplayName);

  // Firestore "undefined" alanları kabul etmez. Tüm alanları eksiksiz ve geçerli tiplerle hazırlarız:
  const cleanProfile: UserProfile = {
    uid: profile.uid,
    username: resolvedUsername,
    email: (profile.email || "").trim(),
    displayName: resolvedDisplayName,
    photoURL: profile.photoURL || "",
    profession: (profile.profession || "Düşünce Kaşifi").trim(),
    bio: (profile.bio || "").trim(),
    instagram: (profile.instagram || "").trim(),
    youtube: (profile.youtube || "").trim(),
    createdAt: profile.createdAt || new Date().toISOString(),
    isAnonymous: Boolean(profile.isAnonymous),
    isBanned: Boolean(profile.isBanned),
    banReason: profile.banReason || "",
    bannedAt: profile.bannedAt || "",
    bannedBy: profile.bannedBy || "",
    role: profile.role || "",
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
    console.log(`[Firestore] Kullanıcı başarıyla kaydedildi: ${cleanProfile.displayName} (@${cleanProfile.username})`);
  } catch (err) {
    console.error("Firestore profile save error:", err);
    throw err;
  }

  // 3. LocalStorage'a kaydet
  if (typeof window !== "undefined") {
    localStorage.setItem(`${PROFILE_CACHE_PREFIX}${profile.uid}`, JSON.stringify(cleanProfile));
    if (cleanProfile.username) {
      localStorage.setItem(`${PROFILE_CACHE_PREFIX}${cleanProfile.username}`, JSON.stringify(cleanProfile));
    }
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
 * Seed düşünürleri ve topluluk kurucu üyelerini de eksiksiz listeye dahil eder.
 */
export const getAllUsersFromFirestore = async (): Promise<UserProfile[]> => {
  const userMap = new Map<string, UserProfile>();

  // 1. Topluluk Çekirdek / Seed Kullanıcıları Önceden Ekle
  Object.values(SEED_COMMUNITY_USERS).forEach((seed) => {
    if (seed.uid) {
      userMap.set(seed.uid, {
        uid: seed.uid,
        email: seed.email || "",
        displayName: seed.displayName || "PsikoWay Düşünürü",
        photoURL: seed.photoURL || "",
        profession: seed.profession || "Düşünce Kaşifi",
        bio: seed.bio || "",
        instagram: seed.instagram || "",
        youtube: seed.youtube || "",
        createdAt: seed.createdAt || "2026-10-01T00:00:00Z",
        isAnonymous: false,
        isBanned: false,
      });
    }
  });

  // 2. Cloud Firestore 'users' koleksiyonunu çek ve üzerine yaz (gerçek güncel veriler)
  try {
    const usersCol = collection(firestore, "users");
    const snap = await getDocs(usersCol);
    snap.forEach((d) => {
      const data = d.data() as UserProfile;
      userMap.set(d.id, {
        ...data,
        uid: d.id,
        isBanned: Boolean(data.isBanned),
        banReason: data.banReason || "",
        bannedAt: data.bannedAt || "",
        bannedBy: data.bannedBy || "",
      });
    });
  } catch (err) {
    console.warn("getAllUsersFromFirestore warning:", err);
  }

  // Tarihe göre sırala (en yeni kayıtlar en başta)
  const allList = Array.from(userMap.values());
  allList.sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });

  return allList;
};


export const getUserCommunityStats = (uid: string, displayNameOrSlug?: string): UserStats => {
  const posts = getStoredPosts();
  const targetSlug = displayNameOrSlug ? toUsernameSlug(displayNameOrSlug) : toUsernameSlug(uid);
  let postsCount = 0;
  let commentsCount = 0;
  let likesReceived = 0;

  posts.forEach((p) => {
    const isAuthor =
      p.authorId === uid ||
      (!p.isAnonymous && toUsernameSlug(p.authorName) === targetSlug);
    if (isAuthor) {
      postsCount++;
      likesReceived += p.likes.length;
    }
    p.comments.forEach((c) => {
      const isCommentAuthor =
        c.authorId === uid ||
        (!c.isAnonymous && toUsernameSlug(c.authorName) === targetSlug);
      if (isCommentAuthor) {
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

export const getUserPosts = (
  uid: string,
  includeAnonymous: boolean = false,
  displayNameOrSlug?: string
): ForumPost[] => {
  const posts = getStoredPosts();
  const localShadow = getLocalShadowPosts();
  const targetSlug = displayNameOrSlug ? toUsernameSlug(displayNameOrSlug) : toUsernameSlug(uid);
  const map = new Map<string, ForumPost>();
  posts.forEach((p) => map.set(p.id, p));
  localShadow.forEach((lp) => {
    if (!map.has(lp.id)) map.set(lp.id, lp);
  });
  const all = Array.from(map.values());
  return all.filter((p) => {
    if (!includeAnonymous && p.isAnonymous) return false;
    return (
      p.authorId === uid ||
      (!p.isAnonymous && toUsernameSlug(p.authorName) === targetSlug)
    );
  });
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
