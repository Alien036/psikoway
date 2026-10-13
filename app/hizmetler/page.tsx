"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import BackgroundVideo from "../../components/BackgroundVideo";
import { 
  Brain, 
  Lightbulb, 
  Waves, 
  HeartHandshake, 
  ShieldAlert, 
  Monitor, 
  Sprout, 
  Compass, 
  Clock, 
  ArrowRight,
  Sparkles,
  MessageSquare
} from "lucide-react";

interface ServiceItem {
  id: string;
  category: "bireysel" | "cift" | "travma" | "online";
  icon: React.ReactNode;
  title: string;
  desc: string;
  tags: string[];
  duration: string;
  approach: string;
}

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const services: ServiceItem[] = [
    {
      id: "bireysel",
      category: "bireysel",
      icon: <Brain size={26} />,
      title: "Bireysel Psikoterapi",
      desc: "İçsel çatışmalar, kendini tanıma, özsaygı, duygusal dayanıklılık ve yaşam krizleriyle başa çıkma sürecinde güvenli ve gizli bir alan sunar.",
      tags: ["Öz-Şefkat", "Duygudurum", "İçsel Denge"],
      duration: "50 Dakika",
      approach: "Bütüncül & Psikodinamik",
    },
    {
      id: "bdt",
      category: "bireysel",
      icon: <Lightbulb size={26} />,
      title: "Bilişsel Davranışçı Terapi (BDT)",
      desc: "Düşünce, duygu ve davranış zincirini çözümleyerek işlevsiz inanç ve kaygı kalıplarını dönüştürmeyi amaçlayan, bilimsel kanıta dayalı yapılandırılmış terapi.",
      tags: ["Kaygı Yönetimi", "Otomatik Düşünceler", "Hedef Odaklı"],
      duration: "50 Dakika",
      approach: "Kanıta Dayalı BDT",
    },
    {
      id: "emdr",
      category: "travma",
      icon: <Waves size={26} />,
      title: "EMDR & Travma Terapisi",
      desc: "Geçmişte yaşanan sarsıcı yaşam olayları, kayıplar ve fobilerin sinir sistemindeki kilitlenmelerini iki yönlü uyarım yöntemiyle duyarsızlaştırır ve yeniden işler.",
      tags: ["Travma Sonrası Stres", "Fobiler", "Duyarsızlaştırma"],
      duration: "60 Dakika",
      approach: "EMDR Enstitüsü Standartları",
    },
    {
      id: "cift",
      category: "cift",
      icon: <HeartHandshake size={26} />,
      title: "Çift ve İlişki Terapisi",
      desc: "Partnerler arasındaki iletişim kopuklukları, bağlanma yaraları, güven krizleri ve duygusal yakınlaşma ihtiyaçlarına yönelik rehberlik.",
      tags: ["Duygu Odaklı Çift Terapisi", "Gottman Metodu", "Güven İnşası"],
      duration: "75 Dakika",
      approach: "Duygu Odaklı Terapi (EFT)",
    },
    {
      id: "panik-kaygi",
      category: "bireysel",
      icon: <ShieldAlert size={26} />,
      title: "Kaygı & Panik Atak Yönetimi",
      desc: "Sürekli endişe hali, yaygın anksiyete, agorafobi ve ani panik atak döngülerini bedensel regülasyon ve düşünce teknikleriyle kontrol altına alma.",
      tags: ["Panik Atak", "Yaygın Kaygı", "Soma ve Nefes"],
      duration: "50 Dakika",
      approach: "Bilişsel & Somatik",
    },
    {
      id: "online",
      category: "online",
      icon: <Monitor size={26} />,
      title: "Çevrimiçi (Online) Terapi",
      desc: "Yurt içi veya yurt dışında yaşayan danışanlar için mesafe sınırlarını ortadan kaldıran, şifreli ve güvenli dijital seans altyapısı.",
      tags: ["Esnek Seans", "Uluslararası Erişim", "Gizli Görüşme"],
      duration: "50 Dakika",
      approach: "Online Güvenli Protokol",
    },
    {
      id: "depresyon",
      category: "bireysel",
      icon: <Sprout size={26} />,
      title: "Depresyon & Yaşam Doyumu",
      desc: "Kronik motivasyon kaybı, isteksizlik, tükenmişlik ve değersizlik hisleriyle çalışarak hayata anlam ve canlılık kazandırma adımları.",
      tags: ["Tükenmişlik", "Anlam Arayışı", "Yeniden Yapılanma"],
      duration: "50 Dakika",
      approach: "Varoluşçu & Bilişsel",
    },
    {
      id: "ergen",
      category: "bireysel",
      icon: <Compass size={26} />,
      title: "Genç & Ergen Danışmanlığı",
      desc: "Kimlik gelişimi, sınav kaygısı, aile içi uyumsuzluk ve akran baskısı yaşayan gençlere yönelik empatik ve destekleyici psikolojik danışmanlık.",
      tags: ["Kimlik İnşası", "Sınav Stresi", "Aile İletişimi"],
      duration: "50 Dakika",
      approach: "Gelişim Odaklı",
    },
  ];

  const filteredServices =
    selectedCategory === "all"
      ? services
      : services.filter((s) => s.category === selectedCategory);

  return (
    <div className="page-wrapper">
      {/* Kehribar Geçişli Video Arka Plan */}
      <BackgroundVideo />

      <Navbar />

      <header className="page-header-hero">
        <div className="pill-badge" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
          <Sparkles size={14} />
          <span>Uzman Psikolojik Danışmanlık</span>
        </div>
        <h1 className="page-title">Hizmetler ve Terapi Alanları</h1>
        <p className="page-desc">
          Zihinsel esneklik, duygusal iyileşme ve sürdürülebilir iç huzur için etik ve bilimsel ilkelerle yapılandırılmış seans süreçleri.
        </p>
      </header>

      <main className="content-glass-section">
        <div className="content-container">
          {/* Kategori Filtresi */}
          <div className="filter-tabs animate-fade-down">
            <button
              type="button"
              className={`filter-btn ${selectedCategory === "all" ? "active" : ""}`}
              onClick={() => setSelectedCategory("all")}
            >
              Tüm Hizmetler
            </button>
            <button
              type="button"
              className={`filter-btn ${selectedCategory === "bireysel" ? "active" : ""}`}
              onClick={() => setSelectedCategory("bireysel")}
            >
              Bireysel Terapi
            </button>
            <button
              type="button"
              className={`filter-btn ${selectedCategory === "cift" ? "active" : ""}`}
              onClick={() => setSelectedCategory("cift")}
            >
              Çift & Aile
            </button>
            <button
              type="button"
              className={`filter-btn ${selectedCategory === "travma" ? "active" : ""}`}
              onClick={() => setSelectedCategory("travma")}
            >
              EMDR & Travma
            </button>
            <button
              type="button"
              className={`filter-btn ${selectedCategory === "online" ? "active" : ""}`}
              onClick={() => setSelectedCategory("online")}
            >
              Online Terapi
            </button>
          </div>

          {/* Hizmet Kartları Listesi */}
          <div className="services-grid-list">
            {filteredServices.map((service, index) => {
              const delayClass = `delay-${(index % 8) + 1}`;
              return (
                <div key={service.id} className={`service-card animate-fade-up ${delayClass}`}>
                  <div className="service-card-top">
                    <div className="service-icon-box">{service.icon}</div>
                    <h3>{service.title}</h3>
                    <p>{service.desc}</p>
                    <div className="service-meta-tags">
                      {service.tags.map((tag) => (
                        <span key={tag} className="service-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="service-card-bottom" style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "stretch" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span className="service-duration" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <Clock size={15} />
                        {service.duration}
                      </span>
                      <Link href={`/iletisim?terapi=${encodeURIComponent(service.title)}`} className="btn-card-action">
                        <span>Randevu Al</span>
                        <ArrowRight size={15} />
                      </Link>
                    </div>

                    <a
                      href={`https://wa.me/905523283646?text=${encodeURIComponent(`Merhaba ${service.title} terapisi almak istiyorum hangi saatler uygun`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-whatsapp-card-action"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        background: "rgba(37, 211, 102, 0.12)",
                        border: "1px solid rgba(37, 211, 102, 0.35)",
                        color: "#25D366",
                        padding: "7px 12px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: 600,
                        textDecoration: "none",
                        transition: "all 0.2s ease"
                      }}
                      title={`${service.title} için WhatsApp ile hızlı bilgi al`}
                    >
                      <MessageSquare size={14} />
                      <span>WhatsApp ile Hızlı Bilgi Al</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Terapi Süreci Yol Haritası */}
          <section className="process-section animate-fade-up delay-4">
            <div className="process-header">
              <h2>Terapi Süreci Nasıl İlerler?</h2>
              <p style={{ color: "rgba(255,255,255,0.7)", maxWidth: "600px", margin: "0 auto" }}>
                Her danışanın öyküsü biriciktir. Seans yolculuğumuz öngörülebilir ve güvenli adımlarla kurgulanır.
              </p>
            </div>

            <div className="process-grid">
              <div className="process-step-card animate-fade-up delay-1">
                <div className="step-num">01</div>
                <h4>Ön Değerlendirme</h4>
                <p>Mevcut zorlanmalar, ihtiyaçlar ve terapi hedefleri ilk seansta detaylıca ele alınır.</p>
              </div>

              <div className="process-step-card animate-fade-up delay-2">
                <div className="step-num">02</div>
                <h4>Kişiye Özel Plan</h4>
                <p>Danışanın bilişsel ve duygusal yapısına en uygun bilimsel ekol ve seans sıklığı belirlenir.</p>
              </div>

              <div className="process-step-card animate-fade-up delay-3">
                <div className="step-num">03</div>
                <h4>Aktif Seanslar</h4>
                <p>Farkındalık, başa çıkma becerileri ve içsel dönüşüm odaklı haftalık seans çalışmaları yürütülür.</p>
              </div>

              <div className="process-step-card animate-fade-up delay-4">
                <div className="step-num">04</div>
                <h4>Kazanım & Kapanış</h4>
                <p>Kazanılan zihinsel dayanıklılık gözden geçirilir ve seanslar güvenle sonlandırılır.</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
