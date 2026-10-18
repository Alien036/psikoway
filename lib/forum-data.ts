import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  arrayUnion,
  arrayRemove,
  increment 
} from "firebase/firestore";
import { firestore } from "./firebase";
import { ForumPost, ForumComment } from "../types/forum";
import { 
  checkAndEnforceRateLimit, 
  getClientFingerprint,
  sanitizeContent,
  checkExternalLinkLimit,
  checkProfanityAndHarassment,
  checkCrisisAndSelfHarm,
  recordSecurityAlert
} from "./anti-spam";

const SHADOW_POSTS_STORAGE_KEY = "psikoway_local_shadow_posts_v1";

export const getLocalShadowPosts = (): ForumPost[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SHADOW_POSTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveLocalShadowPost = (post: ForumPost): void => {
  if (typeof window === "undefined") return;
  try {
    const list = getLocalShadowPosts();
    const updated = [post, ...list.filter((p) => p.id !== post.id)];
    localStorage.setItem(SHADOW_POSTS_STORAGE_KEY, JSON.stringify(updated));
  } catch {}
};

export const deleteLocalShadowPost = (postId: string): void => {
  if (typeof window === "undefined") return;
  try {
    const list = getLocalShadowPosts();
    const updated = list.filter((p) => p.id !== postId);
    localStorage.setItem(SHADOW_POSTS_STORAGE_KEY, JSON.stringify(updated));
  } catch {}
};


export const FORUM_CATEGORIES = [
  "Tümü",
  "Psikoloji & Zihin",
  "Günün Sorusu",
  "Fikirler & Teoriler",
  "İlişkiler & Empati",
  "Deneyim & Hikaye",
  "Kitap, Film & Sanat",
  "Kişisel Gelişim",
] as const;

export const INITIAL_FORUM_POSTS: ForumPost[] = [
  {
    id: "post-1",
    title: "Otomatik olumsuz düşünceleri yakaladığınızda ilk uyguladığınız yöntem ne oluyor?",
    content: `Bilişsel Davranışçı Terapi'de (BDT) zihnimizin felaketleştirme, ya hep ya hiç veya zihin okuma gibi düşünce tuzaklarına düştüğünü öğreniyoruz. 

Kendi deneyimimde, kaygılandığım anlarda bir adım geriye çekilip 'Bu düşünce bir gerçek mi, yoksa sadece zihnimin ürettiği bir hipotez mi?' diye sormak çok yardımcı oluyor. 

Siz günlük hayatınızda bu otomatik düşünce döngülerini kırmak için ne tür içsel teknikler veya farkındalık pratikleri uyguluyorsunuz? Birbirimizden öğreneceğimiz çok şey var.`,
    category: "Psikoloji & Zihin",
    tags: ["BDT", "Farkındalık", "OtomatikDüşünceler", "KaygıYönetimi"],
    authorId: "seed-user-1",
    authorName: "Dr. Selin Yılmaz",
    authorAvatar: "",
    authorProfession: "Klinik Psikolog & Psikoterapist",
    authorBio: "Bilişsel Davranışçı Terapi ve şema terapisi üzerine çalışan zihin araştırmacısı.",
    isAnonymous: false,
    createdAt: "2026-10-10T09:30:00Z",
    likes: ["seed-user-2", "seed-user-3", "seed-user-4", "seed-user-5"],
    views: 0,
    isPinned: true,
    comments: [
      {
        id: "comment-1-1",
        postId: "post-1",
        authorId: "seed-user-2",
        authorName: "Kaan Aras",
        authorProfession: "Felsefe Öğretmeni",
        isAnonymous: false,
        content: "Ben 5-4-3-2-1 duyusal topraklanma (grounding) tekniğini kullanıyorum. Zihnim gelecekteki kötü senaryolara koştuğunda hemen o an etrafımdaki 5 nesneye odaklanmak sinir sistemimi sakinleştiriyor.",
        createdAt: "2026-10-10T10:15:00Z",
        likes: ["seed-user-1", "seed-user-4"],
      },
      {
        id: "comment-1-2",
        postId: "post-1",
        authorId: "seed-user-3",
        authorName: "Elif Demir",
        authorProfession: "Yazar & Danışman",
        isAnonymous: false,
        content: "Düşünceleri bir kağıda yazıp karşısına 'Bunun aksini kanıtlayan 3 somut kanıt nedir?' sorusunu cevaplıyorum. Yazıya döküldüğünde zihindeki devasa canavarlar sıradan cümlelere dönüşüyor.",
        createdAt: "2026-10-10T11:40:00Z",
        likes: ["seed-user-1"],
      },
    ],
  },
  {
    id: "post-2",
    title: "Günün Sorusu: Kendinize en son ne zaman gerçekten 'Bugün nasılsın?' diye sordunuz?",
    content: `Gün boyunca onlarca insana nasılsın diyoruz, işleri yetiştiriyoruz, ekranlara bakıyoruz. Ama aynaya bakıp içimizdeki o yorgun veya neşeli parçaya samimiyetle halini sormayı ne kadar sık unutuyoruz?

Bugün bu satırları okurken gözlerinizi 10 saniye kapatın ve kendi bedeninize, kalbinize bu soruyu sorun. Gerçekten nasıl hissediyorsunuz? Paylaşmak isterseniz bu alan tamamen yargısız ve güvenli.`,
    category: "Günün Sorusu",
    tags: ["GününSorusu", "ÖzŞefkat", "İçselHuzur", "DuyguFarkındalığı"],
    authorId: "seed-user-admin",
    authorName: "PsikoWay Moderatör",
    authorProfession: "PsikoWay Editörü",
    isAnonymous: false,
    createdAt: "2026-10-11T08:00:00Z",
    likes: ["seed-user-1", "seed-user-2", "seed-user-6", "seed-user-7", "seed-user-8"],
    views: 0,
    isPinned: true,
    comments: [
      {
        id: "comment-2-1",
        postId: "post-2",
        authorId: "seed-user-6",
        authorName: "Deniz",
        isAnonymous: true,
        content: "Dürüst olmak gerekirse biraz tükenmiş hissediyordum. Ama bu soruyu görünce derin bir nefes aldım ve kendime dinlenmek için izin vermem gerektiğini fark ettim. Teşekkürler bu hatırlatma için.",
        createdAt: "2026-10-11T09:12:00Z",
        likes: ["seed-user-admin", "seed-user-1"],
      },
      {
        id: "comment-2-2",
        postId: "post-2",
        authorId: "seed-user-7",
        authorName: "Cem Berk",
        authorProfession: "Mühendis & Düşünür",
        isAnonymous: false,
        content: "Hızlı tempolu bir haftanın ardından bugün ilk defa kahvemi yavaşça içerken durabildim. Dingin ama biraz düşünceli bir ruh halindeyim.",
        createdAt: "2026-10-11T10:05:00Z",
        likes: ["seed-user-admin"],
      },
    ],
  },
  {
    id: "post-3",
    title: "Carl Jung'un 'Gölge' (Shadow) kavramı: Bastırdığımız yönlerimizle nasıl barışabiliriz?",
    content: `Jung şöyle der: 'Kişi aydınlığı hayal ederek değil, karanlığın bilincine vararak aydınlanır.'

Başkalarında bizi en çok rahatsız eden, öfkelendiren özelliklerin aslında kendi içimizde reddettiğimiz gölge yönlerimizin yansıması (projeksiyonu) olabileceği fikri üzerine ne düşünüyorsunuz? 

Kendi gölgemizle karşılaşmak neden bu kadar sarsıcı ama bir o kadar da özgürleştirici?`,
    category: "Fikirler & Teoriler",
    tags: ["Jung", "GölgeArketipi", "Bilinçdışı", "Psikanaliz"],
    authorId: "seed-user-4",
    authorName: "Mert Karaca",
    authorProfession: "Felsefe Araştırmacısı",
    isAnonymous: false,
    createdAt: "2026-10-09T14:20:00Z",
    likes: ["seed-user-1", "seed-user-3", "seed-user-5"],
    views: 0,
    comments: [
      {
        id: "comment-3-1",
        postId: "post-3",
        authorId: "seed-user-5",
        authorName: "Ayşe Nur",
        authorProfession: "Sosyolog",
        isAnonymous: false,
        content: "Bence insan kusursuz görünme arzusunu bıraktığı anda gölgesiyle dost olabiliyor. Hatalarımızı ve bencil taraflarımızı kabul etmek bizi kötü yapmaz, sadece insan yapar.",
        createdAt: "2026-10-09T16:40:00Z",
        likes: ["seed-user-4"],
      },
    ],
  },
  {
    id: "post-4",
    title: "Mükemmeliyetçilik: Başarı tutkusu mu, yoksa yargılanma korkusunun lüks bir kalkanı mı?",
    content: `Uzun yıllar mükemmeliyetçi olmayı bir başarı erdemi sanıyordum. Ta ki Brené Brown'ın 'Kusursuzluk zırhı' analizini okuyana kadar.

Mükemmeliyetçilik aslında 'Eğer kusursuz görünürsem, kusursuz yaşarsam ve her şeyi kusursuz yaparsam; suçlanmaktan, yargılanmaktan ve utanmaktan korunurum' inancıdır.

Bu zırhı bırakıp 'yeterince iyi' olmaya razı gelmek cesaret istiyor. Siz bu baskıyla nasıl başa çıkıyorsunuz?`,
    category: "Kişisel Gelişim",
    tags: ["Mükemmeliyetçilik", "Özsaygı", "Cesaret", "Kırılganlık"],
    authorId: "seed-user-2",
    authorName: "Kaan Aras",
    authorProfession: "Felsefe Öğretmeni",
    isAnonymous: false,
    createdAt: "2026-10-08T18:15:00Z",
    likes: ["seed-user-1", "seed-user-3", "seed-user-7"],
    views: 0,
    comments: [
      {
        id: "comment-4-1",
        postId: "post-4",
        authorId: "seed-user-1",
        authorName: "Dr. Selin Yılmaz",
        authorProfession: "Klinik Psikolog",
        isAnonymous: false,
        content: "Harika bir tespit Kaan. Klinikte gördüğümüz en yaygın erteleme (procrastination) sebebi de aslında tembellik değil, mükemmel yapamama korkusudur.",
        createdAt: "2026-10-08T19:30:00Z",
        likes: ["seed-user-2"],
      },
    ],
  },
  {
    id: "post-5",
    title: "İlişkilerde 'Güvenli Bağlanma' yetişkinlikte sonradan geliştirilebilir mi?",
    content: `Kaygılı ya da kaçıngan bağlanma stiline sahip olduğunu fark eden birçok kişi, ilişkilerinde sürekli aynı kısırdöngüleri yaşıyor. 

Uzmanların 'Kazanılmış Güvenli Bağlanma' (Earned Secure Attachment) dediği kavram bana çok umut verici geliyor. Terapötik süreçler, güvenli partner deneyimleri veya derin içgörü sayesinde bağlanma yaralarımızı onarmak gerçekten mümkün mü? Deneyimleyenler var mı?`,
    category: "İlişkiler & Empati",
    tags: ["BağlanmaTeorisi", "İlişkiler", "Güven", "Empati"],
    authorId: "seed-user-3",
    authorName: "Elif Demir",
    authorProfession: "Yazar & Danışman",
    isAnonymous: false,
    createdAt: "2026-10-07T12:00:00Z",
    likes: ["seed-user-2", "seed-user-4", "seed-user-8"],
    views: 0,
    comments: [],
  },
  {
    id: "post-6",
    title: "Viktor Frankl - İnsanın Anlam Arayışı: Zor zamanlarda tutunacak anlamı bulmak",
    content: `Frankl der ki: 'Yaşamak için bir nedeni (neden) olan insan, hemen her nasıla katlanabilir.'

Hayatın en kaotik ve belirsiz dönemlerinde, acının içinde kaybolmak yerine o deneyimden bir bilgelik veya anlam devşirmek insanın ruhsal dayanıklılığını nasıl etkiler? 

Sizin zor dönemlerinizde size pusula olan temel felsefeniz veya anlam kaynağınız ne oldu?`,
    category: "Kitap, Film & Sanat",
    tags: ["Frankl", "Logoterapi", "AnlamArayışı", "RuhsalDayanıklılık"],
    authorId: "seed-user-8",
    authorName: "Burak Kaya",
    authorProfession: "Edebiyatçı",
    isAnonymous: false,
    createdAt: "2026-10-06T15:45:00Z",
    likes: ["seed-user-1", "seed-user-2", "seed-user-3", "seed-user-6"],
    views: 0,
    comments: [],
  },
];

const STORAGE_KEY = "psikoway_forum_posts_v3";
const FORUM_COLLECTION = "forum_posts";

/**
 * Firestore nesnelerinde 'undefined' değer bulunmasına izin vermez.
 * Bu yardımcı fonksiyon, nesne içindeki tüm undefined alanları güvenli string/boş değerlere çevirir.
 */
function sanitizeForFirestore<T>(data: T): any {
  return JSON.parse(
    JSON.stringify(data, (_, value) => {
      if (value === undefined) return "";
      return value;
    })
  );
}

/**
 * Normalleştirici: Firebase verisindeki olası nesne formatındaki dizileri güvenli diziye çevirir
 */
function normalizePost(raw: any, docId?: string): ForumPost {
  const resolvedId = String(raw?.id || docId || "").trim();
  const id = resolvedId || (docId ? String(docId) : `post-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`);

  const likes = Array.isArray(raw?.likes)
    ? raw.likes
    : raw?.likes && typeof raw.likes === "object"
    ? Object.values(raw.likes)
    : [];

  const tags = Array.isArray(raw?.tags)
    ? raw.tags
    : raw?.tags && typeof raw.tags === "object"
    ? Object.values(raw.tags)
    : [];

  let comments: ForumComment[] = [];
  if (Array.isArray(raw?.comments)) {
    comments = raw.comments;
  } else if (raw?.comments && typeof raw.comments === "object") {
    comments = Object.values(raw.comments);
  }

  comments = comments.map((c: any, cIdx: number) => ({
    id: String(c?.id || `comment-${id}-${cIdx}-${Date.now()}`),
    postId: String(c?.postId || id),
    authorId: String(c?.authorId || ""),
    authorName: String(c?.authorName || (c?.isAnonymous ? "Anonim Düşünür" : "Anonim")),
    authorAvatar: c?.authorAvatar || "",
    authorProfession: c?.authorProfession || "",
    isAnonymous: Boolean(c?.isAnonymous),
    content: String(c?.content || ""),
    createdAt: String(c?.createdAt || new Date().toISOString()),
    likes: Array.isArray(c?.likes)
      ? c.likes
      : c?.likes && typeof c.likes === "object"
      ? Object.values(c.likes)
      : [],
    isShadowbanned: Boolean(c?.isShadowbanned),
    shadowClientFingerprint: String(c?.shadowClientFingerprint || ""),
  }));

  return {
    id,
    title: String(raw?.title || ""),
    content: String(raw?.content || ""),
    category: String(raw?.category || "Psikoloji & Zihin"),
    tags,
    authorId: String(raw?.authorId || ""),
    authorName: String(raw?.authorName || (raw?.isAnonymous ? "Anonim Düşünür" : "Anonim")),
    authorAvatar: raw?.authorAvatar || "",
    authorProfession: raw?.authorProfession || "",
    authorBio: raw?.authorBio || "",
    imageUrl: raw?.imageUrl ? String(raw.imageUrl) : "",
    isAnonymous: Boolean(raw?.isAnonymous),
    createdAt: String(raw?.createdAt || new Date().toISOString()),
    likes,
    views: typeof raw?.views === "number" ? raw.views : 0,
    isPinned: Boolean(raw?.isPinned),
    comments,
    isShadowbanned: Boolean(raw?.isShadowbanned),
    shadowClientFingerprint: String(raw?.shadowClientFingerprint || ""),
  };
}

/**
 * Cloud Firestore'a ilk tohum (seed) verilerini yükler
 */
export const seedInitialPostsToFirestore = async (): Promise<void> => {
  try {
    const colRef = collection(firestore, FORUM_COLLECTION);
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) {
      for (const p of INITIAL_FORUM_POSTS) {
        await setDoc(doc(firestore, FORUM_COLLECTION, p.id), sanitizeForFirestore(p));
      }
    }
  } catch (err) {
    console.warn("Firestore forum initial seed warning:", err);
  }
};

