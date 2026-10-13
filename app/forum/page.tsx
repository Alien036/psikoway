"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import BackgroundVideo from "../../components/BackgroundVideo";
import { useAuth } from "../../context/AuthContext";
import { 
  ForumPost, 
  ForumComment, 
  ForumCategory, 
  ForumSortOption 
} from "../../types/forum";
import { 
  FORUM_CATEGORIES, 
  getStoredPosts, 
  subscribeToForumPosts,
  recordPostView,
  createForumPost, 
  togglePostLike, 
  addPostComment, 
  toggleCommentLike, 
  deleteForumPost,
  filterPostsForViewer 
} from "../../lib/forum-data";
import {
  isUserBannedSync,
  getUserWarnings,
  dismissUserWarning
} from "../../lib/admin-data";
import { UserWarning } from "../../types/admin";
import { subscribeToRealUserCount, formatCommunityStat } from "../../lib/community-stats";
import {
  MessageSquareQuote,
  Plus,
  Heart,
  MessageCircle,
  Share2,
  Search,
  Pin,
  Sparkles,
  X,
  Send,
  Eye,
  ShieldCheck,
  User as UserIcon,
  LogIn,
  Flame,
  Clock,
  Tag,
  Trash2,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  ArrowRight,
  Ban,
  AlertTriangle,
  Briefcase,
  BookOpen,
  Lock,
  UserPlus
} from "lucide-react";

// Tarih formatlama (Türkçe göreli zaman)
function formatTimeAgo(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSeconds < 60) return "az önce";
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes} dk önce`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} saat önce`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "dün";
    if (diffDays < 7) return `${diffDays} gün önce`;
    return date.toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
  } catch {
    return "yakın zamanda";
  }
}

