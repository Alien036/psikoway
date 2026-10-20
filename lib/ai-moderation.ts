// lib/ai-moderation.ts
// Yapay Zeka Destekli Çok Katmanlı İçerik (Küfür/Hakaret/+18) ve Görsel (Çıplaklık/NSFW/Görsel İçi Küfür) Moderasyon Motoru

export type ViolationCategory =
  | "clean"
  | "profanity"
  | "harassment"
  | "sexual_content"
  | "nudity"
  | "offensive_image";

export interface TextModerationResult {
  isAllowed: boolean;
  category: ViolationCategory;
  confidence: number;
  reason?: string;
  flaggedTerms?: string[];
  censoredPreview?: string;
}

export interface ImageModerationResult {
  isAllowed: boolean;
  category: ViolationCategory;
  confidence: number;
  reason?: string;
  skinRatio?: number;
  details?: string;
}

// ============================================================================
// 1. TÜRKÇE & İNGİLİZCE KÜFÜR, ARGO, HAKARET VE +18 SÖZLÜK & ÖRÜNTÜ VERİTABANI
// ============================================================================

// Kesin küfür kökleri ve tam eşleşmeler (normalize edilmiş ascii karşılıklarıyla birlikte)
const EXACT_PROFANITY_WORDS = new Set([
  // Türkçe yaygın küfür kısaltmaları ve kelimeler
  "amk", "aq", "amq", "mk", "mq", "oç", "oc", "piç", "pic",
  "sik", "sikerim", "sikeyim", "siktir", "siktirgit", "sikik", "sikis", "sikiş",
  "siken", "sikildi", "sikti", "siktin", "siktim", "sikiyor", "sikiyim", "sokuk",
  "yarrak", "yarak", "yaragim", "yarağım", "yarram", "yarragim", "yarrağım",
  "amcik", "amcık", "amina", "amına", "aminakoyayim", "amınakoyayım", "aminakoyim", "amınakoyim",
  "amini", "amını", "amindan", "amından", "orospu", "oruspu", "orosbu", "orospucocugu", "orospuçocuğu",
  "kahpe", "pezevenk", "pezeveng", "gavat", "ibne", "ipne", "puşt", "pust",
  "yavşak", "yavsak", "gotveren", "götveren", "gotlek", "götlek", "göt", "gotunu", "götünü",
  "tassak", "taşşak", "tasak", "taşak", "kaltak", "fahişe", "fahise", "kevaşe", "kevase",
  "surtuk", "sürtük", "züppe", "dallama", "gerizekali", "gerizekalı", "embesil",
  "şerefsiz", "serefsiz", "haysiyetsiz", "namussuz", "kancik", "kancık", "piçkurusu", "pickurusu",
  "ananı", "anani", "bacını", "bacini", "sülaleni", "sulaleni", "avradını", "avradini",
  // +18 / Müstehcen / Cinsel terimler
  "porno", "porn", "orno", "çıplak", "ciplak", "nude", "nudes", "nsfw",
  "ifşa", "ifsa", "eskort", "escort", "jigolo", "hentai", "onlyfans", "erotik",
  "sakso", "blowjob", "handjob", "boobs", "tits", "pussy", "dick", "cock",
  "fuck", "fucker", "motherfucker", "fucking", "bitch", "whore", "slut", "asshole", "cunt", "bastard",
]);

