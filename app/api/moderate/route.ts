import { NextRequest, NextResponse } from "next/server";
import {
  analyzeTextProfanitySync,
  TextModerationResult,
  ImageModerationResult,
  ViolationCategory,
} from "../../../lib/ai-moderation";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";

/**
 * Yardımcı: JSON cevabını güvenli ayrıştır
 */
function parseJsonSafely(raw: string): any {
  try {
    const cleaned = raw
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1) {
      return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1));
    }
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

/**
 * Gemini API ile Metin veya Görsel Denetimi
 */
async function moderateWithGemini(params: {
  text?: string;
  imageBase64?: string;
}): Promise<{ isAllowed: boolean; category: ViolationCategory; reason?: string; confidence: number } | null> {
  if (!GEMINI_API_KEY) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const parts: any[] = [];

    if (params.imageBase64) {
      const match = params.imageBase64.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
      const mimeType = match ? match[1] : "image/webp";
      const base64Data = match ? match[2] : params.imageBase64;

      parts.push({
        inline_data: {
          mime_type: mimeType,
          data: base64Data,
        },
      });
      parts.push({
        text: `Sen bir psikoloji ve düşünce platformunun (PsikoWay) yapay zeka güvenlik moderatörüsün.
Bu görseli incele ve aşağıdaki durumlardan biri varsa tespit et:
1) Çıplaklık, yarı çıplaklık, cinsel organ, erotik/müstehcen (+18 / NSFW) poz veya pornografik içerik (kategori: "nudity")
2) Görselin üzerinde yazılı Türkçe veya İngilizce küfür, ağır argo, hakaret, el hareketi (orta parmak vb.) veya nefret söylemi (kategori: "offensive_image")
Normal portre fotoğrafları, doğa/sanat görselleri, kitap kapakları ve psikoloji/felsefe görselleri güvenlidir (kategori: "clean").
Sadece şu JSON formatında yanıt ver:
{"isAllowed": boolean, "category": "clean" | "nudity" | "offensive_image", "confidence": number, "reason": "Türkçe açıklama"}`,
      });
    } else if (params.text) {
      parts.push({
        text: `Sen bir psikoloji ve düşünce platformunun (PsikoWay) yapay zeka içerik moderatörüsün.
Aşağıdaki kullanıcı metnini incele. Küfür, sansürlenmiş küfür, ağır argo, hakaret, aşağılama veya +18 cinsel/müstehcen içerik barındırıp barındırmadığını belirle.
Metin: """${params.text}"""
Sadece şu JSON formatında yanıt ver:
{"isAllowed": boolean, "category": "clean" | "profanity" | "harassment" | "sexual_content", "confidence": number, "reason": "Türkçe açıklama"}`,
      });
    }

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 200,
          },
        }),
        signal: controller.signal,
      }
    );

    if (!res.ok) return null;
    const data = await res.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const parsed = parseJsonSafely(rawText);
    if (parsed && typeof parsed.isAllowed === "boolean") {
      return {
        isAllowed: parsed.isAllowed,
        category: parsed.category || (parsed.isAllowed ? "clean" : "profanity"),
        confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0.95,
        reason: parsed.reason,
      };
    }
    return null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * OpenAI Multimodal Moderation API veya Ücretsiz OpenAI-Uyumlu Vision AI Fallback
 */
