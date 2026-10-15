import { doc, getDoc, setDoc, collection, onSnapshot, updateDoc, deleteDoc } from "firebase/firestore";
import { firestore } from "./firebase";
import { SecurityAlert } from "../types/admin";

const FINGERPRINT_KEY = "psikoway_client_fingerprint_v1";
const SHADOWBAN_KEY = "psikoway_shadowbanned_v1";
const SHADOWBAN_UNTIL_KEY = "psikoway_shadowbanned_until_v1";
const BOT_TRAP_KEY = "psikoway_bot_trap_v1";
const WRITE_TIMESTAMPS_KEY = "psikoway_write_timestamps_v1";
const ALERTS_COLLECTION = "moderation_alerts";
const ALERTS_CACHE_KEY = "psikoway_security_alerts_cache_v1";

// 1 Dakika İçinde İzin Verilen Maksimum Yazma Sayısı (Art arda bot gibi seri spam yapanları sınırlar)
export const MAX_WRITES_PER_MINUTE = 6;
export const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 60 saniye
export const RATE_LIMIT_COOLDOWN_MS = 60 * 1000; // 60 saniye geçici bekleme

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
    const now = Date.now();

    // 1. Kalıcı Honeypot Bal Küpü Tuzağı (Yalnızca gerçek botlar için)
    const permanentBotTrap = localStorage.getItem(BOT_TRAP_KEY);
    if (permanentBotTrap === "true") return true;

    // 2. Geçici Hız Sınırı (Cooldown) Kontrolü
    const untilStr = localStorage.getItem(SHADOWBAN_UNTIL_KEY);
    if (untilStr) {
      const until = parseInt(untilStr, 10);
      if (now < until) return true;
      // Cooldown süresi dolduysa bayrakları otomatik kaldır
      localStorage.removeItem(SHADOWBAN_UNTIL_KEY);
      localStorage.removeItem(SHADOWBAN_KEY);
    }

    // 3. Admin Tarafından Verilmiş Aktif Yasaklı Bildirimi Kontrolü
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
export const setShadowbannedLocally = (status: boolean, durationMs?: number): void => {
  if (typeof window === "undefined") return;
  try {
    if (status) {
      if (durationMs) {
        localStorage.setItem(SHADOWBAN_UNTIL_KEY, String(Date.now() + durationMs));
      } else {
        localStorage.setItem(BOT_TRAP_KEY, "true");
      }
      localStorage.setItem(SHADOWBAN_KEY, "true");
    } else {
      localStorage.removeItem(SHADOWBAN_KEY);
      localStorage.removeItem(SHADOWBAN_UNTIL_KEY);
      localStorage.removeItem(BOT_TRAP_KEY);
      localStorage.removeItem(WRITE_TIMESTAMPS_KEY);
    }
  } catch {}
};

/**
 * RATE LIMIT KONTROLÜ
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

  // 1. Kullanıcı aktif bir gölge kısıtlama altında mı?
  if (isUserShadowbanned(params.userId)) {
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

  // 3. EŞİK KONTROLÜ: Son 60 saniyede yazma sayısı MAX_WRITES_PER_MINUTE'den büyük mü?
  if (timestamps.length > MAX_WRITES_PER_MINUTE) {
    // 60 SANİYELİK GEÇİCİ BEKLEME (Kalıcı ban yerine geçici cooldown)
    setShadowbannedLocally(true, RATE_LIMIT_COOLDOWN_MS);

    const alertId = `alert-${now}-${Math.random().toString(36).substring(2, 6)}`;
    const reasonText = `Dakikada ${MAX_WRITES_PER_MINUTE} kuralı aşıldı! Son 60 saniyede ${timestamps.length}. yazma girişimi tespit edildi (Geçici Spam Koruması).`;

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

    console.warn(`[Bot Koruması] Geçici hız sınırı getirildi: ${params.userName} (FP: ${fp})`);

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
    setShadowbannedLocally(false);
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

  // Kullanıcının Firestore'daki gönderilerinin de gölge kısıtlamasını kaldır
  try {
    const { query, where, getDocs } = await import("firebase/firestore");
    const q = query(collection(firestore, "forum_posts"), where("authorId", "==", targetId));
    const snap = await getDocs(q);
    for (const d of snap.docs) {
      if (d.data().isShadowbanned) {
        await updateDoc(doc(firestore, "forum_posts", d.id), { isShadowbanned: false });
      }
    }
  } catch (e) {
    console.warn("Firestore unshadowban posts update warning:", e);
  }
};

/**
 * Belirli bir gönderinin gölge kısıtlamasını doğrudan kaldırır ve yayına alır
 */
