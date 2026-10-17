"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BackgroundVideo from "../components/BackgroundVideo";
import Link from "next/link";
import { ArrowRight, Compass, Sparkles, MessageSquareQuote, Film, HeartHandshake } from "lucide-react";

import { subscribeToRealUserCount } from "../lib/community-stats";

export default function Home() {
  const [kayitliKullanici, setKayitliKullanici] = useState("...");

  useEffect(() => {
    // Firebase Realtime Database üzerinden gerçek kullanıcı sayısını canlı olarak dinle
    const unsubscribeUsers = subscribeToRealUserCount((count) => {
      setKayitliKullanici(count.toLocaleString("tr-TR"));
    });

    return () => {
      unsubscribeUsers();
    };
  }, []);

  return (
    <>
      {/* Kehribar Geçişli Video Arka Plan */}
      <BackgroundVideo />

      {/* Ekranın En Üstünde Sabit Kalan Menü */}
      <Navbar />

      {/* --- İLK EKRAN (HERO) BÖLÜMÜ --- */}
      <section className="hero-fullscreen">
        {/* Ana Yazılar */}
        <div className="hero-content-center animate-fade-down">
          <h1>İnsanı Anlamak,<br />Dünyayı Vitrine Çıkarmak.</h1>
          <p>
            Psikoloji, bilim, kültür ve hikayelerle zihninin farklı yönlerini keşfet.
          </p>
          <div className="hero-actions-center animate-fade-up delay-2">
            <a href="#kesfet" className="btn-primary-solid" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
              <Compass size={18} />
              <span>Keşfet</span>
            </a>
            <div className="live-stats-glass">
              <span className="dot"></span> {kayitliKullanici} Kişi Aramıza Katıldı
            </div>
          </div>
        </div>
      </section>

      {/* --- AŞAĞI KAYDIRINCA GELEN BUZLU CAM BÖLÜM --- */}
      <main className="main-content">
        
        {/* 3'LÜ GÖRSEL KATEGORİLER BÖLÜMÜ */}
        <section className="visual-categories" id="kesfet">
          <div className="categories-grid">
            
            {/* 1. Görsel (Psikolojik Analizler -> Dizi & Film Psikanalizleri) */}
            <Link
              href="/analizler"
              className="category-card animate-fade-up delay-1 interactive-category-card"
              aria-label="Psikolojik Analizler - IMDb Dizi ve Kült Film Karakter Psikanalizleri"
            >
              <img src="/kategori1.jpg" alt="Psikolojik Analizler" />
              <div className="category-overlay">
                <div className="category-badge-chip">
                  <Film size={13} />
                  <span>70 Kült Yapım • Keşfet</span>
                </div>
                <h4>Psikolojik Analizler</h4>
                <p>IMDb Top 50 kült dizisi ve Joker gibi kült filmlerin psikanalitik karakter çözümlemeleri.</p>
                <div className="category-sub-tags">
                  <span className="sub-tag">Dizi &amp; Film Analizleri</span>
                  <span className="sub-tag">Joker &amp; Kült Karakterler</span>
                  <span className="sub-tag">460+ Vaka Dosyası</span>
                </div>
              </div>
            </Link>

            {/* 2. Görsel (Ortada: Psikolojik Testler -> Testler & Ölçekler) */}
            <Link
              href="/testler"
              className="category-card animate-fade-up delay-2 interactive-category-card"
              aria-label="Psikolojik Testler - Kokoloji ve Kişilik Haritası Ölçekleri"
            >
              <img src="/kategori_testler.jpg" alt="Psikolojik Testler" />
              <div className="category-overlay">
                <div className="category-badge-chip">
                  <Sparkles size={13} />
                  <span>Zihnini Keşfet • Teste Başla</span>
                </div>
                <h4>Psikolojik Testler</h4>
                <p>Kokoloji testleri, bağlanma stilleri, anksiyete ve kişilik haritası ölçekleri ile zihnini tanı.</p>
                <div className="category-sub-tags">
                  <span className="sub-tag">Kokoloji Testleri</span>
                  <span className="sub-tag">Kişilik Haritası</span>
                  <span className="sub-tag">Bağlanma &amp; Anksiyete</span>
                </div>
              </div>
            </Link>

            {/* 3. Görsel (Psikolojik Hizmetler -> Klinik Terapi & Danışmanlık) */}
            <Link
              href="/hizmetler"
              className="category-card animate-fade-up delay-3 interactive-category-card"
              aria-label="Psikolojik Hizmetler - Bireysel Terapi, BDT ve Çift Danışmanlığı"
            >
              <img src="/kategori2.jpg" alt="Psikolojik Hizmetler" />
              <div className="category-overlay">
                <div className="category-badge-chip">
                  <HeartHandshake size={13} />
                  <span>Klinik Destek • Seans Al</span>
                </div>
                <h4>Psikolojik Hizmetler</h4>
                <p>Bireysel Terapi, BDT ve Çift Danışmanlığı alanında etik ve bilimsel psikolojik destek.</p>
                <div className="category-sub-tags">
                  <span className="sub-tag">Bireysel Terapi</span>
                  <span className="sub-tag">BDT Danışmanlığı</span>
                  <span className="sub-tag">Çift &amp; Aile Terapisi</span>
                </div>
              </div>
            </Link>

          </div>
        </section>

        {/* TOPLULUK & FORUM ÇAĞRI BÖLÜMÜ */}
        <section className="forum-preview-section animate-fade-up delay-3" style={{ maxWidth: "1200px", margin: "40px auto 20px auto", padding: "0 24px" }}>
          <div className="forum-preview-banner-card" style={{
            background: "linear-gradient(135deg, rgba(224, 184, 120, 0.12), rgba(255, 255, 255, 0.04))",
            border: "1px solid rgba(224, 184, 120, 0.25)",
            borderRadius: "24px",
            padding: "36px 40px",
            backdropFilter: "blur(20px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "24px"
          }}>
            <div style={{ maxWidth: "620px" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(224, 184, 120, 0.15)", color: "#e0b878", padding: "4px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: "700", marginBottom: "12px" }}>
                <MessageSquareQuote size={13} />
                <span>PsikoWay Topluluk & Forum</span>
              </div>
              <h3 style={{ fontSize: "26px", fontFamily: "'Playfair Display', serif", fontWeight: "700", color: "#fff", marginBottom: "10px" }}>
                Düşüncelerini Paylaş, Zihinlerle Bağ Kur
              </h3>
              <p style={{ fontSize: "14.5px", color: "rgba(255, 255, 255, 0.75)", lineHeight: "1.6" }}>
                Giriş yaptıktan sonra psikoloji, içsel farkındalık ve felsefi düşüncelerini özgürce paylaşabileceğin, diğer insanların deneyimlerini dinleyebileceğin güvenli forum alanımız seni bekliyor.
              </p>
            </div>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link href="/forum" className="btn-primary-solid" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                <MessageSquareQuote size={16} />
                <span>Foruma Katıl</span>
              </Link>
              <Link href="/auth?redirect=/forum" className="btn-white-outline" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                <span>Giriş Yap</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        <section id="iletisim" className="cta-section">
          <div className="cta-container animate-fade-up delay-3">
            <h2>Zihinsel sağlığınızda yeni bir sayfa açmaya hazır mısınız?</h2>
            <a href="/iletisim" className="btn-white-large" style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
              <span>Hemen Seans Randevusu Al</span>
              <ArrowRight size={18} />
            </a>
            <div className="contact-info">
              Sorularınız ve randevu talepleriniz için bize ulaşın:<br />
              <div style={{ display: "flex", gap: "16px", justifyContent: "center", alignItems: "center", flexWrap: "wrap", marginTop: "8px" }}>
                <a href="tel:+905523283646" className="email-link">
                  📞 +90 552 328 36 46
                </a>
                <a href="mailto:psikowayresmi@gmail.com" className="email-link">
                  ✉️ psikowayresmi@gmail.com
                </a>
                <span style={{ color: "rgba(255,255,255,0.7)" }}>
                  📍 Kahramanmaraş, Türkiye
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}