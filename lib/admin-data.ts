import { 
  collection,
  doc, 
  getDoc, 
  getDocs,
  setDoc, 
  updateDoc, 
  deleteDoc,
  onSnapshot,
  query,
  where
} from "firebase/firestore";
import { firestore } from "./firebase";
import { BannedUser, UserWarning } from "../types/admin";
import { 
  getStoredPosts, 
  saveStoredPosts, 
  deleteLocalShadowPost,
  markPostDeletedLocally,
  markCommentDeletedLocally
} from "./forum-data";
import { ForumPost } from "../types/forum";

const DEFAULT_ADMIN_PASSWORD = "12345678";
const PASSWORD_CACHE_KEY = "psikoway_admin_password_v1";
const BANNED_USERS_CACHE_KEY = "psikoway_banned_users_v1";
const WARNINGS_CACHE_KEY = "psikoway_user_warnings_v1";
const ADMIN_SESSION_KEY = "psikoway_admin_session_v1";

// 1. ŞİFRE İŞLEMLERİ
export const getAdminPassword = async (): Promise<string> => {
  try {
    const passwordDocRef = doc(firestore, "adminConfig", "security");
    const snapshot = await getDoc(passwordDocRef);
    if (snapshot.exists()) {
      const data = snapshot.data();
      const val = data?.password;
      if (typeof val === "string" && val.length > 0) {
        if (typeof window !== "undefined") {
          localStorage.setItem(PASSWORD_CACHE_KEY, val);
        }
        return val;
      }
    } else {
      // Firestore'da henüz şifre yoksa varsayılanı (12345678) Firestore'a kaydet
      try {
        await setDoc(passwordDocRef, { password: DEFAULT_ADMIN_PASSWORD }, { merge: true });
      } catch (e) {
        console.warn("Could not write default admin password to Firestore:", e);
      }
    }
  } catch (err) {
    console.warn("Firestore admin password fetch failed, using fallback:", err);
  }

  // Fallback cache or default
  if (typeof window !== "undefined") {
    const cached = localStorage.getItem(PASSWORD_CACHE_KEY);
    if (cached) return cached;
  }
  return DEFAULT_ADMIN_PASSWORD;
};

export const verifyAdminPassword = async (candidatePassword: string): Promise<boolean> => {
  const currentPassword = await getAdminPassword();
  return candidatePassword.trim() === currentPassword.trim();
};

export const changeAdminPassword = async (newPassword: string): Promise<boolean> => {
  if (!newPassword || newPassword.trim().length < 4) {
    throw new Error("Şifre en az 4 karakter olmalıdır.");
  }
  const cleanPassword = newPassword.trim();

  // Firestore'a yaz
  try {
    const passwordDocRef = doc(firestore, "adminConfig", "security");
    await setDoc(passwordDocRef, { password: cleanPassword }, { merge: true });
  } catch (err) {
    console.warn("Firestore password update failed, saving locally:", err);
  }

  // Yerel hafızaya kaydet
  if (typeof window !== "undefined") {
    localStorage.setItem(PASSWORD_CACHE_KEY, cleanPassword);
  }
  return true;
};

// 2. OTURUM YÖNETİMİ
export const isAdminLoggedIn = (): boolean => {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === "true";
};

export const setAdminLoggedIn = (status: boolean): void => {
  if (typeof window === "undefined") return;
  if (status) {
    sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
  } else {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  }
};

// 3. YASAKLI KULLANICILAR (BAN)
export const getBannedUsers = async (): Promise<BannedUser[]> => {
  // Önce Firestore'dan dene
  try {
    const banDocRef = doc(firestore, "moderation", "bannedUsers");
    const snapshot = await getDoc(banDocRef);
    if (snapshot.exists()) {
      const data = snapshot.data();
      const list: BannedUser[] = Array.isArray(data?.list) ? data.list : [];
      if (typeof window !== "undefined") {
        localStorage.setItem(BANNED_USERS_CACHE_KEY, JSON.stringify(list));
      }
      return list;
    }
  } catch (e) {
    console.warn("Firestore banned users fetch error:", e);
  }

  // Yerel hafızadan çek
  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem(BANNED_USERS_CACHE_KEY);
      if (cached) return JSON.parse(cached);
    } catch {}
  }
  return [];
};

