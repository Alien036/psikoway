"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import BackgroundVideo from "../../components/BackgroundVideo";
import { useAuth } from "../../context/AuthContext";
import { 
  PRESET_AVATARS, 
  MALE_EMOJI_AVATARS,
  FEMALE_EMOJI_AVATARS,
  getUserCommunityStats, 
  getUserProfile, 
  getUserPosts,
  getUserComments,
  UserProfileComment,
  getInstagramUrl,
  getInstagramHandle,
  getYouTubeUrl,
  getYouTubeHandle,
  toUsernameSlug,
  getProfileUrl
} from "../../lib/profile-data";
import { deleteForumPost, deleteForumComment, subscribeToForumPosts } from "../../lib/forum-data";
import { uploadCompressedImage, formatFileSize } from "../../lib/image-upload";
import { moderateTextWithAI } from "../../lib/ai-moderation";
import { UserProfile, UserStats } from "../../types/user";
import { ForumPost } from "../../types/forum";
import { InstagramIcon, YouTubeIcon } from "../../components/SocialIcons";
import { 
  User, 
  Mail, 
  Briefcase, 
  Camera, 
  CheckCircle2, 
  ArrowRight, 
  MessageSquareQuote, 
  Heart, 
  MessageCircle, 
  LogIn, 
  Save, 
  Upload, 
  LogOut,
  AlertTriangle,
  ExternalLink,
  Share2,
  Copy,
  Eye,
  FileEdit,
  ArrowLeft,
  Sparkles,
  Compass,
  Trash2
} from "lucide-react";