// Kelime içinde veya çekim eki almış halde yakalanacak kök örüntüler
const PROFANITY_STEM_PATTERNS: Array<{ regex: RegExp; label: string; category: ViolationCategory }> = [
  {
    regex: /\b(o\.?\s*ç\.?|or[o0u]sp[uü][a-zçğıöşü]*|p[iı1!]ç[a-zçğıöşü]*)\b/i,
    label: "Ağır küfür / hakaret",
    category: "profanity",
  },
  {
    regex: /\b(a\.?\s*m\.?\s*k\.?|a\.?\s*q\.?|a\s+m\s+k|am[ıi1!]na\s*k[o0]y[a-zçğıöşü]*|am[cç][ıi1!]k[a-zçğıöşü]*)\b/i,
    label: "Küfür / argo ifade",
    category: "profanity",
  },
  {
    regex: /\b(s[iı1!]k(?:er[iı]m|ey[iı]m|t[iı]r[a-zçğıöşü]*|[iı]k|[iı]ş|is|ti[a-zçğıöşü]*|il[a-zçğıöşü]*|em|en|iyor[a-zçğıöşü]*))\b/i,
    label: "Ağır küfür / müstehcen ifade",
    category: "profanity",
  },
  {
    regex: /\b(y[a@]rr?[a@]k[a-zçğıöşü]*|y[a@]rr?[a@][gğ][ıi1!][a-zçğıöşü]*|t[a@]ş+ş?[a@]k[a-zçğıöşü]*)\b/i,
    label: "Ağır küfür / müstehcen ifade",
    category: "profanity",
  },
  {
    regex: /\b(g[öo0]t(?:veren|lek|lalesi|ü?n[üu]|ü?ne|ü?nden)[a-zçğıöşü]*|p[e3]z[e3]v[e3]n[gk][a-zçğıöşü]*|g[a@]v[a@]t[a-zçğıöşü]*|y[a@]vş[a@]k[a-zçğıöşü]*|k[a@]hp[e3][a-zçğıöşü]*|f[a@]h[iı1!]ş[e3][a-zçğıöşü]*|k[a@]lt[a@]k[a-zçğıöşü]*|s[üu]rt[üu]k[a-zçğıöşü]*)\b/i,
    label: "Hakaret / küfür",
    category: "profanity",
  },
  {
    regex: /\b(anan[ıi]\s+s[iı]k[a-zçğıöşü]*|bac[ıi]n[ıi]\s+s[iı]k[a-zçğıöşü]*|s[üu]lalen[iı]\s+s[iı]k[a-zçğıöşü]*)\b/i,
    label: "Ailevi ağır küfür",
    category: "profanity",
  },
  {
    regex: /\b(p[o0]rn[o0]?|nude?s?|nsfw|onlyfans|[cç][ıi1!]pl[a@]k\s+(?:foto[a-zçğıöşü]*|res[iı]m[a-zçğıöşü]*|k[ıi]z[a-zçğıöşü]*|kad[ıi]n[a-zçğıöşü]*|beden[a-zçğıöşü]*)|eskort[a-zçğıöşü]*|[iı]fş[a@]\s+(?:foto|video|link|arşiv))\b/i,
    label: "+18 / Cinsel ve müstehcen içerik",
    category: "sexual_content",
  },
  {
    regex: /\b(f+u+c+k+[a-z]*|m+o+t+h+e+r+f+u+c+k+[a-z]*|b+i+t+c+h+[a-z]*|p+u+s+s+y+|d+i+c+k+h+e+a+d+|a+s+s+h+o+l+e+|w+h+o+r+e+|s+l+u+t+)\b/i,
    label: "İngilizce küfür / müstehcen ifade",
    category: "profanity",
  },
];

