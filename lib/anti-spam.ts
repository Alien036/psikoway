import { doc, getDoc, setDoc, collection, onSnapshot, updateDoc, deleteDoc } from "firebase/firestore";
import { firestore } from "./firebase";
import { SecurityAlert } from "../types/admin";

const FINGERPRINT_KEY = "psikoway_client_fingerprint_v1";
const SHADOWBAN_KEY = "psikoway_shadowbanned_v1";
const WRITE_TIMESTAMPS_KEY = "psikoway_write_timestamps_v1";
const ALERTS_COLLECTION = "moderation_alerts";
const ALERTS_CACHE_KEY = "psikoway_security_alerts_cache_v1";

// 1 Dakika İçinde İzin Verilen Maksimum Yazma Sayısı (2 defadan fazla yazan direkt kısıtlanır)
export const MAX_WRITES_PER_MINUTE = 2;
export const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 60 saniye

/**
 * İstemci Parmak İzi (Tarayıcıyı oturum kapansa bile benzersiz tanımak için)
 */
export const getClientFingerprint = (): string => {
  if (typeof window === "undefined") return "server-client";
  try {
    let fp = localStorage.getItem(FINGERPRINT_KEY);
    if (!fp) {
      fp = `fp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem(FINGERPRINT_KEY, fp);
    }
    return fp;
  } catch {
    return "guest-client";
  }
};

/**
 * Kullanıcı Yerel Olarak Gölge Kısıtlı mı? (Senkron hızlı kontrol)
 */
export const isUserShadowbanned = (userId?: string): boolean => {
  if (typeof window === "undefined") return false;
  try {
    // 1. Tarayıcı parmak izi kontrolü
    const localFlag = localStorage.getItem(SHADOWBAN_KEY);
    if (localFlag === "true") return true;

    // 2. Yasaklı listesi kontrolü
    const cachedAlerts = localStorage.getItem(ALERTS_CACHE_KEY);
    if (cachedAlerts && userId) {
      const list: SecurityAlert[] = JSON.parse(cachedAlerts);
      const isRestricted = list.some(
        (a) => (a.userId === userId || a.clientFingerprint === getClientFingerprint()) && a.status === "shadowbanned"
      );
      if (isRestricted) return true;
    }
  } catch {}
  return false;
};

/**
 * Kullanıcıyı Gölge Kısıtla (Shadowban)
 */
export const setShadowbannedLocally = (status: boolean): void => {
  if (typeof window === "undefined") return;
  try {
    if (status) {
      localStorage.setItem(SHADOWBAN_KEY, "true");
    } else {
      localStorage.removeItem(SHADOWBAN_KEY);
    }
  } catch {}
};

/**
 * RATE LIMIT KONTROLÜ (Dakikada 2'den fazla yazanı direkt kısıtlar)
 * 
 * Dönüş:
 * - isAllowed: Mesajın genele açılıp açılamayacağı
 * - isShadowbanned: Kullanıcının gölge kısıtlı olup olmadığı
 * - reason: Tespit gerekçesi
 */
export const checkAndEnforceRateLimit = async (params: {
  userId: string;
  userName: string;
  actionType: "post" | "comment";
  contentSnippet: string;
  postTitle?: string;
}): Promise<{ isAllowed: boolean; isShadowbanned: boolean; reason?: string }> => {
  if (typeof window === "undefined") {
    return { isAllowed: true, isShadowbanned: false };
  }

  const now = Date.now();
  const fp = getClientFingerprint();

  // 1. Kullanıcı zaten önceden gölge kısıtlanmış mı?
  if (isUserShadowbanned(params.userId)) {
    // Zaten kısıtlı -> Sessizce içeriği gölgeye yönlendir, admin bildirimini güncelle
    await recordSecurityAlert({
      id: `alert-${now}-${Math.random().toString(36).substring(2, 6)}`,
      userId: params.userId,
      clientFingerprint: fp,
      userName: params.userName,
      reason: "Gölge Kısıtlı Kullanıcı Tekrar Mesaj Gönderme Girişimi (Yazı Başarıyla Engellendi)",
      actionType: params.actionType,
      contentSnippet: params.contentSnippet.substring(0, 300),
      postTitle: params.postTitle,
      timestamp: new Date().toISOString(),
      status: "shadowbanned",
      attemptsInWindow: 3,
    });

    return {
      isAllowed: false,
      isShadowbanned: true,
      reason: "Kullanıcı gölge kısıtlama altında.",
    };
  }

  // 2. Son 60 saniyedeki yazma zamanlarını oku
  let timestamps: number[] = [];
  try {
    const raw = localStorage.getItem(WRITE_TIMESTAMPS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // 60 saniyeden eski olanları filtrele
        timestamps = parsed.filter((t: number) => now - t < RATE_LIMIT_WINDOW_MS);
      }
    }
  } catch {}

  // Bu yeni yazma girişimini ekle
  timestamps.push(now);

  // Güncellenmiş listeyi kaydet
  try {
    localStorage.setItem(WRITE_TIMESTAMPS_KEY, JSON.stringify(timestamps));
  } catch {}

  // 3. EŞİK KONTROLÜ: Son 60 saniyede yazma sayısı MAX_WRITES_PER_MINUTE (2)'den büyük mü?
  // Yani dakikada 2 defa yazdıktan sonra 3. yazışta doğrudan erişim sınırı devreye girer!
  if (timestamps.length > MAX_WRITES_PER_MINUTE) {
    // DİREKT ERİŞİM SINIRI GETİR (SHADOWBAN)
    setShadowbannedLocally(true);

    const alertId = `alert-${now}-${Math.random().toString(36).substring(2, 6)}`;
    const reasonText = `Dakikada ${MAX_WRITES_PER_MINUTE} kuralı aşıldı! Son 60 saniyede ${timestamps.length}. yazma girişimi tespit edildi (Bot / Seri Spam Koruması).`;

    await recordSecurityAlert({
      id: alertId,
      userId: params.userId,
      clientFingerprint: fp,
      userName: params.userName,
      reason: reasonText,
      actionType: params.actionType,
      contentSnippet: params.contentSnippet.substring(0, 300),
      postTitle: params.postTitle,
      timestamp: new Date().toISOString(),
      status: "shadowbanned",
      attemptsInWindow: timestamps.length,
    });

    console.warn(`[Bot Koruması] Erişim sınırı getirildi: ${params.userName} (FP: ${fp})`);

    return {
      isAllowed: false,
      isShadowbanned: true,
      reason: reasonText,
    };
  }

  // Normal izin verilen işlem
  return {
    isAllowed: true,
    isShadowbanned: false,
  };
};

/**
 * Güvenlik ve Bot Bildirimini Firestore'a Kaydet
 */
export const recordSecurityAlert = async (alert: SecurityAlert): Promise<void> => {
  // Yerel önbelleğe yaz
  try {
    const cached = localStorage.getItem(ALERTS_CACHE_KEY);
    let list: SecurityAlert[] = cached ? JSON.parse(cached) : [];
    list = [alert, ...list.filter((a) => a.id !== alert.id)].slice(0, 50);
    localStorage.setItem(ALERTS_CACHE_KEY, JSON.stringify(list));
  } catch {}

  // Cloud Firestore'a yaz (Admin paneli anında bildirim alsın)
  try {
    const alertRef = doc(firestore, ALERTS_COLLECTION, alert.id);
    await setDoc(alertRef, {
      ...alert,
      createdAtServer: new Date(),
    });
  } catch (err) {
    console.warn("Firestore record security alert warning:", err);
  }
};

/**
 * Tüm Güvenlik ve Bot Bildirimlerini Getir (Admin Paneli İçin)
 */
export const getSecurityAlerts = async (): Promise<SecurityAlert[]> => {
  try {
    // Firestore'dan çekmeyi dene
    const { getDocs, query, orderBy, limit } = await import("firebase/firestore");
    const q = query(collection(firestore, ALERTS_COLLECTION), limit(100));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const list: SecurityAlert[] = [];
      snapshot.forEach((d) => {
        list.push(d.data() as SecurityAlert);
      });
      list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      if (typeof window !== "undefined") {
        localStorage.setItem(ALERTS_CACHE_KEY, JSON.stringify(list));
      }
      return list;
    }
  } catch (err) {
    console.warn("Firestore getSecurityAlerts fetch warning:", err);
  }

  // Yerel önbellek fallback
  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem(ALERTS_CACHE_KEY);
      if (cached) return JSON.parse(cached);
    } catch {}
  }
  return [];
};

/**
 * Admin: Kullanıcının Gölge Erişim Kısıtlamasını Kaldır (Un-shadowban)
 */
export const unshadowbanUser = async (targetId: string, alertId?: string): Promise<void> => {
  if (typeof window !== "undefined") {
    if (getClientFingerprint() === targetId) {
      setShadowbannedLocally(false);
      localStorage.removeItem(WRITE_TIMESTAMPS_KEY);
    }
    try {
      const cached = localStorage.getItem(ALERTS_CACHE_KEY);
      if (cached) {
        const list: SecurityAlert[] = JSON.parse(cached);
        const updated = list.map((a) =>
          a.userId === targetId || a.clientFingerprint === targetId || a.id === alertId
            ? { ...a, status: "resolved" as const }
            : a
        );
        localStorage.setItem(ALERTS_CACHE_KEY, JSON.stringify(updated));
      }
    } catch {}
  }

  if (alertId) {
    try {
      const alertRef = doc(firestore, ALERTS_COLLECTION, alertId);
      await updateDoc(alertRef, { status: "resolved" });
    } catch (e) {
      console.warn("Firestore unshadowban alert update error:", e);
    }
  }
};

/**
 * Admin: Güvenlik Bildirimini Sil
 */
export const deleteSecurityAlert = async (alertId: string): Promise<void> => {
  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem(ALERTS_CACHE_KEY);
      if (cached) {
        const list: SecurityAlert[] = JSON.parse(cached);
        const updated = list.filter((a) => a.id !== alertId);
        localStorage.setItem(ALERTS_CACHE_KEY, JSON.stringify(updated));
      }
    } catch {}
  }

  try {
    const alertRef = doc(firestore, ALERTS_COLLECTION, alertId);
    await deleteDoc(alertRef);
  } catch (e) {
    console.warn("Firestore alert delete warning:", e);
  }
};

/**
 * CANLI (REALTIME) GÜVENLİK BİLDİRİMLERİ ABONELİĞİ (Admin Paneli İçin)
 */
export const subscribeToSecurityAlerts = (
  callback: (alerts: SecurityAlert[]) => void
): (() => void) => {
  // İlk önce önbellekten ver
  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem(ALERTS_CACHE_KEY);
      if (cached) callback(JSON.parse(cached));
    } catch {}
  }

  try {
    const colRef = collection(firestore, ALERTS_COLLECTION);
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: SecurityAlert[] = [];
          snapshot.forEach((d) => {
            list.push(d.data() as SecurityAlert);
          });
          list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          if (typeof window !== "undefined") {
            localStorage.setItem(ALERTS_CACHE_KEY, JSON.stringify(list));
          }
          callback(list);
        } else {
          callback([]);
        }
      },
      (err) => {
        console.warn("Security alerts onSnapshot warning:", err);
      }
    );
    return unsubscribe;
  } catch (e) {
    console.warn("Security alerts subscribe error:", e);
    return () => {};
  }
};
