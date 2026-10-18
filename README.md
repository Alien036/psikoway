# PsikoWay | Psikoloji, Zihin Analizleri & Topluluk Platformu

> **"İnsanı anlamak, dünyayı vitrine çıkarmak."**  
> Psikoloji, klinik bilim, popüler kültür ve kurgusal karakterlerin psikanalizi üzerine kurulmuş; testler, forum ve klinik danışmanlık hizmetlerini bir araya getiren kapsamlı bir dijital zihin platformu.

---

## 🌟 Proje Nedir? (Projenin Olayı)

**PsikoWay**, modern psikoloji bilimini herkes için erişilebilir, etkileşimli ve ilgi çekici hale getirmeyi amaçlayan tam teşekküllü bir web platformudur. 

Geleneksel psikoloji sitelerinden farklı olarak; popüler kültürdeki ikonik karakterlerin derinlemesine klinik vaka analizlerini, bilimsel psikolojik ölçekleri, kullanıcıların özgürce tartışabileceği güvenli bir topluluk forumunu ve profesyonel terapi randevu altyapısını tek bir çatı altında sunar.

---

## 🚀 Temel Özellikler ve Modüller

### 1. 🎬 Kült Dizi & Film Karakter Psikanalizleri (`/analizler`)
- **70 Kült Yapım**: *Breaking Bad, Succession, Fight Club, Joker, The Sopranos, Peaky Blinders, Fleabag, Dark* ve daha fazlası.
- **460+ Detaylı Vaka Dosyası**: Her karakter için Jungiyen arketipler, birincil psikolojik tanı (Narsisizm, Antisosyal, Travma, Anhedoni, OKB vb.), savunma mekanizmaları, temel içsel çatışmalar ve terapötik yaklaşım önerileri.
- **Etkileşim Sistemi**: Analizleri beğenme, yorum yapma, favorilere kaydetme, okuma süresi ve dinamik okuma ilerleme çubuğu.
- **Yüksek Performans (0ms Veri Erişimi)**: Statik önbellek mimarisi sayesinde veritabanı okuma kotası harcamadan ışık hızında yükleme.

### 2. 🧠 Bilimsel Psikolojik Testler & Ölçekler (`/testler`)
- **8 Kapsamlı Test**:
  1. **Beck Depresyon Düzeyi Ölçeği (BDI)**: 21 soruluk klinik standart simülasyon.
  2. **Beck Anksiyete ve Kaygı Ölçeği (BAI)**: Bedensel ve zihinsel anksiyete seviyesi.
  3. **Büyük Beşli (Big Five / OCEAN) Kişilik Envanteri**: 5 ana kişilik boyutunun analizi.
  4. **İlişkilerde Bağlanma Stili Testi (ECR)**: Güvenli, kaygılı, kaçıngan ve korkulu bağlanma dinamikleri.
  5. **Maslach Tükenmişlik (Burnout) İndeksi**: İş ve yaşam tükenmişlik riski.
  6. **Şema Terapisi**: Erken dönem uyumsuz şemalar ve içsel çocuk inanç kalıpları.
  7. **Öz-Şefkat ve Kendine Nezaket Ölçeği**: Kendine yönelik eleştiri vs. şefkat dengesi.
  8. **İnsanları Memnun Etme ve Kişisel Sınırlar Testi**: "Hayır" diyebilme ve sınır farkındalığı.
- **Sonuç Raporu**: Anlık puanlama, detaylı klinik değerlendirme ve kişiye özel terapi yaklaşımı önerisi.

### 3. 💬 Topluluk & Forum (`/forum`)
- Kullanıcıların zihin, felsefe, psikoloji, deneyim ve ilişkiler üzerine tartışabildiği güvenli alan.
- **Anonim Paylaşım**: Hassas konularda kimliğini gizleyerek soru sorabilme / deneyim aktarabilme.
- **Kategoriler & Filtreler**: Popüler, en yeni, en çok tartışılan sıralamaları.
- **Canlı Senkronizasyon**: Cloud Firestore ile anlık güncellenen gönderiler ve yorumlar.

### 4. 🛡️ Gelişmiş Güvenlik & Anti-Spam Mimarisi (`lib/anti-spam.ts`)
- **Cihaz Parmak İzi (Client Fingerprinting)**: Giriş yapmamış kullanıcıları ve botları cihaz bazında tanıma.
- **Bal Küpü (Honeypot Trap)**: Formlara yerleştirilen gizli alanlarla otomatik botları yakalama.
- **Gölge Kısıtlama (Shadowban)**: Spam veya saldırgan içerik üreten hesapların içerikleri sessizce yalnızca kendilerine gösterilir; platformun geri kalanından izole edilir.
- **Hız Sınırı (Rate Limiting)**: Dakikada maksimum gönderi/yorum kotası ile flood koruması.
- **Firebase App Check & reCAPTCHA v3**: İstemci doğrulama ve API kötüye kullanım engelleme.

### 5. 👑 Yönetim & Moderasyon Paneli (`/admin`)
- Şifre korumalı özel yönetim paneli.
- **Kullanıcı Yönetimi**: Kullanıcı listeleme, ceza/yasaklama (ban & bulk ban), resmi uyarı mesajı gönderme, roller.
- **İçerik Moderasyonu**: Şüpheli içerikleri, flood denemelerini ve spam alarmlarını inceleme; gönderi ve yorum silme/düzenleme.
- **Gelen Kutusu**: Randevu ve danışmanlık taleplerini okuma, yanıtlama ve arşivleme.
- **Sistem Araçları**: Veritabanı senkronizasyon ve göç (RTDB -> Firestore) araçları.

