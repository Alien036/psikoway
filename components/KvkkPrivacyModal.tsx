"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Globe,
  FileText,
  Lock,
  Trash2,
  Database,
  CheckCircle2,
  X,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

export type KvkkModalSection = "aydinlatma" | "acik-riza" | "gizlilik";

interface KvkkPrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSection?: KvkkModalSection;
  onAcceptTerms?: () => void;
  onAcceptExplicitConsent?: () => void;
}

export default function KvkkPrivacyModal({
  isOpen,
  onClose,
  initialSection = "aydinlatma",
  onAcceptTerms,
  onAcceptExplicitConsent,
}: KvkkPrivacyModalProps) {
  const [activeSection, setActiveSection] = useState<KvkkModalSection>(initialSection);

  useEffect(() => {
    if (isOpen) {
      setActiveSection(initialSection);
    }
  }, [isOpen, initialSection]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-down"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        backgroundColor: "rgba(5, 7, 12, 0.84)",
        backdropFilter: "blur(12px)",
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="kvkk-modal-title"
    >
      <div
        className="relative w-full max-w-3xl max-h-[88vh] flex flex-col rounded-2xl border border-amber-400/30 bg-[#121622]/95 text-slate-100 shadow-2xl overflow-hidden"
        style={{
          width: "100%",
          maxWidth: "780px",
          maxHeight: "88vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: "20px",
          border: "1px solid rgba(224, 184, 120, 0.3)",
          background: "linear-gradient(165deg, rgba(22, 27, 42, 0.98), rgba(12, 15, 24, 0.98))",
          boxShadow: "0 24px 60px rgba(0, 0, 0, 0.75)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Üst Başlık */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b border-white/10"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 24px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            background: "rgba(224, 184, 120, 0.06)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                background: "rgba(224, 184, 120, 0.16)",
                border: "1px solid rgba(224, 184, 120, 0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#e0b878",
                flexShrink: 0,
              }}
            >
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3
                id="kvkk-modal-title"
                className="text-lg font-bold text-white"
                style={{ margin: 0, fontSize: "17px", fontWeight: 700, color: "#ffffff" }}
              >
                Kişisel Verilerin Korunması ve Gizlilik Politikası
              </h3>
              <p
                className="text-xs text-slate-400"
                style={{ margin: "2px 0 0 0", fontSize: "12px", color: "rgba(255,255,255,0.6)" }}
              >
                6698 Sayılı KVKK ve Avrupa Birliği GDPR Veri Koruma Standartları Uyum Metni
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
            style={{
              background: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "10px",
              color: "#cbd5e1",
              padding: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Sekmeler */}
        <div
          className="grid grid-cols-3 gap-2 px-6 py-3 bg-white/[0.02] border-b border-white/10"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "8px",
            padding: "12px 24px",
            background: "rgba(255, 255, 255, 0.02)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <button
            type="button"
            onClick={() => setActiveSection("aydinlatma")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              padding: "9px 12px",
              borderRadius: "10px",
              fontSize: "12.5px",
              fontWeight: 600,
              cursor: "pointer",
              border:
                activeSection === "aydinlatma"
                  ? "1px solid rgba(224, 184, 120, 0.5)"
                  : "1px solid rgba(255, 255, 255, 0.08)",
              background:
                activeSection === "aydinlatma"
                  ? "linear-gradient(135deg, #e0b878, #c69248)"
                  : "rgba(255, 255, 255, 0.04)",
              color: activeSection === "aydinlatma" ? "#121622" : "rgba(255, 255, 255, 0.75)",
              transition: "all 0.2s ease",
            }}
          >
            <FileText size={14} />
            <span>Aydınlatma Metni &amp; Sözleşme</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection("acik-riza")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              padding: "9px 12px",
              borderRadius: "10px",
              fontSize: "12.5px",
              fontWeight: 600,
              cursor: "pointer",
              border:
                activeSection === "acik-riza"
                  ? "1px solid rgba(224, 184, 120, 0.5)"
                  : "1px solid rgba(255, 255, 255, 0.08)",
              background:
                activeSection === "acik-riza"
                  ? "linear-gradient(135deg, #e0b878, #c69248)"
                  : "rgba(255, 255, 255, 0.04)",
              color: activeSection === "acik-riza" ? "#121622" : "rgba(255, 255, 255, 0.75)",
              transition: "all 0.2s ease",
            }}
          >
            <Globe size={14} />
            <span>Yurt Dışı Aktarım &amp; Açık Rıza</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection("gizlilik")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              padding: "9px 12px",
              borderRadius: "10px",
              fontSize: "12.5px",
              fontWeight: 600,
              cursor: "pointer",
              border:
                activeSection === "gizlilik"
                  ? "1px solid rgba(224, 184, 120, 0.5)"
                  : "1px solid rgba(255, 255, 255, 0.08)",
              background:
                activeSection === "gizlilik"
                  ? "linear-gradient(135deg, #e0b878, #c69248)"
                  : "rgba(255, 255, 255, 0.04)",
              color: activeSection === "gizlilik" ? "#121622" : "rgba(255, 255, 255, 0.75)",
              transition: "all 0.2s ease",
            }}
          >
            <Lock size={14} />
            <span>Gizlilik &amp; Unutulma Hakkı</span>
          </button>
        </div>

        {/* İçerik Gövdesi */}
        <div
          className="flex-1 overflow-y-auto px-6 py-5 space-y-4 text-sm leading-relaxed text-slate-200"
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px 24px",
            fontSize: "13.5px",
            lineHeight: 1.65,
            color: "rgba(255, 255, 255, 0.85)",
          }}
        >
          {/* Google Firebase Yurt Dışı Veri Aktarımı Vurgulu Bilgi Kutusu */}
          <div
            className="p-4 rounded-xl border border-amber-400/40 bg-amber-500/10"
            style={{
              padding: "14px 16px",
              borderRadius: "12px",
              border: "1px solid rgba(224, 184, 120, 0.4)",
              background: "rgba(224, 184, 120, 0.1)",
              marginBottom: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", color: "#e0b878", fontWeight: 700 }}>
              <Database size={16} />
              <span>Önemli Bilgilendirme: Google Firebase Altyapısı ve Yurt Dışı Veri Aktarımı</span>
            </div>
            <p style={{ margin: 0, fontSize: "13px", color: "rgba(255, 255, 255, 0.9)" }}>
              PsikoWay platformunda oluşturduğunuz hesap ve profil verileriniz,{" "}
              <strong>kimlik doğrulama (Firebase Authentication)</strong> ve{" "}
              <strong>veritabanı altyapısı (Cloud Firestore)</strong> hizmetlerinin güvenli bir şekilde yürütülmesi amacıyla{" "}
              <strong>Google LLC (Google Firebase)</strong> tarafından işletilen{" "}
              <strong>yurt dışındaki sunucularda (yurt dışı veri aktarımı kapsamında)</strong> işlenmekte ve saklanmaktadır.
            </p>
          </div>

          {activeSection === "aydinlatma" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <h4 style={{ color: "#e0b878", fontSize: "15px", fontWeight: 700, marginBottom: "6px" }}>
                  1. Veri Sorumlusu ve Aydınlatma Kapsamı
                </h4>
                <p style={{ margin: 0 }}>
                  6698 sayılı Kişisel Verilerin Korunması Kanunu (&ldquo;KVKK&rdquo;) ve Avrupa Birliği Genel Veri Koruma Tüzüğü (&ldquo;GDPR&rdquo;) uyarınca, PsikoWay Psikolojik Danışmanlık ve Düşünce Topluluğu (&ldquo;PsikoWay&rdquo;) olarak kişisel verilerinizin güvenliğine, şeffaflığa ve veri minimizasyonu ilkesine en üst düzeyde önem veriyoruz.
                </p>
              </div>

              <div>
                <h4 style={{ color: "#e0b878", fontSize: "15px", fontWeight: 700, marginBottom: "6px" }}>
                  2. İşlenen Kişisel Veriler (Veri Minimizasyonu İlkesi)
                </h4>
                <p style={{ margin: "0 0 8px 0" }}>
                  KVKK Madde 4 ve GDPR Madde 5/1-(c) &ldquo;Veri Minimizasyonu&rdquo; ilkesi gereğince platformumuzda T.C. Kimlik Numarası, gereksiz cihaz tanımlayıcıları veya aşırı kişisel veri <strong>toplanmamaktadır</strong>. Yalnızca hizmetin çalışması için zorunlu olan minimum veriler işlenir:
                </p>
                <ul style={{ paddingLeft: "20px", margin: 0, display: "flex", flexDirection: "column", gap: "4px" }}>
                  <li>
                    <strong>Temel Kimlik ve Profil Bilgileri:</strong> Kullanıcı benzersiz kimliği (<code>uid</code>), görünen isim (<code>displayName</code>), kullanıcı adı (<code>username</code>), e-posta adresi (<code>email</code>) ve isteğe bağlı uzmanlık/biyografi bilgileri.
                  </li>
                  <li>
                    <strong>Hukuki Uyum ve Rıza Kayıtları:</strong> KVKK/GDPR açık rıza onay durumu (<code>kvkkConsent: true</code>) ve onayın verildiği zaman damgası (<code>consentGivenAt</code>).
                  </li>
                  <li>
                    <strong>Topluluk Etkileşim Verileri:</strong> Forumda kendi isteğinizle paylaştığınız fikirler, yorumlar ve beğeniler.
                  </li>
                </ul>
              </div>

              <div>
                <h4 style={{ color: "#e0b878", fontSize: "15px", fontWeight: 700, marginBottom: "6px" }}>
                  3. Kişisel Verilerin İşlenme Amaçları ve Hukuki Sebepleri
                </h4>
                <p style={{ margin: 0 }}>
                  Kişisel verileriniz; üyelik kaydınızın oluşturulması, güvenli oturum yönetimi, topluluk forumunda içerik paylaşabilmeniz, kötüye kullanım ve spam girişimlerinin önlenmesi ve KVKK Madde 5/2 (sözleşmenin kurulması ve ifası, veri sorumlusunun meşru menfaati) ile açık rıza hukuki sebeplerine dayanılarak işlenmektedir.
                </p>
              </div>

              <div>
                <h4 style={{ color: "#e0b878", fontSize: "15px", fontWeight: 700, marginBottom: "6px" }}>
                  4. Kullanıcı Sözleşmesi ve Topluluk İlkeleri
                </h4>
                <p style={{ margin: 0 }}>
                  PsikoWay topluluk forumunda paylaşılan içerikler bilgilendirme ve felsefi/psikolojik düşünce paylaşımı amaçlıdır; tıbbi tanı veya acil psikiyatrik tedavi yerine geçmez. Üyeler, diğer katılımcıların kişilik haklarına saygılı davranmayı ve küfür, hakaret veya hukuka aykırı içerik paylaşmamayı kabul eder.
                </p>
              </div>
            </div>
          )}

          {activeSection === "acik-riza" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <h4 style={{ color: "#e0b878", fontSize: "15px", fontWeight: 700, marginBottom: "6px" }}>
                  1. Yurt Dışı Veri Aktarımı ve Google Firebase Altyapısı
                </h4>
                <p style={{ margin: 0 }}>
                  PsikoWay web uygulaması, kullanıcı kimlik doğrulama işlemleri (<strong>Firebase Authentication</strong>) ve gerçek zamanlı bulut veritabanı yönetimi (<strong>Cloud Firestore</strong>) için <strong>Google LLC</strong> tarafından sağlanan <strong>Google Firebase</strong> bulut altyapısını kullanmaktadır.
                </p>
              </div>

              <div>
                <h4 style={{ color: "#e0b878", fontSize: "15px", fontWeight: 700, marginBottom: "6px" }}>
                  2. Aktarılan Veriler ve Güvenlik Önlemleri
                </h4>
                <p style={{ margin: 0 }}>
                  Kayıt ve kullanım esnasında paylaştığınız temel profil verileriniz (<code>uid</code>, e-posta adresiniz, görünen adınız, kullanıcı adınız, isteğe bağlı biyografi/meslek bilgileriniz ve topluluk paylaşımlarınız), Google Firebase&apos;in Türkiye dışında (Avrupa Birliği ve/veya Amerika Birleşik Devletleri veri merkezlerinde) bulunan güvenli sunucularına aktarılmakta ve TLS/SSL şifreleme standartları altında saklanmaktadır.
                </p>
              </div>

              <div>
                <h4 style={{ color: "#e0b878", fontSize: "15px", fontWeight: 700, marginBottom: "6px" }}>
                  3. Açık Rıza Beyanı ve Rızanın Geri Alınması
                </h4>
                <p style={{ margin: 0 }}>
                  6698 sayılı KVKK Madde 9 ve GDPR ilgili hükümleri uyarınca; kayıt formundaki açık rıza kutucuğunu işaretleyerek, kişisel verilerinizin kimlik doğrulama ve veritabanı altyapısı amacıyla yurt dışındaki <strong>Google Firebase</strong> sunucularına aktarılmasına ve burada işlenmesine özgür iradenizle açık rıza vermiş olursunuz. Verdiğiniz açık rızayı dilediğiniz zaman <strong>Profil / Ayarlar</strong> ekranındaki <strong>&ldquo;Hesabımı ve Verilerimi Sil&rdquo;</strong> butonunu kullanarak geri çekebilir ve tüm verilerinizin kalıcı olarak silinmesini sağlayabilirsiniz.
                </p>
              </div>
            </div>
          )}

          {activeSection === "gizlilik" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <h4 style={{ color: "#e0b878", fontSize: "15px", fontWeight: 700, marginBottom: "6px" }}>
                  1. Unutulma Hakkı (Right to be Forgotten - KVKK m.11 &amp; GDPR m.17)
                </h4>
                <p style={{ margin: 0 }}>
                  Her kullanıcımız, hesabını ve kendisine ait tüm kişisel verileri herhangi bir gerekçe göstermeksizin kalıcı olarak silme hakkına sahiptir. <strong>Profil / Ayarlar</strong> sayfasında yer alan <strong>&ldquo;Hesabımı ve Verilerimi Sil&rdquo;</strong> butonunu onayladığınız anda:
                </p>
                <ul style={{ paddingLeft: "20px", margin: "8px 0 0 0", display: "flex", flexDirection: "column", gap: "4px" }}>
                  <li>Cloud Firestore veritabanındaki kullanıcı profil dokümanınız (<code>users/&#123;uid&#125;</code>),</li>
                  <li>Topluluk forumunda paylaştığınız tüm gönderiler, yorumlar ve beğeni kayıtlarınız,</li>
                  <li>Karakter analizlerine yaptığınız yorumlar ve etkileşimleriniz,</li>
                  <li>Firebase Authentication üzerindeki kullanıcı oturumunuz ve kimlik kaydınız (<code>deleteUser()</code>)</li>
                </ul>
                <p style={{ margin: "6px 0 0 0" }}>
                  geri döndürülemez biçimde ve anında silinir.
                </p>
              </div>

              <div>
                <h4 style={{ color: "#e0b878", fontSize: "15px", fontWeight: 700, marginBottom: "6px" }}>
                  2. İlgili Kişinin KVKK Madde 11 Kapsamındaki Hakları
                </h4>
                <p style={{ margin: 0 }}>
                  Veri sahibi olarak; kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, amacına uygun kullanılıp kullanılmadığını öğrenme, yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme, eksik veya yanlış işlenmişse düzeltilmesini isteme ve silinmesini/yok edilmesini talep etme haklarına sahipsiniz. Talepleriniz için <strong>psikowayresmi@gmail.com</strong> adresinden bize ulaşabilirsiniz.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Alt Aksiyon Çubuğu */}
        <div
          className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-white/10 bg-[#0d101a]"
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            padding: "14px 24px",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            background: "rgba(11, 14, 22, 0.96)",
          }}
        >
          <Link
            href="/kvkk"
            target="_blank"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "12.5px",
              color: "#e0b878",
              fontWeight: 600,
            }}
          >
            <span>Tam Sayfa Olarak Görüntüle (/kvkk)</span>
            <ExternalLink size={13} />
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            {onAcceptTerms && activeSection === "aydinlatma" && (
              <button
                type="button"
                onClick={() => {
                  onAcceptTerms();
                  onClose();
                }}
                className="btn-primary-solid"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "9px 16px",
                  fontSize: "13px",
                  borderRadius: "10px",
                }}
              >
                <CheckCircle2 size={15} />
                <span>Okudum, Anladım</span>
              </button>
            )}

            {onAcceptExplicitConsent && activeSection === "acik-riza" && (
              <button
                type="button"
                onClick={() => {
                  onAcceptExplicitConsent();
                  onClose();
                }}
                className="btn-primary-solid"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "9px 16px",
                  fontSize: "13px",
                  borderRadius: "10px",
                }}
              >
                <CheckCircle2 size={15} />
                <span>Açık Rıza Veriyorum</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="btn-white-outline"
              style={{
                padding: "9px 18px",
                fontSize: "13px",
                borderRadius: "10px",
              }}
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