// Yanlış pozitifleri (False Positive) önlemek için güvenli Türkçe kelimeler listesi
const SAFE_TURKISH_WORDS = new Set([
  "siklon", "sikke", "siklamen", "müzik", "fizik", "klasik", "eksik", "kesik", "beşik", "eşik",
  "kaşık", "ışık", "aşık", "bulaşık", "karışık", "alışık", "yapışık", "barışık", "tanışık",
  "amca", "amcası", "amcam", "amaç", "amacı", "ameliyat", "amiral", "amblem", "ambalaj", "ambulans",
  "ampul", "amfi", "amatör", "amazon", "amerika", "amin", "amonyak", "amortisör",
  "götür", "götürmek", "götürdü", "göster", "gösteri", "gösterim", "görev", "görüş", "görüntü", "göz", "gözlem",
  "ocak", "orak", "odak", "ortak", "olanak", "oyuncak", "okunak",
  "piçuta", "kuruş", "duruş", "vuruş", "oturuş", "buluş", "doğuş", "yokuş", "kuş",
  "memnun", "memleket", "memur", "mükemmel", "emlak", "emanet",
  "analiz", "anlam", "anlatı", "anlayış", "anı", "anons", "anonim", "anksiyete", "antidepresan",
  "seksiyonel", "sektör", "sekreter", "seksen", "sekiz", "sekmek",
  "cinsel", "cinsellik", // Psikolojik/akademik bağlamda tek başına geçebilir, ancak +18 küfürlerle birleşirse yakalanır
]);

/**
 * Türkçe karakterleri ve leetspeak/sembolleri normalize eder
 */
export function normalizeTurkishForModeration(input: string): string {
  return input
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/0/g, "o")
    .replace(/1/g, "i")
    .replace(/3/g, "e")
    .replace(/4/g, "a")
    .replace(/5/g, "s")
    .replace(/7/g, "t")
    .replace(/@/g, "a")
    .replace(/\$/g, "s")
    .replace(/!/g, "i")
    // 2'den fazla tekrarlayan harfleri tek harfe indir (örn: siktirrrr -> siktir, amkkkk -> amk)
    .replace(/([a-z])\1{2,}/g, "$1");
}

/**
 * Harf aralarına nokta, yıldız, tire veya boşluk koyarak yapılan sansür delme (obfuscation) girişimlerini çözer
 * Örn: "s.i.k.t.i.r" -> "siktir", "o * r * o * s * p * u" -> "orospu", "a m k" -> "amk"
 */
function collapseObfuscatedTokens(input: string): string {
  // Tek harfler arasındaki sembolleri birleştir: s.i.k, o-r-o-s-p-u, p*i*ç
  let collapsed = input.replace(
    /\b([a-zA-ZçğıöşüÇĞİÖŞÜ013457@$!])(?:[\.\*\-_\/~`|]+([a-zA-ZçğıöşüÇĞİÖŞÜ013457@$!])){2,}\b/g,
    (match) => match.replace(/[\.\*\-_\/~`|]+/g, "")
  );

  // Boşlukla ayrılmış tek harfli küfürleri birleştir (örn: "a m k", "o ç", "s i k")
  collapsed = collapsed.replace(
    /\b([a-zA-ZçğıöşüÇĞİÖŞÜ])\s+([a-zA-ZçğıöşüÇĞİÖŞÜ])(?:\s+([a-zA-ZçğıöşüÇĞİÖŞÜ]))?\b/g,
    (full, c1, c2, c3) => {
      const candidate = normalizeTurkishForModeration(`${c1}${c2}${c3 || ""}`);
      if (EXACT_PROFANITY_WORDS.has(candidate)) {
        return candidate;
      }
      return full;
    }
  );

  return collapsed;
}

/**
 * Anlık (Senkron) Yapay Zeka NLP Metin Sansür ve Küfür Denetimi
 * Kullanıcı yazarken veya form gönderirken anında çalışır.
 */