export const seedInitialPostsToFirebase = seedInitialPostsToFirestore;

/**
 * Yerel Depolamadan Gönderileri Getir (Senkron Fallback)
 */
export const getStoredPosts = (): ForumPost[] => {
  if (typeof window === "undefined") {
    return INITIAL_FORUM_POSTS;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    const baseList: ForumPost[] = Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_FORUM_POSTS;

    const localShadow = getLocalShadowPosts();
    if (!localShadow || localShadow.length === 0) return baseList;

    const postMap = new Map<string, ForumPost>();
    baseList.forEach((p) => postMap.set(p.id, p));
    localShadow.forEach((lp) => {
      if (!postMap.has(lp.id)) {
        postMap.set(lp.id, lp);
      }
    });
    return Array.from(postMap.values());
  } catch (e) {
    console.error("Failed to load forum posts from storage:", e);
    return INITIAL_FORUM_POSTS;
  }
};

/**
 * Yerel Depolamaya Gönderileri Kaydet
 */
export const saveStoredPosts = (posts: ForumPost[]): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch (e) {
    console.error("Failed to save forum posts:", e);
  }
};

/**
 * İzleyiciye Göre Gönderileri ve Yorumları Filtreler:
 * - Normal kullanıcılar başkalarının gölge kısıtlı (isShadowbanned) mesajlarını ASLA göremez.
 * - Gölge kısıtlanan kişi kendi mesajını kendi sayfasında eksiksiz görür ("kendi sayfasında dursun").
 * - Admin ise (isAdmin: true) moderasyon amacıyla hem normal hem de tüm gölge kısıtlı mesajları (11 fikrin tamamını) eksiksiz görür.
 */
