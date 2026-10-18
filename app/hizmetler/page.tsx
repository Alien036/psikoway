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
      icon: <Brain size={18} />,
      title: "Bireysel Psikoterapi",
      desc: "İçsel çatışmalar, kendini tanıma, özsaygı, duygusal dayanıklılık ve yaşam krizleriyle başa çıkma sürecinde güvenli ve gizli bir alan sunar.",
      tags: ["Öz-Şefkat", "Duygudurum", "İçsel Denge"],
      duration: "50 Dk",
      approach: "Bütüncül & Psikodinamik",
    },
    {
      id: "bdt",
      category: "bireysel",
      icon: <Lightbulb size={18} />,
      title: "Bilişsel Davranışçı Terapi (BDT)",
      desc: "Düşünce, duygu ve davranış zincirini çözümleyerek işlevsiz inanç ve kaygı kalıplarını dönüştürmeyi amaçlayan, bilimsel kanıta dayalı yapılandırılmış terapi.",
      tags: ["Kaygı Yönetimi", "Otomatik Düşünceler", "Hedef Odaklı"],
      duration: "50 Dk",
      approach: "Kanıta Dayalı BDT",
    },
    {
      id: "emdr",
      category: "travma",
      icon: <Waves size={18} />,
      title: "EMDR & Travma Terapisi",
      desc: "Geçmişte yaşanan sarsıcı yaşam olayları, kayıplar ve fobilerin sinir sistemindeki kilitlenmelerini iki yönlü uyarım yöntemiyle duyarsızlaştırır ve yeniden işler.",
      tags: ["Travma Sonrası Stres", "Fobiler", "Duyarsızlaştırma"],
      duration: "60 Dk",
      approach: "EMDR Enstitüsü Standartları",
    },
    {
      id: "cift",
      category: "cift",
      icon: <HeartHandshake size={18} />,
      title: "Çift ve İlişki Terapisi",
      desc: "Partnerler arasındaki iletişim kopuklukları, bağlanma yaraları, güven krizleri ve duygusal yakınlaşma ihtiyaçlarına yönelik rehberlik.",
      tags: ["Duygu Odaklı Çift", "Gottman Metodu", "Güven İnşası"],
      duration: "75 Dk",
      approach: "Duygu Odaklı Terapi (EFT)",
    },
    {
      id: "panik-kaygi",
      category: "bireysel",
      icon: <ShieldAlert size={18} />,
      title: "Kaygı & Panik Atak Yönetimi",
      desc: "Sürekli endişe hali, yaygın anksiyete, agorafobi ve ani panik atak döngülerini bedensel regülasyon ve düşünce teknikleriyle kontrol altına alma.",
      tags: ["Panik Atak", "Yaygın Kaygı", "Soma ve Nefes"],
      duration: "50 Dk",
      approach: "Bilişsel & Somatik",
    },
    {
      id: "online",
      category: "online",
      icon: <Monitor size={18} />,
      title: "Çevrimiçi (Online) Terapi",
      desc: "Yurt içi veya yurt dışında yaşayan danışanlar için mesafe sınırlarını ortadan kaldıran, şifreli ve güvenli dijital seans altyapısı.",
      tags: ["Esnek Seans", "Uluslararası Erişim", "Gizli Görüşme"],
      duration: "50 Dk",
      approach: "Online Güvenli Protokol",
    },
    {
      id: "depresyon",
      category: "bireysel",
      icon: <Sprout size={18} />,
      title: "Depresyon & Yaşam Doyumu",
      desc: "Kronik motivasyon kaybı, isteksizlik, tükenmişlik ve değersizlik hisleriyle çalışarak hayata anlam ve canlılık kazandırma adımları.",
      tags: ["Tükenmişlik", "Anlam Arayışı", "Yeniden Yapılanma"],
      duration: "50 Dk",
      approach: "Varoluşçu & Bilişsel",
    },
    {
      id: "ergen",
      category: "bireysel",
      icon: <Compass size={18} />,
      title: "Genç & Ergen Danışmanlığı",
      desc: "Kimlik gelişimi, sınav kaygısı, aile içi uyumsuzluk ve akran baskısı yaşayan gençlere yönelik empatik ve destekleyici psikolojik danışmanlık.",
      tags: ["Kimlik İnşası", "Sınav Stresi", "Aile İletişimi"],
      duration: "50 Dk",
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

          {/* Hizmet Kartları Listesi - Kompakt Kutucuklar */}
          <div className="services-grid-list">
            {filteredServices.map((service) => {
              return (
                <div key={service.id} className="service-card animate-fade-up">
                  <div className="service-card-top">
                    <div className="service-card-head-row">
                      <div className="service-icon-box">{service.icon}</div>
                      <span className="service-duration">
                        <Clock size={12} />
                        {service.duration}
                      </span>
                    </div>
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

                  <div className="service-card-bottom">
                    <Link href={`/iletisim?terapi=${encodeURIComponent(service.title)}`} className="btn-card-action">
                      <span>Randevu Al</span>
                      <ArrowRight size={13} />
                    </Link>

                    <a
                      href={`https://wa.me/905523283646?text=${encodeURIComponent(`Merhaba ${service.title} terapisi almak istiyorum hangi saatler uygun`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-whatsapp-card-action"
                      title={`${service.title} için WhatsApp ile hızlı bilgi al`}
                    >
                      <MessageSquare size={12} />
                      <span>WhatsApp</span>
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
