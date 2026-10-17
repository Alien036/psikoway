"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Download, X, Share, PlusSquare, MoreVertical, Smartphone, CheckCircle2 } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PwaInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isLocalHttp, setIsLocalHttp] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isHttpsOrLocalhost =
      window.location.protocol === "https:" ||
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    setIsLocalHttp(!isHttpsOrLocalhost);

    // ÖNEMLİ: Android Chrome'da yerel Wi-Fi IP'si (örn. http://192.168.1.101:3000) üzerinden
    // girildiğinde sayfada <link rel="manifest"> varsa, Chrome Google Play WebAPK sunucusuna
    // bağlanmaya çalışır ve yerel IP'ye dışarıdan erişilemediği için "Bu uygulama yüklenemez" hatası verir!
    // Bu yüzden manifest ve Service Worker'ı yalnızca HTTPS (Vercel canlı site) veya localhost üzerinde aktif ediyoruz.
    // Yerel IP'de ise <meta name="mobile-web-app-capable" content="yes"> ve 192x192 ikon sayesinde
    // "Ana ekrana ekle" hatasız ve logolu olarak doğrudan ana ekrana eklenir!
    if (isHttpsOrLocalhost) {
      if (!document.querySelector('link[rel="manifest"]')) {
        const link = document.createElement("link");
        link.rel = "manifest";
        link.href = "/manifest.json";
        document.head.appendChild(link);
      }
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/sw.js").catch(() => {});
      }
    } else {
      const existingManifest = document.querySelector('link[rel="manifest"]');
      if (existingManifest) {
        existingManifest.remove();
      }
    }

    // Zaten uygulama olarak (standalone) çalışıyor mu kontrol et
    const checkStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsStandalone(checkStandalone);

    // iOS / iPhone tespiti
    const ua = window.navigator.userAgent.toLowerCase();
    const iosDevice = /iphone|ipad|ipod/.test(ua);
    setIsIOS(iosDevice);

    // Mobilde alt indirme barını göster (eğer daha önce kapatmadıysa ve yüklü değilse)
    const isMobileScreen = window.innerWidth <= 900 || /android|iphone|ipad|ipod/i.test(ua);
    const dismissed = sessionStorage.getItem("psikoway_pwa_banner_dismissed") === "1";
    if (isMobileScreen && !checkStandalone && !dismissed) {
      setShowBanner(true);
    }

    // Tarayıcı yerel kurulum istemini (beforeinstallprompt) yakala
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      if (!checkStandalone && !dismissed) {
        setShowBanner(true);
      }
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsStandalone(true);
      setShowBanner(false);
      setInstalledSuccess(true);
      setTimeout(() => {
        setShowGuideModal(false);
        setInstalledSuccess(false);
      }, 2500);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const triggerInstall = useCallback(async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === "accepted") {
          setDeferredPrompt(null);
          setShowBanner(false);
        }
        return;
      } catch {
        // Hata olursa rehber modalını aç
      }
    }
    setShowGuideModal(true);
  }, [deferredPrompt]);

  // Navbar veya Yan Çekmeceden tetiklenen "psikoway-trigger-install" olayını dinle
  useEffect(() => {
    const handleCustomTrigger = () => {
      triggerInstall();
    };
    window.addEventListener("psikoway-trigger-install", handleCustomTrigger);
    return () => window.removeEventListener("psikoway-trigger-install", handleCustomTrigger);
  }, [triggerInstall]);

  const dismissBanner = () => {
    setShowBanner(false);
    try {
      sessionStorage.setItem("psikoway_pwa_banner_dismissed", "1");
    } catch {}
  };

  if (isStandalone && !showGuideModal) return null;

  return (
    <>
      {/* MOBİL ALT UYGULAMA İNDİRME BARI */}
      {showBanner && !isStandalone && (
        <div className="pwa-mobile-install-banner" role="region" aria-label="Mobil Uygulama İndirme Barı">
          <div className="pwa-banner-left">
            <div className="pwa-banner-logo-wrap">
              <img src="/logo.png" alt="PsikoWay Logo" className="pwa-banner-logo" />
            </div>
            <div className="pwa-banner-text">
              <strong>PsikoWay Uygulaması</strong>
              <span>Telefonuna indir, ana ekrandan tek dokunuşla gir</span>
            </div>
          </div>

          <div className="pwa-banner-actions">
            <button
              type="button"
              onClick={triggerInstall}
              className="pwa-banner-install-btn"
            >
              <Download size={15} />
              <span>İndir</span>
            </button>
            <button
              type="button"
              onClick={dismissBanner}
              className="pwa-banner-close-btn"
              aria-label="İndirme barını kapat"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* LOGOLU TELEFONA İNDİRME & ANA EKRANA EKLEME MODALI */}
      {showGuideModal && (
        <div
          className="pwa-modal-backdrop"
          onClick={() => setShowGuideModal(false)}
        >
          <div
            className="pwa-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="pwa-modal-close"
              onClick={() => setShowGuideModal(false)}
              aria-label="Kapat"
            >
              <X size={20} />
            </button>

            <div className="pwa-modal-header">
              <div className="pwa-modal-logo-ring">
                <img src="/logo.png" alt="PsikoWay Uygulama Logosu" className="pwa-modal-logo-img" />
              </div>
              <span className="pwa-modal-badge">
                <Smartphone size={13} />
                Mobil Uygulama Deneyimi
              </span>
              <h3>PsikoWay&apos;i Telefonuna İndir</h3>
              <p>
                PsikoWay logosuyla ana ekranınıza ekleyin ve tam ekran uygulama olarak anında açın.
              </p>
            </div>

            {installedSuccess ? (
              <div className="pwa-install-success-box">
                <CheckCircle2 size={36} color="#4ade80" />
                <strong>Uygulama Başarıyla Eklendi!</strong>
                <span>Artık telefonunuzun ana ekranındaki PsikoWay logosuna dokunarak doğrudan girebilirsiniz.</span>
              </div>
            ) : (
              <>
                {deferredPrompt && (
                  <button
                    type="button"
                    onClick={triggerInstall}
                    className="pwa-modal-primary-btn"
                  >
                    <Download size={18} />
                    <span>Hemen Telefonuma Yükle</span>
                  </button>
                )}

                <div className="pwa-steps-container">
                  {isIOS ? (
                    <>
                      <div className="pwa-step-title">iPhone / iPad (Safari) Kurulumu:</div>
                      <div className="pwa-step-item">
                        <span className="pwa-step-num">1</span>
                        <div className="pwa-step-desc">
                          Tarayıcınızın alt barındaki <strong>Paylaş</strong>{" "}
                          <Share size={15} style={{ display: "inline", verticalAlign: "middle", color: "#e0b878" }} />{" "}
                          simgesine dokunun.
                        </div>
                      </div>
                      <div className="pwa-step-item">
                        <span className="pwa-step-num">2</span>
                        <div className="pwa-step-desc">
                          Açılan menüyü aşağı kaydırıp{" "}
                          <strong>&ldquo;Ana Ekrana Ekle&rdquo;</strong>{" "}
                          <PlusSquare size={15} style={{ display: "inline", verticalAlign: "middle", color: "#e0b878" }} />{" "}
                          seçeneğine basın ve sağ üstten <strong>Ekle</strong> deyin.
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="pwa-step-title">Android (Chrome / Samsung) Kurulumu:</div>
                      <div className="pwa-step-item">
                        <span className="pwa-step-num">1</span>
                        <div className="pwa-step-desc">
                          Tarayıcınızın sağ üst köşesindeki <strong>Menü ( üç nokta ⋮ )</strong>{" "}
                          <MoreVertical size={15} style={{ display: "inline", verticalAlign: "middle", color: "#e0b878" }} />{" "}
                          simgesine dokunun.
                        </div>
                      </div>
                      <div className="pwa-step-item">
                        <span className="pwa-step-num">2</span>
                        <div className="pwa-step-desc">
                          Menüden <strong>&ldquo;Ana ekrana ekle&rdquo;</strong>{" "}
                          {!isLocalHttp && (
                            <>
                              veya <strong>&ldquo;Uygulamayı yükle&rdquo;</strong>{" "}
                            </>
                          )}
                          seçeneğine dokunup <strong>Ekle</strong> deyin.
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}

            <button
              type="button"
              onClick={() => setShowGuideModal(false)}
              className="pwa-modal-done-btn"
            >
              Anladım
            </button>
          </div>
        </div>
      )}
    </>
  );
}
