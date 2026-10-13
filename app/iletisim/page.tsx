"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import BackgroundVideo from "../../components/BackgroundVideo";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageSquare, 
  CheckCircle2, 
  Sparkles,
  Send
} from "lucide-react";
import { saveContactMessageToFirebase } from "../../lib/contact-data";

const WHATSAPP_PHONE = "905523283646";
const DISPLAY_PHONE = "+90 552 328 36 46";
const CLINIC_ADDRESS = "Kahramanmaraş, Türkiye";

const DEFAULT_THERAPIES = [
  "Bireysel Psikoterapi",
  "Bilişsel Davranışçı Terapi (BDT)",
  "EMDR & Travma Terapisi",
  "Çift ve İlişki Terapisi",
  "Kaygı & Panik Atak Yönetimi",
  "Depresyon & Yaşam Doyumu",
  "Ergen ve Genç Danışmanlığı",
  "Çevrimiçi (Online) Terapi",
];

// Terapiye özel WhatsApp mesaj bağlantısı
function getWhatsAppUrl(therapyName: string) {
  const safeName = (therapyName || "Bireysel Psikoterapi").trim();
  const message = `Merhaba ${safeName} terapisi almak istiyorum hangi saatler uygun`;
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    serviceType: "Bireysel Psikoterapi",
    sessionFormat: "Yüz Yüze (Kahramanmaraş Klinik)",
    preferredTime: "Hafta İçi Öğleden Sonra",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  // URL query parametrelerinden gelen hizmeti otomatik seç (örn: /iletisim?terapi=EMDR veya /iletisim?hizmet=bdt)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const queryTherapy = params.get("terapi") || params.get("hizmet");
      if (queryTherapy) {
        const mapping: Record<string, string> = {
          bireysel: "Bireysel Psikoterapi",
          bdt: "Bilişsel Davranışçı Terapi (BDT)",
          emdr: "EMDR & Travma Terapisi",
          cift: "Çift ve İlişki Terapisi",
          "panik-kaygi": "Kaygı & Panik Atak Yönetimi",
          online: "Çevrimiçi (Online) Terapi",
          depresyon: "Depresyon & Yaşam Doyumu",
          ergen: "Ergen ve Genç Danışmanlığı",
        };
        const resolved = mapping[queryTherapy.toLowerCase()] || queryTherapy;
        setFormData((prev) => ({
          ...prev,
          serviceType: resolved,
        }));
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveContactMessageToFirebase({
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        serviceType: formData.serviceType,
        sessionFormat: formData.sessionFormat,
        preferredTime: formData.preferredTime,
        message: formData.message,
      });
    } catch (err) {
      console.warn("Save message to Firebase error:", err);
    }
    setSubmitted(true);
  };

  const faqItems = [
    {
      q: "Seanslarda gizlilik nasıl sağlanır?",
      a: "Tüm görüşmeler Türk Psikologlar Derneği etik yönetmeliği ve uluslararası gizlilik ilkeleri çerçevesinde mutlak gizlilik altındadır. Danışanın onayı olmadan hiçbir üçüncü tarafla bilgi paylaşılmaz.",
    },
    {
      q: "Seanslar ne sıklıkla ve ne kadar sürer?",
      a: "Bireysel psikoterapi seansları standart olarak 50 dakika, çift terapileri 75 dakika sürer. İdeal sıklık haftada bir seanstır; sürecin ilerleyen aşamalarında iki haftada bire esnetilebilir.",
    },
    {
      q: "Online terapi yüz yüze terapi kadar etkili midir?",
      a: "Bilimsel araştırmalar, özellikle Bilişsel Davranışçı Terapi ve bireysel danışmanlıkta online seansların yüz yüze seanslarla eşdeğer klinik başarı sağladığını göstermektedir.",
    },
  ];

  // Listede olmayan bir terapi geldiyse de dropdown'a ekle
  const therapyList = DEFAULT_THERAPIES.includes(formData.serviceType)
    ? DEFAULT_THERAPIES
    : [formData.serviceType, ...DEFAULT_THERAPIES];

  return (
    <div className="page-wrapper">
      {/* Kehribar Geçişli Video Arka Plan */}
      <BackgroundVideo />

      <Navbar />

      <header className="page-header-hero">
        <div className="pill-badge" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
          <Sparkles size={14} />
          <span>İlk Adımı Atın</span>
        </div>
        <h1 className="page-title">İletişim ve Seans Randevusu</h1>
        <p className="page-desc">
          Zihinsel sağlığınız ve içsel yolculuğunuz için güvenli bir başlangıç yapın. Seans randevusu oluşturabilir veya kliniğimize ulaşabilirsiniz.
        </p>
      </header>

      <main className="content-glass-section">
        <div className="content-container">
          <div className="contact-layout-grid">
            {/* Sol Taraf: Klinik Bilgileri & SSS */}
            <div className="contact-info-panel animate-fade-up delay-1">
              <div className="contact-box">
                <h3>Klinik Bilgileri</h3>

                <div className="contact-item-row">
                  <span className="contact-icon"><MapPin size={20} /></span>
                  <div>
                    <strong>Adres:</strong>
                    <div>{CLINIC_ADDRESS}</div>
                  </div>
                </div>

                <div className="contact-item-row">
                  <span className="contact-icon"><Phone size={20} /></span>
                  <div>
                    <strong>Telefon:</strong>
                    <div>
                      <a href={`tel:+${WHATSAPP_PHONE}`} style={{ color: "inherit", textDecoration: "none" }}>
                        {DISPLAY_PHONE}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="contact-item-row">
                  <span className="contact-icon"><Mail size={20} /></span>
                  <div>
                    <strong>E-Posta:</strong>
                    <div>psikowayresmi@gmail.com</div>
                  </div>
                </div>

                <div className="contact-item-row">
                  <span className="contact-icon"><Clock size={20} /></span>
                  <div>
                    <strong>Çalışma Saatleri:</strong>
                    <div>Pazartesi – Cumartesi: 09:30 – 20:30 (Pazar: Kapalı)</div>
                  </div>
                </div>

                {/* WhatsApp ile Hızlı Bilgi Al Butonu */}
                <div style={{ marginTop: "24px" }}>
                  <a
                    href={getWhatsAppUrl(formData.serviceType)}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-white-outline"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      width: "100%",
                      borderColor: "rgba(37, 211, 102, 0.5)",
                      color: "#fff",
                      background: "rgba(37, 211, 102, 0.12)"
                    }}
                  >
                    <MessageSquare size={16} color="#25D366" />
                    <span>WhatsApp ile Hızlı Bilgi Al</span>
                  </a>
                </div>
              </div>

              {/* Sıkça Sorulan Sorular */}
              <div className="contact-box animate-fade-up delay-3" id="sss">
                <h3>Sıkça Sorulan Sorular</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "16px" }}>
                  {faqItems.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        padding: "16px",
                        borderRadius: "12px",
                        border: "1px solid rgba(255,255,255,0.07)",
                      }}
                    >
                      <h4 style={{ fontSize: "15px", color: "#ffffff", marginBottom: "6px" }}>
                        {item.q}
                      </h4>
                      <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)", lineHeight: "1.5", margin: 0 }}>
                        {item.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sağ Taraf: Randevu Talep Formu */}
            <div className="contact-form-card animate-fade-up delay-2">
              <h3>Seans Randevu Talebi</h3>
              <p>Formu doldurarak veya doğrudan WhatsApp üzerinden seçtiğiniz terapi için randevu bilgisi alabilirsiniz.</p>

              {/* WhatsApp Doğrudan Bilgi Şeridi */}
              <div
                className="whatsapp-fast-banner"
                style={{
                  background: "rgba(37, 211, 102, 0.08)",
                  border: "1px solid rgba(37, 211, 102, 0.3)",
                  borderRadius: "12px",
                  padding: "14px 16px",
                  marginBottom: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", color: "#121622", flexShrink: 0 }}>
                      <MessageSquare size={18} />
                    </div>
                    <div>
                      <strong style={{ display: "block", fontSize: "14px", color: "#fff" }}>
                        Hızlı WhatsApp Randevu Hattı
                      </strong>
                      <span style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.7)" }}>
                        Seçili terapi: <strong style={{ color: "#e0b878" }}>{formData.serviceType}</strong>
                      </span>
                    </div>
                  </div>

                  <a
                    href={getWhatsAppUrl(formData.serviceType)}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      background: "#25D366",
                      color: "#121622",
                      padding: "9px 18px",
                      borderRadius: "8px",
                      fontSize: "13px",
                      fontWeight: 700,
                      textDecoration: "none",
                      boxShadow: "0 4px 14px rgba(37, 211, 102, 0.35)",
                      transition: "transform 0.2s ease"
                    }}
                  >
                    <MessageSquare size={16} />
                    <span>WhatsApp ile Hızlı Bilgi Al</span>
                  </a>
                </div>
              </div>

              {submitted ? (
                <div className="form-success-banner animate-scale">
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <CheckCircle2 size={20} />
                    <h4 style={{ fontSize: "16px", margin: 0 }}>Talebiniz Alındı!</h4>
                  </div>
                  <p style={{ margin: 0, lineHeight: "1.6" }}>
                    Sayın <strong>{formData.fullName}</strong>, {formData.serviceType} seans talebiniz kliniğimize iletilmiştir. Koordinasyon sorumlumuz telefon numaranız ({formData.phone}) üzerinden randevu onayı için en geç 2 saat içinde arayacaktır.
                  </p>
                  
                  <div style={{ marginTop: "16px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <a
                      href={getWhatsAppUrl(formData.serviceType)}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-primary-solid"
                      style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#25D366", color: "#121622", textDecoration: "none" }}
                    >
                      <MessageSquare size={16} />
                      <span>WhatsApp ile Hızlı Bilgi Al</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          fullName: "",
                          phone: "",
                          email: "",
                          serviceType: "Bireysel Psikoterapi",
                          sessionFormat: "Yüz Yüze (Kahramanmaraş Klinik)",
                          preferredTime: "Hafta İçi Öğleden Sonra",
                          message: "",
                        });
                      }}
                      className="btn-white-outline"
                    >
                      Yeni Talep Oluştur
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-field-group">
                    <label>Adınız ve Soyadınız *</label>
                    <input
                      type="text"
                      required
                      placeholder="Örn: Ayşe Yılmaz"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="glass-input"
                    />
                  </div>

                  <div className="form-grid-2">
                    <div className="form-field-group">
                      <label>Telefon Numarası *</label>
                      <input
                        type="tel"
                        required
                        placeholder="0552 328 36 46"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="glass-input"
                      />
                    </div>
                    <div className="form-field-group">
                      <label>E-Posta Adresi *</label>
                      <input
                        type="email"
                        required
                        placeholder="ornek@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="glass-input"
                      />
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-field-group">
                      <label>Danışmanlık Hizmeti (Terapi Türü)</label>
                      <select
                        value={formData.serviceType}
                        onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                        className="form-select-box"
                      >
                        {therapyList.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-field-group">
                      <label>Görüşme Biçimi</label>
                      <select
                        value={formData.sessionFormat}
                        onChange={(e) => setFormData({ ...formData, sessionFormat: e.target.value })}
                        className="form-select-box"
                      >
                        <option>Yüz Yüze (Kahramanmaraş Klinik)</option>
                        <option>Çevrimiçi (Online Güvenli Seans)</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-field-group">
                    <label>Tercih Edilen Zaman Dilimi</label>
                    <select
                      value={formData.preferredTime}
                      onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                      className="form-select-box"
                    >
                      <option>Hafta İçi Sabah (09:30 - 13:00)</option>
                      <option>Hafta İçi Öğleden Sonra (13:00 - 17:00)</option>
                      <option>Hafta İçi Akşam (17:00 - 20:30)</option>
                      <option>Hafta Sonu Cumartesi</option>
                    </select>
                  </div>

                  <div className="form-field-group">
                    <label>Belirtmek İstediğiniz Kısa Not (İsteğe Bağlı)</label>
                    <textarea
                      placeholder="Görüşmek istediğiniz temel konu veya notunuz..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="form-textarea"
                    ></textarea>
                  </div>

                  <div style={{ display: "flex", gap: "10px", marginTop: "12px", flexWrap: "wrap" }}>
                    <button 
                      type="submit" 
                      className="btn-primary-solid" 
                      style={{ flex: 1, minWidth: "180px", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                    >
                      <span>Randevu Talebini Gönder</span>
                      <Send size={16} />
                    </button>
                    
                    <a
                      href={getWhatsAppUrl(formData.serviceType)}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-white-outline"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        background: "rgba(37, 211, 102, 0.15)",
                        borderColor: "rgba(37, 211, 102, 0.4)",
                        color: "#25D366"
                      }}
                      title="Seçili terapi için WhatsApp mesajı başlat"
                    >
                      <MessageSquare size={16} />
                      <span>WhatsApp ile Hızlı Bilgi Al</span>
                    </a>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