export function analyzeTextProfanitySync(text: string): TextModerationResult {
  if (!text || !text.trim()) {
    return { isAllowed: true, category: "clean", confidence: 1.0 };
  }

  const deobfuscated = collapseObfuscatedTokens(text);
  const flaggedTerms: string[] = [];
  let detectedCategory: ViolationCategory = "clean";

  // 1. Örüntü (Regex) Tabanlı Kontroller
  for (const item of PROFANITY_STEM_PATTERNS) {
    const match = deobfuscated.match(item.regex);
    if (match && match[0]) {
      const matchedWord = match[0].trim().toLowerCase();
      if (!SAFE_TURKISH_WORDS.has(matchedWord)) {
        flaggedTerms.push(matchedWord);
        detectedCategory = item.category;
      }
    }
  }

  // 2. Kelime Bazlı Normalize Edilmiş Kök & Tam Eşleşme Analizi
  const rawTokens = deobfuscated
    .toLowerCase()
    .split(/[\s,.;:!?()"'«»\[\]{}<>\/\\|+\-=~`^&*]+/)
    .filter(Boolean);

  for (const rawToken of rawTokens) {
    if (SAFE_TURKISH_WORDS.has(rawToken)) continue;

    const normToken = normalizeTurkishForModeration(rawToken);
    if (SAFE_TURKISH_WORDS.has(normToken)) continue;

    if (EXACT_PROFANITY_WORDS.has(rawToken) || EXACT_PROFANITY_WORDS.has(normToken)) {
      if (!flaggedTerms.includes(rawToken)) {
        flaggedTerms.push(rawToken);
      }
      if (detectedCategory === "clean") {
        detectedCategory = ["porno", "porn", "ciplak", "nude", "nudes", "nsfw", "ifsa", "eskort", "escort", "onlyfans"].includes(normToken)
          ? "sexual_content"
          : "profanity";
      }
      continue;
    }

    // Türkçe çekim eki almış ağır küfür kökleri kontrolü (örn: "orospular", "pezevenkler", "yavşaklık", "sik소")
    const strictPrefixes = [
      "orospu", "oruspu", "pezevenk", "gavat", "yavsak", "serefsiz",
      "haysiyetsiz", "amcik", "yarrak", "siktir", "sikik", "gotveren", "fahise", "kaltak",
    ];
    for (const prefix of strictPrefixes) {
      if (normToken.startsWith(prefix) && normToken.length <= prefix.length + 7) {
        if (!flaggedTerms.includes(rawToken)) {
          flaggedTerms.push(rawToken);
        }
        if (detectedCategory === "clean") {
          detectedCategory = "profanity";
        }
        break;
      }
    }
  }

  if (flaggedTerms.length > 0) {
    // Sansürlenmiş önizleme oluştur
    let censoredPreview = text;
    for (const term of flaggedTerms) {
      const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      censoredPreview = censoredPreview.replace(
        new RegExp(escaped, "gi"),
        (m) => m[0] + "*".repeat(Math.max(2, m.length - 1))
      );
    }

    const reason =
      detectedCategory === "sexual_content"
        ? "🛡️ Yapay Zeka Sansür Filtresi: Paylaşımınızda +18 / müstehcen veya uygunsuz ifadeler tespit edildi. Topluluk kurallarımız gereği bu içerik paylaşılamaz."
        : "🛡️ Yapay Zeka Sansür Filtresi: Paylaşımınızda küfür, argo veya kırıcı ifadeler tespit edildi. Lütfen saygılı ve yapıcı bir dil kullanın.";

    return {
      isAllowed: false,
      category: detectedCategory,
      confidence: 0.97,
      reason,
      flaggedTerms: Array.from(new Set(flaggedTerms)),
      censoredPreview,
    };
  }

  return {
    isAllowed: true,
    category: "clean",
    confidence: 0.99,
  };
}

/**
 * Asenkron Yapay Zeka Metin Denetimi (Önce yerel NLP, ardından sunucu AI `/api/moderate` denetimi)
 */
export async function moderateTextWithAI(
  text: string,
  context: "post" | "comment" | "profile" = "post"
): Promise<TextModerationResult> {
  // 1. Hızlı yerel NLP denetimi
  const localResult = analyzeTextProfanitySync(text);
  if (!localResult.isAllowed) {
    return localResult;
  }

  // 2. Sunucu tabanlı AI moderasyon uç noktası kontrolü
  if (typeof window !== "undefined") {
    try {
      const response = await fetch("/api/moderate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "text",
          text,
          context,
        }),
      });

      if (response.ok) {
        const data = (await response.json()) as TextModerationResult;
        if (data && data.isAllowed === false) {
          return data;
        }
      }
    } catch (err) {
      // Ağ hatasında yerel NLP sonucuna güven
      console.warn("[AI Text Moderation Fallback]:", err);
    }
  }

  return localResult;
}

