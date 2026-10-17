================================================================================
PSIKOWAY - PROJE TANITIMI VE GENEL BAKIŞ
"İnsanı anlamak, dünyayı vitrine çıkarmak."
================================================================================

1. PROJENİN ÖZETİ VE AMACI:
--------------------------------------------------------------------------------
PsikoWay; psikoloji, klinik bilim, popüler kültür ve kurgusal karakterlerin 
psikanalizi üzerine kurulmuş; psikolojik testler, interaktif topluluk forumu, 
klinik hizmetler ve randevu yönetimini tek bir çatı altında birleştiren modern 
bir web platformudur.


2. TEMEL ÖZELLİKLER VE BÖLÜMLER:
--------------------------------------------------------------------------------
A) DİZİ & FİLM KARAKTER PSİKANALİZLERİ (/analizler):
   - 70 Kült Yapım: Breaking Bad, Succession, Fight Club, Joker, The Sopranos, 
     Peaky Blinders, Dark, Fleabag vb.
   - 460'tan fazla karakter için hazırlanmış derin klinik analiz dosyası.
   - Her karakter için: Birincil Tanı, Jungiyen Arketip, Savunma Mekanizmaları, 
     İçsel Çatışmalar ve Terapötik Yaklaşımlar.
   - Kullanıcı etkileşimleri: Beğeni, yorum yapma, yer imlerine kaydetme, okuma 
     süresi ve ilerleme göstergesi.
   - 0ms gecikmeli yerel statik bellek önbelleği ile hızlı erişim.

B) PSİKOLOJİK TESTLER VE ÖLÇEKLER (/testler):
   - 8 Adet Bilimsel Test ve Ölçek:
     1. Beck Depresyon Düzeyi Ölçeği (BDI - 21 soru)
     2. Beck Anksiyete ve Kaygı Ölçeği (BAI)
     3. Büyük Beşli (Big Five / OCEAN) Kişilik Envanteri
     4. İlişkilerde Bağlanma Stili Testi (ECR)
     5. Maslach Tükenmişlik (Burnout) İndeksi
     6. Şema Terapisi (Erken Dönem Uyumsuz Şemalar & İçsel Çocuk)
     7. Öz-Şefkat ve Kendine Nezaket Ölçeği
     8. İnsanları Memnun Etme ve Kişisel Sınırlar Testi
   - Anlık puanlama, detaylı klinik değerlendirme ve kişiye özel terapi önerisi.

C) TOPLULUK VE FORUM (/forum):
   - Psikoloji, zihin, deneyim ve ilişkiler üzerine tartışma alanı.
   - Anonim paylaşım seçeneği.
   - Popüler, en yeni ve en çok tartışılan gönderi filtreleri.
   - Cloud Firestore ile gerçek zamanlı (live) senkronizasyon.

D) GELİŞMİŞ GÜVENLİK VE ANTİ-SPAM SİSTEMİ (lib/anti-spam.ts):
   - Cihaz Parmak İzi (Client Fingerprinting) ile oturumsuz bot tespiti.
   - Bal Küpü (Honeypot) tuzakları.
   - Gölge Kısıtlama (Shadowban): Spamcılar engellendiklerini anlamadan içerikleri
     yalnızca kendilerine gösterilir; platformdan gizlenir.
   - Hız Sınırı (Rate Limiting): Dakikada maksimum gönderi/yorum limiti.
   - Firebase App Check (reCAPTCHA v3) bot koruması.

E) YÖNETİM & MODERASYON PANELİ (/admin):
   - Şifreli admin girişi.
   - Kullanıcı yönetimi (banlama, toplu işlem, resmi uyarı mesajı gönderme).
   - İçerik moderasyonu (gönderi ve yorum silme, güvenlik uyarılarını inceleme).
   - Danışmanlık ve randevu mesajları gelen kutusu.
   - Veritabanı yönetim ve göç (RTDB -> Firestore) araçları.

F) KLİNİK HİZMETLER VE İLETİŞİM (/hizmetler, /iletisim):
   - Bireysel Terapi, BDT, Çift & Aile Danışmanlığı, EMDR & Travma Desteği.
   - Randevu ve iletişim talep formu.

G) KULLANICI PROFİLİ VE GİRİŞ SİSTEMİ (/auth, /profil):
   - Google ile tek tıkla giriş veya e-posta/şifre ile güvenli oturum.
   - Profil bilgileri (meslek, biyografi, avatar, anonimlik).
   - Kişisel kütüphane: Paylaşılan gönderiler, yorumlar ve kaydedilen analizler.


3. TEKNOLOJİ YIĞINI (TECH STACK):
--------------------------------------------------------------------------------
- Framework: Next.js 16 (App Router), React 19
- Dil: TypeScript
- Tasarım & Stil: Tailwind CSS v4, Glassmorphism (buzlu cam efekti), Koyu Tema (#090503, #e0b878)
- Veritabanı & Backend: Google Firebase (Cloud Firestore)
- Kimlik Doğrulama: Firebase Authentication (Google & Email/Password)
- Güvenlik: Firebase App Check (reCAPTCHA v3) + Özel Anti-Spam Motoru
- İkon Seti: Lucide React


4. ÇALIŞTIRMA TALİMATLARI:
--------------------------------------------------------------------------------
Geliştirme sunucusunu başlatmak için:
  npm install
  npm run dev

Tarayıcıdan erişmek için:
  http://localhost:3000
================================================================================
