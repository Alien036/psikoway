import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "../../../../components/Navbar";
import Footer from "../../../../components/Footer";
import BackgroundVideo from "../../../../components/BackgroundVideo";
import { 
  getCharacterById,
  getRelatedCharacters,
  getSeriesById,
  CHARACTER_ANALYSES,
  CharacterAnalysisArticle 
} from "../../../../lib/analyses-data";
import AnalysisInteractions from "../../../../components/AnalysisInteractions";
import { 
  ArrowLeft, 
  Clock, 
  Tv, 
  UserCheck, 
  ShieldAlert, 
  BrainCircuit, 
  Quote, 
  MessageSquareQuote,
  Sparkles,
  ArrowRight,
  BookOpen
} from "lucide-react";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export const revalidate = 86400; // 24 saat önbellek, statik anında açılış

export async function generateStaticParams() {
  return CHARACTER_ANALYSES.map((char) => ({
    id: char.id,
  }));
}

export default async function CharacterDetailPage({ params }: PageProps) {
  const { id } = await params;
  const character = await getCharacterById(id);

  if (!character) {
    notFound();
  }

  // Aynı dizideki diğer karakterleri getir
  const relatedCharacters = await getRelatedCharacters(character.seriesId, character.id);
  const seriesInfo = await getSeriesById(character.seriesId);

  return (
    <div className="page-wrapper">
      <BackgroundVideo />
      <Navbar />

      <main className="character-dossier-page">
        <div className="content-container">
          
          {/* Üst Navigasyon & Breadcrumbs */}
          <nav className="dossier-breadcrumb-bar animate-fade-down">
            <Link href="/analizler" className="dossier-back-btn">
              <ArrowLeft size={16} />
              <span>Dizilere ve Analizlere Dön</span>
            </Link>

            <div className="dossier-breadcrumbs">
              <Link href="/analizler" className="dossier-breadcrumb-link">
                Popüler Diziler
              </Link>
              <span className="dossier-breadcrumb-sep">/</span>
              <span className="dossier-breadcrumb-current">
                {character.series}
              </span>
              <span className="dossier-breadcrumb-sep">/</span>
              <span className="dossier-breadcrumb-active">
                {character.characterName}
              </span>
            </div>
          </nav>

          {/* Karakter Ana Başlık & Sinematik Hero Alanı */}
          <section className="dossier-hero-card animate-fade-up">
            <div className="dossier-hero-backdrop">
              <img
                src={character.image}
                alt={character.characterName}
                className="dossier-hero-bg-img"
              />
              <div className="dossier-hero-gradient" />
            </div>

            <div className="dossier-hero-inner">
              <div className="dossier-hero-avatar-wrap">
                <img
                  src={character.image}
                  alt={character.characterName}
                  className="dossier-hero-avatar"
                />
              </div>

              <div className="dossier-hero-info">
                <div className="dossier-badges-row">
                  <span className="poster-series-badge">
                    <Tv size={12} />
                    {character.series}
                  </span>
                  <span className={`poster-role-badge ${character.role === 'main' ? 'main-role' : 'supporting-role'}`}>
                    {character.role === 'main' ? '👑 Ana Karakter' : '🎭 Yan Karakter'}
                  </span>
                  <span className="poster-diagnosis-badge">
                    {character.badge}
                  </span>
                </div>

                <h1 className="dossier-title">{character.characterName}</h1>
                <p className="dossier-actor-line">
                  Canlandıran: <strong>{character.actor}</strong>
                </p>

                <p className="dossier-tagline">
                  &ldquo;{character.tagline}&rdquo;
                </p>

                <div className="dossier-quick-meta">
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <Clock size={14} color="#e0b878" />
                    {character.readTime}
                  </span>
                  <span className="dossier-meta-sep">•</span>
                  <span>PsikoWay Klinik Vaka Dosyası</span>
                </div>
              </div>
            </div>
          </section>

          {/* Psikolojik Profil Göstergeleri (Metrik Kartları) */}
          <section className="dossier-metrics-grid animate-fade-up delay-1">
            <div className="dossier-metric-card">
              <div className="dossier-metric-header">
                <BrainCircuit size={18} color="#e0b878" />
                <span>Klinik Tanı Hipotezi</span>
              </div>
              <p className="dossier-metric-val">
                {character.psychologicalProfile.primaryDiagnosis}
              </p>
            </div>

            <div className="dossier-metric-card">
              <div className="dossier-metric-header">
                <Sparkles size={18} color="#e0b878" />
                <span>Jungian / Edebi Arketip</span>
              </div>
              <p className="dossier-metric-val">
                {character.psychologicalProfile.archetype}
              </p>
            </div>

            <div className="dossier-metric-card">
              <div className="dossier-metric-header">
                <ShieldAlert size={18} color="#e0b878" />
                <span>Savunma Mekanizmaları</span>
              </div>
              <div className="dossier-defense-wrap">
                {character.psychologicalProfile.defenseMechanisms.map((def, di) => (
                  <span key={di} className="poster-chip">
                    🛡️ {def}
                  </span>
                ))}
              </div>
            </div>

            <div className="dossier-metric-card">
              <div className="dossier-metric-header">
                <BookOpen size={18} color="#e0b878" />
                <span>Temel İçsel Çatışma</span>
              </div>
              <p className="dossier-metric-val">
                {character.psychologicalProfile.coreConflict}
              </p>
            </div>
          </section>

          {/* İkonik Karakter Sözü / Repliği */}
          {character.fullContent.quote && (
            <section className="dossier-quote-section animate-fade-up delay-2">
              <Quote size={28} color="#e0b878" className="dossier-quote-icon" />
              <blockquote className="dossier-quote-text">
                &ldquo;{character.fullContent.quote.text}&rdquo;
              </blockquote>
              {character.fullContent.quote.context && (
                <p className="dossier-quote-context">
                  — {character.fullContent.quote.context}
                </p>
              )}
            </section>
          )}

          {/* Derinlemesine Klinik Vaka İncelemesi (Makale Gövdesi) */}
          <section className="dossier-article-body animate-fade-up delay-3">
            <h2 className="dossier-section-title">
              <span>Psikanalitik Çözümleme &amp; Karakter Haritası</span>
            </h2>

            <p className="dossier-lead-text">
              {character.fullContent.lead}
            </p>

            <div className="dossier-sections-list">
              {character.fullContent.sections.map((sec, i) => (
                <div key={i} className="dossier-content-block">
                  <h3 className="dossier-block-heading">{sec.heading}</h3>
                  <p className="dossier-block-paragraph">{sec.body}</p>
                </div>
              ))}
            </div>

            {/* Klinik Ders & Terapi Odası Kutuları */}
            <div className="dossier-insights-grid">
              <div className="dossier-insight-box clinical-box">
                <div className="dossier-insight-head">
                  <ShieldAlert size={18} color="#e0b878" />
                  <strong>Klinik Çıkarım (Psiko-Eğitim Dersi)</strong>
                </div>
                <p>{character.fullContent.clinicalTakeaway}</p>
              </div>

              <div className="dossier-insight-box therapy-box">
                <div className="dossier-insight-head">
                  <BrainCircuit size={18} color="#38bdf8" />
                  <strong>Terapi Odası Perspektifi (Nasıl Çalışılırdı?)</strong>
                </div>
                <p>{character.fullContent.therapeuticApproach}</p>
              </div>
            </div>

            {/* Forum ve Tartışma Çağrısı */}
            <div className="dossier-forum-banner">
              <div>
                <h4>Bu Karakter Hakkında Ne Düşünüyorsun?</h4>
                <p>PsikoWay forum topluluğunda vaka hakkında kendi gözlemlerini ve teorilerini paylaş.</p>
              </div>
              <Link href="/forum" className="btn-primary-solid" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                <MessageSquareQuote size={16} />
                <span>Forumda Tartış</span>
              </Link>
            </div>
          </section>

          {/* Dinamik Kullanıcı Etkileşimleri (Beğeniler ve Yorumlar - Firestore) */}
          <AnalysisInteractions
            analysisId={character.id}
            analysisTitle={`${character.characterName} — ${character.series}`}
          />

          {/* Aynı Dizideki Diğer Karakterler (İlişkili Kadro) */}
          {relatedCharacters.length > 0 && (
            <section className="dossier-related-section animate-fade-up delay-4">
              <div className="dossier-related-header">
                <div>
                  <h3 className="dossier-related-title">{character.series} Kadrosundaki Diğer Karakterler</h3>
                  <p className="dossier-related-sub">Bu dizinin diğer ana ve yan karakterlerinin zihinsel haritalarını incele:</p>
                </div>
                <Link href="/analizler" className="btn-white-outline btn-sm">
                  Tüm Dizileri Gör
                </Link>
              </div>

              <div className="analysis-grid">
                {relatedCharacters.map((relChar) => (
                  <Link
                    key={relChar.id}
                    href={`/analizler/karakter/${relChar.id}`}
                    className="analysis-poster-card"
                  >
                    <img
                      src={relChar.image}
                      alt={relChar.characterName}
                      className="poster-card-bg-img"
                    />
                    <div className="poster-card-gradient" />

                    <div className="poster-card-content">
                      <div className="poster-top-bar">
                        <span className="poster-series-badge">
                          <Tv size={12} />
                          {relChar.series}
                        </span>
                        <span className={`poster-role-badge ${relChar.role === 'main' ? 'main-role' : 'supporting-role'}`}>
                          {relChar.role === 'main' ? '👑 Ana Karakter' : '🎭 Yan Karakter'}
                        </span>
                      </div>

                      <div className="poster-bottom-details">
                        <span className="poster-diagnosis-badge">
                          {relChar.badge}
                        </span>

                        <div className="poster-header-text">
                          <h3 className="poster-character-name">{relChar.characterName}</h3>
                          <span className="poster-actor-name">{relChar.actor}</span>
                        </div>

                        <p className="poster-tagline">
                          &ldquo;{relChar.tagline}&rdquo;
                        </p>

                        <div className="poster-chips-row">
                          {relChar.psychologicalProfile?.archetype && (
                            <span className="poster-chip">
                              🎭 {relChar.psychologicalProfile.archetype}
                            </span>
                          )}
                          {!relChar.psychologicalProfile?.archetype && (
                            <span className="poster-chip">
                              🧠 {relChar.psychologicalProfile?.primaryDiagnosis || relChar.badge || "Psikanaliz"}
                            </span>
                          )}
                        </div>

                        <div className="poster-card-footer">
                          <span className="poster-read-time">
                            <Clock size={13} />
                            {relChar.readTime}
                          </span>
                          <span className="poster-cta-btn">
                            <span>Dosyayı Aç</span>
                            <ArrowRight size={14} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
