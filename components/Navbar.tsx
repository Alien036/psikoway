"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, User as UserIcon, LogOut, MessageSquareQuote } from "lucide-react";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { user, userProfile, logout, getUserDisplayName } = useAuth();

  const navItems = [
    { label: "Ana Sayfa", href: "/" },
    { label: "Topluluk & Forum", href: "/forum" },
    { label: "Hizmetler", href: "/hizmetler" },
    { label: "Analizler", href: "/analizler" },
    { label: "Testler", href: "/testler" },
    { label: "İletişim", href: "/iletisim" },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      setUserDropdownOpen(false);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <header className="glass-header">
      <Link href="/" className="nav-logo" aria-label="PsikoWay">
        <Image
          src="/logo.png"
          alt="PsikoWay Logo"
          width={54}
          height={54}
          priority
          className="nav-logo-img"
        />
      </Link>

      <nav className="nav-links text-white desktop-nav">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link-item ${isActive ? "active-nav-link" : ""}`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="header-right text-white">
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

        <button
          type="button"
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menü"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-nav-drawer animate-scale">
          {user && (
            <Link
              href={user.isAnonymous ? "/auth" : "/profil"}
              onClick={() => setMobileMenuOpen(false)}
              className="mobile-user-card"
              style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}
            >
              <div className="mobile-user-avatar">
                {userProfile?.photoURL || user.photoURL ? (
                  <img
                    src={userProfile?.photoURL || user.photoURL || ""}
                    alt={userProfile?.displayName || getUserDisplayName()}
                  />
                ) : (
                  <UserIcon size={20} />
                )}
              </div>
              <div className="mobile-user-info">
                <strong>{userProfile?.displayName || getUserDisplayName()}</strong>
                <span>
                  {user.isAnonymous
                    ? "Misafir Üye • Giriş Yap →"
                    : userProfile?.profession || "Profilim & Ayarlar →"}
                </span>
              </div>
            </Link>
          )}

          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`mobile-nav-link ${isActive ? "active-nav-link" : ""}`}
              >
                {item.label}
              </Link>
            );
          })}

          {user ? (
            <button
              type="button"
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="btn-danger-outline w-100 text-center"
              style={{
                marginTop: "12px",
                display: "inline-flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <LogOut size={16} />
              <span>Çıkış Yap</span>
            </button>
          ) : (
            <Link
              href="/auth"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-primary-solid w-100 text-center"
              style={{
                marginTop: "10px",
                display: "inline-flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>Giriş Yap</span>
              <ArrowRight size={16} />
            </Link>
          )}
        </div>
      )}
    </header>
  );
}

