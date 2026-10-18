import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dsaqzywd";
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || "784872741448477";
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || "5RiDRDLGkqLB3suMhHX29U26fPM";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folderInput = (formData.get("folder") as string) || "psikoway/uploads";

    if (!file) {
      return NextResponse.json(
        { error: "Yüklenecek fotoğraf dosyası bulunamadı." },
        { status: 400 }
      );
    }

    // Klasör adını güvenli hale getir
    const folder = folderInput.replace(/[^a-zA-Z0-9/_-]/g, "");
    const timestamp = Math.round(Date.now() / 1000).toString();

    // Cloudinary imza oluşturma (alfabetik parametre sırası + API_SECRET)
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
    const signature = crypto.createHash("sha1").update(paramsToSign).digest("hex");

    const cloudinaryForm = new FormData();
    cloudinaryForm.append("file", file);
    cloudinaryForm.append("api_key", CLOUDINARY_API_KEY);
    cloudinaryForm.append("timestamp", timestamp);
    cloudinaryForm.append("folder", folder);
    cloudinaryForm.append("signature", signature);

    const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

    const response = await fetch(uploadUrl, {
      method: "POST",
      body: cloudinaryForm,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[Cloudinary Upload Error]:", data);
      return NextResponse.json(
        { error: data?.error?.message || "Cloudinary yükleme hatası." },
        { status: response.status }
      );
    }

    // Otomatik kalite ve WebP/AVIF dönüşüm parametresi eklenmiş optimize URL
    const rawUrl: string = data.secure_url || data.url;
    const optimizedUrl = rawUrl.includes("/upload/")
      ? rawUrl.replace("/upload/", "/upload/f_auto,q_auto/")
      : rawUrl;

    return NextResponse.json({
      url: optimizedUrl,
      rawUrl,
      publicId: data.public_id,
      bytes: data.bytes,
      width: data.width,
      height: data.height,
      format: data.format,
    });
  } catch (err: any) {
    console.error("[Upload Route Error]:", err);
    return NextResponse.json(
      { error: err?.message || "Fotoğraf yüklenirken sunucu hatası oluştu." },
      { status: 500 }
    );
  }
}