export const unshadowbanPost = async (postId: string): Promise<void> => {
  try {
    const postRef = doc(firestore, "forum_posts", postId);
    await updateDoc(postRef, { isShadowbanned: false });
  } catch (err) {
    console.warn("Firestore unshadowbanPost warning:", err);
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

// ========================================================
// 3. HONEYPOT (BAL KÜPÜ) BOT TUZAĞI KORUMASI
// ========================================================
/**
 * Honeypot Bal Küpü Tuzağı:
 * Botlar formlardaki gizli alanları otomatik doldurur.
 * Doldurulduğu an kullanıcı hem tarayıcı hem Firestore düzeyinde kalıcı olarak
 * gölge kısıtlanır (shadowbanned) ve işlem engellenir.
 */
export const triggerHoneypotTrap = async (params: {
  userId?: string;
  userName?: string;
  actionType: "post" | "comment" | "register" | "honeypot";
  honeypotValue: string;
}): Promise<never> => {
  setShadowbannedLocally(true);
  const now = Date.now();
  const fp = getClientFingerprint();

  await recordSecurityAlert({
    id: `alert-honeypot-${now}-${Math.random().toString(36).substring(2, 6)}`,
    userId: params.userId || "bot-honeypot-user",
    clientFingerprint: fp,
    userName: params.userName || "Şüpheli Bot / Form Tarayıcı",
    reason: `Honeypot (Bal Küpü) tuzağı tetiklendi! Gizli sahte 'website_url' alanına otomatik bot verisi yazıldı: "${params.honeypotValue.slice(0, 50)}"`,
    actionType: params.actionType === "register" ? "register" : params.actionType,
    contentSnippet: `[Bal Küpü Tuzağı] Otomatik form tarayıcı bot engellendi. Alan: website_url`,
    timestamp: new Date().toISOString(),
    status: "shadowbanned",
    attemptsInWindow: 99,
  });

  throw new Error("Güvenlik doğrulaması başarısız oldu (Honeypot Bot Koruması).");
};

// ========================================================
// 4. XSS & TEHLİKELİ HTML/SCRIPT ETİKETLERİNİ TEMİZLEME
// ========================================================
/**
 * Gönderi ve yorum içeriklerindeki tehlikeli HTML/script etiketlerini temizleyen sanitization fonksiyonu
 */
export const sanitizeContent = (input: string): string => {
  if (!input) return "";

  let cleaned = input;

  // 1. Script, iframe, object, embed, style etiketlerini gövdesiyle birlikte kaldır
  cleaned = cleaned.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  cleaned = cleaned.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "");
  cleaned = cleaned.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "");
  cleaned = cleaned.replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, "");
  cleaned = cleaned.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");

  // 2. Tehlikeli protokol ve event handler'ları etkisizleştir
  cleaned = cleaned.replace(/javascript:/gi, "blocked-javascript:");
  cleaned = cleaned.replace(/data:\s*text\/html/gi, "blocked-data-html:");
  cleaned = cleaned.replace(/vbscript:/gi, "blocked-vbscript:");
  cleaned = cleaned.replace(/\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, " data-blocked-attr=1");

  // 3. Raw HTML taglerini güvenli metne dönüştür
  cleaned = cleaned.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  return cleaned.trim();
};

// ========================================================
// 5. GEÇİCİ E-POSTA (TEMP-MAIL) KORUMASI
// ========================================================
export const DISPOSABLE_EMAIL_DOMAINS = new Set([
  "tempmail.com", "temp-mail.org", "temp-mail.io", "tempmailo.com",
  "yopmail.com", "yopmail.fr", "yopmail.net",
  "10minutemail.com", "10minutemail.net", "10minute.email",
  "guerrillamail.com", "guerrillamail.net", "guerrillamail.org", "sharklasers.com", "grr.la",
  "mailinator.com", "mailinater.com",
  "throwawaymail.com", "fakemailgenerator.com", "dispostable.com",
  "trashmail.com", "trashmail.net", "mohmal.com", "dropmail.me",
  "getairmail.com", "emailondeck.com", "crazymailing.com", "burnermail.io",
  "generator.email", "nada.ltd", "inboxkitten.com", "mytemp.email"
]);

/**
 * Bilinen geçici e-posta servislerini kontrol eder.
 */
export const isDisposableEmail = (email: string): boolean => {
  if (!email || !email.includes("@")) return false;
  const parts = email.split("@");
  if (parts.length < 2) return false;
  const domain = parts[1].trim().toLowerCase();
  if (!domain) return false;

  if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) return true;
  for (const blocked of DISPOSABLE_EMAIL_DOMAINS) {
    if (domain === blocked || domain.endsWith(`.${blocked}`) || domain.includes(blocked)) {
      return true;
    }
  }
  return false;
};

// ========================================================
// 6. DIŞ BAĞLANTI (LINK) SPAM SINIRLANDIRMASI
// ========================================================
/**
 * Kullanıcıların paylaşımlarında art arda dış bağlantı (http/https) paylaşmasını sınırlar.
 */