async function moderateWithVisionAI(params: {
  text?: string;
  imageBase64?: string;
}): Promise<{ isAllowed: boolean; category: ViolationCategory; reason?: string; confidence: number } | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4800);

  try {
    // 1. Eğer OPENAI_API_KEY tanımlıysa resmi omni-moderation-latest modelini kullan
    if (OPENAI_API_KEY) {
      const input: any[] = [];
      if (params.text) {
        input.push({ type: "text", text: params.text });
      }
      if (params.imageBase64) {
        input.push({
          type: "image_url",
          image_url: { url: params.imageBase64 },
        });
      }

      const res = await fetch("https://api.openai.com/v1/moderations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "omni-moderation-latest",
          input,
        }),
        signal: controller.signal,
      });

      if (res.ok) {
        const data = await res.json();
        const result = data?.results?.[0];
        if (result) {
          if (result.flagged) {
            const cats = result.categories || {};
            const isSexual = Boolean(cats.sexual || cats["sexual/minors"]);
            return {
              isAllowed: false,
              category: isSexual ? (params.imageBase64 ? "nudity" : "sexual_content") : "profanity",
              confidence: 0.96,
              reason: isSexual
                ? "🛡️ Yapay Zeka Güvenlik Filtresi: İçerikte çıplaklık veya +18 müstehcen unsur tespit edildiği için engellendi."
                : "🛡️ Yapay Zeka Güvenlik Filtresi: İçerikte küfür, nefret söylemi veya topluluk kurallarına aykırı unsur tespit edildi.",
            };
          }
          return { isAllowed: true, category: "clean", confidence: 0.98 };
        }
      }
    }

    // 2. Sıfır-Konfigürasyonlu Çok Modlu AI Vision / Text Denetimi
    if (params.imageBase64) {
      const visionPrompt = `Analyze this image strictly for content moderation on a psychology community platform.
Reject ("isAllowed": false) ONLY if the image contains:
1. Nudity, exposed breasts/genitals/buttocks, explicit sexual content, lingerie/erotic/NSFW poses ("category": "nudity")
2. Turkish or English profanity/swear words written as text on the image, or middle finger gesture ("category": "offensive_image")
Respond ONLY with valid JSON: {"isAllowed": boolean, "category": "clean"|"nudity"|"offensive_image", "confidence": number}`;

      const res = await fetch("https://text.pollinations.ai/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "openai",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: visionPrompt },
                { type: "image_url", image_url: { url: params.imageBase64 } },
              ],
            },
          ],
          temperature: 0.1,
        }),
        signal: controller.signal,
      });

      if (res.ok) {
        const data = await res.json();
        const content = data?.choices?.[0]?.message?.content || "";
        const parsed = parseJsonSafely(content);
        if (parsed && typeof parsed.isAllowed === "boolean") {
          if (!parsed.isAllowed) {
            const isNudity = parsed.category === "nudity";
            return {
              isAllowed: false,
              category: isNudity ? "nudity" : "offensive_image",
              confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0.94,
              reason: isNudity
                ? "🛡️ Yapay Zeka Görsel Denetimi: Yüklemeye çalıştığınız fotoğrafta çıplaklık veya müstehcen (+18) içerik tespit edildi. Bu fotoğraf yüklenemez."
                : "🛡️ Yapay Zeka Görsel Denetimi: Yüklemeye çalıştığınız görselin üzerinde küfür, argo veya uygunsuz ifade tespit edildi. Bu fotoğraf yüklenemez.",
            };
          }
          return { isAllowed: true, category: "clean", confidence: 0.95 };
        }
      }
    }

    return null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, text, imageBase64, fileName, clientSkinRatio } = body || {};

    // ========================================================================
    // A. METİN MODERASYONU (KÜFÜR, HAKARET, +18 METİN)
    // ========================================================================
    if (type === "text") {
      const localCheck: TextModerationResult = analyzeTextProfanitySync(String(text || ""));
      if (!localCheck.isAllowed) {
        return NextResponse.json(localCheck);
      }

      // Gemini veya AI modeliyle derin bağlam kontrolü
      const geminiCheck = await moderateWithGemini({ text: String(text || "") });
      if (geminiCheck && !geminiCheck.isAllowed) {
        return NextResponse.json({
          isAllowed: false,
          category: geminiCheck.category,
          confidence: geminiCheck.confidence,
          reason:
            geminiCheck.reason ||
            "🛡️ Yapay Zeka Sansür Filtresi: Paylaşımınızda topluluk kurallarına aykırı küfür veya uygunsuz ifade tespit edildi.",
        } satisfies TextModerationResult);
      }

      return NextResponse.json(localCheck);
    }

    // ========================================================================
    // B. GÖRSEL MODERASYONU (ÇIPLAKLIK / NSFW VE GÖRSEL ÜZERİNDEKİ KÜFÜR)
    // ========================================================================
    if (type === "image") {
      // 1. Dosya adı kontrolü
      if (fileName) {
        const nameCheck = analyzeTextProfanitySync(String(fileName));
        if (!nameCheck.isAllowed) {
          return NextResponse.json({
            isAllowed: false,
            category: "offensive_image",
            confidence: 0.98,
            reason:
              "🛡️ Yapay Zeka Görsel Güvenlik Filtresi: Dosya adında küfür veya uygunsuz (+18) ifade tespit edildiği için fotoğraf reddedildi.",
          } satisfies ImageModerationResult);
        }
      }

      if (!imageBase64 || typeof imageBase64 !== "string") {
        return NextResponse.json(
          { isAllowed: false, category: "offensive_image", confidence: 0.9, reason: "Geçersiz görsel verisi." },
          { status: 400 }
        );
      }

      // 2. Gemini Vision varsa öncelikli olarak çalıştır
      const geminiImgCheck = await moderateWithGemini({ imageBase64 });
      if (geminiImgCheck) {
        if (!geminiImgCheck.isAllowed) {
          return NextResponse.json({
            isAllowed: false,
            category: geminiImgCheck.category,
            confidence: geminiImgCheck.confidence,
            reason:
              geminiImgCheck.reason ||
              "🛡️ Yapay Zeka Görsel Denetimi: Fotoğrafta çıplaklık veya uygunsuz içerik tespit edildiği için yükleme engellendi.",
          } satisfies ImageModerationResult);
        }
      }

      // 3. Multimodal Vision AI denetimi
      const visionCheck = await moderateWithVisionAI({ imageBase64 });
      if (visionCheck && !visionCheck.isAllowed) {
        return NextResponse.json({
          isAllowed: false,
          category: visionCheck.category,
          confidence: visionCheck.confidence,
          reason: visionCheck.reason,
        } satisfies ImageModerationResult);
      }

      // 4. İstemci CV ten oranı yüksek sınırda ise ek güvenlik kontrolü
      if (typeof clientSkinRatio === "number" && clientSkinRatio >= 55) {
        return NextResponse.json({
          isAllowed: false,
          category: "nudity",
          confidence: 0.91,
          skinRatio: clientSkinRatio,
          reason:
            "🛡️ Yapay Zeka Görsel Denetimi: Görselde yüksek oranda çıplaklık / açık ten yoğunluğu tespit edildiği için yükleme engellendi.",
        } satisfies ImageModerationResult);
      }

      return NextResponse.json({
        isAllowed: true,
        category: "clean",
        confidence: 0.96,
      } satisfies ImageModerationResult);
    }

    return NextResponse.json({ isAllowed: true, category: "clean", confidence: 1.0 });
  } catch (err: any) {
    console.error("[AI Moderation API Error]:", err);
    return NextResponse.json({ isAllowed: true, category: "clean", confidence: 0.8 });
  }
}