export const filterPostsForViewer = (
  posts: ForumPost[],
  viewerUserId?: string,
  isAdmin: boolean = false
): ForumPost[] => {
  const clientFp = typeof window !== "undefined" ? getClientFingerprint() : "";

  // Yerel gölge gönderilerini de birleştir (kullanıcı veya yönetici sayfayı yenilese bile gönderisi ekranda kalsın)
  const localShadowPosts = getLocalShadowPosts();
  const postMap = new Map<string, ForumPost>();

  posts.forEach((p) => {
    postMap.set(p.id, p);
  });

  localShadowPosts.forEach((lp) => {
    if (!postMap.has(lp.id)) {
      postMap.set(lp.id, lp);
    }
  });

  const merged = Array.from(postMap.values());

  // Yönetici (Admin) tüm gönderileri (normal ve gölge kısıtlıların tamamını) eksiksiz görür
  if (isAdmin) {
    return merged;
  }

  return merged
    .filter((post) => {
      // Normal gönderiler herkese açıktır
      if (!post.isShadowbanned) return true;
      // Gölge kısıtlı gönderileri yalnızca yazan kullanıcı oturumu açıkken görebilir; diğer hiç kimse (millet/ziyaretçi) göremez
      if (viewerUserId && post.authorId === viewerUserId) return true;
      return false;
    })
    .map((post) => {
      // Yorumları da aynı gizlilik prensibiyle filtrele
      const visibleComments = (post.comments || []).filter((c) => {
        if (!c.isShadowbanned) return true;
        if (viewerUserId && c.authorId === viewerUserId) return true;
        return false;
      });

      return {
        ...post,
        comments: visibleComments,
      };
    });
};