function ProfileContentInner({ forcedId }: { forcedId?: string }) {
  const searchParams = useSearchParams();
  const queryId =
    forcedId ||
    searchParams.get("kullanici") ||
    searchParams.get("username") ||
    searchParams.get("id") ||
    searchParams.get("uid") ||
    null;
  const isPreviewMode =
    searchParams.get("onizleme") === "1" || searchParams.get("preview") === "1";

  const { 
    user, 
    userProfile, 
    updateProfileData, 
    logout, 
    isRegisteredUser, 
    isAnonymousUser 
  } = useAuth();

  const myUsernameSlug = toUsernameSlug(
    userProfile?.username || userProfile?.displayName || user?.displayName || ""
  );
  const querySlug = queryId ? toUsernameSlug(queryId) : "";
  const isSelfIdentifier = Boolean(
    user &&
      queryId &&
      (queryId === user.uid ||
        (myUsernameSlug && myUsernameSlug !== "dusunur" && querySlug === myUsernameSlug))
  );

  // Ziyaret Edilen Başka Bir Kullanıcı mı? (veya Herkese Açık Önizleme Modu mu?)
  const isViewingOther = Boolean(queryId && (!isSelfIdentifier || isPreviewMode));

  // Kendi Profil Form Alanları
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [profession, setProfession] = useState("");
  const [bio, setBio] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [email, setEmail] = useState("");
  const [instagram, setInstagram] = useState("");
  const [youtube, setYoutube] = useState("");

  // Kendi Profil Sekmesi: "edit" (Bilgileri Düzenle) | "posts" (Fikirlerim) | "comments" (Yorumlarım) | "preview" (Önizleme)
  const [activeTab, setActiveTab] = useState<"edit" | "posts" | "comments" | "preview">("edit");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Kendi İstatistik, Gönderi ve Yorumları
  const [myStats, setMyStats] = useState<UserStats>({ postsCount: 0, commentsCount: 0, likesReceived: 0 });
  const [myPosts, setMyPosts] = useState<ForumPost[]>([]);
  const [myComments, setMyComments] = useState<UserProfileComment[]>([]);

  // Başka Kullanıcıyı Ziyaret Durumları
  const [targetUser, setTargetUser] = useState<UserProfile | null>(null);
  const [targetStats, setTargetStats] = useState<UserStats>({ postsCount: 0, commentsCount: 0, likesReceived: 0 });
  const [targetPosts, setTargetPosts] = useState<ForumPost[]>([]);
  const [loadingTarget, setLoadingTarget] = useState(false);
  const [targetNotFound, setTargetNotFound] = useState(false);

  // Toast Bildirim
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  };

  // Kendi Profil Bilgilerini State'e Doldur
  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || "");
      setUsername(
        userProfile.username || toUsernameSlug(userProfile.displayName || "")
      );
      setProfession(userProfile.profession || "");
      setBio(userProfile.bio || "");
      setPhotoURL(userProfile.photoURL || "");
      setEmail(userProfile.email || user?.email || "");
      setInstagram(userProfile.instagram || "");
      setYoutube(userProfile.youtube || "");
    } else if (user) {
      const fallbackName = user.displayName || (user.isAnonymous ? "Misafir Düşünür" : "");
      setDisplayName(fallbackName);
      setUsername(toUsernameSlug(fallbackName));
      setEmail(user.email || "");
    }

    if (user) {
      const currentName = userProfile?.displayName || user.displayName || "";
      const statsData = getUserCommunityStats(user.uid, currentName);
      setMyStats(statsData);
      setMyPosts(getUserPosts(user.uid, true, currentName));
      setMyComments(getUserComments(user.uid));
    }
  }, [user, userProfile]);

  // Kendi profil sayfasındayken adres çubuğunu /profil/kullanici-adi olarak tut
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      !isViewingOther &&
      user &&
      !user.isAnonymous
    ) {
      const cleanSlug = toUsernameSlug(
        userProfile?.username || userProfile?.displayName || user.displayName || ""
      );
      if (cleanSlug && cleanSlug !== "dusunur") {
        const expectedPath = `/profil/${encodeURIComponent(cleanSlug)}`;
        if (window.location.pathname !== expectedPath || window.location.search) {
          window.history.replaceState(null, "", expectedPath);
        }
      }
    }
  }, [isViewingOther, user, userProfile]);

  // Canlı Dinleme: Forumdaki veri değişiklikleri anında profile yansısın
  useEffect(() => {
    if (user) {
      const currentName = userProfile?.displayName || user.displayName || "";
      const unsub = subscribeToForumPosts(() => {
        setMyStats(getUserCommunityStats(user.uid, currentName));
        setMyPosts(getUserPosts(user.uid, true, currentName));
        setMyComments(getUserComments(user.uid));
      }, user.uid);
      return () => unsub();
    }
  }, [user, userProfile]);

  // Kendi Fikrini Silme
  const handleDeleteMyPost = async (postId: string, title: string) => {
    if (!user) return;
    if (window.confirm(`"${title}" başlıklı fikrinizi kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`)) {
      try {
        await deleteForumPost(postId, user.uid);
        setMyPosts((prev) => prev.filter((p) => p.id !== postId));
        setMyComments(getUserComments(user.uid));
        setMyStats(getUserCommunityStats(user.uid, displayName));
        showToast("Fikriniz başarıyla silindi.");
      } catch (err: any) {
        showToast("Silme hatası: " + (err?.message || ""));
      }
    }
  };

  // Kendi Yorumunu Silme
  const handleDeleteMyComment = async (postId: string, commentId: string) => {
    if (!user) return;
    if (window.confirm("Bu yorumunuzu kalıcı olarak silmek istediğinizden emin misiniz?")) {
      try {
        await deleteForumComment(postId, commentId, user.uid);
        setMyComments((prev) => prev.filter((c) => c.commentId !== commentId));
        setMyPosts(getUserPosts(user.uid, true, displayName));
        setMyStats(getUserCommunityStats(user.uid, displayName));
        showToast("Yorumunuz başarıyla silindi.");
      } catch (err: any) {
        showToast("Silme hatası: " + (err?.message || ""));
      }
    }
  };

  // Başka Bir Kullanıcının Profilini Çek (Kullanıcı Adı veya ID ile)
  useEffect(() => {
    if (isViewingOther && queryId) {
      setLoadingTarget(true);
      setTargetNotFound(false);
      getUserProfile(queryId)
        .then((prof) => {
          if (prof) {
            setTargetUser(prof);
            setTargetStats(getUserCommunityStats(prof.uid, prof.displayName));
            setTargetPosts(getUserPosts(prof.uid, false, prof.displayName));

            // Adres çubuğunda ID (?id=...) varsa otomatik olarak kullanıcı adına (/profil/kullanici-adi) çevir
            if (typeof window !== "undefined") {
              const cleanPath = getProfileUrl({
                username: prof.username,
                displayName: prof.displayName,
                uid: prof.uid,
              });
              const targetUrl = isPreviewMode ? `${cleanPath}?onizleme=1` : cleanPath;
              if (window.location.pathname + window.location.search !== targetUrl) {
                window.history.replaceState(null, "", targetUrl);
              }
            }
          } else {
            setTargetNotFound(true);
          }
        })
        .catch(() => {
          setTargetNotFound(true);
        })
        .finally(() => {
          setLoadingTarget(false);
        });
    }
  }, [isViewingOther, queryId, isPreviewMode]);

  // Fotoğraf Dosyası Yükleme (Otomatik Sıkıştırma + Cloudinary Bulut Yükleme)
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoCompressInfo, setPhotoCompressInfo] = useState<string | null>(null);

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    setPhotoCompressInfo(null);
    showToast("🤖 Yapay zeka fotoğrafı inceliyor ve yüklüyor...");

    try {
      const result = await uploadCompressedImage(file, "avatar");
      setPhotoURL(result.url);

      const infoText = `🛡️ Yapay Zeka Onaylı • ${formatFileSize(result.originalSize)} → ${formatFileSize(result.compressedSize)} (%${result.savedPercent} sıkıştırıldı)`;
      setPhotoCompressInfo(infoText);

      // Kullanıcı kayıtlıysa profil fotoğrafını anında kaydet
      if (user && (displayName.trim() || userProfile?.displayName)) {
        try {
          const finalName = displayName.trim() || userProfile?.displayName || "Düşünür";
          await updateProfileData({
            displayName: finalName,
            username: toUsernameSlug(username.trim() || finalName),
            profession: profession.trim() || userProfile?.profession || "Düşünce Kaşifi",
            bio: bio.trim(),
            photoURL: result.url,
            email: email.trim(),
            instagram: instagram.trim(),
            youtube: youtube.trim(),
          });
          showToast(`Profil fotoğrafı yapay zeka onayından geçti ve kaydedildi!`);
        } catch {
          showToast("Fotoğraf yüklendi! Kaydetmek için 'Değişiklikleri Kaydet'e basın.");
        }
      } else {
        showToast("Fotoğraf yüklendi! Kaydetmek için 'Değişiklikleri Kaydet'e basın.");
      }
    } catch (err: any) {
      const errMsg = err?.message || "Fotoğraf yüklenirken bir hata oluştu.";
      showToast(errMsg);
      alert(errMsg);
    } finally {
      setUploadingPhoto(false);
      e.target.value = "";
    }
  };

  // Profil Formunu Kaydet
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      alert("Lütfen adınızı giriniz.");
      return;
    }
    setSaving(true);
    try {
      const cleanUserSlug = toUsernameSlug(username.trim() || displayName.trim());
      const textModeration = await moderateTextWithAI(
        `${displayName} ${cleanUserSlug} ${profession} ${bio}`,
        "profile"
      );
      if (!textModeration.isAllowed) {
        const msg =
          textModeration.reason ||
          "🛡️ Yapay Zeka Sansür Filtresi: Profil bilgilerinizde uygunsuz veya küfürlü ifadeler tespit edildi.";
        showToast(msg);
        alert(msg);
        setSaving(false);
        return;
      }

      setUsername(cleanUserSlug);
      await updateProfileData({
        displayName: displayName.trim(),
        username: cleanUserSlug,
        profession: profession.trim() || "Düşünce Kaşifi",
        bio: bio.trim(),
        photoURL: photoURL.trim() || "",
        email: email.trim(),
        instagram: instagram.trim(),
        youtube: youtube.trim(),
      });
      if (typeof window !== "undefined") {
        window.history.replaceState(null, "", `/profil/${encodeURIComponent(cleanUserSlug)}`);
      }
      showToast("Profiliniz ve kullanıcı adınız başarıyla kaydedildi!");
    } catch (err: any) {
      console.error(err);
      alert("Profil güncellenirken hata oluştu: " + (err.message || ""));
    } finally {
      setSaving(false);
    }
  };

  // Profil Linkini Kullanıcı Adıyla Kopyala
  const handleCopyProfileLink = (profileParams: {
    username?: string;
    displayName?: string;
    uid?: string;
  }) => {
    if (typeof window !== "undefined") {
      const path = getProfileUrl(profileParams);
      const url = `${window.location.origin}${path}`;
      navigator.clipboard.writeText(url).then(() => {
        showToast(`Profil bağlantısı kopyalandı: ${path}`);
      }).catch(() => {
        showToast("Bağlantı kopyalanamadı.");
      });
    }
  };

  return (
    <div className="page-wrapper profile-page-wrapper">
      <BackgroundVideo />
      <Navbar />

      {/* Toast Bildirim */}
      {toast && (
        <div className="forum-toast animate-fade-down">
          <CheckCircle2 size={16} />
          <span>{toast}</span>
        </div>
      )}

      <main className="content-glass-section profile-main-section">
        <div className="content-container profile-container">
          
          {/* =========================================================================
              DURUM A: BAŞKA BİR KULLANICININ PROFİLİNE BAKILIYOR (ZİYARETÇİ GÖRÜNÜMÜ)
              ========================================================================= */}
          {isViewingOther ? (
            loadingTarget ? (
              <div className="profile-auth-prompt-card animate-scale" style={{ textAlign: "center", padding: "60px 20px" }}>
                <div className="prompt-icon-box" style={{ margin: "0 auto 16px auto" }}>
                  <Sparkles size={32} color="#e0b878" />
                </div>
                <h2>Düşünür Profili Yükleniyor...</h2>
                <p>Topluluk üyesinin bilgileri ve paylaşımları getiriliyor.</p>
              </div>
            ) : targetNotFound || !targetUser ? (
              <div className="profile-auth-prompt-card animate-scale">
                <div className="prompt-icon-box" style={{ background: "rgba(239, 68, 68, 0.15)", color: "#f87171" }}>
                  <AlertTriangle size={32} />
                </div>
                <h2>Düşünür Profili Bulunamadı</h2>
                <p>
                  Aradığınız profil mevcut değil veya paylaşımlarını tamamen anonim olarak gerçekleştirmiş olabilir.
                </p>
                <div style={{ marginTop: "20px" }}>
                  <Link href="/forum" className="btn-primary-solid">
                    <ArrowLeft size={16} />
                    <span>Foruma Geri Dön</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="profile-hub-grid animate-fade-up">
                
                {/* SOL TARAF: ZİYARET EDİLEN KULLANICININ BİLGİ KARTI */}
                <div className="profile-overview-card">
                  <div className="profile-avatar-container">
                    {targetUser.photoURL ? (
                      <img src={targetUser.photoURL} alt={targetUser.displayName} className="profile-main-avatar" />
                    ) : (
                      <div className="profile-avatar-fallback">
                        {targetUser.displayName ? targetUser.displayName.charAt(0).toUpperCase() : "D"}
                      </div>
                    )}
                  </div>

                  <h1 className="profile-user-name">{targetUser.displayName || "Düşünür"}</h1>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#e0b878",
                      fontWeight: 500,
                      marginBottom: "6px",
                      opacity: 0.9,
                    }}
                  >
                    @{toUsernameSlug(targetUser.username || targetUser.displayName)}
                  </div>
                  <div className="profile-profession-tag">
                    <Briefcase size={13} />
                    <span>{targetUser.profession || "Düşünce Kaşifi"}</span>
                  </div>

                  {/* Sosyal Medya Rozetleri (Instagram & YouTube) */}
                  <div className="profile-social-pills">
                    {targetUser.instagram && (
                      <a
                        href={getInstagramUrl(targetUser.instagram)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-pill-btn social-pill-instagram"
                        title={`${targetUser.displayName} Instagram Profilini Aç`}
                      >
                        <div className="social-pill-left">
                          <InstagramIcon size={16} />
                          <span className="social-handle">{getInstagramHandle(targetUser.instagram)}</span>
                        </div>
                        <ExternalLink size={13} className="social-pill-arrow" />
                      </a>
                    )}

                    {targetUser.youtube && (
                      <a
                        href={getYouTubeUrl(targetUser.youtube)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-pill-btn social-pill-youtube"
                        title={`${targetUser.displayName} YouTube Kanalını Aç`}
                      >
                        <div className="social-pill-left">
                          <YouTubeIcon size={16} />
                          <span className="social-handle">{getYouTubeHandle(targetUser.youtube)}</span>
                        </div>
                        <ExternalLink size={13} className="social-pill-arrow" />
                      </a>
                    )}
                  </div>

                  {/* Biyografi */}
                  <div className="profile-bio-box">
                    <h4>Hakkında</h4>
                    <p>
                      {targetUser.bio || "Bu düşünür henüz bir biyografi eklememiş."}
                    </p>
                  </div>

                  {/* İstatistikler */}
                  <div className="profile-stats-row">
                    <div className="profile-stat-item">
                      <span className="stat-val">{targetStats.postsCount}</span>
                      <span className="stat-lbl">Fikir</span>
                    </div>
                    <div className="profile-stat-item">
                      <span className="stat-val">{targetStats.commentsCount}</span>
                      <span className="stat-lbl">Yorum</span>
                    </div>
                    <div className="profile-stat-item">
                      <span className="stat-val">{targetStats.likesReceived}</span>
                      <span className="stat-lbl">Beğeni</span>
                    </div>
                  </div>

                  {/* Aksiyonlar */}
                  <div className="profile-quick-actions">
                    {user && targetUser.uid === user.uid && (
                      <Link
                        href={getProfileUrl({
                          username: targetUser.username,
                          displayName: targetUser.displayName,
                          uid: targetUser.uid,
                        })}
                        className="btn-primary-solid w-100 text-center"
                        style={{ display: "inline-flex", justifyContent: "center", alignItems: "center", gap: "8px" }}
                      >
                        <FileEdit size={15} />
                        <span>Profilimi Düzenlemeye Dön</span>
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        handleCopyProfileLink({
                          username: targetUser.username,
                          displayName: targetUser.displayName,
                          uid: targetUser.uid,
                        })
                      }
                      className="btn-white-outline w-100"
                      style={{ display: "inline-flex", justifyContent: "center", alignItems: "center", gap: "8px" }}
                    >
                      <Copy size={15} />
                      <span>Profili Paylaş</span>
                    </button>
                    <Link
                      href="/forum"
                      className="btn-primary-solid w-100 text-center"
                      style={{ display: "inline-flex", justifyContent: "center", alignItems: "center", gap: "8px" }}
                    >
                      <MessageSquareQuote size={16} />
                      <span>Topluluk & Forum</span>
                    </Link>
                  </div>
                </div>

                {/* SAĞ TARAF: ZİYARET EDİLEN KULLANICININ PAYLAŞIMLARI VE SOSYAL MEDYA KARTLARI */}
                <div className="profile-details-column">
                  
                  {/* Sosyal Medya Varsa Öne Çıkan Kartlar */}
                  {(targetUser.instagram || targetUser.youtube) && (
                    <div className="public-social-grid">
                      {targetUser.instagram && (
                        <a
                          href={getInstagramUrl(targetUser.instagram)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="public-social-banner instagram"
                        >
                          <div className="public-social-icon-box">
                            <InstagramIcon size={24} />
                          </div>
                          <div className="public-social-info">
                            <span className="public-social-label">Instagram Hesabı</span>
                            <span className="public-social-handle">{getInstagramHandle(targetUser.instagram)}</span>
                            <span className="public-social-action">
                              <span>Profiline Git</span>
                              <ExternalLink size={12} />
                            </span>
                          </div>
                        </a>
                      )}

                      {targetUser.youtube && (
                        <a
                          href={getYouTubeUrl(targetUser.youtube)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="public-social-banner youtube"
                        >
                          <div className="public-social-icon-box">
                            <YouTubeIcon size={24} />
                          </div>
                          <div className="public-social-info">
                            <span className="public-social-label">YouTube Kanalı</span>
                            <span className="public-social-handle">{getYouTubeHandle(targetUser.youtube)}</span>
                            <span className="public-social-action">
                              <span>Kanalı İzle</span>
                              <ExternalLink size={12} />
                            </span>
                          </div>
                        </a>
                      )}
                    </div>
                  )}

                  {/* Paylaşılan Fikirler */}
                  <div className="public-profile-card">
                    <div className="public-profile-header-title">
                      <h3>
                        <Compass size={20} color="#e0b878" />
                        <span>{targetUser.displayName} Tarafından Paylaşılan Fikirler</span>
                      </h3>
                      <span className="tab-badge">{targetPosts.length} Fikir</span>
                    </div>

                    {targetPosts.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "40px 10px", color: "rgba(255,255,255,0.6)" }}>
                        <p>Bu düşünür henüz herkese açık bir fikir veya tartışma paylaşmamış.</p>
                      </div>
                    ) : (
                      <div className="user-posts-list">
                        {targetPosts.map((post, idx) => (
                          <Link
                            key={post.id || `target-post-${idx}`}
                            href={`/forum?post=${post.id}`}
                            className="user-post-item-card"
                          >
                            <div className="user-post-item-header">
                              <span className="user-post-item-category">{post.category}</span>
                              <span className="user-post-item-date">
                                {new Date(post.createdAt).toLocaleDateString("tr-TR", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric"
                                })}
                              </span>
                            </div>
                            <h4 className="user-post-item-title">{post.title}</h4>
                            <p className="user-post-item-snippet">{post.content}</p>
                            <div className="user-post-item-footer">
                              <div className="user-post-item-meta">
                                <span><Heart size={14} color="#e0b878" /> {post.likes.length} Beğeni</span>
                                <span><MessageCircle size={14} /> {post.comments.length} Yorum</span>
                              </div>
                              <span className="user-post-read-link">
                                <span>Tartışmayı Oku</span>
                                <ArrowRight size={13} />
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                </div>

              </div>
            )
          ) : (
            /* =========================================================================
               DURUM B: KULLANICININ KENDİ PROFİLİ
               ========================================================================= */
            <>
              {/* 1. GİRİŞ YAPILMAMIŞ DURUM */}
              {!user && (
                <div className="profile-auth-prompt-card animate-scale">
                  <div className="prompt-icon-box">
                    <User size={32} />
                  </div>
                  <h2>Kendi Profilinizi Oluşturmak İçin Giriş Yapın</h2>
                  <p>
                    Profil bilgilerinizi doldurmak, meslek ve biyografinizi belirlemek, Instagram ve YouTube hesaplarınızı ekleyerek diğer üyelerle etkileşime geçmek için giriş yapabilirsiniz.
                  </p>
                  <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "20px" }}>
                    <Link href="/auth?redirect=/profil" className="btn-primary-solid">
                      <LogIn size={16} />
                      <span>Giriş Yap veya Kayıt Ol</span>
                    </Link>
                    <Link href="/forum" className="btn-white-outline">
                      <span>Forumu Ziyaret Et</span>
                    </Link>
                  </div>
                </div>
              )}

              {/* 2. MİSAFİR KULLANICI UYARISI */}
              {user && isAnonymousUser && (
                <div className="anonymous-guest-card animate-fade-down">
                  <div className="guest-badge-line">
                    <AlertTriangle size={18} color="#fbbf24" />
                    <span>Misafir Oturumu (Yalnızca Okuma Modu)</span>
                  </div>
                  <p>
                    Şu anda misafir olarak bağlısınız. Profil bilgilerinizi kalıcı olarak kaydetmek, fotoğraf, biyografi, Instagram ve YouTube hesaplarınızı eklemek için kalıcı bir hesap oluşturmalısınız.
                  </p>
                  <Link href="/auth?redirect=/profil" className="btn-primary-solid btn-sm" style={{ marginTop: "12px", display: "inline-flex" }}>
                    <span>Kalıcı Hesap Oluştur</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              )}

              {/* 3. KULLANICI PROFİL HUB */}
              {user && (
                <div className="profile-hub-grid animate-fade-up">
                  
                  {/* SOL TARAF: PROFİL KARTI & ÖZETİ */}
                  <div className="profile-overview-card">
                    <div className="profile-avatar-container">
                      {photoURL ? (
                        <img src={photoURL} alt={displayName} className="profile-main-avatar" />
                      ) : (
                        <div className="profile-avatar-fallback">
                          {displayName ? displayName.charAt(0).toUpperCase() : "P"}
                        </div>
                      )}

                      {isRegisteredUser && (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab("edit");
                            const fileInput = document.getElementById("profile-file-input");
                            if (fileInput) fileInput.click();
                          }}
                          className="avatar-edit-badge-btn"
                          title="Fotoğraf Yükle veya Değiştir"
                        >
                          <Camera size={14} />
                        </button>
                      )}
                    </div>

                    <h1 className="profile-user-name">{displayName || "Düşünür"}</h1>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#e0b878",
                        fontWeight: 500,
                        marginBottom: "6px",
                        opacity: 0.9,
                      }}
                    >
                      @{toUsernameSlug(username || displayName)}
                    </div>
                    <div className="profile-profession-tag">
                      <Briefcase size={13} />
                      <span>{profession || "Düşünce Kaşifi"}</span>
                    </div>

                    {email && (
                      <div className="profile-email-line">
                        <Mail size={13} />
                        <span>{email}</span>
                      </div>
                    )}

                    {/* Sosyal Medya Rozetleri (Instagram & YouTube) */}
                    <div className="profile-social-pills">
                      {instagram ? (
                        <a
                          href={getInstagramUrl(instagram)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-pill-btn social-pill-instagram"
                          title="Instagram Hesabını Aç"
                        >
                          <div className="social-pill-left">
                            <InstagramIcon size={16} />
                            <span className="social-handle">{getInstagramHandle(instagram)}</span>
                          </div>
                          <ExternalLink size={13} className="social-pill-arrow" />
                        </a>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab("edit");
                            const instInput = document.getElementById("edit-instagram");
                            if (instInput) instInput.focus();
                          }}
                          className="social-pill-add"
                        >
                          <InstagramIcon size={14} />
                          <span>+ Instagram Hesabı Ekle</span>
                        </button>
                      )}

                      {youtube ? (
                        <a
                          href={getYouTubeUrl(youtube)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-pill-btn social-pill-youtube"
                          title="YouTube Kanalını Aç"
                        >
                          <div className="social-pill-left">
                            <YouTubeIcon size={16} />
                            <span className="social-handle">{getYouTubeHandle(youtube)}</span>
                          </div>
                          <ExternalLink size={13} className="social-pill-arrow" />
                        </a>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab("edit");
                            const ytInput = document.getElementById("edit-youtube");
                            if (ytInput) ytInput.focus();
                          }}
                          className="social-pill-add"
                        >
                          <YouTubeIcon size={14} />
                          <span>+ YouTube Kanalı Ekle</span>
                        </button>
                      )}
                    </div>

                    {/* Biyografi Bölümü */}
                    <div className="profile-bio-box">
                      <h4>Hakkımda</h4>
                      <p>
                        {bio || "Henüz bir biyografi eklenmemiş. Profil bilgilerinizi doldurarak kendinizi tanıtabilirsiniz."}
                      </p>
                    </div>

                    {/* İstatistikler */}
                    <div className="profile-stats-row">
                      <div className="profile-stat-item">
                        <span className="stat-val">{myStats.postsCount}</span>
                        <span className="stat-lbl">Fikir</span>
                      </div>
                      <div className="profile-stat-item">
                        <span className="stat-val">{myStats.commentsCount}</span>
                        <span className="stat-lbl">Yorum</span>
                      </div>
                      <div className="profile-stat-item">
                        <span className="stat-val">{myStats.likesReceived}</span>
                        <span className="stat-lbl">Beğeni</span>
                      </div>
                    </div>

                    {/* Hızlı Aksiyonlar */}
                    <div className="profile-quick-actions">
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyProfileLink({
                            username: username || userProfile?.username,
                            displayName: displayName || userProfile?.displayName,
                            uid: user.uid,
                          })
                        }
                        className="btn-white-outline w-100"
                        style={{ display: "inline-flex", justifyContent: "center", alignItems: "center", gap: "8px" }}
                        title="Diğer kullanıcılarla paylaşmak için profil linkini kopyalayın"
                      >
                        <Share2 size={15} />
                        <span>Profil Bağlantımı Kopyala</span>
                      </button>

                      <Link
                        href={`${getProfileUrl({
                          username: username || userProfile?.username,
                          displayName: displayName || userProfile?.displayName,
                          uid: user.uid,
                        })}?onizleme=1`}
                        className="btn-white-outline w-100 text-center"
                        style={{ display: "inline-flex", justifyContent: "center", alignItems: "center", gap: "8px" }}
                        title="Diğer kullanıcıların profilinizi nasıl gördüğünü test edin"
                      >
                        <Eye size={15} />
                        <span>Herkese Açık Önizleme</span>
                      </Link>

                      <Link
                        href="/forum"
                        className="btn-primary-solid w-100 text-center"
                        style={{ display: "inline-flex", justifyContent: "center", alignItems: "center", gap: "8px" }}
                      >
                        <MessageSquareQuote size={16} />
                        <span>Foruma Git</span>
                      </Link>

                      <button
                        type="button"
                        onClick={logout}
                        className="btn-danger-outline w-100"
                        style={{ display: "inline-flex", justifyContent: "center", alignItems: "center", gap: "8px" }}
                      >
                        <LogOut size={16} />
                        <span>Çıkış Yap</span>
                      </button>
                    </div>
                  </div>

                  {/* SAĞ TARAF: PROFİL BİLGİLERİNİ DOLDURMA FORMU VE PAYLAŞILAN FİKİRLER */}
                  <div className="profile-details-column">
                    
                    {/* Sekme Butonları */}
                    <div className="profile-tabs-header">
                      <button
                        type="button"
                        onClick={() => setActiveTab("edit")}
                        className={`profile-tab-button ${activeTab === "edit" ? "active" : ""}`}
                      >
                        <FileEdit size={15} />
                        <span>Profil Bilgilerimi Doldur</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab("posts")}
                        className={`profile-tab-button ${activeTab === "posts" ? "active" : ""}`}
                      >
                        <Compass size={15} />
                        <span>Paylaştığım Fikirler</span>
                        <span className="tab-badge">{myPosts.length}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab("comments")}
                        className={`profile-tab-button ${activeTab === "comments" ? "active" : ""}`}
                      >
                        <MessageCircle size={15} />
                        <span>Yazdığım Yorumlar</span>
                        <span className="tab-badge">{myComments.length}</span>
                      </button>
                    </div>

                    {/* SEKME 1: BİLGİLERİ DOLDURMA FORMU */}
                    {activeTab === "edit" && (
                      <div className="profile-edit-card animate-fade-down">
                        <div className="edit-card-header">
                          <h3>Profil ve Hesap Bilgileriniz</h3>
                          <p>
                            Topluluktaki kimliğinizi oluşturun, sosyal medya hesaplarınızı bağlayın. Diğer üyeler profilinize tıkladığında bu bilgileri görebilir.
                          </p>
                        </div>

                        <form onSubmit={handleSaveProfile} className="profile-edit-form">
                          {/* Ad Soyad */}
                          <div className="form-group">
                            <label htmlFor="edit-name">Ad Soyad / Görünen İsim *</label>
                            <input
                              id="edit-name"
                              type="text"
                              required
                              value={displayName}
                              onChange={(e) => {
                                const val = e.target.value;
                                setDisplayName(val);
                                if (!username || username === toUsernameSlug(displayName)) {
                                  setUsername(toUsernameSlug(val));
                                }
                              }}
                              placeholder="Örn: Dr. Selin Yılmaz"
                              className="form-control"
                            />
                          </div>

                          {/* Kullanıcı Adı (Profil Bağlantısı) */}
                          <div className="form-group">
                            <label htmlFor="edit-username">Kullanıcı Adı (Profil Bağlantınız)</label>
                            <input
                              id="edit-username"
                              type="text"
                              value={username}
                              onChange={(e) => setUsername(toUsernameSlug(e.target.value))}
                              placeholder="Örn: dr-selin-yilmaz"
                              className="form-control"
                            />
                            <span className="social-field-hint">
                              Profil adresiniz: <strong>/profil/{toUsernameSlug(username || displayName || "kullanici-adi")}</strong>
                            </span>
                          </div>

                          {/* Meslek */}
                          <div className="form-group">
                            <label htmlFor="edit-prof">Meslek / Uzmanlık Alanı</label>
                            <input
                              id="edit-prof"
                              type="text"
                              value={profession}
                              onChange={(e) => setProfession(e.target.value)}
                              placeholder="Örn: Klinik Psikolog, Felsefe Mezunu, Yazar, Danışman, Araştırmacı..."
                              className="form-control"
                            />
                          </div>

                          {/* SOSYAL MEDYA: INSTAGRAM */}
                          <div className="form-group">
                            <label htmlFor="edit-instagram">Instagram Hesabı</label>
                            <div className="social-input-container">
                              <span className="social-input-icon social-input-instagram-icon">
                                <InstagramIcon size={18} />
                              </span>
                              <input
                                id="edit-instagram"
                                type="text"
                                value={instagram}
                                onChange={(e) => setInstagram(e.target.value)}
                                placeholder="Örn: @kullaniciadi veya https://instagram.com/kullaniciadi"
                                className="form-control form-control-social"
                              />
                            </div>
                            <span className="social-field-hint">
                              Diğer kullanıcılar profilinize girdiğinde Instagram hesabınızı görebilir ve tek tıkla sizi takip edebilir.
                            </span>
                          </div>

                          {/* SOSYAL MEDYA: YOUTUBE */}
                          <div className="form-group">
                            <label htmlFor="edit-youtube">YouTube Kanalı</label>
                            <div className="social-input-container">
                              <span className="social-input-icon social-input-youtube-icon">
                                <YouTubeIcon size={18} />
                              </span>
                              <input
                                id="edit-youtube"
                                type="text"
                                value={youtube}
                                onChange={(e) => setYoutube(e.target.value)}
                                placeholder="Örn: @kanaladi veya https://youtube.com/@kanaladi"
                                className="form-control form-control-social"
                              />
                            </div>
                            <span className="social-field-hint">
                              YouTube kanalınızı bağlayarak video ve düşüncelerinizi PsikoWay topluluğuyla paylaşabilirsiniz.
                            </span>
                          </div>

                          {/* E-posta */}
                          <div className="form-group">
                            <label htmlFor="edit-email">İletişim E-posta Adresi</label>
                            <input
                              id="edit-email"
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="ornek@mail.com"
                              className="form-control"
                            />
                          </div>

                          {/* Biyografi */}
                          <div className="form-group">
                            <label htmlFor="edit-bio">Biyografi & Kendini Tanıt</label>
                            <textarea
                              id="edit-bio"
                              rows={4}
                              value={bio}
                              onChange={(e) => setBio(e.target.value)}
                              placeholder="İlgi duyduğunuz psikolojik ekoller, felsefi görüşleriniz veya düşünce yolculuğunuz hakkında bir iki cümle..."
                              className="form-control"
                            />
                          </div>

                          {/* Profil Fotoğrafı Seçenekleri */}
                          <div className="form-group">
                            <label>Profil Fotoğrafı Seç veya Yükle</label>
                            <div className="avatar-selection-box">
                              {/* 1. URL Girişi */}
                              <input
                                type="text"
                                value={photoURL}
                                onChange={(e) => setPhotoURL(e.target.value)}
                                placeholder="Profil görsel bağlantısı (URL) yapıştırın..."
                                className="form-control"
                                style={{ marginBottom: "10px" }}
                              />

                              {/* 2. Dosya Yükleme Butonu */}
                              <div className="upload-btn-wrapper" style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                                <label
                                  className="btn-file-upload"
                                  style={{
                                    opacity: uploadingPhoto ? 0.65 : 1,
                                    pointerEvents: uploadingPhoto ? "none" : "auto",
                                  }}
                                >
                                  <Upload size={15} />
                                  <span>
                                    {uploadingPhoto
                                      ? "Sıkıştırılıyor & Yükleniyor..."
                                      : "Cihazdan Fotoğraf Yükle (Otomatik Sıkıştırma)"}
                                  </span>
                                  <input
                                    id="profile-file-input"
                                    type="file"
                                    accept="image/*"
                                    disabled={uploadingPhoto}
                                    onChange={handleImageFileUpload}
                                    style={{ display: "none" }}
                                  />
                                </label>
                                {photoURL && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setPhotoURL("");
                                      setPhotoCompressInfo(null);
                                    }}
                                    className="btn-remove-photo"
                                  >
                                    Fotoğrafı Kaldır
                                  </button>
                                )}
                                {photoCompressInfo && (
                                  <span
                                    style={{
                                      fontSize: "12px",
                                      color: "#34d399",
                                      background: "rgba(16, 185, 129, 0.12)",
                                      border: "1px solid rgba(16, 185, 129, 0.3)",
                                      padding: "4px 10px",
                                      borderRadius: "999px",
                                      fontWeight: 500,
                                    }}
                                  >
                                    ⚡ {photoCompressInfo}
                                  </span>
                                )}
                              </div>

                              {/* 3. Hazır Temel Erkek & Kız Emojileri */}
                              <div className="preset-avatars-section">
                                <span className="preset-label" style={{ marginBottom: "12px", display: "block" }}>
                                  Veya hazır temel erkek &amp; kız emojilerinden profil fotoğrafı seçin:
                                </span>

                                {/* Erkek Emojileri */}
                                <div style={{ marginBottom: "16px" }}>
                                  <div className="preset-category-title">
                                    <span>👨 Erkek Karakter Emojileri</span>
                                  </div>
                                  <div className="preset-avatars-grid">
                                    {MALE_EMOJI_AVATARS.map((av) => (
                                      <button
                                        key={av.id}
                                        type="button"
                                        onClick={() => {
                                          setPhotoURL(av.url);
                                          showToast(`${av.label} seçildi!`);
                                        }}
                                        className={`preset-avatar-btn ${photoURL === av.url ? "selected" : ""}`}
                                        title={av.label}
                                        style={{ background: av.bgColor }}
                                      >
                                        <span className="preset-emoji-char">{av.emoji}</span>
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                {/* Kız / Kadın Emojileri */}
                                <div>
                                  <div className="preset-category-title">
                                    <span>👩 Kız &amp; Kadın Karakter Emojileri</span>
                                  </div>
                                  <div className="preset-avatars-grid">
                                    {FEMALE_EMOJI_AVATARS.map((av) => (
                                      <button
                                        key={av.id}
                                        type="button"
                                        onClick={() => {
                                          setPhotoURL(av.url);
                                          showToast(`${av.label} seçildi!`);
                                        }}
                                        className={`preset-avatar-btn ${photoURL === av.url ? "selected" : ""}`}
                                        title={av.label}
                                        style={{ background: av.bgColor }}
                                      >
                                        <span className="preset-emoji-char">{av.emoji}</span>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="form-actions-row">
                            <button
                              type="submit"
                              disabled={saving || uploadingPhoto}
                              className="btn-primary-solid"
                              style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
                            >
                              <Save size={16} />
                              <span>{saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}</span>
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    {/* SEKME 2: PAYLAŞTIĞIM FİKİRLER */}
                    {activeTab === "posts" && (
                      <div className="public-profile-card animate-fade-down">
                        <div className="public-profile-header-title">
                          <h3>
                            <Compass size={20} color="#e0b878" />
                            <span>Toplulukta Paylaştığınız Fikirler</span>
                          </h3>
                          <Link href="/forum" className="btn-primary-solid btn-sm">
                            <span>Yeni Fikir Paylaş</span>
                            <ArrowRight size={13} />
                          </Link>
                        </div>

                        {myPosts.length === 0 ? (
                          <div style={{ textAlign: "center", padding: "40px 10px", color: "rgba(255,255,255,0.6)" }}>
                            <p>Henüz kendi adınızla bir fikir paylaşmadınız.</p>
                            <Link href="/forum" className="btn-white-outline" style={{ display: "inline-flex", marginTop: "12px", gap: "6px" }}>
                              <MessageSquareQuote size={15} />
                              <span>Forumda Fikir Paylaş</span>
                            </Link>
                          </div>
                        ) : (
                          <div className="user-posts-list">
                            {myPosts.map((post, idx) => (
                              <div
                                key={post.id || `my-post-${idx}`}
                                className="user-post-item-card"
                              >
                                <div className="user-post-item-header">
                                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                                    <span className="user-post-item-category">{post.category}</span>
                                    {post.isAnonymous && (
                                      <span className="post-anon-tag">🕶️ Anonim Paylaşıldı</span>
                                    )}
                                  </div>
                                  <span className="user-post-item-date">
                                    {new Date(post.createdAt).toLocaleDateString("tr-TR", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric"
                                    })}
                                  </span>
                                </div>
                                <h4 className="user-post-item-title">{post.title}</h4>
                                <p className="user-post-item-snippet">{post.content}</p>
                                {post.imageUrl && (
                                  <div style={{ marginTop: "10px", marginBottom: "10px" }}>
                                    <img
                                      src={post.imageUrl}
                                      alt={post.title}
                                      style={{
                                        maxHeight: "180px",
                                        borderRadius: "10px",
                                        objectFit: "cover",
                                        border: "1px solid rgba(224, 184, 120, 0.25)",
                                      }}
                                    />
                                  </div>
                                )}
                                <div className="user-post-item-footer">
                                  <div className="user-post-item-meta">
                                    <span><Heart size={14} color="#e0b878" /> {post.likes.length} Beğeni</span>
                                    <span><MessageCircle size={14} /> {post.comments.length} Yorum</span>
                                  </div>
                                  <div className="user-post-actions">
                                    <Link
                                      href={`/forum?post=${post.id}`}
                                      className="btn-user-post-view"
                                      title="Tartışmaya Git"
                                    >
                                      <Eye size={13} />
                                      <span>Görüntüle</span>
                                    </Link>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteMyPost(post.id, post.title)}
                                      className="btn-user-post-delete"
                                      title="Fikri Kalıcı Olarak Sil"
                                    >
                                      <Trash2 size={13} />
                                      <span>Sil</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* SEKME 3: YAZDIĞIM YORUMLAR */}
                    {activeTab === "comments" && (
                      <div className="public-profile-card animate-fade-down">
                        <div className="public-profile-header-title">
                          <h3>
                            <MessageCircle size={20} color="#e0b878" />
                            <span>Fikirlere Yazdığınız Yorumlar</span>
                          </h3>
                          <Link href="/forum" className="btn-primary-solid btn-sm">
                            <span>Forumu Gez</span>
                            <ArrowRight size={13} />
                          </Link>
                        </div>

                        {myComments.length === 0 ? (
                          <div style={{ textAlign: "center", padding: "40px 10px", color: "rgba(255,255,255,0.6)" }}>
                            <p>Henüz herhangi bir fikre yorum yazmadınız.</p>
                            <Link href="/forum" className="btn-white-outline" style={{ display: "inline-flex", marginTop: "12px", gap: "6px" }}>
                              <MessageSquareQuote size={15} />
                              <span>Tartışmalara Katıl</span>
                            </Link>
                          </div>
                        ) : (
                          <div className="user-posts-list">
                            {myComments.map((comm) => (
                              <div
                                key={comm.commentId}
                                className="user-comment-item-card"
                              >
                                <div className="user-post-item-header">
                                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                                    <span className="user-comment-parent-title">
                                      💬 {comm.postTitle}
                                    </span>
                                    {comm.isAnonymous && (
                                      <span className="post-anon-tag">🕶️ Anonim Yorum</span>
                                    )}
                                  </div>
                                  <span className="user-post-item-date">
                                    {new Date(comm.createdAt).toLocaleDateString("tr-TR", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric"
                                    })}
                                  </span>
                                </div>
                                <div className="user-comment-snippet">
                                  &ldquo;{comm.content}&rdquo;
                                </div>
                                <div className="user-post-item-footer">
                                  <div className="user-post-item-meta">
                                    <span><Heart size={14} color="#e0b878" /> {comm.likesCount} Beğeni</span>
                                  </div>
                                  <div className="user-post-actions">
                                    <Link
                                      href={`/forum?post=${comm.postId}`}
                                      className="btn-user-post-view"
                                      title="İlgili Fikre Git"
                                    >
                                      <Eye size={13} />
                                      <span>Fikre Git</span>
                                    </Link>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteMyComment(comm.postId, comm.commentId)}
                                      className="btn-user-post-delete"
                                      title="Bu Yorumu Kalıcı Olarak Sil"
                                    >
                                      <Trash2 size={13} />
                                      <span>Yorumu Sil</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                  </div>

                </div>
              )}
            </>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ProfilePage({ forcedId }: { forcedId?: string }) {
  return (
    <Suspense
      fallback={
        <div className="page-wrapper profile-page-wrapper" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
          <div style={{ color: "#e0b878", fontSize: "18px" }}>Profil yükleniyor...</div>
        </div>
      }
    >
      <ProfileContentInner forcedId={forcedId} />
    </Suspense>
  );
}