export const banUser = async (
  userId: string,
  userName: string,
  reason: string
): Promise<BannedUser[]> => {
  const currentList = await getBannedUsers();
  const filtered = currentList.filter((u) => u.userId !== userId);
  const newBan: BannedUser = {
    userId,
    userName,
    reason: reason || "Topluluk kurallarını ihlal",
    bannedAt: new Date().toISOString(),
    bannedBy: "Admin",
  };
  const updated = [newBan, ...filtered];

  // 1. moderation/bannedUsers'a toplu liste olarak yaz
  try {
    const banDocRef = doc(firestore, "moderation", "bannedUsers");
    await setDoc(banDocRef, { list: updated }, { merge: true });
  } catch (e) {
    console.warn("Firestore ban save error:", e);
  }

  // 2. banned_users/{userId} dokümanına kaydet
  try {
    const directBanRef = doc(firestore, "banned_users", userId);
    await setDoc(directBanRef, newBan, { merge: true });
  } catch (e) {
    console.warn("Firestore direct ban save error:", e);
  }

  // 3. users/{userId} dokümanında isBanned alanını aktif et
  try {
    const userDocRef = doc(firestore, "users", userId);
    await setDoc(userDocRef, {
      isBanned: true,
      banReason: newBan.reason,
      bannedAt: newBan.bannedAt,
      bannedBy: "Admin",
    }, { merge: true });
  } catch (e) {
    console.warn("Firestore user profile ban update warning:", e);
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(BANNED_USERS_CACHE_KEY, JSON.stringify(updated));
  }
  return updated;
};

export const unbanUser = async (userId: string): Promise<BannedUser[]> => {
  const currentList = await getBannedUsers();
  const updated = currentList.filter((u) => u.userId !== userId);

  // 1. moderation/bannedUsers'dan çıkar
  try {
    const banDocRef = doc(firestore, "moderation", "bannedUsers");
    await setDoc(banDocRef, { list: updated }, { merge: true });
  } catch (e) {
    console.warn("Firestore unban save error:", e);
  }

  // 2. banned_users/{userId} dokümanını sil
  try {
    const directBanRef = doc(firestore, "banned_users", userId);
    await deleteDoc(directBanRef);
  } catch (e) {
    console.warn("Firestore direct ban delete error:", e);
  }

  // 3. users/{userId} dokümanında isBanned alanını false yap
  try {
    const userDocRef = doc(firestore, "users", userId);
    await setDoc(userDocRef, {
      isBanned: false,
      banReason: "",
      bannedAt: null,
      bannedBy: null,
    }, { merge: true });
  } catch (e) {
    console.warn("Firestore user profile unban update warning:", e);
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(BANNED_USERS_CACHE_KEY, JSON.stringify(updated));
  }
  return updated;
};

export const bulkBanUsers = async (
  usersToBan: { id: string; name: string }[],
  reason: string
): Promise<BannedUser[]> => {
  let list = await getBannedUsers();
  for (const target of usersToBan) {
    list = await banUser(target.id, target.name, reason);
  }
  return list;
};

export const bulkUnbanUsers = async (userIds: string[]): Promise<BannedUser[]> => {
  let list = await getBannedUsers();
  for (const uid of userIds) {
    list = await unbanUser(uid);
  }
  return list;
};

export const isUserBannedSync = (userId: string): boolean => {
  if (typeof window === "undefined" || !userId) return false;
  try {
    const cached = localStorage.getItem(BANNED_USERS_CACHE_KEY);
    if (!cached) return false;
    const list: BannedUser[] = JSON.parse(cached);
    return list.some((u) => u.userId === userId);
  } catch {
    return false;
  }
};

