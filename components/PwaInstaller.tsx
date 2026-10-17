"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Download, X, Share, PlusSquare, Smartphone, CheckCircle2 } from "lucide-react";

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
  const [apkDownloading, setApkDownloading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ua = window.navigator.userAgent || "";
    const uaLower = ua.toLowerCase();

    // Zaten PsikoWay Android APK veya standalone PWA içinde mi çalışıyor kontrol et
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

    const isMobileScreen = window.innerWidth <= 900 || /android|iphone|ipad|ipod/i.test(uaLower);
    const dismissed = sessionStorage.getItem("psikoway_pwa_banner_dismissed") === "1";
    if (isMobileScreen && !checkStandalone && !dismissed) {
      setShowBanner(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsStandalone(true);
      setShowBanner(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const startApkDownload = useCallback(() => {
    setApkDownloading(true);
    const link = document.createElement("a");
    link.href = "/PsikoWay.apk";
    link.download = "PsikoWay.apk";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowGuideModal(true);
  }, []);

  const triggerInstall = useCallback(async () => {
    if (isIOS) {
      setShowGuideModal(true);
      return;
    }
    // Android ve diğer cihazlarda doğrudan PsikoWay.apk indirmesini başlat ve kurulum bilgisini göster
    startApkDownload();
  }, [isIOS, startApkDownload]);

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
              <strong>PsikoWay Mobil Uygulaması</strong>
              <span>{isIOS ? "Ana ekrana ekle & tam ekran kullan" : "Resmi Android APK uygulamasını indir"}</span>
            </div>
          </div>

          <div className="pwa-banner-actions">
            <button
              type="button"
              onClick={triggerInstall}
              className="pwa-banner-install-btn"
            >
              <Download size={15} />
              <span>{isIOS ? "Yükle" : "APK İndir"}</span>
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

      {/* LOGOLU APK İNDİRME & KURULUM MODALI */}
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
                PsikoWay v1.0 Resmi Mobil Uygulama
              </span>
              <h3>PsikoWay Mobil Uygulaması</h3>
              <p>
                {isIOS
                  ? "iPhone / iPad cihazınızda PsikoWay logosuyla ana ekranınıza ekleyin."
                  : "Kısayol değil, doğrudan telefonunuza kurulan gerçek Android uygulaması (PsikoWay.apk)."}
              </p>
            </div>

            {!isIOS && (
              <>
                <a
                  href="/PsikoWay.apk"
                  download="PsikoWay.apk"
                  onClick={() => setApkDownloading(true)}
                  className="pwa-modal-primary-btn"
                  style={{ textDecoration: "none" }}
                >
                  <Download size={18} />
                  <span>PsikoWay.apk Dosyasını İndir</span>
                </a>

                {apkDownloading && (
                  <div className="pwa-install-success-box">
                    <CheckCircle2 size={28} color="#4ade80" />
                    <strong>PsikoWay.apk İndiriliyor!</strong>
                    <span style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.85)" }}>
                      İndirme tamamlandığında bildirim çubuğundan veya İndirilenler klasöründen{" "}
                      <strong>PsikoWay.apk</strong> dosyasına dokunup <strong>&ldquo;Yükle&rdquo;</strong> deyin.
                    </span>
                  </div>
                )}

                {deferredPrompt && (
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await deferredPrompt.prompt();
                      } catch {}
                    }}
                    className="pwa-modal-done-btn"
                    style={{ marginBottom: "10px" }}
                  >
                    Alternatif: Tarayıcı Üzerinden Hızlı Kur (WebAPK)
                  </button>
                )}
              </>
            )}

            <div className="pwa-steps-container">
              {isIOS ? (
                <>
                  <div className="pwa-step-title">iPhone / iPad (Safari) Kurulumu:</div>
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
                      seçeneğine basın.
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="pwa-step-title">Android APK Kurulum Adımları:</div>
                  <div className="pwa-step-item">
                    <span className="pwa-step-num">1</span>
                    <div className="pwa-step-desc">
                      Yukarıdaki <strong>&ldquo;PsikoWay.apk Dosyasını İndir&rdquo;</strong> butonuna basın ve dosyayı indirin.
                    </div>
                  </div>
                  <div className="pwa-step-item">
                    <span className="pwa-step-num">2</span>
                    <div className="pwa-step-desc">
                      İnen <strong>PsikoWay.apk</strong> dosyasına dokunun ve <strong>&ldquo;Yükle&rdquo;</strong> diyerek gerçek uygulamayı telefonunuza kurun.
                    </div>
                  </div>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowGuideModal(false)}
              className="pwa-modal-done-btn"
            >
              Kapat
            </button>
          </div>
        </div>
      )}
    </>
  );
}