// ============================================================================
// 2. YAPAY ZEKA GÖRSEL DENETİMİ (ÇIPLAKLIK / NSFW & GÖRSEL İÇİ KÜFÜR ANALİZİ)
// ============================================================================

const NSFW_FILENAME_PATTERNS =
  /\b(nude|nudes|nsfw|porn|porno|sex|seks|ciplak|çıplak|ifsa|ifşa|eskort|escort|hentai|xxx|erotik|boobs|pussy|dick|fuck|sik|amk|orospu)\b/i;

/**
 * RGB pikselinin insan teni (skin-tone) olup olmadığını YCbCr + HSV renk uzaylarında analiz eder.
 * Farklı cilt tonlarını (açık, buğday, esmer) kapsar; beyaz duvar, sarı ışık ve ahşap yanlış pozitiflerini dışlar.
 */
function isHumanSkinPixel(r: number, g: number, b: number): boolean {
  // Çok karanlık veya tam parlak beyaz pikselleri ele
  if (r < 55 || g < 35 || b < 20) return false;
  if (r > 250 && g > 245 && b > 240) return false;

  // RGB baskınlık kuralı: İnsan teninde Kırmızı > Yeşil > Mavi olmalı ve R-G farkı belirgin olmalı
  if (!(r > g && g >= b - 8)) return false;
  const rgDiff = r - g;
  const rbDiff = r - b;
  if (rgDiff < 12 || rgDiff > 110) return false;
  if (rbDiff < 22 || rbDiff > 165) return false;

  // YCbCr renk uzayı dönüşümü
  const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
  const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;

  // Daraltılmış gerçek insan teni zarfı (sarı/turuncu grafik tasarımları ve bej arka planları dışlar)
  const inYCbCrSkinRange = cb >= 82 && cb <= 124 && cr >= 136 && cr <= 170;
  if (!inYCbCrSkinRange) return false;

  // HSV Doygunluk (Saturation) kontrolü: Bej/gri duvarları ve aşırı doygun turuncu/kırmızı nesneleri ele
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const saturation = max === 0 ? 0 : (max - min) / max;
  if (saturation < 0.16 || saturation > 0.65) return false;

  return true;
}

/**
 * İstemci Tarafı (Tarayıcı İçi) Bilgisayarlı Görü (Computer Vision) Çıplaklık / NSFW Analizi
 * Görselin piksel matrisini, merkez (ROI) gövde ten yoğunluğunu ve kesintisiz ten kümesi topolojisini inceler.
 */
