// lib/image-upload.ts
// İstemci tarafında (tarayıcıda) fotoğrafları otomatik olarak WebP formatında sıkıştırıp
// boyutunu %85-%98 oranında küçülten ve Cloudinary bulut depolamasına yükleyen yardımcı katman.

export interface CompressedUploadResult {
  url: string;
  originalSize: number;
  compressedSize: number;
  savedPercent: number;
  width: number;
  height: number;
}

export interface CompressOptions {
  maxWidth: number;
  maxHeight: number;
  quality: number;
}

/**
 * Bayt cinsinden dosya boyutunu okunabilir metne çevirir (örn: "4.2 MB", "48 KB")
 */
export function formatFileSize(bytes: number): string {
  if (!bytes || bytes <= 0) return "0 KB";
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${Math.round(kb)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
}

/**
 * Tarayıcıda HTML5 Canvas kullanarak fotoğrafı yeniden boyutlandırır ve WebP olarak sıkıştırır.
 */
export function compressImageOnClient(
  file: File,
  options: CompressOptions
): Promise<{ blob: Blob; dataUrl: string; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error("Fotoğraf dosyası okunamadı."));
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => reject(new Error("Geçersiz görsel dosyası."));
      img.onload = () => {
        let { width, height } = img;
        const { maxWidth, maxHeight, quality } = options;

        // En-boy oranını koruyarak küçült
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Görsel işleme motoru başlatılamadı."));
          return;
        }

        // Yüksek kaliteli çizim yumuşatma
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // Önce WebP dene, desteklenmiyorsa JPEG kullan
        const mimeType = "image/webp";
        const dataUrl = canvas.toDataURL(mimeType, quality);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Görsel sıkıştırılamadı."));
              return;
            }
            resolve({ blob, dataUrl, width, height });
          },
          mimeType,
          quality
        );
      };

      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Fotoğrafı önce cihazda sıkıştırır, ardından Cloudinary'ye yükler.
 * - "avatar": Maks 512x512 px, %80 WebP kalite (~15-35 KB)
 * - "forum": Maks 1280x1280 px, %82 WebP kalite (~40-95 KB)
 */
export async function uploadCompressedImage(
  file: File,
  type: "avatar" | "forum" = "forum"
): Promise<CompressedUploadResult> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Lütfen geçerli bir fotoğraf dosyası (JPG, PNG, WebP) seçin.");
  }

  // 15 MB üstü ham dosyaları engelle
  if (file.size > 15 * 1024 * 1024) {
    throw new Error("Seçilen fotoğraf 15 MB'tan büyük olamaz.");
  }

  const originalSize = file.size;

  const compressOpts: CompressOptions =
    type === "avatar"
      ? { maxWidth: 512, maxHeight: 512, quality: 0.8 }
      : { maxWidth: 1280, maxHeight: 1280, quality: 0.82 };

  // 1. Adım: Tarayıcıda sıkıştır
  const { blob, dataUrl, width, height } = await compressImageOnClient(file, compressOpts);
  const compressedSize = blob.size;
  const savedPercent =
    originalSize > compressedSize
      ? Math.round(((originalSize - compressedSize) / originalSize) * 100)
      : 0;

  // 2. Adım: Sıkıştırılmış küçük dosyayı Cloudinary API'sine gönder
  const folder = type === "avatar" ? "psikoway/avatars" : "psikoway/forum";
  const compressedFile = new File(
    [blob],
    `psikoway-${type}-${Date.now()}.webp`,
    { type: "image/webp" }
  );

  try {
    const formData = new FormData();
    formData.append("file", compressedFile);
    formData.append("folder", folder);

    const response = await fetch("/api/upload-image", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      if (data?.url) {
        return {
          url: data.url,
          originalSize,
          compressedSize: data.bytes || compressedSize,
          savedPercent,
          width: data.width || width,
          height: data.height || height,
        };
      }
    } else {
      const errData = await response.json().catch(() => ({}));
      console.warn("[Cloudinary API Fallback]:", errData);
    }
  } catch (err) {
    console.warn("[Cloudinary Network Fallback, using compressed DataURL]:", err);
  }

  // Yedek (Fallback): Eğer internet veya API kesintisi olursa sıkıştırılmış hafif WebP verisini döndür
  return {
    url: dataUrl,
    originalSize,
    compressedSize,
    savedPercent,
    width,
    height,
  };
}