// 4. KULLANICI UYARILARI
export const getUserWarnings = async (): Promise<UserWarning[]> => {
  try {
    const warnDocRef = doc(firestore, "moderation", "warnings");
    const snapshot = await getDoc(warnDocRef);
    if (snapshot.exists()) {
      const data = snapshot.data();
      const list: UserWarning[] = Array.isArray(data?.list) ? data.list : [];
      if (typeof window !== "undefined") {
        localStorage.setItem(WARNINGS_CACHE_KEY, JSON.stringify(list));
      }
      return list;
    }
  } catch (e) {
    console.warn("Firestore warnings fetch error:", e);
  }

  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem(WARNINGS_CACHE_KEY);
      if (cached) return JSON.parse(cached);
    } catch {}
  }
  return [];
};

export const sendUserWarning = async (
  userId: string,
  userName: string,
  message: string
): Promise<UserWarning[]> => {
  const current = await getUserWarnings();
  const newWarning: UserWarning = {
    id: `warn-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    userId,
    userName,
    message: message || "Topluluk kurallarına dikkat ediniz.",
    createdAt: new Date().toISOString(),
    isRead: false,
  };
  const updated = [newWarning, ...current];

  try {
    const warnDocRef = doc(firestore, "moderation", "warnings");
    await setDoc(warnDocRef, { list: updated }, { merge: true });
  } catch (e) {
    console.warn("Firestore warning send error:", e);
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(WARNINGS_CACHE_KEY, JSON.stringify(updated));
  }
  return updated;
};

export const deleteUserWarning = async (warningId: string): Promise<UserWarning[]> => {
  const current = await getUserWarnings();
  const updated = current.filter((w) => w.id !== warningId);

  try {
    const warnDocRef = doc(firestore, "moderation", "warnings");
    await setDoc(warnDocRef, { list: updated }, { merge: true });
  } catch (e) {
    console.warn("Firestore warning delete error:", e);
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(WARNINGS_CACHE_KEY, JSON.stringify(updated));
  }
  return updated;
};

export const dismissUserWarning = async (warningId: string): Promise<void> => {
  const current = await getUserWarnings();
  const updated = current.map((w) => (w.id === warningId ? { ...w, isRead: true } : w));
  try {
    const warnDocRef = doc(firestore, "moderation", "warnings");
    await setDoc(warnDocRef, { list: updated }, { merge: true });
  } catch {}
  if (typeof window !== "undefined") {
    localStorage.setItem(WARNINGS_CACHE_KEY, JSON.stringify(updated));
  }
};

// 5. ADMİN İÇERİK SİLME İŞLEMLERİ
export const adminDeletePost = (postId: string): ForumPost[] => {
  deleteLocalShadowPost(postId);
  const current = getStoredPosts();
  if (!postId) return current;
  const updated = current.filter((p) => p.id !== postId);
  saveStoredPosts(updated);
  try {
    const postDocRef = doc(firestore, "forum_posts", postId);
    deleteDoc(postDocRef).catch((e) => console.warn("Admin post delete error:", e));
  } catch (e) {
    console.warn("Admin post delete error:", e);
  }
  return updated;
};

export const adminDeleteComment = (postId: string, commentId: string): ForumPost[] => {
  const current = getStoredPosts();
  if (!postId || !commentId) return current;
  let updatedCommentsList: any[] = [];
  const updated = current.map((p) => {
    if (p.id !== postId) return p;
    const remainingComments = p.comments.filter((c) => c.id !== commentId);
    updatedCommentsList = remainingComments;
    return {
      ...p,
      comments: remainingComments,
    };
  });
  saveStoredPosts(updated);
  try {
    const postDocRef = doc(firestore, "forum_posts", postId);
    updateDoc(postDocRef, { comments: updatedCommentsList }).catch((e) => console.warn("Admin comment delete error:", e));
  } catch (e) {
    console.warn("Admin comment delete error:", e);
  }
  return updated;
};