// Renkli monogram avatar üretici
const AVATAR_COLORS = [
  "linear-gradient(135deg, #e0b878, #c69248)",
  "linear-gradient(135deg, #6366f1, #4f46e5)",
  "linear-gradient(135deg, #10b981, #059669)",
  "linear-gradient(135deg, #ec4899, #db2777)",
  "linear-gradient(135deg, #8b5cf6, #7c3aed)",
  "linear-gradient(135deg, #06b6d4, #0891b2)",
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

export default function ForumPage() {
  const { 
    user, 
    userProfile, 
    isRegisteredUser, 
    isAnonymousUser, 
    signInWithGoogle, 
    signInGuest, 
    getUserDisplayName 
  } = useAuth();

  // Gönderi verisi
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("Tümü");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<ForumSortOption>("newest");

  // Açık olan yorum bölümleri
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  // Genişletilmiş uzun içerikler
  const [expandedText, setExpandedText] = useState<Record<string, boolean>>({});
  // Yorum inputları
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [commentAnonymous, setCommentAnonymous] = useState<Record<string, boolean>>({});

  // Modallar
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Yeni gönderi formu
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<string>("Psikoloji & Zihin");
  const [newTags, setNewTags] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newIsAnonymous, setNewIsAnonymous] = useState(false);
  const [formError, setFormError] = useState("");
  const [userWarningsList, setUserWarningsList] = useState<UserWarning[]>([]);
  const [realUsersCount, setRealUsersCount] = useState<number>(1);
  const isCurrentUserBanned = user ? isUserBannedSync(user.uid) : false;

  // Firebase Realtime Database üzerinden canlı olarak gönderileri, beğenileri ve görüntülemeleri dinle
  useEffect(() => {
    const unsubscribePosts = subscribeToForumPosts((livePosts) => {
      setPosts(livePosts);
    }, user?.uid);

    const unsubscribeUsers = subscribeToRealUserCount((count) => {
      setRealUsersCount(count);
    });

    getUserWarnings()
      .then((warns) => setUserWarningsList(warns))
      .catch(() => {});

    return () => {
      unsubscribePosts();
      unsubscribeUsers();
    };
  }, [user]);

  const activeUserWarnings = useMemo(() => {
    if (!user) return [];
    return userWarningsList.filter((w) => w.userId === user.uid && !w.isRead);
  }, [user, userWarningsList]);

  const handleDismissWarning = async (warningId: string) => {
    await dismissUserWarning(warningId);
    setUserWarningsList((prev) =>
      prev.map((w) => (w.id === warningId ? { ...w, isRead: true } : w))
    );
    showToast("Uyarıyı onayladınız.");
  };

  // Toast bildirim zamanlayıcısı
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtrelenmiş ve sıralanmış gönderiler
  const filteredPosts = useMemo(() => {
    let result = [...posts];

    // Kategori filtresi
    if (selectedCategory !== "Tümü") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Etiket filtresi
    if (selectedTag) {
      result = result.filter((p) =>
        p.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase())
      );
    }

    // Arama filtresi
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q) ||
          p.authorName.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sıralama
    result.sort((a, b) => {
      // Sabitlenmiş gönderiler her zaman en başta kalsın
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      if (sortBy === "popular") {
        return b.likes.length - a.likes.length;
      }
      if (sortBy === "discussed") {
        return b.comments.length - a.comments.length;
      }
      // 'newest'
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  }, [posts, selectedCategory, selectedTag, searchQuery, sortBy]);

  // Popüler etiket listesi
  const popularTags = useMemo(() => {
    const counts: Record<string, number> = {};
    posts.forEach((p) => {
      p.tags.forEach((t) => {
        counts[t] = (counts[t] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([tag]) => tag);
  }, [posts]);

  // Toplam Yorum Sayısı (Gerçek Zamanlı)
  const totalCommentsCount = useMemo(() => {
    return posts.reduce((sum, p) => sum + (p.comments?.length || 0), 0);
  }, [posts]);

  // Beğeni Tıklaması
  const handleLikePost = async (postId: string) => {
    if (isCurrentUserBanned) {
      showToast("Yasaklı hesaplar etkileşimde bulunamaz.");
      return;
    }
    let currentUserId = user?.uid;
    if (!currentUserId) {
      try {
        const guestUser = await signInGuest();
        currentUserId = guestUser?.uid;
      } catch (e) {
        console.warn("Guest sign-in error for like:", e);
      }
    }
    if (!currentUserId) {
      currentUserId = `guest-${Math.random().toString(36).substring(2, 9)}`;
    }
    const updated = await togglePostLike(postId, currentUserId);
    setPosts(updated);
  };

  // Yorum Bölümünü Aç/Kapat
  const toggleComments = (postId: string) => {
    recordPostView(postId);
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  // Yorum Gönderme (Yalnızca kayıtlı hesaplar)
  const handleAddComment = async (postId: string) => {
    if (!isRegisteredUser || !user) {
      showToast("Yorum yapabilmek için lütfen önce hesap açın veya giriş yapın.");
      setIsAuthModalOpen(true);
      return;
    }
    if (isCurrentUserBanned) {
      showToast("Hesabınız yasaklandığı için yorum yapamazsınız.");
      return;
    }
    const content = (commentInputs[postId] || "").trim();
    if (!content) return;

    const commentAuthorName = userProfile?.displayName || user.displayName || getUserDisplayName();
    const commentAuthorAvatar = userProfile?.photoURL || user.photoURL || "";
    const commentAuthorProf = userProfile?.profession || "";

    try {
      const updated = await addPostComment(postId, {
        authorId: user.uid,
        authorName: commentAuthorName,
        authorAvatar: commentAuthorAvatar,
        authorProfession: commentAuthorProf,
        isAnonymous: false,
        content,
      });

      setPosts(filterPostsForViewer(updated, user.uid));
      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
      showToast("Yorumunuz başarıyla paylaşıldı!");
    } catch (err: any) {
      showToast(err?.message || "Yorum gönderilemedi.");
    }
  };

  // Yorum Beğeni
  const handleLikeComment = async (postId: string, commentId: string) => {
    if (isCurrentUserBanned) {
      showToast("Yasaklı hesaplar etkileşimde bulunamaz.");
      return;
    }
    let currentUserId = user?.uid;
    if (!currentUserId) {
      try {
        const guestUser = await signInGuest();
        currentUserId = guestUser?.uid;
      } catch {}
    }
    if (!currentUserId) {
      currentUserId = `guest-${Math.random().toString(36).substring(2, 9)}`;
    }
    const updated = await toggleCommentLike(postId, commentId, currentUserId);
    setPosts(updated);
  };

  // Paylaşım Butonu
  const handleSharePost = (post: ForumPost) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/forum#${post.id}`);
      showToast("Fikir bağlantısı panoya kopyalandı!");
    } else {
      showToast("Bağlantı hazırlandı.");
    }
  };

  // Gönderi Silme
  const handleDeletePost = async (postId: string) => {
    if (!user) return;
    if (confirm("Bu fikri silmek istediğinizden emin misiniz?")) {
      const updated = await deleteForumPost(postId, user.uid);
      setPosts(updated);
      showToast("Fikir başarıyla silindi.");
    }
  };

  // Yeni Gönderi Modalını Açma Kontrolü (Yalnızca kayıtlı hesaplar)
  const handleOpenNewPostModal = () => {
    if (!isRegisteredUser || !user) {
      showToast("Fikir paylaşabilmek için lütfen önce hesap açın veya giriş yapın.");
      setIsAuthModalOpen(true);
      return;
    }
    setIsNewPostModalOpen(true);
  };

  // Yeni Gönderi Kaydetme (Yalnızca kayıtlı hesaplar & Anonim yasak)
  const handleCreatePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isRegisteredUser || !user) {
      setFormError("Anonim olarak veya hesap açmadan fikir paylaşılamaz. Lütfen kayıt olun veya giriş yapın.");
      setIsAuthModalOpen(true);
      return;
    }
    if (isCurrentUserBanned) {
      setFormError("Hesabınız topluluk yöneticisi tarafından yasaklanmıştır. Yeni fikir paylaşamazsınız.");
      return;
    }
    if (!newTitle.trim()) {
      setFormError("Lütfen bir başlık yazın.");
      return;
    }
    if (!newContent.trim()) {
      setFormError("Lütfen fikir veya düşüncenizi detaylandırın.");
      return;
    }

    // Etiketleri parse et (#kelime veya virgülle ayrılmış)
    const parsedTags = newTags
      .split(/[\s,]+/)
      .map((t) => t.replace(/^#/, "").trim())
      .filter(Boolean);

    const postAuthorName = userProfile?.displayName || user.displayName || getUserDisplayName();
    const postAuthorAvatar = userProfile?.photoURL || user.photoURL || "";
    const postAuthorProf = userProfile?.profession || "";

    try {
      const updated = await createForumPost({
        title: newTitle.trim(),
        category: newCategory,
        tags: parsedTags.length > 0 ? parsedTags : ["Psikoloji", "Fikir"],
        content: newContent.trim(),
        authorId: user.uid,
        authorName: postAuthorName,
        authorAvatar: postAuthorAvatar,
        authorProfession: postAuthorProf,
        isAnonymous: false,
      });

      setPosts(filterPostsForViewer(updated, user.uid));
      setIsNewPostModalOpen(false);
      // Formu sıfırla
      setNewTitle("");
      setNewContent("");
      setNewTags("");
      setNewCategory("Psikoloji & Zihin");
      setNewIsAnonymous(false);
      setFormError("");
      showToast("Fikriniz toplulukla paylaşıldı!");
    } catch (err: any) {
      setFormError(err?.message || "Fikir paylaşılırken bir hata oluştu.");
    }
  };

  return (
    <div className="page-wrapper forum-page-wrapper">
      {/* Kehribar Geçişli Video Arka Plan */}
      <BackgroundVideo />

      <Navbar />

      {/* Toast Mesajı */}
      {toastMessage && (
        <div className="forum-toast animate-fade-down">
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* --- HERO / BAŞLIK BÖLÜMÜ --- */}
      <header className="page-header-hero forum-header-hero">
        <div className="pill-badge" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
          <MessageSquareQuote size={14} />
          <span>PsikoWay Topluluk & Fikir Alanı</span>
        </div>
        <h1 className="page-title">Zihinlerin Buluştuğu Düşünce Forumu</h1>
        <p className="page-desc">
          İçsel keşiflerini paylaş, sorular sor, derin psikolojik içgörüler kazan ve fikirlerini yargısız bir alanda diğer insanlarla buluştur.
        </p>

        {/* Kullanıcı Uyarısı Varsa Göster */}
        {activeUserWarnings.length > 0 && (
          <div className="user-warning-stream animate-fade-down" style={{ maxWidth: "900px", margin: "20px auto 0 auto" }}>
            {activeUserWarnings.map((w) => (
              <div key={w.id} className="user-warning-alert-box">
                <AlertTriangle size={20} color="#fbbf24" style={{ flexShrink: 0 }} />
                <div style={{ flex: 1, textAlign: "left" }}>
                  <strong style={{ color: "#fbbf24", display: "block", fontSize: "14px" }}>Moderatör Uyarısı:</strong>
                  <span style={{ fontSize: "13.5px", color: "rgba(255,255,255,0.9)" }}>{w.message}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDismissWarning(w.id)}
                  className="btn-dismiss-warn"
                >
                  Anladım (Kapat)
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Kullanıcı Yasaklıysa Göster */}
        {isCurrentUserBanned && (
          <div className="user-banned-alert-box animate-fade-down" style={{ maxWidth: "900px", margin: "20px auto 0 auto" }}>
            <Ban size={22} color="#f87171" style={{ flexShrink: 0 }} />
            <div style={{ textAlign: "left" }}>
              <strong style={{ color: "#f87171", display: "block", fontSize: "15px" }}>Hesabınız Moderasyon Tarafından Yasaklandı</strong>
              <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)" }}>
                Topluluk kurallarını ihlal sebebiyle hesabınız askıya alınmıştır. Forumda yeni fikir paylaşamaz veya yorum yapamazsınız.
              </span>
            </div>
          </div>
        )}

        {/* Kullanıcı Durum Şeridi (Giriş Durumuna Göre Akıllı Bar) */}
        <div className="forum-user-status-card animate-fade-up delay-1">
          {isRegisteredUser ? (
            <div className="user-status-logged-in">
              <div className="user-status-avatar-box">
                {userProfile?.photoURL || user?.photoURL ? (
                  <img
                    src={userProfile?.photoURL || user?.photoURL || ""}
                    alt={userProfile?.displayName || getUserDisplayName()}
                  />
                ) : (
                  <div
                    className="avatar-monogram"
                    style={{ background: getAvatarColor(userProfile?.displayName || getUserDisplayName()) }}
                  >
                    {(userProfile?.displayName || getUserDisplayName()).charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="user-status-text">
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  <span className="user-status-greeting">
                    Hoş geldin, <strong>{userProfile?.displayName || getUserDisplayName()}</strong>
                  </span>
                  {userProfile?.profession && (
                    <span className="author-profession-chip">
                      <Briefcase size={12} />
                      <span>{userProfile.profession}</span>
                    </span>
                  )}
                </div>
                <span className="user-status-sub">
                  {userProfile?.bio ? (
                    <span>&ldquo;{userProfile.bio}&rdquo;</span>
                  ) : (
                    <span>Bugün zihnini meşgul eden hangi düşünceyi toplulukla paylaşmak istersin?</span>
                  )}
                </span>
              </div>
              <div className="user-status-actions-group">
                <Link
                  href="/profil"
                  className="btn-white-outline"
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 14px", fontSize: "13px" }}
                  title="Profilini Gör & Düzenle"
                >
                  <UserIcon size={14} />
                  <span>Profilim</span>
                </Link>
                <button
                  type="button"
                  onClick={handleOpenNewPostModal}
                  className="btn-primary-solid btn-pulse-glow"
                  style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
                >
                  <Plus size={18} />
                  <span>Yeni Fikir Paylaş</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="user-status-guest user-status-readonly">
              <div className="guest-info-left">
                <div className="guest-badge-pill">
                  <BookOpen size={15} />
                  <span>Misafir Okuma Modu</span>
                </div>
                <div>
                  <strong>Anonim / Misafir Olarak Okuyorsunuz</strong>
                  <p>
                    Topluluktaki tüm fikirleri ve yorumları serbestçe inceleyebilirsiniz. Kendi adınızla fikir ve yorum paylaşmak için lütfen hesap açınız (Anonim ve hesapsız gönderi kabul edilmemektedir).
                  </p>
                </div>
              </div>
              <div className="guest-actions-right">
                <Link
                  href="/auth?mode=register"
                  className="btn-primary-solid"
                  style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
                >
                  <UserPlus size={16} />
                  <span>Hesap Aç & Paylaş</span>
                </Link>
                <button
                  type="button"
                  onClick={handleOpenNewPostModal}
                  className="btn-white-outline"
                  style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
                >
                  <Plus size={16} />
                  <span>Fikir Yaz</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* --- ANA FORUM İÇERİĞİ --- */}
      <main className="content-glass-section forum-main-container">
        <div className="content-container forum-layout-grid">
          
          {/* SOL TARAF: FİLTRELER, ARAMA VE TARTIŞMA AKIŞI */}
          <div className="forum-feed-column">
            
            {/* ARAMA VE SIRALAMA ÇUBUĞU */}
            <div className="forum-controls-bar animate-fade-down">
              <div className="forum-search-wrapper">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Fikirlerde, başlıklarda veya etiketlerde ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="forum-search-input"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="clear-search-btn"
                    aria-label="Aramayı Temizle"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              {/* SIRALAMA SEÇENEKLERİ */}
              <div className="forum-sort-tabs">
                <button
                  type="button"
                  onClick={() => setSortBy("newest")}
                  className={`sort-tab-btn ${sortBy === "newest" ? "active" : ""}`}
                >
                  <Clock size={14} />
                  <span>En Yeni</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy("popular")}
                  className={`sort-tab-btn ${sortBy === "popular" ? "active" : ""}`}
                >
                  <Flame size={14} />
                  <span>Popüler</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy("discussed")}
                  className={`sort-tab-btn ${sortBy === "discussed" ? "active" : ""}`}
                >
                  <MessageCircle size={14} />
                  <span>Tartışılan</span>
                </button>
              </div>
            </div>

            {/* KATEGORİ BUTONLARI (FİLTRELER) */}
            <div className="forum-category-pills-scroll animate-fade-down delay-1">
              {FORUM_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat);
                    setSelectedTag(null);
                  }}
                  className={`forum-category-pill ${selectedCategory === cat && !selectedTag ? "active" : ""}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Aktif Etiket Filtresi Göstergesi */}
            {selectedTag && (
              <div className="active-tag-banner animate-fade-down">
                <span>
                  Etiket Filtresi: <strong>#{selectedTag}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedTag(null)}
                  className="btn-clear-tag"
                >
                  <X size={14} /> Temizle
                </button>
              </div>
            )}

            {/* GÖNDERİ LİSTESİ */}
            <div className="forum-posts-stream">
              {filteredPosts.length === 0 ? (
                <div className="forum-empty-state animate-fade-up">
                  <div className="empty-icon-circle">
                    <MessageSquareQuote size={32} />
                  </div>
                  <h3>Aramanıza Uygun Fikir Bulunamadı</h3>
                  <p>
                    Bu filtre veya anahtar kelimeyle henüz bir tartışma başlatılmamış. İlk fikri sen paylaşmak ister misin?
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory("Tümü");
                      setSelectedTag(null);
                      setSearchQuery("");
                      setIsNewPostModalOpen(true);
                    }}
                    className="btn-primary-solid"
                    style={{ marginTop: "16px", display: "inline-flex", alignItems: "center", gap: "8px" }}
                  >
                    <Plus size={16} />
                    <span>İlk Fikri Sen Paylaş</span>
                  </button>
                </div>
              ) : (
                filteredPosts.map((post, idx) => {
                  const hasLiked = user ? post.likes.includes(user.uid) : false;
                  const isOwner = user && user.uid === post.authorId;
                  const isCommentsOpen = Boolean(expandedComments[post.id]);
                  const isLong = post.content.length > 280;
                  const isExpanded = Boolean(expandedText[post.id]);

                  return (
                    <article
                      key={post.id}
                      id={post.id}
                      className={`forum-post-card animate-fade-up ${post.isPinned ? "is-pinned" : ""}`}
                      style={{ animationDelay: `${idx * 0.05}s` }}
                      onClick={() => recordPostView(post.id)}
                    >
                      {/* Kart Üst Bilgisi (Yazar & Kategori & Zaman) */}
                      <div className="post-header-row">
                        <div className="post-author-meta">
                          {post.isAnonymous ? (
                            <div className="avatar-monogram anonymous-avatar">
                              <UserIcon size={16} />
                            </div>
                          ) : (
                            <Link
                              href={`/profil?id=${post.authorId}`}
                              className="post-author-link"
                              title={`${post.authorName} Profilini Görüntüle`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              {post.authorAvatar ? (
                                <img
                                  src={post.authorAvatar}
                                  alt={post.authorName}
                                  className="post-author-img"
                                />
                              ) : (
                                <div
                                  className="avatar-monogram"
                                  style={{ background: getAvatarColor(post.authorName) }}
                                >
                                  {post.authorName.charAt(0).toUpperCase()}
                                </div>
                              )}
                            </Link>
                          )}

                          <div className="post-author-info">
                            <div className="author-name-row">
                              {post.isAnonymous ? (
                                <span className="author-name">Anonim Düşünür</span>
                              ) : (
                                <Link
                                  href={`/profil?id=${post.authorId}`}
                                  className="author-name author-name-link"
                                  title={`${post.authorName} Profilini Görüntüle`}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {post.authorName}
                                </Link>
                              )}
                              {!post.isAnonymous && post.authorProfession && (
                                <span className="author-profession-chip" title={`Meslek: ${post.authorProfession}`}>
                                  <Briefcase size={10} />
                                  <span>{post.authorProfession}</span>
                                </span>
                              )}
                              {post.isPinned && (
                                <span className="pinned-badge">
                                  <Pin size={11} /> Öne Çıkan
                                </span>
                              )}
                              <span className="post-time">{formatTimeAgo(post.createdAt)}</span>
                            </div>
                            <div className="category-chip-line">
                              <span className="category-tag-badge">{post.category}</span>
                            </div>
                          </div>
                        </div>

                        {/* Sahibiyse Sil Butonu */}
                        {isOwner && (
                          <button
                            type="button"
                            onClick={() => handleDeletePost(post.id)}
                            className="btn-icon-subtle btn-delete"
                            title="Fikri Sil"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>

                      {/* Gönderi Başlığı */}
                      <h2
                        className="post-title"
                        onClick={() => recordPostView(post.id)}
                        style={{ cursor: "pointer" }}
                      >
                        {post.title}
                      </h2>

                      {/* Gönderi İçeriği */}
                      <div className="post-body-content">
                        <p onClick={() => recordPostView(post.id)}>
                          {isLong && !isExpanded
                            ? `${post.content.slice(0, 280)}...`
                            : post.content}
                        </p>
                        {isLong && (
                          <button
                            type="button"
                            onClick={() => {
                              recordPostView(post.id);
                              setExpandedText((prev) => ({
                                ...prev,
                                [post.id]: !prev[post.id],
                              }));
                            }}
                            className="btn-read-more"
                          >
                            {isExpanded ? "Daha az göster" : "Devamını oku"}
                          </button>
                        )}
                      </div>

                      {/* Etiketler */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="post-tags-row">
                          {post.tags.map((tag) => (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => setSelectedTag(tag)}
                              className="post-tag-chip"
                            >
                              <Tag size={11} /> #{tag}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Etkileşim Butonları (Beğen, Yorum Yap, Paylaş) */}
                      <div className="post-actions-bar">
                        <div className="actions-left">
                          <button
                            type="button"
                            onClick={() => handleLikePost(post.id)}
                            className={`action-btn like-btn ${hasLiked ? "liked" : ""}`}
                            aria-label="Beğen"
                          >
                            <Heart size={16} className={hasLiked ? "heart-filled" : ""} />
                            <span>{post.likes.length}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleComments(post.id)}
                            className={`action-btn comment-btn ${isCommentsOpen ? "active" : ""}`}
                            aria-label="Yorumları Gör"
                          >
                            <MessageCircle size={16} />
                            <span>{post.comments.length} Yanıt</span>
                          </button>

                          <div className="view-stat">
                            <Eye size={14} />
                            <span>{post.views} görüntüleme</span>
                          </div>
                        </div>

                        <div className="actions-right">
                          <button
                            type="button"
                            onClick={() => handleSharePost(post)}
                            className="action-btn share-btn"
                            title="Bağlantıyı Paylaş"
                          >
                            <Share2 size={16} />
                            <span>Paylaş</span>
                          </button>
                        </div>
                      </div>

                      {/* --- YORUMLAR BÖLÜMÜ (AÇILIR KAPANIR) --- */}
                      {isCommentsOpen && (
                        <div className="post-comments-container animate-fade-down">
                          <div className="comments-divider"></div>

                          {/* YENİ YORUM YAZMA KUTUSU */}
                          <div className="new-comment-box">
                            {isRegisteredUser ? (
                              <div className="comment-composer">
                                <div className="composer-top">
                                  {userProfile?.photoURL || user?.photoURL ? (
                                    <img
                                      src={userProfile?.photoURL || user?.photoURL || ""}
                                      alt={userProfile?.displayName || getUserDisplayName()}
                                      className="comment-user-avatar"
                                      style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover", border: "1px solid rgba(224, 184, 120, 0.4)" }}
                                    />
                                  ) : (
                                    <div
                                      className="avatar-monogram comment-user-avatar"
                                      style={{ background: getAvatarColor(userProfile?.displayName || getUserDisplayName()) }}
                                    >
                                      {(userProfile?.displayName || getUserDisplayName()).charAt(0).toUpperCase()}
                                    </div>
                                  )}
                                  <textarea
                                    rows={2}
                                    placeholder="Bu fikir hakkında ne düşünüyorsunuz? Düşüncenizi paylaşın..."
                                    value={commentInputs[post.id] || ""}
                                    onChange={(e) =>
                                      setCommentInputs((prev) => ({
                                        ...prev,
                                        [post.id]: e.target.value,
                                      }))
                                    }
                                    className="comment-textarea"
                                  />
                                </div>
                                <div className="composer-bottom">
                                  <span style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.65)", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                    <UserIcon size={13} color="#e0b878" />
                                    <span><strong>{userProfile?.displayName || getUserDisplayName()}</strong> olarak yanıtlıyorsunuz</span>
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleAddComment(post.id)}
                                    disabled={!commentInputs[post.id]?.trim()}
                                    className="btn-primary-solid btn-comment-send"
                                    style={{ marginLeft: "auto" }}
                                  >
                                    <Send size={14} />
                                    <span>Yanıtla</span>
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="comment-locked-card">
                                <div className="comment-locked-left">
                                  <Lock size={18} color="#e0b878" />
                                  <div>
                                    <strong>Yorum Yapmak İçin Hesap Açın</strong>
                                    <p>Anonim ve misafirlerin yorum yapmasına izin verilmemektedir. Tartışmalara katılmak için lütfen giriş yapın veya kayıt olun.</p>
                                  </div>
                                </div>
                                <div className="comment-locked-actions">
                                  <Link href="/auth?mode=register" className="btn-primary-solid btn-sm">
                                    <UserPlus size={13} />
                                    <span>Hesap Aç</span>
                                  </Link>
                                  <Link href="/auth?mode=login" className="btn-white-outline btn-sm">
                                    <LogIn size={13} />
                                    <span>Giriş Yap</span>
                                  </Link>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* MEVCUT YORUMLAR LİSTESİ */}
                          <div className="comments-stream">
                            {post.comments.length === 0 ? (
                              <div className="no-comments-yet">
                                Henüz yorum yapılmamış. İlk düşünceyi sen ekle!
                              </div>
                            ) : (
                              post.comments.map((comm) => {
                                const hasLikedComment = user
                                  ? comm.likes.includes(user.uid)
                                  : false;
                                return (
                                  <div key={comm.id} className="comment-card animate-fade-up">
                                    <div className="comment-author-row">
                                      {comm.isAnonymous ? (
                                        <div className="avatar-monogram comment-avatar-sm anonymous-avatar">
                                          <UserIcon size={12} />
                                        </div>
                                      ) : (
                                        <Link
                                          href={`/profil?id=${comm.authorId}`}
                                          className="comment-author-link"
                                          title={`${comm.authorName} Profilini Görüntüle`}
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          {comm.authorAvatar ? (
                                            <img
                                              src={comm.authorAvatar}
                                              alt={comm.authorName}
                                              className="comment-avatar-sm"
                                              style={{ width: "24px", height: "24px", borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
                                            />
                                          ) : (
                                            <div
                                              className="avatar-monogram comment-avatar-sm"
                                              style={{ background: getAvatarColor(comm.authorName) }}
                                            >
                                              {comm.authorName.charAt(0).toUpperCase()}
                                            </div>
                                          )}
                                        </Link>
                                      )}
                                      {comm.isAnonymous ? (
                                        <span className="comment-author-name">Anonim Düşünür</span>
                                      ) : (
                                        <Link
                                          href={`/profil?id=${comm.authorId}`}
                                          className="comment-author-name author-name-link"
                                          title={`${comm.authorName} Profilini Görüntüle`}
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          {comm.authorName}
                                        </Link>
                                      )}
                                      {!comm.isAnonymous && comm.authorProfession && (
                                        <span className="comment-profession-chip" title={`Meslek: ${comm.authorProfession}`}>
                                          <Briefcase size={9} />
                                          <span>{comm.authorProfession}</span>
                                        </span>
                                      )}
                                      <span className="comment-time">
                                        {formatTimeAgo(comm.createdAt)}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => handleLikeComment(post.id, comm.id)}
                                        className={`comment-like-btn ${hasLikedComment ? "liked" : ""}`}
                                        title="Yorumu Beğen"
                                      >
                                        <Heart size={13} className={hasLikedComment ? "heart-filled" : ""} />
                                        {comm.likes.length > 0 && (
                                          <span>{comm.likes.length}</span>
                                        )}
                                      </button>
                                    </div>
                                    <p className="comment-text">{comm.content}</p>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })
              )}
            </div>
          </div>

          {/* SAĞ TARAF: WİDGETLAR & TOPLULUK BİLGİLERİ */}
          <aside className="forum-sidebar-column">
            
            {/* 1. GÜNÜN ZİHİN SORUSU WIDGET */}
            <div className="forum-widget-card daily-prompt-widget animate-fade-up delay-1">
              <div className="widget-header">
                <div className="widget-badge">
                  <Sparkles size={13} />
                  <span>Günün Sorusu</span>
                </div>
              </div>
              <h3 className="widget-prompt-title">
                &quot;Kendinde son zamanlarda fark ettiğin ama adını koymakta zorlandığın bir içsel değişim var mı?&quot;
              </h3>
              <p className="widget-prompt-desc">
                Zihninin derinliklerine kulak ver. Bu alanda paylaşılan her içsel gözlem, bir başka insanın yolunu aydınlatabilir.
              </p>
              <button
                type="button"
                onClick={() => {
                  setNewCategory("Günün Sorusu");
                  setNewTitle("Günün Sorusu Yanıtım: ");
                  setIsNewPostModalOpen(true);
                }}
                className="btn-primary-solid w-100"
                style={{ display: "inline-flex", justifyContent: "center", alignItems: "center", gap: "8px", marginTop: "12px" }}
              >
                <span>Fikrini Paylaş</span>
                <ArrowRight size={15} />
              </button>
            </div>

            {/* 2. TREND ETİKETLER */}
            <div className="forum-widget-card animate-fade-up delay-2">
              <h4 className="widget-title">
                <Tag size={16} /> Popüler Konular & Etiketler
              </h4>
              <div className="widget-tags-cloud">
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setSelectedTag(tag);
                      setSelectedCategory("Tümü");
                    }}
                    className={`tag-cloud-chip ${selectedTag === tag ? "active" : ""}`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. TOPLULUK İLKELERİ */}
            <div className="forum-widget-card rules-widget animate-fade-up delay-3">
              <h4 className="widget-title">
                <ShieldCheck size={16} /> Topluluk ve Empati İlkeleri
              </h4>
              <ul className="rules-list">
                <li>
                  <strong>1. Empatik ve Yargısız Dil:</strong> Herkesin iç dünyası ve deneyimleri kendine özgüdür; saygı esastır.
                </li>
                <li>
                  <strong>2. Gizlilik ve Güven:</strong> Hassas konularda dilerseniz anonim paylaşım seçeneğini kullanabilirsiniz.
                </li>
                <li>
                  <strong>3. Yapıcı Paylaşım:</strong> Amaç teşhis koymak değil, insani duyguları ve bilimsel bakış açılarını keşfetmektir.
                </li>
              </ul>
            </div>

            {/* 4. CANLI TOPLULUK İSTATİSTİKLERİ (Firebase Gerçek Veri) */}
            <div className="forum-widget-card stats-widget animate-fade-up delay-4">
              <h4 className="widget-title">Topluluk Nabzı</h4>
              <div className="stats-mini-grid">
                <div className="stat-mini-item">
                  <span className="stat-number">{formatCommunityStat(posts.length)}</span>
                  <span className="stat-label">Paylaşılan Fikir</span>
                </div>
                <div className="stat-mini-item">
                  <span className="stat-number">{formatCommunityStat(totalCommentsCount)}</span>
                  <span className="stat-label">Tartışma Yanıtı</span>
                </div>
                <div className="stat-mini-item">
                  <span className="stat-number">{formatCommunityStat(realUsersCount)}</span>
                  <span className="stat-label">Zihin Kaşifi</span>
                </div>
              </div>
            </div>

          </aside>
        </div>
      </main>

      {/* --- MODAL 1: YENİ FİKİR PAYLAŞ MODALI --- */}
      {isNewPostModalOpen && (
        <div className="modal-overlay" onClick={() => setIsNewPostModalOpen(false)}>
          <div
            className="modal-content-box forum-composer-modal animate-scale"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div className="modal-icon-badge">
                  <Plus size={20} />
                </div>
                <div>
                  <h3>Yeni Fikir & Tartışma Paylaş</h3>
                  <p>Zihnindeki düşünceyi topluluğun şefkatli alanına bırak.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewPostModalOpen(false)}
                className="modal-close-btn"
                aria-label="Kapat"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreatePostSubmit} className="composer-form">
              {formError && <div className="form-error-banner">{formError}</div>}

              {isAnonymousUser && (
                <div style={{ background: "rgba(224, 184, 120, 0.08)", border: "1px solid rgba(224, 184, 120, 0.25)", borderRadius: "8px", padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", gap: "10px" }}>
                  <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.85)" }}>
                    Fikriniz <strong>Anonim Düşünür</strong> olarak paylaşılacak. Profil adınızla görünmek isterseniz:
                  </div>
                  <Link href="/auth" className="btn-white-outline btn-sm" style={{ padding: "4px 10px", fontSize: "12px", whiteSpace: "nowrap" }}>
                    Giriş Yap
                  </Link>
                </div>
              )}

                {/* Başlık Girişi */}
                <div className="form-group">
                  <label htmlFor="post-title-input">Başlık / Soru *</label>
                  <input
                    id="post-title-input"
                    type="text"
                    required
                    placeholder="Örn: Günlük hayatta otomatik düşünceleri nasıl fark edebiliriz?"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="form-control"
                  />
                </div>

                {/* Kategori ve Etiketler */}
                <div className="form-row-2">
                  <div className="form-group">
                    <label htmlFor="post-category-select">Kategori *</label>
                    <select
                      id="post-category-select"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="form-control"
                    >
                      {FORUM_CATEGORIES.filter((c) => c !== "Tümü").map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="post-tags-input">Etiketler (virgülle ayırın)</label>
                    <input
                      id="post-tags-input"
                      type="text"
                      placeholder="Örn: BDT, Farkındalık, Kaygı"
                      value={newTags}
                      onChange={(e) => setNewTags(e.target.value)}
                      className="form-control"
                    />
                  </div>
                </div>

                {/* Fikir Detayı */}
                <div className="form-group">
                  <label htmlFor="post-content-textarea">Fikrinin Detayı & Açıklaması *</label>
                  <textarea
                    id="post-content-textarea"
                    rows={6}
                    required
                    placeholder="Düşünceni, deneyimini, merak ettiğin soruyu veya karşılaştığın teoriyi detaylandır..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="form-control"
                  />
                </div>

                {/* Paylaşım Yapan Hesap Bilgisi (Anonim paylaşım engellendi) */}
                <div className="form-author-indicator">
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {userProfile?.photoURL || user?.photoURL ? (
                      <img
                        src={userProfile?.photoURL || user?.photoURL || ""}
                        alt={userProfile?.displayName || getUserDisplayName()}
                        style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover", border: "1px solid rgba(224, 184, 120, 0.4)" }}
                      />
                    ) : (
                      <div
                        className="avatar-monogram"
                        style={{ width: "32px", height: "32px", fontSize: "14px", background: getAvatarColor(userProfile?.displayName || getUserDisplayName()) }}
                      >
                        {(userProfile?.displayName || getUserDisplayName()).charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <span style={{ fontSize: "11.5px", color: "rgba(255, 255, 255, 0.55)", display: "block" }}>
                        Paylaşım Yapılacak Hesap (Anonim Gönderi Yasaktır):
                      </span>
                      <strong style={{ fontSize: "13.5px", color: "#fff" }}>
                        {userProfile?.displayName || getUserDisplayName()}
                      </strong>
                      {userProfile?.profession && (
                        <span style={{ fontSize: "12px", color: "#e0b878", marginLeft: "6px" }}>
                          ({userProfile.profession})
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Form Aksiyonları */}
                <div className="modal-actions-footer">
                  <button
                    type="button"
                    onClick={() => setIsNewPostModalOpen(false)}
                    className="btn-white-outline"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="submit"
                    className="btn-primary-solid"
                    style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
                  >
                    <Send size={16} />
                    <span>Fikri Toplulukla Paylaş</span>
                  </button>
                </div>
              </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: GİRİŞ YAP MODALI (GİRİŞSİZ TIKLAYANLAR İÇİN) --- */}
      {isAuthModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAuthModalOpen(false)}>
          <div
            className="modal-content-box forum-auth-modal animate-scale"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div className="modal-icon-badge">
                  <LogIn size={20} />
                </div>
                <div>
                  <h3>PsikoWay Topluluğuna Katıl</h3>
                  <p>Fikirlerini paylaşmak ve tartışmalara dahil olmak için saniyeler içinde giriş yap.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(false)}
                className="modal-close-btn"
                aria-label="Kapat"
              >
                <X size={20} />
              </button>
            </div>

            <div className="auth-modal-body">
              <div className="auth-modal-notice-box" style={{ background: "rgba(224, 184, 120, 0.08)", border: "1px solid rgba(224, 184, 120, 0.25)", borderRadius: "10px", padding: "12px 14px", display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "16px", textAlign: "left" }}>
                <BookOpen size={18} color="var(--gold-primary)" style={{ flexShrink: 0, marginTop: "2px" }} />
                <span style={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.8)", lineHeight: "1.5" }}>
                  <strong>Önemli Kural:</strong> Anonim / misafir ziyaretçiler içerikleri <em>yalnızca okuyabilir</em>. Fikir veya yorum yazmak, beğeni göndermek için kayıtlı bir hesap gereklidir.
                </span>
              </div>

              <div className="auth-modal-buttons">
                <Link
                  href="/auth"
                  className="btn-primary-solid w-100"
                  style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px", textDecoration: "none", padding: "12px" }}
                  onClick={() => setIsAuthModalOpen(false)}
                >
                  <LogIn size={18} />
                  <span>E-posta ile Giriş / Kayıt Ol</span>
                </Link>

                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await signInWithGoogle();
                      setIsAuthModalOpen(false);
                      showToast("Google ile başarıyla giriş yapıldı!");
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                  className="btn-social google-btn w-100"
                >
                  <Sparkles size={18} />
                  <span>Google ile Devam Et</span>
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await signInGuest();
                      setIsAuthModalOpen(false);
                      showToast("Misafir okuma moduna geçildi (Sadece okuma).");
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                  className="btn-social guest-btn w-100"
                >
                  <UserIcon size={18} />
                  <span>Misafir Olarak Oku (Sadece Okuma)</span>
                </button>
              </div>

              <div className="auth-modal-footer-note" style={{ marginTop: "14px", fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>
                Kendi profil fotoğrafınızı, mesleğinizi ve biyografinizi oluşturmak için{" "}
                <Link href="/auth" className="auth-direct-link" onClick={() => setIsAuthModalOpen(false)}>
                  Hesap Oluşturun
                </Link>
                .
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
