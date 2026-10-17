"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  X, 
  ArrowRight, 
  User as UserIcon, 
  LogOut, 
  MessageSquareQuote,
  Home,
  Briefcase,
  Film,
  Sparkles,
  Mail,
  ChevronRight
} from "lucide-react";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { user, userProfile, logout, getUserDisplayName } = useAuth();

  const navItems = [
    { label: "Ana Sayfa", href: "/", icon: Home },
    { label: "Topluluk & Forum", href: "/forum", icon: MessageSquareQuote },
    { label: "Hizmetler", href: "/hizmetler", icon: Briefcase },
    { label: "Analizler", href: "/analizler", icon: Film },
    { label: "Testler", href: "/testler", icon: Sparkles },
    { label: "İletişim", href: "/iletisim", icon: Mail },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      setUserDropdownOpen(false);
      setSidebarOpen(false);
      router.push("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Sayfa değiştiğinde çekmeceyi kapat ve kaydırma kilidini kaldır
  useEffect(() => {
    setSidebarOpen(false);
    setUserDropdownOpen(false);
    document.body.style.overflow = "";
  }, [pathname]);

  // ESC tuşuna basıldığında menüyü kapat ve arka plan kaydırmasını yönet
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSidebarOpen(false);
        setUserDropdownOpen(false);
      }
    };
    if (sidebarOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  // Kullanıcı açılır menüsü dışına tıklandığında kapat (özellikle mobil dokunmatik ekranlar için)
  useEffect(() => {
    if (!userDropdownOpen) return;
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && !target.closest(".user-nav-profile-container")) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside, { passive: true });
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [userDropdownOpen]);

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled((prev) => (prev === isScrolled ? prev : isScrolled));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header 
        className={`glass-header fixed top-0 left-0 right-0 w-full z-[9990] ${scrolled ? "scrolled" : ""}`}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          width: "100%",
          zIndex: 9990,
          background: "transparent",
          border: "none",
          borderBottom: "none",
          boxShadow: "none",
          backdropFilter: "none",
          WebkitBackdropFilter: "none",
          pointerEvents: "auto",
        }}
      >
        {/* SOL ALAN: Üç Çizgi Hamburger Menü Butonu + Logo */}
        <div className="header-left" style={{ pointerEvents: "auto", position: "relative", zIndex: 9995 }}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen((prev) => !prev);
            }}
            className="side-menu-trigger-btn"
            aria-label="Gezinme Menüsünü Aç"
            aria-expanded={sidebarOpen}
            title="Menü"
            style={{
              pointerEvents: "auto",
              touchAction: "manipulation",
              WebkitTapHighlightColor: "transparent",
              position: "relative",
              zIndex: 9996,
            }}
          >
            <div className="hamburger-bars" style={{ pointerEvents: "none" }}>
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </div>
            <span className="side-menu-trigger-text" style={{ pointerEvents: "none" }}>Menü</span>
          </button>

          <Link href="/" className="nav-logo" aria-label="PsikoWay">
            <Image
              src="/logo.png"
              alt="PsikoWay Logo"
              width={50}
              height={50}
              priority
              className="nav-logo-img"
            />
            <span className="nav-brand-title">PsikoWay</span>
          </Link>
        </div>

        {/* SAĞ ALAN: Kullanıcı Profili veya Giriş Yap Butonu */}
        <div className="header-right text-white" style={{ pointerEvents: "auto", position: "relative", zIndex: 9995 }}>
          {user ? (
            <div className="user-nav-profile-container" style={{ position: "relative" }}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="user-nav-badge-btn"
                title="Profil Menüsü"
              >
                {userProfile?.photoURL || user.photoURL ? (
                  <img
                    src={userProfile?.photoURL || user.photoURL || ""}
                    alt={userProfile?.displayName || getUserDisplayName()}
                    className="user-avatar-tiny"
                  />
                ) : (
                  <div className="user-avatar-placeholder">
                    <UserIcon size={15} />
                  </div>
                )}
                <span className="user-nav-name">{userProfile?.displayName || getUserDisplayName()}</span>
              </button>

              {userDropdownOpen && (
                <div className="user-nav-dropdown animate-scale">
                  <div className="user-nav-dropdown-header">
                    <div className="dropdown-user-title">{userProfile?.displayName || getUserDisplayName()}</div>
                    <div className="dropdown-user-subtitle">
                      {user.isAnonymous
                        ? "Misafir (Yalnızca Okuma)"
                        : userProfile?.profession || user.email || "Kayıtlı Üye"}
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  
                  <Link
                    href="/profil"
                    onClick={() => setUserDropdownOpen(false)}
                    className="dropdown-item"
                  >
                    <UserIcon size={16} />
                    <span>Profilim & Ayarlar</span>
                  </Link>

                  <Link
                    href="/forum"
                    onClick={() => setUserDropdownOpen(false)}
                    className="dropdown-item"
                  >
                    <MessageSquareQuote size={16} />
                    <span>Topluluk & Forum</span>
                  </Link>

                  {user.isAnonymous && (
                    <Link
                      href="/auth"
                      onClick={() => setUserDropdownOpen(false)}
                      className="dropdown-item"
                      style={{ color: "#e0b878" }}
                    >
                      <ArrowRight size={16} />
                      <span>Kalıcı Hesap Oluştur</span>
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="dropdown-item dropdown-logout-btn"
                  >
                    <LogOut size={16} />
                    <span>Çıkış Yap</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth" className="btn-white-outline">
              Giriş Yap
            </Link>
          )}
        </div>
      </header>

      {/* KARARTMA ARKA PLANI (BACKDROP) */}
      <div 
        className={`side-drawer-backdrop ${sidebarOpen ? "open" : ""}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99998,
          opacity: sidebarOpen ? 1 : 0,
          pointerEvents: sidebarOpen ? "auto" : "none",
          visibility: sidebarOpen ? "visible" : "hidden",
        }}
      />

      {/* SOL SLIDE DRAWER (HAFİFÇE SAĞA KAYARAK AÇILAN PANEL) */}
      <aside 
        className={`side-drawer-panel ${sidebarOpen ? "open" : ""}`}
        aria-label="Ana Gezinme Menüsü"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 99999,
          transform: sidebarOpen ? "translate3d(0, 0, 0)" : "translate3d(-105%, 0, 0)",
          WebkitTransform: sidebarOpen ? "translate3d(0, 0, 0)" : "translate3d(-105%, 0, 0)",
          visibility: sidebarOpen ? "visible" : "hidden",
          pointerEvents: sidebarOpen ? "auto" : "none",
        }}
      >
        <div className="side-drawer-header">
          <button 
            type="button"
            onClick={() => {
              setSidebarOpen(false);
              router.push("/");
            }} 
            className="side-drawer-logo"
            style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: 0 }}
          >
            <Image
              src="/logo.png"
              alt="PsikoWay Logo"
              width={42}
              height={42}
              className="nav-logo-img"
            />
            <div className="side-drawer-brand">
              <span className="side-drawer-brand-name">PsikoWay</span>
              <span className="side-drawer-brand-sub">Zihin & Psikoloji</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="side-drawer-close-btn"
            aria-label="Menüyü Kapat"
            title="Kapat"
          >
            <X size={20} />
          </button>
        </div>

        <div className="side-drawer-body">
          <div className="side-drawer-section-label">GEZİNME & SAYFALAR</div>
          <nav className="side-drawer-nav">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const IconComp = item.icon;
              return (
                <button
                  type="button"
                  key={item.href}
                  onClick={() => {
                    setSidebarOpen(false);
                    router.push(item.href);
                  }}
                  className={`side-drawer-nav-item ${isActive ? "active" : ""}`}
                  style={{ width: "100%", textAlign: "left", cursor: "pointer", fontFamily: "inherit" }}
                >
                  <div className="side-nav-item-left">
                    <span className="side-nav-icon-box">
                      <IconComp size={18} />
                    </span>
                    <span className="side-nav-label">{item.label}</span>
                  </div>
                  {isActive ? (
                    <span className="side-nav-active-dot" />
                  ) : (
                    <ChevronRight size={15} className="side-nav-chevron" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="side-drawer-footer">
          {user ? (
            <div className="side-drawer-user-box">
              <button 
                type="button"
                onClick={() => {
                  setSidebarOpen(false);
                  router.push("/profil");
                }} 
                className="side-drawer-user-info"
                style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: 0, width: "100%" }}
              >
                {userProfile?.photoURL || user.photoURL ? (
                  <img
                    src={userProfile?.photoURL || user.photoURL || ""}
                    alt={userProfile?.displayName || getUserDisplayName()}
                    className="side-user-avatar"
                  />
                ) : (
                  <div className="side-user-avatar-placeholder">
                    <UserIcon size={17} />
                  </div>
                )}
                <div className="side-user-text">
                  <strong>{userProfile?.displayName || getUserDisplayName()}</strong>
                  <span>{user.isAnonymous ? "Misafir Üye" : (userProfile?.profession || "Profilim")}</span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSidebarOpen(false);
                  handleLogout();
                }}
                className="side-drawer-logout-btn"
                title="Çıkış Yap"
              >
                <LogOut size={15} />
                <span>Çıkış</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setSidebarOpen(false);
                router.push("/auth");
              }}
              className="side-drawer-login-btn"
              style={{ width: "100%", cursor: "pointer", border: "none", fontFamily: "inherit", fontSize: "14px" }}
            >
              <span>Giriş Yap veya Katıl</span>
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
