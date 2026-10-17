"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import BackgroundVideo from "../../components/BackgroundVideo";
import {
  Clock,
  BarChart3,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles,
  Search,
  CheckCircle2,
  Share2,
  HelpCircle,
  BrainCircuit,
  MessageCircle,
  Calendar,
  CalendarCheck,
  Phone,
  ShieldCheck,
  MessageSquare
} from "lucide-react";
import {
  PSYCHOLOGY_TESTS,
  TEST_CATEGORIES,
  TestDefinition,
  TestResultReport
} from "../../lib/tests-data";

export default function TestsPage() {
  const [activeTest, setActiveTest] = useState<TestDefinition | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<any[]>([]);
  const [testResult, setTestResult] = useState<TestResultReport | null>(null);

  // Filtreler
  const [selectedCategory, setSelectedCategory] = useState<string>("Tümü");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtrelenmiş Testler
  const filteredTests = useMemo(() => {
    return PSYCHOLOGY_TESTS.filter((test) => {
      const matchesCategory = selectedCategory === "Tümü" || test.category === selectedCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const startTest = (test: TestDefinition) => {
    setActiveTest(test);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setTestResult(null);
    window.scrollTo({ top: 350, behavior: "smooth" });
  };

  const handleOptionSelect = (option: any) => {
    if (!activeTest) return;

    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQuestionIndex] = option;
    setUserAnswers(updatedAnswers);

    if (currentQuestionIndex + 1 < activeTest.questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      const res = activeTest.getResult(updatedAnswers);
      setTestResult(res);
      window.scrollTo({ top: 350, behavior: "smooth" });
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const resetTest = () => {
    setActiveTest(null);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setTestResult(null);
  };

  const handleShareResult = () => {
    if (!testResult || !activeTest) return;
    const therapyText = testResult.recommendedTherapy?.name ? `\nTavsiye Edilen Terapi: ${testResult.recommendedTherapy.name}` : "";
    const shareText = `PsikoWay Psikolojik Test Sonucum: "${testResult.title}"\n${testResult.scoreText || ""}${therapyText}\nKendini keşfetmek ve randevu almak için: ${window.location.origin}/testler`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      showToast("Test sonucu ve terapi tavsiyesi panoya kopyalandı!");
    } else {
      showToast("Sonuç paylaşıma hazır.");
    }
  };

  return (
    <div className="page-wrapper">
      {/* Kehribar Geçişli Video Arka Plan */}
      <BackgroundVideo />

      <Navbar />

      {/* Toast Bildirimi */}
      {toastMessage && (
        <div
          className="forum-toast animate-fade-down"
          style={{
            position: "fixed",
            bottom: "30px",
            right: "30px",
            zIndex: 9999,
            background: "rgba(18, 12, 8, 0.95)",
            border: "1px solid rgba(224, 184, 120, 0.5)",
            color: "#ffffff",
            padding: "12px 20px",
            borderRadius: "12px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "14px"
          }}
        >
          <CheckCircle2 size={16} color="var(--gold-primary)" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HERO / BAŞLIK BÖLÜMÜ */}
      <header className="page-header-hero">
        <div className="pill-badge" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
          <Sparkles size={14} />
          <span>Kendini Keşfet & Zihnini Anla</span>
        </div>
        <h1 className="page-title">İnteraktif Psikoloji Testleri</h1>
        <p className="page-desc">
          Bilinçdışınıza, ilişki kalıplarınıza, tükenmişlik eşiğinize ve duygusal dayanıklılığınıza klinik standartlardaki ölçeklerle ayna tutun. Her test en az 20 soru içerir ve test bitiminde durumunuza özel terapi tavsiyesi ile hemen randevu planlama imkanı sunar.
        </p>

        {/* İSTATİSTİK ŞERİDİ */}
        {!activeTest && (
          <div
            className="test-stats-strip animate-fade-up delay-1"
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "24px",
              marginTop: "24px",
              flexWrap: "wrap",
              fontSize: "13.5px",
              color: "rgba(255, 255, 255, 0.75)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <BrainCircuit size={16} color="var(--gold-primary)" />
              <span><strong>8</strong> Kapsamlı Klinik Test (Her biri 20+ Soru)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <HelpCircle size={16} color="var(--gold-primary)" />
              <span><strong>160+</strong> Derin Klinik Soru</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <CheckCircle2 size={16} color="#4ade80" />
              <span>Tavsiye Edilen Terapi & Doğrudan Randevu</span>
            </div>
          </div>
        )}
      </header>

      <main className="content-glass-section">
        <div className="content-container">
          {!activeTest ? (
            <div>
              {/* KATEGORİ FİLTRELERİ VE ARAMA ÇUBUĞU */}
              <div
                className="animate-fade-down"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "20px",
                  marginBottom: "40px"
                }}
              >
                {/* Arama Kutusu */}
                <div style={{ position: "relative", width: "100%", maxWidth: "460px" }}>
                  <Search
                    size={18}
                    style={{
                      position: "absolute",
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "rgba(255,255,255,0.4)"
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Test adı, kategori veya anahtar kelime ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 16px 12px 42px",
                      borderRadius: "12px",
                      background: "rgba(255, 255, 255, 0.06)",
                      border: "1px solid rgba(255, 255, 255, 0.14)",
                      color: "#fff",
                      fontSize: "14px",
                      outline: "none",
                      transition: "all 0.2s ease"
                    }}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      style={{
                        position: "absolute",
                        right: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        color: "rgba(255,255,255,0.5)",
                        cursor: "pointer"
                      }}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                {/* Kategori Hapları */}
                <div
                  className="test-categories-bar"
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                    justifyContent: "center"
                  }}
                >
                  {TEST_CATEGORIES.map((cat) => {
                    const isActive = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        style={{
                          padding: "8px 16px",
                          borderRadius: "999px",
                          fontSize: "13px",
                          fontWeight: isActive ? 600 : 500,
                          cursor: "pointer",
                          transition: "all 0.25s ease",
                          background: isActive
                            ? "linear-gradient(135deg, rgba(224, 184, 120, 0.35), rgba(198, 146, 72, 0.2))"
                            : "rgba(255, 255, 255, 0.04)",
                          border: isActive
                            ? "1px solid rgba(224, 184, 120, 0.7)"
                            : "1px solid rgba(255, 255, 255, 0.1)",
                          color: isActive ? "#ffffff" : "rgba(255, 255, 255, 0.75)",
                          boxShadow: isActive ? "0 4px 15px rgba(224, 184, 120, 0.15)" : "none"
                        }}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* TEST KARTLARI LİSTESİ */}
              {filteredTests.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 20px", color: "rgba(255,255,255,0.6)" }}>
                  <HelpCircle size={48} style={{ margin: "0 auto 16px auto", opacity: 0.5 }} />
                  <h3>Aramanıza uygun psikolojik test bulunamadı.</h3>
                  <p style={{ marginTop: "8px" }}>Farklı bir arama kelimesi veya kategori seçmeyi deneyin.</p>
                  <button
                    type="button"
                    onClick={() => { setSelectedCategory("Tümü"); setSearchQuery(""); }}
                    className="btn-white-outline"
                    style={{ marginTop: "16px" }}
                  >
                    Tüm Testleri Göster
                  </button>
                </div>
              ) : (
                <div className="quizzes-list-grid">
                  {filteredTests.map((test, index) => {
                    const delayClass = `delay-${(index % 8) + 1}`;
                    return (
                      <div key={test.id} className={`quiz-card animate-fade-up ${delayClass}`}>
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
                            <span className="pill-badge" style={{ fontSize: "11px", padding: "4px 12px" }}>
                              {test.category}
                            </span>
                            {test.badge && (
                              <span
                                style={{
                                  fontSize: "11px",
                                  color: "var(--gold-primary)",
                                  background: "rgba(224, 184, 120, 0.1)",
                                  padding: "3px 8px",
                                  borderRadius: "6px",
                                  border: "1px solid rgba(224, 184, 120, 0.25)",
                                  fontWeight: 600
                                }}
                              >
                                {test.badge}
                              </span>
                            )}
                          </div>

                          <div style={{ margin: "20px 0 12px", color: "var(--gold-primary)" }}>
                            {test.icon}
                          </div>
                          <h3 style={{ fontSize: "22px", minHeight: "56px" }}>{test.title}</h3>
                          <p style={{ minHeight: "72px" }}>{test.desc}</p>
                        </div>

                        <div>
                          <div
                            style={{
                              fontSize: "13px",
                              color: "rgba(255,255,255,0.6)",
                              marginBottom: "16px",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center"
                            }}
                          >
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                              <Clock size={14} />
                              <span>{test.duration}</span>
                            </span>
                            <span style={{ color: "rgba(255,255,255,0.5)" }}>
                              {test.questionCount} Soru
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => startTest(test)}
                            className="btn-primary-solid w-100"
                            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                          >
                            <span>Teste Başla</span>
                            <ArrowRight size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* AKTİF TEST ÇÖZME PANELİ */
            <div className="quiz-active-panel animate-scale">
              {!testResult ? (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span className="pill-badge">
                        {activeTest.title}
                      </span>
                      <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>
                        {activeTest.category}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={resetTest}
                      style={{
                        background: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        color: "#ffffff",
                        cursor: "pointer",
                        padding: "6px 14px",
                        borderRadius: "8px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "13px",
                        transition: "all 0.2s ease"
                      }}
                    >
                      <X size={15} />
                      <span>Testten Çık</span>
                    </button>
                  </div>

                  {/* İlerleme Çubuğu */}
                  <div className="quiz-progress-track">
                    <div
                      className="quiz-progress-fill"
                      style={{
                        width: `${((currentQuestionIndex + 1) / activeTest.questions.length) * 100}%`,
                        background: "linear-gradient(90deg, #c69248, #e0b878)"
                      }}
                    ></div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", fontSize: "13.5px", color: "rgba(255,255,255,0.65)" }}>
                    <span>Soru {currentQuestionIndex + 1} / {activeTest.questions.length}</span>
                    <span>%{Math.round(((currentQuestionIndex + 1) / activeTest.questions.length) * 100)} Tamamlandı</span>
                  </div>

                  <h3 className="question-text">
                    {activeTest.questions[currentQuestionIndex].question}
                  </h3>

                  {/* Seçenekler */}
                  <div className="quiz-options-box">
                    {activeTest.questions[currentQuestionIndex].options.map((opt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className="quiz-opt-btn"
                        onClick={() => handleOptionSelect(opt)}
                      >
                        <span className="quiz-opt-indicator">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span style={{ flex: 1, lineHeight: "1.5" }}>{opt.text}</span>
                      </button>
                    ))}
                  </div>

                  {/* Önceki Soru Butonu */}
                  {currentQuestionIndex > 0 && (
                    <div style={{ marginTop: "16px" }}>
                      <button
                        type="button"
                        onClick={handlePrevQuestion}
                        className="btn-white-outline btn-sm"
                        style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 12px", fontSize: "13px" }}
                      >
                        <ArrowLeft size={14} />
                        <span>Önceki Soru</span>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                /* SONUÇ RAPORU GÖRÜNÜMÜ */
                <div className="quiz-result-view animate-scale">
                  <div className="quiz-result-icon" style={{ display: "flex", justifyContent: "center", marginBottom: "16px", color: "var(--gold-primary)" }}>
                    <BarChart3 size={58} />
                  </div>
                  <span className="pill-badge" style={{ marginBottom: "12px" }}>
                    {activeTest.title} • Değerlendirme Raporu
                  </span>

                  <h3 style={{ fontSize: "28px", color: "#ffffff", margin: "10px 0" }}>
                    {testResult.title}
                  </h3>

                  {testResult.scoreText && (
                    <div
                      style={{
                        fontSize: "15px",
                        color: "var(--gold-primary)",
                        fontWeight: 700,
                        marginBottom: "20px",
                        display: "inline-block",
                        padding: "6px 16px",
                        background: "rgba(224, 184, 120, 0.1)",
                        borderRadius: "8px",
                        border: "1px solid rgba(224, 184, 120, 0.25)"
                      }}
                    >
                      {testResult.scoreText}
                    </div>
                  )}

                  <div className="quiz-result-report">
                    <div style={{ marginBottom: "20px" }}>
                      <strong style={{ display: "block", color: "var(--gold-primary)", fontSize: "16px", marginBottom: "6px" }}>
                        🧠 Psikolojik Çözümleme:
                      </strong>
                      <p style={{ margin: 0, lineHeight: "1.7", color: "rgba(255, 255, 255, 0.9)" }}>
                        {testResult.evaluation}
                      </p>
                    </div>

                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "18px" }}>
                      <strong style={{ display: "block", color: "#4ade80", fontSize: "16px", marginBottom: "6px" }}>
                        🌱 Öneri & Yaşam Yol Haritası:
                      </strong>
                      <p style={{ margin: 0, lineHeight: "1.7", color: "#e2e8f0" }}>
                        {testResult.advice}
                      </p>
                    </div>
                  </div>

                  {/* ======================================================== */}
                  {/* TAVSİYE EDİLEN TERAPİ EKRANI / KARTI                     */}
                  {/* ======================================================== */}
                  {testResult.recommendedTherapy && (
                    <div
                      className="test-recommended-therapy-card animate-fade-up"
                      style={{
                        margin: "32px 0 28px 0",
                        background: "linear-gradient(145deg, rgba(224, 184, 120, 0.12) 0%, rgba(26, 18, 14, 0.85) 100%)",
                        border: "1.5px solid rgba(224, 184, 120, 0.45)",
                        borderRadius: "22px",
                        padding: "30px 32px",
                        textAlign: "left",
                        boxShadow: "0 18px 45px rgba(0, 0, 0, 0.5), 0 0 30px rgba(224, 184, 120, 0.15)",
                        position: "relative",
                        overflow: "hidden"
                      }}
                    >
                      {/* Üst Vurgu Çizgisi */}
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          height: "3px",
                          background: "linear-gradient(90deg, #c69248, #e0b878, #ffd79a)"
                        }}
                      />

                      {/* Başlık ve Rozet */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px", marginBottom: "16px" }}>
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            background: "rgba(224, 184, 120, 0.18)",
                            border: "1px solid rgba(224, 184, 120, 0.4)",
                            padding: "6px 14px",
                            borderRadius: "999px",
                            color: "var(--gold-primary)",
                            fontSize: "12.5px",
                            fontWeight: 700,
                            letterSpacing: "0.5px"
                          }}
                        >
                          <Sparkles size={14} />
                          <span>KLİNİK TAVSİYE EDİLEN TERAPİ MODELİ</span>
                        </div>

                        <span style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.6)" }}>
                          Test Bulgusu Eşleşmesi
                        </span>
                      </div>

                      {/* Terapi Başlığı */}
                      <div style={{ marginBottom: "14px" }}>
                        <span style={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.7)", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600 }}>
                          Sizin İçin En Uygun Yöntem:
                        </span>
                        <h4
                          className="test-therapy-title"
                          style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "28px",
                            color: "#ffffff",
                            margin: "4px 0 0 0",
                            textShadow: "0 2px 10px rgba(0,0,0,0.5)"
                          }}
                        >
                          <span style={{ color: "var(--gold-primary)" }}>{testResult.recommendedTherapy.name}</span>
                        </h4>
                      </div>

                      {/* Eşleşme Sebebi / Açıklaması */}
                      <p style={{ margin: "0 0 20px 0", color: "rgba(255, 255, 255, 0.88)", fontSize: "14.5px", lineHeight: "1.75" }}>
                        {testResult.recommendedTherapy.matchReason}
                      </p>

                      {/* Bu Terapinin Sağlayacağı Temel Kazanımlar */}
                      {testResult.recommendedTherapy.benefits && testResult.recommendedTherapy.benefits.length > 0 && (
                        <div style={{ marginBottom: "24px" }}>
                          <strong style={{ display: "block", color: "#ffffff", fontSize: "13.5px", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                            🌿 Bu Terapi Sürecinde Elde Edeceğiniz Kazanımlar:
                          </strong>
                          <div className="test-benefits-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "10px" }}>
                            {testResult.recommendedTherapy.benefits.map((benefit, bIdx) => (
                              <div
                                key={bIdx}
                                style={{
                                  display: "flex",
                                  alignItems: "flex-start",
                                  gap: "10px",
                                  background: "rgba(255, 255, 255, 0.05)",
                                  padding: "10px 14px",
                                  borderRadius: "10px",
                                  border: "1px solid rgba(255, 255, 255, 0.09)",
                                  fontSize: "13.5px",
                                  color: "#f1f5f9"
                                }}
                              >
                                <CheckCircle2 size={16} color="#4ade80" style={{ flexShrink: 0, marginTop: "2px" }} />
                                <span>{benefit}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Süre ve Format Bilgisi */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          flexWrap: "wrap",
                          gap: "14px",
                          paddingTop: "16px",
                          borderTop: "1px solid rgba(255, 255, 255, 0.12)",
                          fontSize: "13px",
                          color: "rgba(255, 255, 255, 0.8)"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <Clock size={15} color="var(--gold-primary)" />
                          <span><strong>Öngörülen Seans Süreci:</strong> {testResult.recommendedTherapy.duration}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <ShieldCheck size={15} color="#4ade80" />
                          <span><strong>Seans Biçimi:</strong> {testResult.recommendedTherapy.format}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ======================================================== */}
                  {/* HEMEN RANDEVU AL BÖLÜMÜ (CALL TO ACTION)                 */}
                  {/* ======================================================== */}
                  <div
                    className="test-cta-card animate-fade-up delay-1"
                    style={{
                      background: "radial-gradient(ellipse at top, rgba(224, 184, 120, 0.15), rgba(18, 12, 10, 0.95))",
                      border: "2px solid rgba(224, 184, 120, 0.65)",
                      borderRadius: "22px",
                      padding: "36px 30px",
                      textAlign: "center",
                      boxShadow: "0 20px 50px rgba(0, 0, 0, 0.65), 0 0 35px rgba(224, 184, 120, 0.22)",
                      marginBottom: "32px",
                      position: "relative"
                    }}
                  >
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "56px",
                        height: "56px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, rgba(224, 184, 120, 0.25), rgba(198, 146, 72, 0.15))",
                        border: "1.5px solid rgba(224, 184, 120, 0.5)",
                        color: "var(--gold-primary)",
                        marginBottom: "16px",
                        boxShadow: "0 4px 20px rgba(224, 184, 120, 0.25)"
                      }}
                    >
                      <CalendarCheck size={28} />
                    </div>

                    <h3
                      className="test-cta-title"
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "30px",
                        color: "#ffffff",
                        margin: "0 0 10px 0"
                      }}
                    >
                      Randevu Al & İlk Seansınızı Planlayın
                    </h3>

                    <p
                      style={{
                        maxWidth: "620px",
                        margin: "0 auto 24px auto",
                        color: "rgba(255, 255, 255, 0.85)",
                        fontSize: "15px",
                        lineHeight: "1.65"
                      }}
                    >
                      Test sonucunuz doğrultusunda tavsiye edilen <strong style={{ color: "var(--gold-primary)" }}>{testResult.recommendedTherapy?.name || "Bireysel Terapi"}</strong> seansı için uzman klinik psikologlarımızla yüz yüze veya online görüşme randevusu oluşturabilirsiniz.
                    </p>

                    {/* Ana Randevu Butonları */}
                    <div className="test-cta-actions" style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap", marginBottom: "20px" }}>
                      <Link
                        href={`/iletisim?terapi=${encodeURIComponent(testResult.recommendedTherapy?.name || "")}`}
                        className="btn-primary-solid"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "10px",
                          padding: "15px 32px",
                          fontSize: "15.5px",
                          fontWeight: 700,
                          borderRadius: "12px",
                          boxShadow: "0 10px 30px rgba(224, 184, 120, 0.4)",
                          textDecoration: "none",
                          transition: "all 0.25s ease"
                        }}
                      >
                        <Calendar size={18} />
                        <span>Hemen Randevu Al</span>
                        <ArrowRight size={18} />
                      </Link>

                      <a
                        href={`https://wa.me/905523283646?text=${encodeURIComponent(`Merhaba PsikoWay, '${activeTest.title}' testini tamamladım. Test sonucuma göre önerilen '${testResult.recommendedTherapy?.name || "Bireysel Psikoterapi"}' için uzman psikologdan randevu almak istiyorum.`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="test-whatsapp-cta-btn"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "10px",
                          padding: "15px 28px",
                          fontSize: "15px",
                          fontWeight: 700,
                          borderRadius: "12px",
                          background: "#25D366",
                          color: "#0a1f11",
                          textDecoration: "none",
                          boxShadow: "0 8px 25px rgba(37, 211, 102, 0.4)",
                          transition: "all 0.25s ease"
                        }}
                      >
                        <MessageSquare size={18} />
                        <span>WhatsApp ile Hızlı Randevu Al</span>
                      </a>
                    </div>

                    {/* Danışma Hattı */}
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "13.5px",
                        color: "rgba(255, 255, 255, 0.7)",
                        flexWrap: "wrap",
                        justifyContent: "center"
                      }}
                    >
                      <Phone size={14} color="var(--gold-primary)" />
                      <span>Doğrudan Danışma Hattı: <a href="tel:+905523283646" style={{ color: "#ffffff", fontWeight: 600, textDecoration: "underline" }}>+90 552 328 36 46</a></span>
                    </div>
                  </div>

                  {/* Sonuç Aksiyon Butonları (Tekrar Çöz, Paylaş, Diğer Testler) */}
                  <div className="test-result-actions" style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginTop: "16px" }}>
                    <button
                      type="button"
                      onClick={() => startTest(activeTest)}
                      className="btn-white-outline"
                      style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "13.5px" }}
                    >
                      <RotateCcw size={15} />
                      <span>Testi Tekrar Çöz</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleShareResult}
                      className="btn-white-outline"
                      style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "13.5px" }}
                      title="Sonucu Kopyala"
                    >
                      <Share2 size={15} />
                      <span>Sonucu Kopyala / Paylaş</span>
                    </button>

                    <button
                      type="button"
                      onClick={resetTest}
                      className="btn-white-outline"
                      style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "13.5px" }}
                    >
                      <span>Tüm Testleri İncele</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
