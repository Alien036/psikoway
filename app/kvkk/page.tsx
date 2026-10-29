"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import BackgroundVideo from "../../components/BackgroundVideo";
import {
  ShieldCheck,
  Database,
  Globe,
  FileText,
  Lock,
  Trash2,
  UserCheck,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

function KvkkPageContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("bolum") || "tumu";
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  useEffect(() => {
    const param = searchParams.get("bolum");
    if (param) setActiveTab(param);
  }, [searchParams]);

  return (
    <div className="page-wrapper">
      <BackgroundVideo />
      <Navbar />

      <header className="page-header-hero">
        <div
          className="pill-badge"
          style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
        >
          <ShieldCheck size={14} />
          <span>6698 Sayılı KVKK &amp; AB GDPR Veri Koruma Standartları</span>
        </div>
        <h1 className="page-title">
          Kişisel Verilerin Korunması ve Gizlilik Politikası
        </h1>
        <p className="page-desc">
          PsikoWay platformunda işlenen kişisel verileriniz, Google Firebase yurt dışı veri aktarımı süreçleri, veri minimizasyonu ilkelerimiz ve unutulma hakkınız hakkında şeffaf bilgilendirme.
        </p>
      </header>

      <main className="content-glass-section">
        <div className="content-container" style={{ maxWidth: "960px", margin: "0 auto" }}>
          {/* Yurt Dışı Veri Aktarımı Vurgu Kartı */}
          <div
            className="rounded-2xl border border-amber-400/40 bg-amber-500/10 p-6 mb-8"
            style={{
              background: "rgba(224, 184, 120, 0.1)",
              border: "1px solid rgba(224, 184, 120, 0.4)",
              borderRadius: "18px",
              padding: "24px",
              marginBottom: "28px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                color: "#e0b878",
                fontWeight: 700,
                fontSize: "16px",
                marginBottom: "10px",
              }}
            >
              <Database size={20} />
              <span>
                Google Firebase Sunucuları ve Yurt Dışı Veri Aktarımı Bilgilendirmesi
              </span>
            </div>
            <p
              style={{
                margin: 0,
                fontSize: "14.5px",
                lineHeight: 1.7,
                color: "rgba(255, 255, 255, 0.9)",
              }}
            >
              PsikoWay platformunda oluşturduğunuz üyelik ve profil verileriniz,{" "}
              <strong>kimlik doğrulama (Firebase Authentication)</strong> ve{" "}
              <strong>veritabanı altyapısı (Cloud Firestore)</strong> amacıyla{" "}
              <strong>Google LLC (Google Firebase)</strong> tarafından işletilen{" "}
              <strong>yurt dışındaki sunucularda (yurt dışı veri aktarımı)</strong>{" "}
              işlenmekte ve güvenli olarak muhafaza edilmektedir. Kayıt esnasında bağımsız açık rıza kutucuğu ile onayınız alınmakta ve onay zaman damganız (<code>consentGivenAt</code>, <code>kvkkConsent: true</code>) profil dokümanınızda saklanmaktadır.
            </p>
          </div>

          {/* Sekme Filtreleri */}
          <div
            className="flex flex-wrap gap-2 mb-6"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              marginBottom: "24px",
            }}
          >
            {[
              { id: "tumu", label: "Tüm Politikalar", icon: ShieldCheck },
              { id: "aydinlatma", label: "KVKK Aydınlatma Metni", icon: FileText },
              { id: "acik-riza", label: "Yurt Dışı Aktarım & Açık Rıza", icon: Globe },
              { id: "gizlilik", label: "Gizlilik & Unutulma Hakkı", icon: Lock },
              { id: "sozlesme", label: "Kullanıcı Sözleşmesi", icon: UserCheck },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 18px",
                    borderRadius: "12px",
                    fontSize: "13.5px",
                    fontWeight: 600,
                    cursor: "pointer",
                    border: isActive
                      ? "1px solid rgba(224, 184, 120, 0.6)"
                      : "1px solid rgba(255, 255, 255, 0.12)",
                    background: isActive
                      ? "linear-gradient(135deg, #e0b878, #c69248)"
                      : "rgba(18, 22, 34, 0.75)",
                    color: isActive ? "#121622" : "rgba(255, 255, 255, 0.85)",
                    transition: "all 0.2s ease",
                  }}
                >
                  <Icon size={15} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* İçerik Kartları */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {(activeTab === "tumu" || activeTab === "aydinlatma") && (
              <section
                className="rounded-2xl border border-white/10 bg-[#121622]/85 p-6"
                style={{
                  background: "rgba(18, 22, 34, 0.82)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "18px",
                  padding: "28px",
                }}
              >
                <h2 style={{ color: "#e0b878", fontSize: "20px", marginBottom: "14px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <FileText size={20} />
                  <span>1. KVKK ve GDPR Aydınlatma Metni</span>
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: "14.5px", lineHeight: 1.75, color: "rgba(255,255,255,0.85)" }}>
                  <p style={{ margin: 0 }}>
                    <strong>Veri Sorumlusu:</strong> PsikoWay Psikolojik Danışmanlık ve Düşünce Topluluğu (Kahramanmaraş, Türkiye • E-posta: psikowayresmi@gmail.com).
                  </p>
                  <p style={{ margin: 0 }}>
                    <strong>Veri Minimizasyonu İlkesi (KVKK m.4 &amp; GDPR m.5):</strong> Platformumuzda T.C. Kimlik Numarası, gereksiz cihaz bilgisi, IP izleme kaydı veya aşırı kişisel veri kesinlikle toplanmaz. Yalnızca üyelik ve topluluk etkileşimi için zorunlu olan minimum veriler (<code>uid</code>, görünen ad, kullanıcı adı, e-posta adresi, isteğe bağlı uzmanlık/biyografi bilgileri ve açık rıza onay zamanı <code>consentGivenAt</code>) işlenmektedir.
                  </p>
                  <p style={{ margin: 0 }}>
                    <strong>Kişisel Verilerin İşlenme Amaçları:</strong> Kimlik doğrulama süreçlerinin yürütülmesi, kullanıcı profilinin oluşturulması, topluluk forumunda düşünce ve yorum paylaşımının sağlanması, bilgi güvenliği süreçlerinin yürütülmesi ve ilgili kişinin açık rızasının belgelenmesi amaçlarıyla sınırlı olarak işlenmektedir.
                  </p>
                </div>
              </section>
            )}

            {(activeTab === "tumu" || activeTab === "acik-riza") && (
              <section
                className="rounded-2xl border border-white/10 bg-[#121622]/85 p-6"
                style={{
                  background: "rgba(18, 22, 34, 0.82)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "18px",
                  padding: "28px",
                }}
              >
                <h2 style={{ color: "#e0b878", fontSize: "20px", marginBottom: "14px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <Globe size={20} />
                  <span>2. Yurt Dışı Veri Aktarımı (Google Firebase) ve Açık Rıza Beyanı</span>
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: "14.5px", lineHeight: 1.75, color: "rgba(255,255,255,0.85)" }}>
                  <p style={{ margin: 0 }}>
                    PsikoWay, kullanıcı hesaplarının güvenliği ve veritabanı sürekliliği için <strong>Google LLC</strong> tarafından sağlanan <strong>Google Firebase (Firebase Authentication ve Cloud Firestore)</strong> altyapısını kullanmaktadır.
                  </p>
                  <p style={{ margin: 0 }}>
                    6698 sayılı KVKK&apos;nın 9. maddesi (&ldquo;Kişisel verilerin yurt dışına aktarılması&rdquo;) ve GDPR hükümleri uyarınca; kimlik doğrulama ve veritabanı altyapısı amacıyla temel profil verileriniz yurt dışında bulunan Google Firebase sunucularında işlenmektedir. Kayıt formunda yer alan bağımsız açık rıza kutucuğunu işaretleyerek bu aktarıma özgür iradenizle onay vermiş olursunuz.
                  </p>
                </div>
              </section>
            )}

            {(activeTab === "tumu" || activeTab === "gizlilik") && (
              <section
                className="rounded-2xl border border-white/10 bg-[#121622]/85 p-6"
                style={{
                  background: "rgba(18, 22, 34, 0.82)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "18px",
                  padding: "28px",
                }}
              >
                <h2 style={{ color: "#e0b878", fontSize: "20px", marginBottom: "14px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <Trash2 size={20} />
                  <span>3. Gizlilik Politikası ve Unutulma Hakkı (Right to be Forgotten)</span>
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: "14.5px", lineHeight: 1.75, color: "rgba(255,255,255,0.85)" }}>
                  <p style={{ margin: 0 }}>
                    KVKK Madde 7, Madde 11 ve GDPR Madde 17 (&ldquo;Right to Erasure / Right to be Forgotten&rdquo;) kapsamında tüm kullanıcılarımız <strong>Unutulma Hakkına</strong> sahiptir.
                  </p>
                  <p style={{ margin: 0 }}>
                    Kullanıcılarımız diledikleri an <strong>Profil / Ayarlar</strong> sayfasında yer alan <strong>&ldquo;Hesabımı ve Verilerimi Sil&rdquo;</strong> butonuna tıklayarak; Cloud Firestore üzerindeki profil kayıtlarını, forum gönderilerini, yorumlarını, beğenilerini ve Firebase Authentication üzerindeki kullanıcı hesaplarını (<code>deleteUser()</code>) tek adımla kalıcı olarak silebilirler.
                  </p>
                </div>
              </section>
            )}

            {(activeTab === "tumu" || activeTab === "sozlesme") && (
              <section
                className="rounded-2xl border border-white/10 bg-[#121622]/85 p-6"
                style={{
                  background: "rgba(18, 22, 34, 0.82)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "18px",
                  padding: "28px",
                }}
              >
                <h2 style={{ color: "#e0b878", fontSize: "20px", marginBottom: "14px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <UserCheck size={20} />
                  <span>4. Kullanıcı Sözleşmesi ve Kullanım Koşulları</span>
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: "14.5px", lineHeight: 1.75, color: "rgba(255,255,255,0.85)" }}>
                  <p style={{ margin: 0 }}>
                    PsikoWay platformunda yer alan psikolojik analizler, testler ve forum tartışmaları yalnızca kültür, eğitim ve öz-farkındalık amaçlıdır; klinik tanı veya acil psikiyatrik müdahale yerine geçmez.
                  </p>
                  <p style={{ margin: 0 }}>
                    Kullanıcılar, topluluk alanında paylaştıkları içeriklerin üçüncü kişilerin kişilik haklarını ihlal etmemesinden, nefret söylemi veya hakaret içermemesinden ve kendi hesap şifrelerinin güvenliğinden sorumludur.
                  </p>
                </div>
              </section>
            )}
          </div>

          {/* Alt Navigasyon */}
          <div style={{ marginTop: "32px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <Link
              href="/auth"
              className="btn-white-outline"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
            >
              <ArrowLeft size={16} />
              <span>Giriş / Kayıt Sayfasına Dön</span>
            </Link>

            <Link
              href="/profil"
              className="btn-primary-solid"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
            >
              <CheckCircle2 size={16} />
              <span>Profil ve Veri Ayarlarına Git</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function KvkkPage() {
  return (
    <Suspense
      fallback={
        <div className="page-wrapper" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
          <div style={{ color: "#e0b878", fontSize: "18px" }}>Sayfa yükleniyor...</div>
        </div>
      }
    >
      <KvkkPageContent />
    </Suspense>
  );
}
