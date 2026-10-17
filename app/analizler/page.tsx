"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import BackgroundVideo from "../../components/BackgroundVideo";
import { 
  SERIES_LIST, 
  CHARACTER_ANALYSES, 
  SeriesItem, 
  CharacterSummaryItem
} from "../../lib/analyses-data";
import { 
  Sparkles, 
  Clock, 
  X, 
  Search, 
  ArrowRight, 
  ShieldAlert, 
  BrainCircuit, 
  Quote, 
  Tv, 
  UserCheck,
  ChevronUp,
  Layers,
  Film,
  Sparkle,
  ArrowUpRight
} from "lucide-react";

export default function AnalysisPage() {
  const [seriesList] = useState<SeriesItem[]>(SERIES_LIST);
  const [characterList] = useState<CharacterSummaryItem[]>(CHARACTER_ANALYSES);

  const [selectedDrawerSeries, setSelectedDrawerSeries] = useState<SeriesItem | null>(null);
  const [drawerRoleFilter, setDrawerRoleFilter] = useState<"all" | "main" | "supporting">("all");
  const [mediaType, setMediaType] = useState<"all" | "movies" | "series">("all");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // ESC tuşuna basınca çekmeceyi (drawer) kapat
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedDrawerSeries) {
        setSelectedDrawerSeries(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedDrawerSeries]);

  // Çekmece açıkken arka plan kaydırmasını kilitle
  useEffect(() => {
    if (selectedDrawerSeries) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedDrawerSeries]);

  // Dizi ve Film listesi filtreleme (format, tür ve arama sorgusuna göre)
  const filteredSeriesList = useMemo(() => {
    let list = seriesList;

    if (mediaType === "movies") {
      list = list.filter((s) => s.id.endsWith("-movie"));
    } else if (mediaType === "series") {
      list = list.filter((s) => !s.id.endsWith("-movie"));
    }

    if (selectedGenre !== "all") {
      list = list.filter((series) => {
        const g = (series.genre + " " + series.psychologicalTheme + " " + series.title).toLowerCase();
        if (selectedGenre === "suc") return g.includes("suç") || g.includes("mafya") || g.includes("kartel") || g.includes("noir");
        if (selectedGenre === "gerilim") return g.includes("gerilim") || g.includes("gizem") || g.includes("korku") || g.includes("psikolojik") || g.includes("tıp") || g.includes("hukuk");
        if (selectedGenre === "dram") return g.includes("dram") || g.includes("tarih") || g.includes("savaş") || g.includes("dönem") || g.includes("hanedan");
        if (selectedGenre === "bilimkurgu") return g.includes("bilim kurgu") || g.includes("fantezi") || g.includes("distop") || g.includes("doğaüstü") || g.includes("anime");
        return true;
      });
    }

    const q = searchQuery.toLowerCase().trim();
    if (!q) return list;

    return list.filter((series) => {
      const matchesTitle = series.title.toLowerCase().includes(q);
      const matchesGenre = series.genre.toLowerCase().includes(q);
      const matchesTheme = series.psychologicalTheme.toLowerCase().includes(q);
      const matchesTagline = series.tagline.toLowerCase().includes(q);

      // Ayrıca yapımın altındaki karakter adlarında da arama yap
      const seriesChars = characterList.filter((c) => c.seriesId === series.id);
      const matchesChar = seriesChars.some((c) => 
        c.characterName.toLowerCase().includes(q) || 
        c.actor.toLowerCase().includes(q) ||
        (c.psychologicalProfile?.primaryDiagnosis || "").toLowerCase().includes(q)
      );

      return matchesTitle || matchesGenre || matchesTheme || matchesTagline || matchesChar;
    });
  }, [seriesList, characterList, searchQuery, selectedGenre, mediaType]);

  // Seçili dizinin çekmecesinde gösterilecek karakterler
  const drawerCharacters = useMemo(() => {
    if (!selectedDrawerSeries) return [];

    return characterList.filter((char) => {
      if (char.seriesId !== selectedDrawerSeries.id) return false;
      if (drawerRoleFilter === "all") return true;
      return char.role === drawerRoleFilter;
    });
  }, [characterList, selectedDrawerSeries, drawerRoleFilter]);

  // Seçili dizideki toplam ana ve yan karakter sayıları
  const characterCounts = useMemo(() => {
    if (!selectedDrawerSeries) return { total: 0, main: 0, supporting: 0 };
    const all = characterList.filter((c) => c.seriesId === selectedDrawerSeries.id);
    return {
      total: all.length,
      main: all.filter((c) => c.role === "main").length,
      supporting: all.filter((c) => c.role === "supporting").length,
    };
  }, [characterList, selectedDrawerSeries]);

  const openSeriesDrawer = (series: SeriesItem) => {
    setSelectedDrawerSeries(series);
    setDrawerRoleFilter("all");
  };

  return (
    <div className="page-wrapper">
      <BackgroundVideo />
      <Navbar />

      {/* Hero Başlık Alanı */}
      <header className="page-header-hero">
        <div className="pill-badge" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
          <Sparkles size={14} />
          <span>Kült Yapım Arşivi • Psikanalitik Karakter Çözümlemeleri</span>
        </div>
        <h1 className="page-title">Popüler Dizi, Film &amp; Karakter Psikanalizi</h1>
        <p className="page-desc">
          IMDb Top 50 kült dizisi ve Joker, Dövüş Kulübü, Taksici gibi 20 psikolojik kült film başyapıtı: Yapımların kapak afişine tıklayarak ana ve kilit karakter kadrosunu keşfedin, derinlemesine klinik psikolojik profillerini inceleyin.
        </p>
      </header>

      <main className="content-glass-section">
        <div className="content-container">
          
          {/* Üst Arama Çubuğu & Bilgilendirme */}
          <div className="analysis-header-controls animate-fade-down">
            <div className="analysis-search-container">
              <Search size={18} className="analysis-search-icon-left" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Dizi, film, karakter veya psikolojik tema ara (Örn: Joker, Arthur Fleck, Tyler Durden, Walter White, Narsisizm...)"
                className="analysis-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="analysis-search-clear-btn"
                  title="Aramayı Temizle"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="series-catalog-stat-bar">
              <span className="catalog-stat-pill highlight">
                <Film size={14} />
                <span>20 Psikolojik Kült Film</span>
              </span>
              <span className="catalog-stat-pill">
                <Tv size={14} />
                <span>50 Kült Dizi</span>
              </span>
              <span className="catalog-stat-pill highlight">
                <BrainCircuit size={14} />
                <span>460+ Detaylı Karakter Psikanalizi</span>
              </span>
              <span className="catalog-stat-pill">
                <UserCheck size={14} />
                <span>Ana &amp; Kilit Karakterler</span>
              </span>
            </div>

            {/* Medya Formatı Filtreleri (Tümü / Psikolojik Filmler / Kült Diziler) */}
            <div className="series-media-format-bar" style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "16px", width: "100%" }}>
              <button
                type="button"
                className={`catalog-format-toggle-btn ${mediaType === "all" ? "active" : ""}`}
                onClick={() => setMediaType("all")}
              >
                🎬 Tümü (70 Yapım)
              </button>
              <button
                type="button"
                className={`catalog-format-toggle-btn ${mediaType === "movies" ? "active" : ""}`}
                onClick={() => setMediaType("movies")}
              >
                🃏 Psikolojik Kült Filmler (Joker vb. • 20 Film)
              </button>
              <button
                type="button"
                className={`catalog-format-toggle-btn ${mediaType === "series" ? "active" : ""}`}
                onClick={() => setMediaType("series")}
              >
                📺 IMDb Top 50 Dizi
              </button>
            </div>

            {/* Tür / Kategori Hızlı Filtreleri */}
            <div className="series-genre-tabs-bar" style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "12px", width: "100%" }}>
              <button
                type="button"
                className={`bottom-sheet-role-btn ${selectedGenre === "all" ? "active" : ""}`}
                onClick={() => setSelectedGenre("all")}
              >
                Tüm Türler
              </button>
              <button
                type="button"
                className={`bottom-sheet-role-btn ${selectedGenre === "suc" ? "active" : ""}`}
                onClick={() => setSelectedGenre("suc")}
              >
                🔫 Suç &amp; Mafya
              </button>
              <button
                type="button"
                className={`bottom-sheet-role-btn ${selectedGenre === "gerilim" ? "active" : ""}`}
                onClick={() => setSelectedGenre("gerilim")}
              >
                🧠 Psikolojik Gerilim &amp; Gizem
              </button>
              <button
                type="button"
                className={`bottom-sheet-role-btn ${selectedGenre === "dram" ? "active" : ""}`}
                onClick={() => setSelectedGenre("dram")}
              >
                🎭 Tarih &amp; Dönem Dramı
              </button>
              <button
                type="button"
                className={`bottom-sheet-role-btn ${selectedGenre === "bilimkurgu" ? "active" : ""}`}
                onClick={() => setSelectedGenre("bilimkurgu")}
              >
                🚀 Bilim Kurgu &amp; Fantezi
              </button>
            </div>
          </div>

          {/* Yapım Bulunamadı Durumu */}
          {filteredSeriesList.length === 0 ? (
            <div className="profile-auth-prompt-card animate-scale" style={{ textAlign: "center", padding: "50px 20px" }}>
              <div className="prompt-icon-box" style={{ margin: "0 auto 16px auto" }}>
                <BrainCircuit size={32} color="#e0b878" />
              </div>
              <h2>Aradığınız Kriterlere Uygun Yapım Bulunamadı</h2>
              <p>Farklı bir dizi veya film adı, karakter veya psikolojik terim arayabilir ya da aramayı temizleyebilirsiniz.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setMediaType("all");
                  setSelectedGenre("all");
                }}
                className="btn-primary-solid"
                style={{ marginTop: "16px" }}
              >
                Aramayı Sıfırla
              </button>
            </div>
          ) : (
            /* DİZİ & FİLM KATALOĞU IZGARASI - HER SIRADA 3 SİNEMATİK KAPAK KARTI */
            <div className="series-catalog-grid">
              {filteredSeriesList.map((series, idx) => {
                const animClass = idx < 6 ? `animate-fade-up delay-${(idx % 6) + 1}` : "";
                const isMovie = series.id.endsWith("-movie");
                return (
                  <article
                    key={series.id}
                    className={`series-poster-card ${animClass}`}
                    onClick={() => openSeriesDrawer(series)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        openSeriesDrawer(series);
                      }
                    }}
                  >
                    {/* Arka Plan Dizi/Film Kapak Fotoğrafı */}
                    <img
                      src={series.coverImage}
                      alt={`${series.title} Kapak Afişi`}
                      className="series-card-bg-img"
                      loading={idx < 4 ? "eager" : "lazy"}
                      decoding="async"
                    />

                    {/* Sinematik Gradyan Katmanı */}
                    <div className="series-card-gradient" />

                    {/* Fotoğraf Üzerine Yerleşen Dizi/Film Bilgileri */}
                    <div className="series-card-content">
                      {/* Üst Rozet Barı */}
                      <div className="series-card-top-bar">
                        <span className="series-card-genre-badge">
                          {isMovie ? <Film size={12} /> : <Tv size={12} />}
                          {series.genre}
                        </span>
                        <span className="series-card-count-badge">
                          {series.characterCount} Karakter Analizi
                        </span>
                      </div>

                      {/* Alt Kısım: Başlık, Sezon/Süre, Tagline, Temalar ve Tıklama Çağrısı */}
                      <div className="series-card-bottom-details">
                        <span className="series-card-season-tag">
                          {series.seasons}
                        </span>

                        <h2 className="series-card-title">{series.title}</h2>

                        <p className="series-card-tagline">
                          &ldquo;{series.tagline}&rdquo;
                        </p>

                        <div className="series-card-theme-box">
                          <span className="series-theme-label">🧠 Psikanalitik Odak:</span>
                          <p className="series-theme-text">{series.psychologicalTheme}</p>
                        </div>

                        {/* Tıklama Aksiyon Çubuğu */}
                        <div className="series-card-action-bar">
                          <span className="series-open-drawer-btn">
                            <ChevronUp size={16} className="drawer-arrow-bounce" />
                            <span>Karakterleri İncele</span>
                          </span>
                          <span className="series-card-chars-hint">
                            {isMovie ? "Kilit Karakterler" : "Ana & Yan Roller"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

        </div>
      </main>

      {/* =========================================================================
          ALTTAN YUKARI ÇIKAN SİNEMATİK ÇEKMECE PANELİ (BOTTOM SHEET DRAWER)
          "Diziye tıklayınca alttan yukarı çıksın ve tüm ana/yan karakterler görünsün"
          ========================================================================= */}
      {selectedDrawerSeries && (
        <div 
          className="series-bottom-sheet-overlay"
          onClick={() => setSelectedDrawerSeries(null)}
        >
          <div 
            className="series-bottom-sheet-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Üst Çekmece Tutamacı (Pull Handle) */}
            <div className="bottom-sheet-handle-bar" onClick={() => setSelectedDrawerSeries(null)}>
              <div className="bottom-sheet-handle" />
            </div>

            {/* Çekmece Başlık Barı */}
            <div className="bottom-sheet-header">
              <div className="bottom-sheet-series-info">
                <img
                  src={selectedDrawerSeries.coverImage}
                  alt={selectedDrawerSeries.title}
                  className="bottom-sheet-series-thumb"
                  loading="lazy"
                  decoding="async"
                />
                <div className="bottom-sheet-series-text">
                  <div className="bottom-sheet-badge-group">
                    <span className="series-badge-gold">
                      {selectedDrawerSeries.id.endsWith("-movie") ? <Film size={12} /> : <Tv size={12} />}
                      {selectedDrawerSeries.genre}
                    </span>
                    <span className="series-badge-sub">
                      {selectedDrawerSeries.seasons}
                    </span>
                  </div>
                  <h2 className="bottom-sheet-series-title">
                    {selectedDrawerSeries.title}
                  </h2>
                  <p className="bottom-sheet-series-tagline">
                    {selectedDrawerSeries.tagline}
                  </p>
                </div>
              </div>

              {/* Kapat Butonu */}
              <button
                type="button"
                className="bottom-sheet-close-btn"
                onClick={() => setSelectedDrawerSeries(null)}
                aria-label="Kapat"
              >
                <X size={22} />
              </button>
            </div>

            {/* Çekmece İçi Kontrol Barı: Rol Filtreleri & Karakter Sayısı */}
            <div className="bottom-sheet-controls-bar">
              <div className="bottom-sheet-role-tabs">
                <button
                  type="button"
                  className={`bottom-sheet-role-btn ${drawerRoleFilter === "all" ? "active" : ""}`}
                  onClick={() => setDrawerRoleFilter("all")}
                >
                  Tümü ({characterCounts.total})
                </button>
                <button
                  type="button"
                  className={`bottom-sheet-role-btn ${drawerRoleFilter === "main" ? "active" : ""}`}
                  onClick={() => setDrawerRoleFilter("main")}
                >
                  👑 Ana Karakterler ({characterCounts.main})
                </button>
                <button
                  type="button"
                  className={`bottom-sheet-role-btn ${drawerRoleFilter === "supporting" ? "active" : ""}`}
                  onClick={() => setDrawerRoleFilter("supporting")}
                >
                  🎭 Kilit Yan Karakterler ({characterCounts.supporting})
                </button>
              </div>

              <div className="bottom-sheet-guide-note">
                <Sparkle size={13} color="#e0b878" />
                <span>Karaktere tıklayarak tam sayfa psikanalitik dosyasına gidebilirsiniz</span>
              </div>
            </div>

            {/* Çekmece Gövdesi: 3 Sütunlu Karakter Poster Kartları Izgarası */}
            <div className="bottom-sheet-body">
              <div className="bottom-sheet-characters-grid">
                {drawerCharacters.map((char, cIdx) => (
                  <Link
                    key={char.id}
                    href={`/analizler/karakter/${char.id}`}
                    className={`analysis-poster-card ${cIdx < 6 ? "animate-fade-up" : ""}`}
                  >
                    {/* Karakter Portre Fotoğrafı */}
                    <img
                      src={char.image}
                      alt={`${char.characterName} - ${char.series}`}
                      className="poster-card-bg-img"
                      loading="lazy"
                      decoding="async"
                    />

                    {/* Sinematik Gradyan Katmanı */}
                    <div className="poster-card-gradient" />

                    {/* Kart Üstü Bilgileri */}
                    <div className="poster-card-content">
                      {/* Üst Rozet Barı */}
                      <div className="poster-top-bar">
                        <span className="poster-series-badge">
                          {char.seriesId.endsWith("-movie") ? <Film size={12} /> : <Tv size={12} />}
                          {char.series}
                        </span>
                        <span className={`poster-role-badge ${char.role === "main" ? "main-role" : "supporting-role"}`}>
                          {char.role === "main" ? "👑 Ana Karakter" : "🎭 Kilit Yan Karakter"}
                        </span>
                      </div>

                      {/* Alt Kısım: Teşhis, İsim, Aktör, Aforizma, Çipler ve Buton */}
                      <div className="poster-bottom-details">
                        <span className="poster-diagnosis-badge">
                          {char.badge}
                        </span>

                        <div className="poster-header-text">
                          <h3 className="poster-character-name">{char.characterName}</h3>
                          <span className="poster-actor-name">{char.actor}</span>
                        </div>

                        <p className="poster-tagline">
                          &ldquo;{char.tagline}&rdquo;
                        </p>

                        {/* Arketip & Savunma Mekanizmaları */}
                        <div className="poster-chips-row">
                          {char.psychologicalProfile?.archetype && (
                            <span className="poster-chip" title="Jungian Arketip">
                              🎭 {char.psychologicalProfile.archetype}
                            </span>
                          )}
                          {char.psychologicalProfile?.defenseMechanisms && char.psychologicalProfile.defenseMechanisms.slice(0, 2).map((def, di) => (
                            <span key={di} className="poster-chip" title="Savunma Mekanizması">
                              🛡️ {def}
                            </span>
                          ))}
                          {!char.psychologicalProfile?.archetype && (
                            <span className="poster-chip" title="Klinik Teşhis">
                              🧠 {char.psychologicalProfile?.primaryDiagnosis || char.badge || "Psikanaliz"}
                            </span>
                          )}
                        </div>

                        {/* Kart Alt Çubuğu - Ayrılmış Sayfaya Yönlendirme */}
                        <div className="poster-card-footer">
                          <span className="poster-read-time">
                            <Clock size={13} />
                            {char.readTime}
                          </span>
                          <span className="poster-cta-btn">
                            <span>Psikanalizi Oku</span>
                            <ArrowRight size={14} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
