"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  Globe, 
  User, 
  MessageSquareQuote, 
  Mail, 
  Lock, 
  Briefcase, 
  UserPlus, 
  LogIn, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle,
  BookOpen
} from "lucide-react";
import BackgroundVideo from "../../components/BackgroundVideo";
import { useAuth } from "../../context/AuthContext";
import { triggerHoneypotTrap, isDisposableEmail } from "../../lib/anti-spam";

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/forum";
  const { user, isRegisteredUser, signInWithEmail, signUpWithEmail, signInWithGoogle, signInGuest, loading: authLoading } = useAuth();

  // Zaten oturum açmış kullanıcıları doğrudan foruma yönlendir
  React.useEffect(() => {
    if (!authLoading && isRegisteredUser) {
      router.replace(redirectTarget);
    }
  }, [authLoading, isRegisteredUser, redirectTarget, router]);

  // 'login' | 'register'
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  
  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [profession, setProfession] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Durumlar
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const translateFirebaseError = (errMsg: string) => {
    if (errMsg.includes("auth/email-already-in-use")) return "Bu e-posta adresi zaten kullanımda.";
    if (errMsg.includes("auth/invalid-email")) return "Geçerli bir e-posta adresi yazınız.";
    if (errMsg.includes("auth/weak-password")) return "Şifre en az 6 karakter olmalıdır.";
    if (errMsg.includes("auth/invalid-credential") || errMsg.includes("auth/user-not-found") || errMsg.includes("auth/wrong-password")) {
      return "Hatalı e-posta veya şifre girdiniz.";
    }
    return errMsg || "İşlem sırasında bir hata oluştu.";
  };

  // E-posta ile Giriş
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signInWithEmail(email, password);
      router.push(redirectTarget);
    } catch (err: any) {
      setError(translateFirebaseError(err.message || ""));
    } finally {
      setLoading(false);
    }
  };

  // E-posta ile Kayıt Ol
  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    // Honeypot Bal Küpü Tuzağı (Bot Kontrolü)
    if (honeypot) {
      try {
        await triggerHoneypotTrap({ actionType: "register", honeypotValue: honeypot });
      } catch {}
      setError("Güvenlik doğrulaması başarısız oldu.");
      return;
    }
    // Geçici E-posta Kontrolü
    if (isDisposableEmail(email)) {
      setError("Geçici ve tek kullanımlık e-posta adresleri (temp-mail) ile kayıt olunamaz. Lütfen kalıcı bir e-posta adresi kullanın.");
      return;
    }
    if (!displayName.trim()) {
      setError("Lütfen adınızı ve soyadınızı belirtin.");
      return;
    }
    if (password.length < 6) {
      setError("Şifreniz en az 6 karakter olmalıdır.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await signUpWithEmail(email, password, displayName, profession);
      router.push("/forum"); // Kayıt olan kullanıcıyı doğrudan foruma yönlendir
    } catch (err: any) {
      setError(translateFirebaseError(err.message || ""));
    } finally {
      setLoading(false);
    }
  };

  // Google Girişi
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      await signInWithGoogle();
      router.push(redirectTarget);
    } catch (err: any) {
      setError("Google ile giriş yapılamadı: " + (err.message || ""));
    } finally {
      setLoading(false);
    }
  };

  // Misafir Girişi (Sadece Okuma)
  const handleGuestSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      await signInGuest();
      router.push(redirectTarget);
    } catch (err: any) {
      setError("Misafir girişi başarısız: " + (err.message || ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card animate-scale auth-card-wide">
      {/* Topluluk Rozeti */}
      <div className="auth-community-badge">
        <MessageSquareQuote size={14} />
        <span>PsikoWay Zihin Topluluğu & Forum</span>
      </div>

      <h2>PsikoWay&apos;e Hoş Geldin</h2>
      <p>
        Kendi düşünce profilini oluştur, zihnini keşfet ve toplulukta fikirlerini özgürce paylaş.
      </p>

      {/* Giriş / Kayıt Ol Sekme Değiştirici */}
      <div className="auth-tab-switch">
        <button
          type="button"
          onClick={() => {
            setAuthMode("login");
            setError("");
          }}
          className={`auth-switch-btn ${authMode === "login" ? "active" : ""}`}
        >
          <LogIn size={15} />
          <span>Giriş Yap</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setAuthMode("register");
            setError("");
          }}
          className={`auth-switch-btn ${authMode === "register" ? "active" : ""}`}
        >
          <UserPlus size={15} />
          <span>Kayıt Ol</span>
        </button>
      </div>

      {error && (
        <div className="error-message animate-fade-down" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* 1. GİRİŞ FORMU */}
      {authMode === "login" && (
        <form onSubmit={handleEmailLogin} className="auth-form-body">
          <div className="form-group">
            <label htmlFor="login-email">E-posta Adresi</label>
            <div className="input-with-icon">
              <Mail size={16} className="input-field-icon" />
              <input
                id="login-email"
                type="email"
                required
                placeholder="ornek@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control with-icon"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Şifre</label>
            <div className="input-with-icon">
              <Lock size={16} className="input-field-icon" />
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="Şifreniz..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control with-icon with-eye"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="auth-eye-btn"
                aria-label="Şifreyi Göster"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary-solid w-100 btn-auth-action"
          >
            <span>{loading ? "Giriş yapılıyor..." : "E-posta ile Giriş Yap"}</span>
          </button>
        </form>
      )}

      {/* 2. KAYIT OL FORMU */}
      {authMode === "register" && (
        <form onSubmit={handleEmailRegister} className="auth-form-body">
          {/* Honeypot Bal Küpü Koruması (Botlar için gizli sahte alan) */}
          <div style={{ display: "none" }} tabIndex={-1} aria-hidden="true">
            <label htmlFor="reg-website-url">Website</label>
            <input
              id="reg-website-url"
              type="text"
              name="website_url"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-name">Ad Soyad / Takma Ad *</label>
            <div className="input-with-icon">
              <User size={16} className="input-field-icon" />
              <input
                id="reg-name"
                type="text"
                required
                placeholder="Örn: Dr. Selin Yılmaz veya Deniz"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="form-control with-icon"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reg-email">E-posta Adresi *</label>
            <div className="input-with-icon">
              <Mail size={16} className="input-field-icon" />
              <input
                id="reg-email"
                type="email"
                required
                placeholder="ornek@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control with-icon"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reg-profession">Meslek / Uzmanlık Alanı (İsteğe bağlı)</label>
            <div className="input-with-icon">
              <Briefcase size={16} className="input-field-icon" />
              <input
                id="reg-profession"
                type="text"
                placeholder="Örn: Klinik Psikolog, Felsefe Öğrencisi, Yazar..."
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                className="form-control with-icon"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reg-pass">Şifre * (En az 6 karakter)</label>
            <div className="input-with-icon">
              <Lock size={16} className="input-field-icon" />
              <input
                id="reg-pass"
                type={showPassword ? "text" : "password"}
                required
                placeholder="Güvenli bir şifre seçin..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control with-icon with-eye"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="auth-eye-btn"
                aria-label="Şifreyi Göster"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary-solid w-100 btn-auth-action"
          >
            <span>{loading ? "Hesap oluşturuluyor..." : "Hesap Oluştur ve Katıl"}</span>
          </button>
        </form>
      )}

      {/* Ayırıcı */}
      <div className="auth-or-divider">
        <span>veya hızlı devam et</span>
      </div>

      {/* Alternatif Butonlar: Google & Misafir */}
      <div className="auth-buttons" style={{ marginBottom: 0 }}>
        <button 
          onClick={handleGoogleSignIn} 
          disabled={loading}
          className="btn-social google-btn"
        >
          <Globe size={18} />
          <span>Google ile Devam Et</span>
        </button>
        
        <button 
          onClick={handleGuestSignIn} 
          disabled={loading}
          className="btn-social guest-btn"
          title="Misafir girişi yapanlar forumu sadece okuyabilir"
        >
          <BookOpen size={17} />
          <span>Misafir Olarak Keşfet <strong style={{ opacity: 0.8 }}>(Yalnızca Okuma Modu)</strong></span>
        </button>
      </div>

      {/* Bilgilendirme Notu */}
      <div className="auth-bottom-note">
        <span style={{ color: "#e0b878", fontWeight: "600" }}>⚠️ Topluluk Kuralı:</span> Misafir (anonim) kullanıcılar forumdaki tüm fikir ve yorumları serbestçe okuyabilir. Kendi fikirlerinizi paylaşmak, yorum yazmak ve etkileşim kurmak için e-posta veya Google ile profil oluşturmanız gerekmektedir.
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <>
      {/* Kehribar Geçişli Video Arka Plan */}
      <BackgroundVideo />

      <div className="auth-container">
        <Link href="/" className="nav-logo" style={{ position: 'absolute', top: 30, left: 50 }}>
          <Image
            src="/logo.png"
            alt="PsikoWay Logo"
            width={52}
            height={52}
            priority
            className="nav-logo-img"
          />
        </Link>

        <Suspense fallback={<div className="auth-card"><p>Yükleniyor...</p></div>}>
          <AuthForm />
        </Suspense>
      </div>
    </>
  );
}