export async function analyzeImageNudityOnClient(
  dataUrl: string,
  fileName: string = ""
): Promise<ImageModerationResult> {
  // 1. Dosya adında küfür veya +18 / çıplaklık ibaresi var mı?
  if (fileName && NSFW_FILENAME_PATTERNS.test(fileName)) {
    return {
      isAllowed: false,
      category: "nudity",
      confidence: 0.98,
      reason:
        "🛡️ Yapay Zeka Görsel Güvenlik Filtresi: Seçtiğiniz dosya adı veya meta verisi uygunsuz (+18 / küfürlü) içerik barındırdığı için engellendi.",
    };
  }

  if (typeof window === "undefined" || typeof document === "undefined") {
    return { isAllowed: true, category: "clean", confidence: 0.9 };
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onerror = () => {
      resolve({
        isAllowed: false,
        category: "offensive_image",
        confidence: 0.9,
        reason: "Görsel dosyası doğrulanamadı veya bozuk.",
      });
    };

    img.onload = () => {
      try {
        // Analiz için standart 160x160 ızgara çözünürlüğüne örnekle
        const gridW = 160;
        const gridH = 160;
        const canvas = document.createElement("canvas");
        canvas.width = gridW;
        canvas.height = gridH;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          resolve({ isAllowed: true, category: "clean", confidence: 0.8 });
          return;
        }

        ctx.drawImage(img, 0, 0, gridW, gridH);
        const imageData = ctx.getImageData(0, 0, gridW, gridH);
        const pixels = imageData.data;

        const totalPixels = gridW * gridH;
        let totalSkinPixels = 0;

        // Gövde/Merkez Bölgesi (X: %18-%82, Y: %25-%88) -> Portre/yüz (üst %0-%35) harici ana beden bölgesi
        let bodyRoiTotal = 0;
        let bodyRoiSkin = 0;

        // Alt-Orta Gövde Bölgesi (X: %22-%78, Y: %40-%85) -> Çıplaklıkta en yoğun ten çıkan bölge
        let torsoRoiTotal = 0;
        let torsoRoiSkin = 0;

        // Piksel varyansı (düz renkli bej/krem arka planları gerçek insan teninden ayırt etmek için)
        let skinRedSum = 0;
        let skinRedSqSum = 0;

        // İkili (binary) ten maskesi
        const skinMask = new Uint8Array(totalPixels);

        for (let y = 0; y < gridH; y++) {
          const normY = y / gridH;
          for (let x = 0; x < gridW; x++) {
            const normX = x / gridW;
            const idx = (y * gridW + x) * 4;
            const r = pixels[idx];
            const g = pixels[idx + 1];
            const b = pixels[idx + 2];
            const a = pixels[idx + 3];

            if (a < 128) continue;

            const isSkin = isHumanSkinPixel(r, g, b);
            const cellIdx = y * gridW + x;

            if (isSkin) {
              skinMask[cellIdx] = 1;
              totalSkinPixels++;
              skinRedSum += r;
              skinRedSqSum += r * r;
            }

            if (normX >= 0.18 && normX <= 0.82 && normY >= 0.25 && normY <= 0.88) {
              bodyRoiTotal++;
              if (isSkin) bodyRoiSkin++;
            }

            if (normX >= 0.22 && normX <= 0.78 && normY >= 0.40 && normY <= 0.85) {
              torsoRoiTotal++;
              if (isSkin) torsoRoiSkin++;
            }
          }
        }

        const overallSkinRatio = totalSkinPixels / totalPixels;
        const bodySkinRatio = bodyRoiTotal > 0 ? bodyRoiSkin / bodyRoiTotal : 0;
        const torsoSkinRatio = torsoRoiTotal > 0 ? torsoRoiSkin / torsoRoiTotal : 0;

        // Renk varyansı: Düz renkli grafik/duvar kağıtlarında varyans çok düşüktür (< 35),
        // gerçek fotoğraf/beden görüntüsünde ışık-gölge geçişlerinden dolayı varyans belirgindir.
        const meanR = totalSkinPixels > 0 ? skinRedSum / totalSkinPixels : 0;
        const varianceR =
          totalSkinPixels > 0 ? skinRedSqSum / totalSkinPixels - meanR * meanR : 0;
        const isNaturalPhotoTexture = varianceR > 42;

        // En büyük bağlantılı (bitişik) ten bloğunu bul (BFS Connected Component Analysis)
        const visited = new Uint8Array(totalPixels);
        let maxConnectedSkinCluster = 0;

        for (let i = 0; i < totalPixels; i++) {
          if (skinMask[i] === 1 && visited[i] === 0) {
            let clusterSize = 0;
            const queue = [i];
            visited[i] = 1;

            while (queue.length > 0) {
              const curr = queue.pop()!;
              clusterSize++;

              const cx = curr % gridW;
              const cy = Math.floor(curr / gridW);

              const neighbors = [
                cy > 0 ? (cy - 1) * gridW + cx : -1,
                cy < gridH - 1 ? (cy + 1) * gridW + cx : -1,
                cx > 0 ? cy * gridW + (cx - 1) : -1,
                cx < gridW - 1 ? cy * gridW + (cx + 1) : -1,
              ];

              for (const n of neighbors) {
                if (n >= 0 && skinMask[n] === 1 && visited[n] === 0) {
                  visited[n] = 1;
                  queue.push(n);
                }
              }
            }

            if (clusterSize > maxConnectedSkinCluster) {
              maxConnectedSkinCluster = clusterSize;
            }
          }
        }

        const largestClusterRatio = maxConnectedSkinCluster / totalPixels;

        // ÇIPLAKLIK / MÜSTEHCENLİK KARAR EŞİKLERİ:
        // Normal bir yüz/portre fotoğrafında:
        // - Yüz genelde görselin %10-%28'ini kaplar, alt gövde (torsoRoi) kıyafetli olduğu için ten oranı düşüktür.
        // Çıplaklık içeren bir görselde ise:
        // - Gövde (torsoRoi) ten oranı çok yüksektir (> %52) VE kesintisiz tek parça ten kümesi büyüktür (> %32)
        // VEYA genel ten oranı (> %48) ve gövde ten oranı (> %58) aynı anda yüksektir.
        const isHighNudityProbability =
          isNaturalPhotoTexture &&
          ((overallSkinRatio > 0.45 && bodySkinRatio > 0.56 && torsoSkinRatio > 0.52) ||
            (largestClusterRatio > 0.34 && torsoSkinRatio > 0.55) ||
            (bodySkinRatio > 0.64 && torsoSkinRatio > 0.60));

        if (isHighNudityProbability) {
          resolve({
            isAllowed: false,
            category: "nudity",
            confidence: Math.min(0.99, Math.round((bodySkinRatio + torsoSkinRatio) * 50) / 100),
            skinRatio: Math.round(overallSkinRatio * 100),
            reason:
              "🛡️ Yapay Zeka Görsel Denetimi: Yüklemeye çalıştığınız fotoğrafta yüksek oranda çıplaklık / müstehcen (+18) içerik tespit edildi. PsikoWay topluluk kuralları gereği bu görsel yüklenemez.",
          });
          return;
        }

        resolve({
          isAllowed: true,
          category: "clean",
          confidence: 0.95,
          skinRatio: Math.round(overallSkinRatio * 100),
        });
      } catch {
        resolve({ isAllowed: true, category: "clean", confidence: 0.8 });
      }
    };

    img.src = dataUrl;
  });
}