### 6. 🩺 Klinik Psikolojik Hizmetler & Randevu (`/hizmetler` & `/iletisim`)
- Bireysel Terapi, Bilişsel Davranışçı Terapi (BDT), Çift & Aile Danışmanlığı, EMDR & Travma Desteği gibi seans hizmetleri.
- Doğrudan panel entegreli randevu ve iletişim formu.

### 7. 👤 Kullanıcı Profili ve Oturum Sistemi (`/auth` & `/profil`)
- Google ile tek tıkla giriş veya e-posta/şifre doğrulaması.
- Profil düzenleme (meslek, biyografi, avatar seçimi, anonimlik tercihleri).
- Kullanıcının açtığı konular, yaptığı yorumlar ve kaydettiği analizleri içeren kişisel kütüphane.

---

## 🛠️ Teknoloji Yığını (Tech Stack)

| Alan | Teknoloji | Açıklama |
|---|---|---|
| **Frontend Framework** | **Next.js 16** (App Router) & **React 19** | Modern SSR & CSR hibrit yapı |
| **Dil** | **TypeScript 5** | Tip güvenli kod tabanı |
| **Stil & Tasarım** | **Tailwind CSS v4** + Özel CSS | Amber/Gold (#e0b878) lüks koyu tema, glassmorphism |
| **Veritabanı & Backend** | **Google Firebase (Cloud Firestore)** | Gerçek zamanlı NoSQL veritabanı |
| **Kimlik Doğrulama** | **Firebase Authentication** | Google OAuth & Email/Şifre oturumları |
| **Güvenlik & Bot Koruması** | **Firebase App Check (reCAPTCHA v3)** | Bot ve tersine mühendislik koruması |
| **İkonlar** | **Lucide React** | Modern ve hafif SVG ikon seti |
| **Tipografi** | **Geist & Playfair Display** | Lüks ve okunabilir font ailesi |

---

## 📁 Proje Dizin Yapısı

```plaintext
piskoway/
├── app/                      # Next.js App Router sayfaları
│   ├── admin/                # Yönetici & Moderasyon Paneli
│   ├── analizler/            # Dizi & Film karakter psikanalizleri
│   │   └── karakter/[id]/    # Karakter detay vaka dosyaları
│   ├── auth/                 # Giriş & Kayıt ekranı
│   ├── forum/                # Topluluk tartışma platformu
│   ├── hizmetler/            # Klinik terapi ve danışmanlık hizmetleri
│   ├── iletisim/             # Randevu ve iletişim sayfası
│   ├── profil/               # Kullanıcı profil & kayıtlılar alanı
│   ├── testler/              # 8 adet psikolojik ölçek ve testler
│   ├── globals.css           # Global stil tanımlamaları & cam teması
│   ├── layout.tsx            # Ana HTML iskeleti ve AuthProvider
│   └── page.tsx              # Açılış (Landing/Hero) ana sayfası
│
├── components/               # Tekrar kullanılabilir UI bileşenleri
│   ├── AnalysisInteractions  # Beğeni, yorum, kaydetme modülü
│   ├── BackgroundVideo       # Amber atmosferik arka plan videosu
│   ├── Navbar                # Şeffaf buzlu cam menü
│   ├── Footer                # Sayfa altlığı ve telif bilgileri
│   └── SocialIcons           # Sosyal medya ikonları
│
├── context/                  # Global durum yönetimleri
│   └── AuthContext.tsx       # Kullanıcı oturum & yetki yönetimi
│
├── lib/                      # Veri, servis ve yardımcı fonksiyonlar
│   ├── series-data/          # 70 yapım ve 461 karakter analiz verisi
│   ├── tests-data.tsx        # Psikolojik testlerin mantığı ve raporları
│   ├── forum-data.ts         # Forum gönderi/yorum Firestore işlemleri
│   ├── anti-spam.ts          # Parmak izi, honeypot, shadowban & rate-limit
│   ├── admin-data.ts         # Yönetici yetkileri ve moderasyon araçları
│   ├── profile-data.ts       # Kullanıcı profil CRUD ve istatistikler
│   ├── contact-data.ts       # Seans ve randevu mesajları
│   ├── community-stats.ts    # Gerçek zamanlı üye sayaçları
│   └── firebase.ts           # Firebase SDK & App Check başlatıcı
│
├── firestore.rules           # Cloud Firestore güvenlik ve rol kuralları
├── package.json              # Bağımlılıklar ve npm betikleri
└── README.md                 # Proje tanıtım ve dokümantasyon dosyası
```

---

## ⚡ Kurulum ve Çalıştırma

Projeyi yerel makinenizde çalıştırmak için:

```bash
# 1. Bağımlılıkları yükleyin
npm install

# 2. Geliştirme sunucusunu başlatın
npm run dev

# 3. Tarayıcınızda açın
http://localhost:3000
```

---

## 🔒 Güvenlik Kuralları (Firestore)
Veritabanı kuralları `firestore.rules` dosyasında sıkı bir şekilde tanımlanmıştır:
- Kullanıcılar yalnızca kendi profillerini güncelleyebilir.
- Yasaklı (banned) kullanıcıların yazma yetkileri Firestore seviyesinde engellenir.
- İletişim mesajları yalnızca anonim oluşturulabilir; yalnızca yetkili adminler okuyabilir.
- Moderasyon alarmları ve yönetici alanları uçtan uca korunmaktadır.