/**
 * CANLI (REAL-TIME) TAKİP ABONELİĞİ:
 * Cloud Firestore 'forum_posts' koleksiyonunu anlık olarak dinler.
 * Beğeniler, görüntülemeler, yeni gönderiler ve yorumlar anında canlı güncellenir.
 */
export const subscribeToForumPosts = (
  callback: (posts: ForumPost[]) => void,
  viewerUserId?: string,
  isAdmin: boolean = false
): (() => void) => {
  // İlk önce yereldeki hazır veriyi hemen göster (hızlı açılış)
  const cached = getStoredPosts();
  callback(filterPostsForViewer(cached, viewerUserId, isAdmin));

  // Firestore boşsa seed yükle
  seedInitialPostsToFirestore();

  try {
    const colRef = collection(firestore, FORUM_COLLECTION);
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: ForumPost[] = [];
          snapshot.forEach((d) => {
            const data = d.data();
            // Yalnızca başlığı veya içeriği olan geçerli gönderileri listele (bozuk/boş belgeleri ayıkla)
            if (data && (data.title || data.content || d.id)) {
              if (data.title || data.content) {
                list.push(normalizePost(data, d.id));
              }
            }
          });

          // Sıralama: pinned olanlar önce, ardından en yeni
          list.sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });

          saveStoredPosts(list);
          callback(filterPostsForViewer(list, viewerUserId, isAdmin));
        } else {
          seedInitialPostsToFirestore().then(() => {
            callback(filterPostsForViewer(INITIAL_FORUM_POSTS, viewerUserId, isAdmin));
          });
        }
      },
      (error) => {
        console.warn("Firestore forum onSnapshot subscription warning:", error);
        callback(filterPostsForViewer(getStoredPosts(), viewerUserId, isAdmin));
      }
    );

    return unsubscribe;
  } catch (err) {
    console.warn("Firestore forum subscribe init warning:", err);
    return () => {};
  }
};