/**
 * Tam Kapsamlı Yapay Zeka Görsel Denetimi (İstemci CV + Sunucu AI Vision `/api/moderate`)
 */
export async function moderateImageWithAI(
  dataUrl: string,
  fileName: string = ""
): Promise<ImageModerationResult> {
  // 1. Adım: Tarayıcıda hızlı Bilgisayarlı Görü (Computer Vision) çıplaklık ve dosya adı kontrolü
  const clientResult = await analyzeImageNudityOnClient(dataUrl, fileName);
  if (!clientResult.isAllowed) {
    return clientResult;
  }

  // 2. Adım: Sunucu tarafı AI Vision (`/api/moderate`) kontrolü (Çıplaklık + Görsel Üzerindeki Küfür/Yazı OCR Denetimi)
  if (typeof window !== "undefined") {
    try {
      const response = await fetch("/api/moderate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "image",
          imageBase64: dataUrl,
          fileName,
          clientSkinRatio: clientResult.skinRatio || 0,
        }),
      });

      if (response.ok) {
        const serverData = (await response.json()) as ImageModerationResult;
        if (serverData && serverData.isAllowed === false) {
          return serverData;
        }
      }
    } catch (err) {
      console.warn("[AI Image Moderation Server Fallback]:", err);
    }
  }

  return clientResult;
}
