"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Download, X, Share, PlusSquare, MoreVertical, ShieldCheck, CheckCircle2 } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// Sayfa yüklenir yüklenmez (React bileşeni mount olmadan bile önce) beforeinstallprompt olayını yakala
let globalDeferredPrompt: BeforeInstallPromptEvent | null = null;
if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    globalDeferredPrompt = e as BeforeInstallPromptEvent;
  });
}

export default function PwaInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(globalDeferredPrompt);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ua = window.navigator.userAgent || "";
    const uaLower = ua.toLowerCase();

    // Zaten uygulama olarak (standalone / WebAPK) çalışıyor mu kontrol et
    const checkStandalone =
      ua.includes("PsikoWayAndroidApp") ||
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsStandalone(checkStandalone);

    const iosDevice = /iphone|ipad|ipod/.test(uaLower);
    setIsIOS(iosDevice);

    const isHttpsOrLocalhost =
      window.location.protocol === "https:" ||
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    if (isHttpsOrLocalhost && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    if (globalDeferredPrompt) {
      setDeferredPrompt(globalDeferredPrompt);
    }

    const isMobileScreen = window.innerWidth <= 900 || /android|iphone|ipad|ipod/i.test(uaLower);
    const dismissed = sessionStorage.getItem("psikoway_pwa_banner_dismissed") === "1";
    if (isMobileScreen && !checkStandalone && !dismissed) {
      setShowBanner(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      globalDeferredPrompt = promptEvent;
      setDeferredPrompt(promptEvent);
      if (!checkStandalone && !dismissed) {
        setShowBanner(true);
      }
    };

    const handleAppInstalled = () => {
      globalDeferredPrompt = null;
      setDeferredPrompt(null);
      setIsStandalone(true);
      setShowBanner(false);
      setInstalledSuccess(true);
      setTimeout(() => {
        setShowGuideModal(false);
        setInstalledSuccess(false);
      }, 2800);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const triggerInstall = useCallback(async () => {
    const activePrompt = deferredPrompt || globalDeferredPrompt;
    if (activePrompt) {
      try {
        // Google Play resmi WebAPK sertifikalı kurulum penceresini doğrudan açar (Uyarı vermez!)
        await activePrompt.prompt();
        const choiceResult = await activePrompt.userChoice;
        if (choiceResult.outcome === "accepted") {
          globalDeferredPrompt = null;
          setDeferredPrompt(null);
          setShowBanner(false);
        }
        return;
      } catch {
        // Hata durumunda rehber penceresini göster
      }
    }
    setShowGuideModal(true);
  }, [deferredPrompt]);

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
      {/* MOBİL ALT SERTİFİKALI UYGULAMA KURULUM BARI */}
      {showBanner && !isStandalone && (
        <div className="pwa-mobile-install-banner" role="region" aria-label="Mobil Uygulama Kurulum Barı">
          <div className="pwa-banner-left">
            <div className="pwa-banner-logo-wrap">
              <img src="/logo.png" alt="PsikoWay Logo" className="pwa-banner-logo" />
            </div>
            <div className="pwa-banner-text">
              <strong>PsikoWay Resmi Uygulaması</strong>
              <span>Google sertifikalı, reklamsız ve tam ekran kur</span>
            </div>
          </div>

          <div className="pwa-banner-actions">
            <button
              type="button"
              onClick={triggerInstall}
              className="pwa-banner-install-btn"
            >
              <Download size={15} />
              <span>Yükle</span>
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

      {/* SERTİFİKALI GOOGLE WEBAPK & İOS KURULUM MODALI */}
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
                <ShieldCheck size={13} />
                SSL & Google WebAPK Sertifikalı
              </span>
              <h3>PsikoWay Mobil Uygulaması</h3>
              <p>
                Dışarıdan APK dosyası indirmeden, doğrudan Google Play WebAPK sertifikasıyla güvenli ve uyarısız olarak telefonunuza kurun.
              </p>
            </div>

            {installedSuccess ? (
              <div className="pwa-install-success-box">
                <CheckCircle2 size={36} color="#4ade80" />
                <strong>Uygulama Başarıyla Kuruldu!</strong>
                <span>Artık telefonunuzun uygulama menüsündeki PsikoWay logosuna dokunarak doğrudan açabilirsiniz.</span>
              </div>
            ) : (
              <>
                {(deferredPrompt || globalDeferredPrompt) && (
                  <button
                    type="button"
                    onClick={triggerInstall}
                    className="pwa-modal-primary-btn"
                  >
                    <ShieldCheck size={18} />
                    <span>Sertifikalı Olarak Hemen Yükle</span>
                  </button>
                )}

                <div className="pwa-steps-container">
                  {isIOS ? (
                    <>
                      <div className="pwa-step-title">iPhone / iPad (Safari) Sertifikalı Kurulum:</div>
                      <div className="pwa-step-item">
                        <span className="pwa-step-num">1</span>
                        <div className="pwa-step-desc">
                          Alt bardaki <strong>Paylaş</strong>{" "}
                          <Share size={15} style={{ display: "inline", verticalAlign: "middle", color: "#e0b878" }} />{" "}
                          simgesine dokunun.
                        </div>
                      </div>
                      <div className="pwa-step-item">
                        <span className="pwa-step-num">2</span>
                        <div className="pwa-step-desc">
                          Menüden <strong>&ldquo;Ana Ekrana Ekle&rdquo;</strong>{" "}
                          <PlusSquare size={15} style={{ display: "inline", verticalAlign: "middle", color: "#e0b878" }} />{" "}
                          seçeneğine basın ve <strong>Ekle</strong> deyin.
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="pwa-step-title">Android Sertifikalı (Uyarısız) Kurulum:</div>
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
                          Menüdeki <strong>&ldquo;Uygulamayı yükle&rdquo;</strong> seçeneğine basın. Google Play WebAPK servisi uygulamayı sertifikalı olarak (hiçbir güvenlik uyarısı vermeden) telefonunuza kuracaktır.
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
              Tamam
            </button>
          </div>
        </div>
      )}
    </>
  );
}