export const checkExternalLinkLimit = (
  content: string,
  maxLinks: number = 2
): { isAllowed: boolean; linkCount: number; reason?: string } => {
  if (!content) return { isAllowed: true, linkCount: 0 };
  const linkMatches = content.match(/https?:\/\/[^\s]+/gi) || [];
  const linkCount = linkMatches.length;

  if (linkCount > maxLinks) {
    return {
      isAllowed: false,
      linkCount,
      reason: `Topluluk ve spam güvenliği nedeniyle bir paylaşımda en fazla ${maxLinks} adet web bağlantısına izin verilir (Tespit edilen: ${linkCount}).`,
    };
  }

  return { isAllowed: true, linkCount };
};

// ========================================================
// 7. KRİZ VE AĞIR İHLAL FİLTRESİ (PSİKOLOJİ FORUMU GÜVENLİĞİ)
// ========================================================
// Ağır hakaret ve saygısızlık kalıpları
const SEVERE_PROFANITY_PATTERNS = [
  /\b(o[çc]|o\.ç\.|orospu|orospuçocuğu|piç|sik[a-z]*|sikerim|sikeyim|amk|aq|amına|amını|yarrak|yarak|götlek|ibne|kahpe)\b/i,
  /\b(pezevenk|götveren|amcık)\b/i,
];

/**
 * Ağır hakaret ve küfür kontrolü
 */
export const checkProfanityAndHarassment = (
  text: string
): { hasViolation: boolean; reason?: string } => {
  if (!text) return { hasViolation: false };

  for (const pattern of SEVERE_PROFANITY_PATTERNS) {
    if (pattern.test(text)) {
      return {
        hasViolation: true,
        reason: "Paylaşımınız topluluk kurallarımıza aykırı ve kırıcı ifadeler içermektedir. Lütfen yapıcı ve saygılı bir dil kullanın.",
      };
    }
  }

  return { hasViolation: false };
};

export interface CrisisHelpInfo {
  title: string;
  message: string;
  emergencyNumbers: Array<{ label: string; number: string; description: string }>;
}

// Akut kriz, kendine zarar verme ve intihar eğilimi anahtar kelimeleri
const CRISIS_PATTERNS = [
  /\b(intihar|intiharı|intihara|intihar\s+et)\b/i,
  /\b(kendime\s+zarar|canıma\s+kıy|canıma\s+kıyma|canıma\s+kıyacağım|canıma\s+kıymak)\b/i,
  /\b(ölmek\s+istiyorum|yaşamak\s+istemiyorum|yaşamıma\s+son|hayatıma\s+son)\b/i,
  /\b(kendimi\s+öldür|kendimi\s+asmak|kendimi\s+as|kendimi\s+vur|bileklerimi\s+kes)\b/i,
];

/**
 * Psikoloji forumu kriz ve akut kendine zarar verme algılayıcısı:
 * Kendine zarar verme veya akut kriz belirtildiğinde tespit eder,
 * moderasyona kriz bildirimi gönderir ve kullanıcıya 112 gibi acil destek hatlarını sunar.
 */
export const checkCrisisAndSelfHarm = (
  text: string
): { isCrisisDetected: boolean; crisisHelp?: CrisisHelpInfo; reason?: string } => {
  if (!text) return { isCrisisDetected: false };

  for (const pattern of CRISIS_PATTERNS) {
    if (pattern.test(text)) {
      return {
        isCrisisDetected: true,
        reason: "İçerikte kendine zarar verme veya akut psikolojik kriz ifadeleri tespit edildi.",
        crisisHelp: {
          title: "Yalnız Değilsiniz, Size Destek Olmak İstiyoruz",
          message:
            "Şu an çok zor veya bunaltıcı duygular yaşıyor olabilirsiniz. Unutmayın ki bu acıyı tek başınıza taşımak zorunda değilsiniz. Uzmanlar ve acil destek hatları size ücretsiz ve 7/24 destek sağlamak için hazırdır.",
          emergencyNumbers: [
            {
              label: "112 Acil Çağrı Merkezi",
              number: "112",
              description: "Hayati tehlike ve acil sağlık durumlarında 7/24 ücretsiz arayabilirsiniz.",
            },
            {
              label: "Sağlık Bakanlığı MHRS & Psikiyatri Randevu",
              number: "182",
              description: "Ruh sağlığı uzmanı ve psikiyatrist randevuları için arayabilirsiniz.",
            },
            {
              label: "Aile ve Sosyal Hizmetler Destek Hattı",
              number: "183",
              description: "Kadın, çocuk ve aileler için 7/24 psikososyal destek hattı.",
            },
          ],
        },
      };
    }
  }

  return { isCrisisDetected: false };
};