/**
 * YENİ GÖNDERİ OLUŞTURMA:
 * - Bot koruması & Dakikada 2 defa yazma sınırı denetlenir.
 * - Sınırı aşan kullanıcıya erişim sınırı (gölge kısıtlama) getirilir.
 * - Kullanıcı gönderisinin gittiğini sanır ve kendi sayfasında görür, ancak genele düşmez.
 */
export const createForumPost = async (
  newPostData: Omit<ForumPost, "id" | "createdAt" | "likes" | "views" | "comments">
): Promise<{ updatedPosts: ForumPost[]; isShadowbanned: boolean; reason?: string }> => {
  // Anonim ve Hesapsız Gönderi Engeli: Yalnızca kayıtlı hesaplar fikir paylaşabilir
  if (newPostData.isAnonymous || !newPostData.authorId || newPostData.authorId.startsWith("guest-")) {
    throw new Error("Hesap açmayanların ve anonim kullanıcıların fikir paylaşmasına izin verilmez. Lütfen bir hesap açın veya giriş yapın.");
  }

  const currentPosts = getStoredPosts();
  const clientFp = getClientFingerprint();

  // 1. AĞIR KÜFÜR VE HAKARET DENETİMİ
  const fullText = `${newPostData.title} ${newPostData.content}`;
  const profanityResult = checkProfanityAndHarassment(fullText);
  if (profanityResult.hasViolation) {
    throw new Error(profanityResult.reason || "Paylaşımınız topluluk kurallarımıza aykırı ifadeler içermektedir.");
  }

  // 2. DIŞ BAĞLANTI (LINK) SINIRLANDIRMASI (En fazla 2 link)
  const linkResult = checkExternalLinkLimit(newPostData.content, 2);
  if (!linkResult.isAllowed) {
    throw new Error(linkResult.reason || "Topluluk güvenliği nedeniyle fazla sayıda dış bağlantı paylaşamazsınız.");
  }

  // 3. KRİZ VE KENDİNE ZARAR VERME FİLTRESİ (PSİKOLOJİ FORUMU GÜVENLİĞİ)
  let isCrisis = false;
  const crisisResult = checkCrisisAndSelfHarm(fullText);
  if (crisisResult.isCrisisDetected) {
    isCrisis = true;
    // Moderasyona acil kriz alarmı kaydet
    recordSecurityAlert({
      id: `alert-crisis-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId: newPostData.authorId,
      clientFingerprint: clientFp,
      userName: newPostData.authorName || "PsikoWay Düşünürü",
      reason: "ACİL KRİZ BİLDİRİMİ: Gönderide kendine zarar verme veya akut kriz belirtisi tespit edildi.",
      actionType: "post",
      contentSnippet: newPostData.content.substring(0, 300),
      postTitle: newPostData.title,
      timestamp: new Date().toISOString(),
      status: "crisis",
      attemptsInWindow: 1,
    }).catch(() => {});
  }

  // 4. XSS & HTML SANITIZATION (GÜVENLİ METİN TEMİZLİĞİ)
  const cleanTitle = sanitizeContent(newPostData.title);
  const cleanContent = sanitizeContent(newPostData.content);

  // 0. AYNI GÖNDERİYİ KISA SÜREDE PEŞ PEŞE GÖNDERME KONTROLÜ (Spam Engeli)
  const trimmedNewTitle = cleanTitle.trim().toLowerCase();
  const recentDuplicatePost = currentPosts.find((p) => {
    if (p.authorId !== newPostData.authorId) return false;
    const isSameTitle = p.title.trim().toLowerCase() === trimmedNewTitle;
    const diffMs = Date.now() - new Date(p.createdAt).getTime();
    return isSameTitle && diffMs < 60 * 1000;
  });
  if (recentDuplicatePost) {
    throw new Error("Aynı başlıkla 1 dakika içinde tekrar fikir paylaşamazsınız.");
  }

  // 5. BOT & SPAM RATE LIMIT KONTROLÜ (Dakikada 2'den fazla yazanı direkt kısıtla)
  const rateLimitResult = await checkAndEnforceRateLimit({
    userId: newPostData.authorId,
    userName: newPostData.authorName || "PsikoWay Düşünürü",
    actionType: "post",
    contentSnippet: cleanContent,
    postTitle: cleanTitle,
  });

  const isShadow = rateLimitResult.isShadowbanned || isCrisis;

  const created: ForumPost = {
    ...newPostData,
    id: `post-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title: cleanTitle,
    content: cleanContent,
    authorName: newPostData.authorName || "PsikoWay Düşünürü",
    authorAvatar: newPostData.authorAvatar || "",
    authorProfession: newPostData.authorProfession || "",
    authorBio: newPostData.authorBio || "",
    imageUrl: newPostData.imageUrl || "",
    createdAt: new Date().toISOString(),
    likes: [],
    views: 1,
    isPinned: false,
    comments: [],
    isAnonymous: false,
    isShadowbanned: isShadow,
    shadowClientFingerprint: clientFp,
  };

  // Eğer gölge kısıtlandıysa: Kullanıcının kendi yerel deposuna ekle (kendi sayfasında dursun)
  if (isShadow) {
    saveLocalShadowPost(created);
  }

  const updated = [created, ...currentPosts];
  saveStoredPosts(updated);

  // Cloud Firestore'a kaydet (Admin görebilsin ve incelesin)
  try {
    const postRef = doc(firestore, FORUM_COLLECTION, created.id);
    const cleanDoc = sanitizeForFirestore(created);
    await setDoc(postRef, cleanDoc);
    console.log(
      isShadow 
        ? "[Bot Koruması] Gönderi gölge kısıtlamasıyla kaydedildi (diğer insanlara gitmedi):" 
        : "[Firestore] Gönderi başarıyla yüklendi:", 
      created.id
    );
  } catch (err) {
    console.error("Firestore create post error:", err);
  }

  return {
    updatedPosts: updated,
    isShadowbanned: isShadow,
    reason: rateLimitResult.reason,
  };
};

/**
 * GÖNDERİ BEĞENİSİ (CANLI TAKİP):
 * Cloud Firestore'da postun 'likes' listesini atomik olarak günceller.
 */
export const togglePostLike = async (postId: string, userId: string): Promise<ForumPost[]> => {
  const currentPosts = getStoredPosts();
  let hasLiked = false;
  let updatedLikes: string[] = [];

  const updated = currentPosts.map((post) => {
    if (post.id !== postId) return post;
    hasLiked = post.likes.includes(userId);
    updatedLikes = hasLiked
      ? post.likes.filter((id) => id !== userId)
      : [...post.likes, userId];
    return { ...post, likes: updatedLikes };
  });

  saveStoredPosts(updated);

  // Cloud Firestore'da anında güncelle
  try {
    const postRef = doc(firestore, FORUM_COLLECTION, postId);
    if (hasLiked) {
      await updateDoc(postRef, { likes: arrayRemove(userId) });
    } else {
      await updateDoc(postRef, { likes: arrayUnion(userId) });
    }
  } catch (err) {
    console.warn("Firestore toggle like arrayUnion warning, fallback to updateDoc:", err);
    try {
      const postRef = doc(firestore, FORUM_COLLECTION, postId);
      await updateDoc(postRef, { likes: updatedLikes });
    } catch {}
  }

  return updated;
};

/**
 * GÖRÜNTÜLEME TAKİBİ (CANLI):
 * Bir kullanıcı gönderiyi okuduğunda Cloud Firestore'da 'views' sayacını günceller.
 */
export const recordPostView = async (postId: string): Promise<void> => {
  if (typeof window === "undefined" || !postId) return;
  const sessionKey = `psikoway_viewed_${postId}`;

  if (sessionStorage.getItem(sessionKey)) return;
  sessionStorage.setItem(sessionKey, "1");

  const currentPosts = getStoredPosts();
  let newViews = 1;
  const updated = currentPosts.map((p) => {
    if (p.id === postId) {
      newViews = (p.views || 0) + 1;
      return { ...p, views: newViews };
    }
    return p;
  });
  saveStoredPosts(updated);

  try {
    const postRef = doc(firestore, FORUM_COLLECTION, postId);
    await updateDoc(postRef, { views: increment(1) });
  } catch {
    // Eğer belge henüz Firestore'da yoksa ve yerel listede tam gönderi verisi mevcutsa tohum olarak kaydet
    const postToSeed = currentPosts.find((p) => p.id === postId);
    if (postToSeed && (postToSeed.title || postToSeed.content)) {
      try {
        const postRef = doc(firestore, FORUM_COLLECTION, postId);
        await setDoc(postRef, sanitizeForFirestore({ ...postToSeed, views: newViews }));
      } catch {}
    }
  }
};

/**
 * YENİ YORUM EKLEME:
 * - Bot koruması & Dakikada 2 defa yazma sınırı denetlenir.
 * - Sınırı aşan kullanıcıya erişim sınırı (gölge kısıtlama) getirilir.
 * - Kullanıcı yorumunun gittiğini sanır ve kendi sayfasında görür, ancak genele düşmez.
 */
export const addPostComment = async (
  postId: string,
  commentData: {
    authorId: string;
    authorName: string;
    authorAvatar?: string;
    authorProfession?: string;
    isAnonymous?: boolean;
    content: string;
  }
): Promise<{ updatedPosts: ForumPost[]; isShadowbanned: boolean; reason?: string }> => {
  // Anonim ve Hesapsız Yorum Engeli: Yalnızca kayıtlı hesaplar yorum yapabilir
  if (commentData.isAnonymous || !commentData.authorId || commentData.authorId === "guest" || commentData.authorId.startsWith("guest-")) {
    throw new Error("Hesap açmayanların ve anonim kullanıcıların yorum yapmasına izin verilmez. Lütfen bir hesap açın veya giriş yapın.");
  }

  const currentPosts = getStoredPosts();
  const clientFp = getClientFingerprint();

  // 1. AĞIR KÜFÜR VE HAKARET KONTROLÜ
  const profanityResult = checkProfanityAndHarassment(commentData.content);
  if (profanityResult.hasViolation) {
    throw new Error(profanityResult.reason || "Yorumunuz topluluk kurallarımıza aykırı ifadeler içermektedir.");
  }

  // 2. DIŞ BAĞLANTI (LINK) SINIRLANDIRMASI (Yorumlarda en fazla 1 link)
  const linkResult = checkExternalLinkLimit(commentData.content, 1);
  if (!linkResult.isAllowed) {
    throw new Error(linkResult.reason || "Yorumlarda çok fazla dış bağlantı paylaşamazsınız.");
  }

  // 3. KRİZ VE KENDİNE ZARAR VERME TESPİTİ
  let isCrisis = false;
  const crisisResult = checkCrisisAndSelfHarm(commentData.content);
  if (crisisResult.isCrisisDetected) {
    isCrisis = true;
    recordSecurityAlert({
      id: `alert-crisis-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId: commentData.authorId,
      clientFingerprint: clientFp,
      userName: commentData.authorName || "PsikoWay Düşünürü",
      reason: "ACİL KRİZ BİLDİRİMİ: Yorumda kendine zarar verme veya akut kriz belirtisi tespit edildi.",
      actionType: "comment",
      contentSnippet: commentData.content.substring(0, 300),
      postTitle: `Post ID: ${postId}`,
      timestamp: new Date().toISOString(),
      status: "crisis",
      attemptsInWindow: 1,
    }).catch(() => {});
  }

  // 4. XSS & HTML SANITIZATION
  const cleanCommentText = sanitizeContent(commentData.content);

  // 0. AYNI YORUMU KISA SÜREDE PEŞ PEŞE GÖNDERME KONTROLÜ (Spam Engeli)
  const existingPost = currentPosts.find((p) => p.id === postId);
  if (existingPost && existingPost.comments) {
    const trimmedNew = cleanCommentText.trim().toLowerCase();
    const recentDuplicate = existingPost.comments.find((c) => {
      if (c.authorId !== commentData.authorId) return false;
      const isSameContent = c.content.trim().toLowerCase() === trimmedNew;
      const diffMs = Date.now() - new Date(c.createdAt).getTime();
      return isSameContent && diffMs < 45 * 1000;
    });
    if (recentDuplicate) {
      throw new Error("Aynı yanıtı 45 saniye içinde art arda gönderemezsiniz.");
    }
  }

  // 5. BOT & SPAM RATE LIMIT KONTROLÜ (Dakikada 2'den fazla yazanı direkt kısıtla)
  const rateLimitResult = await checkAndEnforceRateLimit({
    userId: commentData.authorId,
    userName: commentData.authorName || "PsikoWay Düşünürü",
    actionType: "comment",
    contentSnippet: cleanCommentText,
    postTitle: `Post ID: ${postId}`,
  });

  const isShadow = rateLimitResult.isShadowbanned || isCrisis;

  const newComment: ForumComment = {
    id: `comment-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    postId,
    authorId: commentData.authorId,
    authorName: commentData.authorName || "PsikoWay Düşünürü",
    authorAvatar: commentData.authorAvatar || "",
    authorProfession: commentData.authorProfession || "",
    isAnonymous: false,
    content: cleanCommentText,
    createdAt: new Date().toISOString(),
    likes: [],
    isShadowbanned: isShadow,
    shadowClientFingerprint: clientFp,
  };

  let allCommentsForPost: ForumComment[] = [];
  const updated = currentPosts.map((post) => {
    if (post.id !== postId) return post;
    allCommentsForPost = [...(post.comments || []), newComment];
    return {
      ...post,
      comments: allCommentsForPost,
    };
  });

  saveStoredPosts(updated);

  // Cloud Firestore'a atomik ve güvenli biçimde kaydet (Admin görebilsin)
  try {
    const postRef = doc(firestore, FORUM_COLLECTION, postId);
    const cleanComment = sanitizeForFirestore(newComment);

    try {
      await updateDoc(postRef, {
        comments: arrayUnion(cleanComment),
      });
      console.log(
        isShadow 
          ? "[Bot Koruması] Yorum gölge kısıtlamasıyla kaydedildi (diğer insanlara gitmedi):" 
          : "[Firestore] Yorum arrayUnion ile başarıyla kaydedildi:", 
        newComment.id
      );
    } catch (updateErr) {
      console.warn("arrayUnion update warning, trying fallback:", updateErr);
      const postSnap = await getDoc(postRef);
      if (postSnap.exists()) {
        const postData = postSnap.data();
        const existingComments = Array.isArray(postData.comments) ? postData.comments : [];
        await updateDoc(postRef, {
          comments: sanitizeForFirestore([...existingComments, cleanComment]),
        });
      } else {
        const matchedPost = updated.find((p) => p.id === postId);
        if (matchedPost) {
          await setDoc(postRef, sanitizeForFirestore(matchedPost), { merge: true });
        }
      }
    }
  } catch (err) {
    console.error("Firestore comment save error:", err);
  }

  return {
    updatedPosts: updated,
    isShadowbanned: isShadow,
    reason: rateLimitResult.reason,
  };
};

/**
 * YORUM BEĞENİSİ (CANLI):
 * Cloud Firestore'da yorumun 'likes' listesini günceller.
 */
export const toggleCommentLike = async (
  postId: string,
  commentId: string,
  userId: string
): Promise<ForumPost[]> => {
  const currentPosts = getStoredPosts();
  let updatedCommentsForPost: ForumComment[] = [];

  const updated = currentPosts.map((post) => {
    if (post.id !== postId) return post;
    const updatedComments = post.comments.map((comm) => {
      if (comm.id !== commentId) return comm;
      const hasLiked = comm.likes.includes(userId);
      const updatedLikes = hasLiked
        ? comm.likes.filter((id) => id !== userId)
        : [...comm.likes, userId];
      return { ...comm, likes: updatedLikes };
    });
    updatedCommentsForPost = updatedComments;
    return { ...post, comments: updatedComments };
  });

  saveStoredPosts(updated);

  // Cloud Firestore'da güncelle
  try {
    const postRef = doc(firestore, FORUM_COLLECTION, postId);
    await updateDoc(postRef, { comments: sanitizeForFirestore(updatedCommentsForPost) });
  } catch (err) {
    console.warn("Firestore comment like update error:", err);
  }

  return updated;
};

/**
 * GÖNDERİ SİLME:
 * Cloud Firestore'dan ve yerel hafızadan gönderiyi kalıcı olarak kaldırır.
 */
export const deleteForumPost = async (postId: string, userId: string): Promise<ForumPost[]> => {
  const currentPosts = getStoredPosts();
  const clientFp = typeof window !== "undefined" ? getClientFingerprint() : "";

  const updated = currentPosts.filter(
    (post) => !(post.id === postId && (post.authorId === userId || (clientFp && post.shadowClientFingerprint === clientFp)))
  );

  saveStoredPosts(updated);
  deleteLocalShadowPost(postId);

  try {
    const postRef = doc(firestore, FORUM_COLLECTION, postId);
    await deleteDoc(postRef);
  } catch (err) {
    console.warn("Firestore remove post error:", err);
  }

  return updated;
};

/**
 * YORUM SİLME:
 * Kullanıcının kendi yazdığı yorumu ilgili gönderiden hem yerel depoda hem Firestore'da siler.
 */
export const deleteForumComment = async (
  postId: string,
  commentId: string,
  userId: string
): Promise<ForumPost[]> => {
  const currentPosts = getStoredPosts();
  const clientFp = typeof window !== "undefined" ? getClientFingerprint() : "";
  let updatedCommentsForPost: ForumComment[] = [];

  const updated = currentPosts.map((post) => {
    if (post.id !== postId) return post;
    const remainingComments = (post.comments || []).filter(
      (c) => !(c.id === commentId && (c.authorId === userId || (clientFp && c.shadowClientFingerprint === clientFp)))
    );
    updatedCommentsForPost = remainingComments;
    return {
      ...post,
      comments: remainingComments,
    };
  });

  saveStoredPosts(updated);

  try {
    const postRef = doc(firestore, FORUM_COLLECTION, postId);
    await updateDoc(postRef, {
      comments: sanitizeForFirestore(updatedCommentsForPost),
    });
  } catch (err) {
    console.warn("Firestore remove comment error:", err);
  }

  return updated;
};


