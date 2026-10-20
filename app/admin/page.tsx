"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import BackgroundVideo from "../../components/BackgroundVideo";
import { 
  ShieldAlert, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  Trash2, 
  Ban, 
  AlertTriangle, 
  KeyRound, 
  CheckCircle2, 
  XCircle, 
  Search, 
  RefreshCw, 
  MessageSquareQuote, 
  MessageCircle, 
  User, 
  Users, 
  LogOut, 
  ArrowRight, 
  Check, 
  X, 
  Sparkles,
  Database,
  Mail,
  Phone,
  Calendar,
  Copy,
  ExternalLink,
  Shield,
  UserCheck,
  UserX,
  Filter
} from "lucide-react";
import { 
  verifyAdminPassword, 
  changeAdminPassword, 
  isAdminLoggedIn, 
  setAdminLoggedIn, 
  getBannedUsers, 
  banUser, 
  unbanUser, 
  bulkBanUsers,
  bulkUnbanUsers,
  getUserWarnings, 
  sendUserWarning, 
  deleteUserWarning,
  adminDeletePost,
  adminDeleteComment
} from "../../lib/admin-data";
import { getStoredPosts, subscribeToForumPosts } from "../../lib/forum-data";
import { getContactMessages, deleteContactMessage, updateMessageStatus, ContactMessage } from "../../lib/contact-data";
import { getAllUsersFromFirestore, migrateAllUsersFromRTDBToFirestore, getProfileUrl } from "../../lib/profile-data";
import { 
  getSecurityAlerts, 
  subscribeToSecurityAlerts, 
  unshadowbanUser, 
  unshadowbanPost,
  deleteSecurityAlert 
} from "../../lib/anti-spam";
import { ForumPost } from "../../types/forum";
import { UserProfile } from "../../types/user";
import { BannedUser, UserWarning, AdminModerationUser, SecurityAlert } from "../../types/admin";

export default function AdminPage() {
  // Giriş Durumu
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>("");
  const [authLoading, setAuthLoading] = useState<boolean>(false);

  // Sekmeler: 'posts' | 'comments' | 'users' | 'messages' | 'security' | 'bot-alerts'
  const [activeTab, setActiveTab] = useState<"posts" | "comments" | "users" | "messages" | "security" | "bot-alerts">("posts");

  // Veriler
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [firestoreUsers, setFirestoreUsers] = useState<UserProfile[]>([]);
  const [migratingUsers, setMigratingUsers] = useState<boolean>(false);
  const [bannedUsers, setBannedUsers] = useState<BannedUser[]>([]);
  const [warnings, setWarnings] = useState<UserWarning[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modallar
  const [banModalOpen, setBanModalOpen] = useState<boolean>(false);
  const [targetBanUser, setTargetBanUser] = useState<{ id: string; name: string } | null>(null);
  const [banReasonInput, setBanReasonInput] = useState<string>("");

  const [warnModalOpen, setWarnModalOpen] = useState<boolean>(false);
  const [targetWarnUser, setTargetWarnUser] = useState<{ id: string; name: string } | null>(null);
  const [warnMessageInput, setWarnMessageInput] = useState<string>("");

  // Şifre Değiştirme
  const [newPasswordInput, setNewPasswordInput] = useState<string>("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState<string>("");
  const [passwordChangeMsg, setPasswordChangeMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [passwordChangeLoading, setPasswordChangeLoading] = useState<boolean>(false);

  // Toast Bildirim
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Toplu Seçimler (Kutucuk / Checkbox)
  const [selectedPostIds, setSelectedPostIds] = useState<string[]>([]);
  const [selectedCommentIds, setSelectedCommentIds] = useState<string[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [userStatusFilter, setUserStatusFilter] = useState<"all" | "active" | "banned" | "registered" | "guest">("all");
  const [bulkBanModalOpen, setBulkBanModalOpen] = useState<boolean>(false);
  const [bulkBanReason, setBulkBanReason] = useState<string>("Topluluk kurallarını ihlal");
  const [copiedUserId, setCopiedUserId] = useState<string | null>(null);

  const copyUserId = (id: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(id);
      setCopiedUserId(id);
      setTimeout(() => setCopiedUserId(null), 2000);
      showToast("Kullanıcı ID panoya kopyalandı!");
    }
  };

  // Kısıtlanmış (Gölge) Gönderiler
  const shadowbannedPosts = useMemo(() => {
    return posts.filter((p) => p.isShadowbanned);
  }, [posts]);

  // Aktif Gölge Kısıtlı Bildirim Sayısı
  const activeBotAlertsCount = useMemo(() => {
    return securityAlerts.filter((a) => a.status === "shadowbanned").length;
  }, [securityAlerts]);

  // İlk yükleme: Oturum kontrolü
  useEffect(() => {
    const logged = isAdminLoggedIn();
    if (logged) {
      setIsAuth(true);
    }
  }, []);

  // Canlı Dinleyiciler ve Veri Yükleme (isAuth değiştiğinde)
  useEffect(() => {
    if (isAuth) {
      loadAllData();
      // Admin oturumunda tüm gönderileri (gölge kısıtlılar dahil) dinle
      const unsubPosts = subscribeToForumPosts((livePosts) => {
        setPosts(livePosts);
      }, undefined, true);

      // Bot ve Güvenlik bildirimlerini canlı dinle
      const unsubAlerts = subscribeToSecurityAlerts((liveAlerts) => {
        setSecurityAlerts(liveAlerts);
      });

      return () => {
        unsubPosts();
        unsubAlerts();
      };
    }
  }, [isAuth]);

  const loadAllData = async () => {
    try {
      setPosts(getStoredPosts());
      const bans = await getBannedUsers();
      setBannedUsers(bans);
      const warns = await getUserWarnings();
      setWarnings(warns);
      const msgs = await getContactMessages();
      setContactMessages(msgs);
      const fUsers = await getAllUsersFromFirestore();
      setFirestoreUsers(fUsers);
      const secAlerts = await getSecurityAlerts();
      setSecurityAlerts(secAlerts);
    } catch (e) {
      console.error("Error loading admin data:", e);
    }
  };

  const handleUnshadowban = async (targetId: string, alertId: string) => {
    await unshadowbanUser(targetId, alertId);
    setSecurityAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: "resolved" as const } : a))
    );
    setPosts((prev) =>
      prev.map((p) => (p.authorId === targetId ? { ...p, isShadowbanned: false } : p))
    );
    showToast("Kullanıcının ve gönderilerinin gölge kısıtlaması kaldırıldı.");
  };

  const handleUnshadowbanSinglePost = async (postId: string, title: string) => {
    try {
      await unshadowbanPost(postId);
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, isShadowbanned: false } : p))
      );
      showToast(`"${title.slice(0, 20)}..." gönderisi yayına alındı ve herkese görünür yapıldı.`);
    } catch {
      showToast("İşlem sırasında hata oluştu.");
    }
  };

  const handleDeleteSecurityAlert = async (alertId: string) => {
    await deleteSecurityAlert(alertId);
    setSecurityAlerts((prev) => prev.filter((a) => a.id !== alertId));
    showToast("Güvenlik bildirimi silindi.");
  };

  const handleMigrateUsers = async () => {
    setMigratingUsers(true);
    try {
      const res = await migrateAllUsersFromRTDBToFirestore();
      if (res.success) {
        showToast(`${res.count} kullanıcı Realtime DB'den Firestore'a başarıyla taşındı.`);
        const fUsers = await getAllUsersFromFirestore();
        setFirestoreUsers(fUsers);
      } else {
        showToast(`Taşıma işlemi hatası: ${res.error || "Bilinmiyor"}`);
      }
    } catch (err: any) {
      showToast(`Hata: ${err?.message || "Kullanıcılar taşınamadı"}`);
    } finally {
      setMigratingUsers(false);
    }
  };


  const handleDeleteContactMessage = async (msgId: string) => {
    if (confirm("Bu iletişim/randevu mesajını silmek istediğinizden emin misiniz?")) {
      await deleteContactMessage(msgId);
      setContactMessages((prev) => prev.filter((m) => m.id !== msgId));
      showToast("Mesaj silindi.");
    }
  };

  const handleToggleMessageStatus = async (msgId: string, currentStatus: "new" | "read" | "contacted") => {
    const nextStatus = currentStatus === "new" ? "contacted" : "read";
    await updateMessageStatus(msgId, nextStatus);
    setContactMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, status: nextStatus } : m))
    );
    showToast(`Mesaj durumu güncellendi.`);
  };

  // Giriş Yapma
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    try {
      const isValid = await verifyAdminPassword(passwordInput);
      if (isValid) {
        setIsAuth(true);
        setAdminLoggedIn(true);
        setPasswordInput("");
        loadAllData();
        showToast("Yönetici girişi başarılı!");
      } else {
        setAuthError("Hatalı yönetici şifresi! Lütfen tekrar deneyin.");
      }
    } catch (err: any) {
      setAuthError("Doğrulama hatası: " + (err.message || "Bilinmeyen hata"));
    } finally {
      setAuthLoading(false);
    }
  };

  // Çıkış Yapma
  const handleLogout = () => {
    setAdminLoggedIn(false);
    setIsAuth(false);
    showToast("Yönetici oturumu kapatıldı.");
  };

  // Post Silme
  const handleDeletePost = (postId: string, title: string) => {
    if (confirm(`"${title}" başlıklı fikri kalıcı olarak silmek istediğinize emin misiniz?`)) {
      const updated = adminDeletePost(postId);
      setPosts(updated);
      showToast("Fikir başarıyla silindi.");
    }
  };

  // Yorum Silme
  const handleDeleteComment = (postId: string, commentId: string) => {
    if (confirm("Bu yorumu kalıcı olarak silmek istediğinize emin misiniz?")) {
      const updated = adminDeleteComment(postId, commentId);
      setPosts(updated);
      showToast("Yorum başarıyla silindi.");
    }
  };

  // --- KUTUCUK (CHECKBOX) VE TOPLU İŞLEM YÖNETİCİLERİ ---
  // 1. Gönderi Seçimi Toggle
  const handleToggleSelectPost = (postId: string) => {
    setSelectedPostIds((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  };

  // 2. Tüm Gönderileri Seç / Kaldır
  const handleToggleSelectAllPosts = () => {
    if (filteredPosts.length > 0 && selectedPostIds.length === filteredPosts.length) {
      setSelectedPostIds([]);
    } else {
      setSelectedPostIds(filteredPosts.map((p) => p.id));
    }
  };

  // 3. Yalnızca Kısıtlanmış (Gölge) Gönderileri İşaretle
  const handleSelectOnlyShadowbannedPosts = () => {
    const shadowIds = filteredPosts.filter((p) => p.isShadowbanned).map((p) => p.id);
    setSelectedPostIds(shadowIds);
    if (shadowIds.length > 0) {
      showToast(`${shadowIds.length} adet kısıtlanmış fikir kutucuğu işaretlendi.`);
    } else {
      showToast("Kısıtlanmış herhangi bir fikir bulunmuyor.");
    }
  };

  // 4. İşaretlenen Gönderileri Toplu Sil
  const handleBulkDeletePosts = () => {
    if (selectedPostIds.length === 0) return;
    if (confirm(`İşaretlenen ${selectedPostIds.length} adet fikri kalıcı olarak silmek istediğinizden emin misiniz?`)) {
      let updated = posts;
      selectedPostIds.forEach((id) => {
        updated = adminDeletePost(id);
      });
      setPosts(updated);
      setSelectedPostIds([]);
      showToast(`${selectedPostIds.length} fikir kalıcı olarak silindi.`);
    }
  };

  // 5. İşaretlenen Kısıtlı Gönderileri Toplu Yayına Al
  const handleBulkUnshadowbanPosts = async () => {
    if (selectedPostIds.length === 0) return;
    try {
      for (const id of selectedPostIds) {
        await unshadowbanPost(id);
      }
      setPosts((prev) =>
        prev.map((p) => (selectedPostIds.includes(p.id) ? { ...p, isShadowbanned: false } : p))
      );
      setSelectedPostIds([]);
      showToast(`${selectedPostIds.length} fikir yayına alındı ve herkese görünür yapıldı.`);
    } catch {
      showToast("Toplu işlem sırasında hata oluştu.");
    }
  };

  // 6. TEK TIKLA TÜM KISITLANMIŞ GÖNDERİLERİ SİL
  const handleDeleteAllShadowbannedPosts = () => {
    const shadowList = posts.filter((p) => p.isShadowbanned);
    if (shadowList.length === 0) {
      showToast("Kısıtlanmış herhangi bir fikir bulunmuyor.");
      return;
    }
    if (confirm(`DİKKAT: Kısıtlanmış ${shadowList.length} adet spam/gölge fikrin HEPSİNİ tek tıkla kalıcı olarak silmek istiyor musunuz?`)) {
      let updated = posts;
      shadowList.forEach((p) => {
        updated = adminDeletePost(p.id);
      });
      setPosts(updated);
      setSelectedPostIds([]);
      showToast(`Kısıtlanmış ${shadowList.length} fikrin hepsi başarıyla silindi!`);
    }
  };

  // 7. Yorum Seçimi Toggle
  const handleToggleSelectComment = (commentKey: string) => {
    setSelectedCommentIds((prev) =>
      prev.includes(commentKey) ? prev.filter((id) => id !== commentKey) : [...prev, commentKey]
    );
  };

  // 8. Tüm Yorumları Seç / Kaldır
  const handleToggleSelectAllComments = () => {
    if (filteredComments.length > 0 && selectedCommentIds.length === filteredComments.length) {
      setSelectedCommentIds([]);
    } else {
      setSelectedCommentIds(filteredComments.map((c) => `${c.postId}:::${c.commentId}`));
    }
  };

  // 9. İşaretlenen Yorumları Toplu Sil
  const handleBulkDeleteComments = () => {
    if (selectedCommentIds.length === 0) return;
    if (confirm(`İşaretlenen ${selectedCommentIds.length} adet yorumu kalıcı olarak silmek istediğinizden emin misiniz?`)) {
      let updated = posts;
      selectedCommentIds.forEach((key) => {
        const [postId, commentId] = key.split(":::");
        if (postId && commentId) {
          updated = adminDeleteComment(postId, commentId);
        }
      });
      setPosts(updated);
      setSelectedCommentIds([]);
      showToast(`${selectedCommentIds.length} yorum silindi.`);
    }
  };

  // Banlama Açma
  const openBanModal = (userId: string, userName: string) => {
    setTargetBanUser({ id: userId, name: userName });
    setBanReasonInput("Topluluk kurallarını ihlal etme");
    setBanModalOpen(true);
  };

  // Ban Onay (Tekil Kullanıcı Engelleme)
  const handleConfirmBan = async () => {
    if (!targetBanUser) return;
    try {
      const reason = banReasonInput.trim() || "Topluluk kurallarını ihlal etme";
      const updated = await banUser(targetBanUser.id, targetBanUser.name, reason);
      setBannedUsers(updated);
      setFirestoreUsers((prev) =>
        prev.map((u) =>
          u.uid === targetBanUser.id
            ? { ...u, isBanned: true, banReason: reason, bannedAt: new Date().toISOString() }
            : u
        )
      );
      setBanModalOpen(false);
      showToast(`${targetBanUser.name} hesabı başarıyla engellendi.`);
    } catch (e) {
      console.error("Ban error:", e);
      showToast("Engelleme işlemi sırasında hata oluştu.");
    }
  };

  // Ban Kaldırma (Tekil Kullanıcı Engelini Kaldır)
  const handleUnban = async (userId: string, userName: string) => {
    if (confirm(`${userName} kullanıcısının engelini kaldırmak istiyor musunuz?`)) {
      try {
        const updated = await unbanUser(userId);
        setBannedUsers(updated);
        setFirestoreUsers((prev) =>
          prev.map((u) =>
            u.uid === userId
              ? { ...u, isBanned: false, banReason: "", bannedAt: undefined }
              : u
          )
        );
        showToast(`${userName} kullanıcısının engeli kaldırıldı.`);
      } catch (e) {
        console.error("Unban error:", e);
        showToast("Engel kaldırma sırasında hata oluştu.");
      }
    }
  };

  // --- KULLANICI TOPLU SEÇİM & ENGELLER ---
  const handleToggleSelectUser = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleToggleSelectAllUsers = () => {
    if (filteredUsers.length > 0 && selectedUserIds.length === filteredUsers.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(filteredUsers.map((u) => u.userId));
    }
  };

  const handleSelectOnlyActiveUsers = () => {
    const activeIds = filteredUsers.filter((u) => !u.isBanned).map((u) => u.userId);
    setSelectedUserIds(activeIds);
    if (activeIds.length > 0) {
      showToast(`${activeIds.length} aktif kullanıcı işaretlendi.`);
    } else {
      showToast("Aktif kullanıcı bulunamadı.");
    }
  };

  const handleSelectOnlyBannedUsers = () => {
    const bannedIds = filteredUsers.filter((u) => u.isBanned).map((u) => u.userId);
    setSelectedUserIds(bannedIds);
    if (bannedIds.length > 0) {
      showToast(`${bannedIds.length} engelli kullanıcı işaretlendi.`);
    } else {
      showToast("Engelli kullanıcı bulunamadı.");
    }
  };

  const handleBulkBanUsersConfirm = async () => {
    if (selectedUserIds.length === 0) return;
    try {
      const reason = bulkBanReason.trim() || "Topluluk kurallarını ihlal";
      const usersToBan = discoveredUsers
        .filter((u) => selectedUserIds.includes(u.userId))
        .map((u) => ({ id: u.userId, name: u.userName }));
      const updated = await bulkBanUsers(usersToBan, reason);
      setBannedUsers(updated);
      setFirestoreUsers((prev) =>
        prev.map((u) =>
          selectedUserIds.includes(u.uid)
            ? { ...u, isBanned: true, banReason: reason, bannedAt: new Date().toISOString() }
            : u
        )
      );
      setSelectedUserIds([]);
      setBulkBanModalOpen(false);
      showToast(`${usersToBan.length} kullanıcı başarıyla engellendi.`);
    } catch (e) {
      console.error(e);
      showToast("Toplu engelleme sırasında hata oluştu.");
    }
  };

  const handleBulkUnbanUsersConfirm = async () => {
    if (selectedUserIds.length === 0) return;
    if (confirm(`Seçilen ${selectedUserIds.length} kullanıcının engelini kaldırmak istediğinizden emin misiniz?`)) {
      try {
        const updated = await bulkUnbanUsers(selectedUserIds);
        setBannedUsers(updated);
        setFirestoreUsers((prev) =>
          prev.map((u) =>
            selectedUserIds.includes(u.uid)
              ? { ...u, isBanned: false, banReason: "", bannedAt: undefined }
              : u
          )
        );
        setSelectedUserIds([]);
        showToast(`${selectedUserIds.length} kullanıcının engeli kaldırıldı.`);
      } catch (e) {
        console.error(e);
        showToast("Toplu engel kaldırma sırasında hata oluştu.");
      }
    }
  };

  // Uyarı Açma
  const openWarnModal = (userId: string, userName: string) => {
    setTargetWarnUser({ id: userId, name: userName });
    setWarnMessageInput("Lütfen paylaşımlarınızda saygılı ve empatik bir dil kullanmaya özen gösteriniz.");
    setWarnModalOpen(true);
  };

  // Uyarı Onay
  const handleConfirmWarn = async () => {
    if (!targetWarnUser) return;
    try {
      const updated = await sendUserWarning(targetWarnUser.id, targetWarnUser.name, warnMessageInput);
      setWarnings(updated);
      setWarnModalOpen(false);
      showToast(`${targetWarnUser.name} kullanıcısına uyarı iletildi.`);
    } catch (e) {
      console.error(e);
    }
  };

  // Uyarı Silme
  const handleDeleteWarn = async (warnId: string) => {
    if (confirm("Bu uyarıyı kaldırmak istiyor musunuz?")) {
      try {
        const updated = await deleteUserWarning(warnId);
        setWarnings(updated);
        showToast("Uyarı kaldırıldı.");
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Şifre Güncelleme
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeMsg(null);
    if (!newPasswordInput || newPasswordInput.trim().length < 4) {
      setPasswordChangeMsg({ type: "error", text: "Şifre en az 4 karakter olmalıdır." });
      return;
    }
    if (newPasswordInput !== newPasswordConfirm) {
      setPasswordChangeMsg({ type: "error", text: "Girilen şifreler birbiriyle eşleşmiyor!" });
      return;
    }

    setPasswordChangeLoading(true);
    try {
      await changeAdminPassword(newPasswordInput);
      setPasswordChangeMsg({ type: "success", text: "Admin şifresi başarıyla Firebase'e güncellendi!" });
      setNewPasswordInput("");
      setNewPasswordConfirm("");
      showToast("Şifre başarıyla güncellendi.");
    } catch (err: any) {
      setPasswordChangeMsg({ type: "error", text: "Hata: " + (err.message || "Şifre güncellenemedi.") });
    } finally {
      setPasswordChangeLoading(false);
    }
  };

  // Kullanıcı Listesi Çıkarımı
  const discoveredUsers = useMemo(() => {
    const map = new Map<string, AdminModerationUser>();

    // 1. Cloud Firestore'daki Kayıtlı Kullanıcılar
    firestoreUsers.forEach((u) => {
      map.set(u.uid, {
        userId: u.uid,
        userName: u.displayName || (u.isAnonymous ? "Misafir Düşünür" : "PsikoWay Üyesi"),
        email: u.email || "",
        photoURL: u.photoURL || "",
        profession: u.profession || (u.isAnonymous ? "Misafir Okuyucu" : "Düşünce Kaşifi"),
        bio: u.bio || "",
        createdAt: u.createdAt || "",
        isAnonymous: Boolean(u.isAnonymous),
        role: u.role || (u.uid === "seed-user-admin" ? "admin" : "member"),
        isBanned: Boolean(u.isBanned),
        banReason: u.banReason || "",
        bannedAt: u.bannedAt || "",
        bannedBy: u.bannedBy || "",
        warningsCount: 0,
        postsCount: 0,
        commentsCount: 0,
      });
    });

    // 2. Postlardan
    posts.forEach((p) => {
      const existing = map.get(p.authorId) || {
        userId: p.authorId,
        userName: p.authorName || "PsikoWay Düşünürü",
        photoURL: p.authorAvatar || "",
        profession: p.authorProfession || "",
        isAnonymous: Boolean(p.isAnonymous),
        isBanned: false,
        warningsCount: 0,
        postsCount: 0,
        commentsCount: 0,
      };
      existing.postsCount += 1;
      map.set(p.authorId, existing);
    });

    // 3. Yorumlardan
    posts.forEach((p) => {
      p.comments.forEach((c) => {
        const existing = map.get(c.authorId) || {
          userId: c.authorId,
          userName: c.authorName || "PsikoWay Düşünürü",
          photoURL: c.authorAvatar || "",
          profession: c.authorProfession || "",
          isAnonymous: Boolean(c.isAnonymous),
          isBanned: false,
          warningsCount: 0,
          postsCount: 0,
          commentsCount: 0,
        };
        existing.commentsCount += 1;
        map.set(c.authorId, existing);
      });
    });

    // 4. Ban durumlarını ve uyarı sayılarını ekle
    bannedUsers.forEach((b) => {
      const existing = map.get(b.userId) || {
        userId: b.userId,
        userName: b.userName || "Yasaklı Kullanıcı",
        isBanned: true,
        banReason: b.reason,
        bannedAt: b.bannedAt,
        bannedBy: b.bannedBy || "Admin",
        warningsCount: 0,
        postsCount: 0,
        commentsCount: 0,
      };
      existing.isBanned = true;
      existing.banReason = b.reason;
      existing.bannedAt = b.bannedAt;
      existing.bannedBy = b.bannedBy || "Admin";
      map.set(b.userId, existing);
    });

    warnings.forEach((w) => {
      const existing = map.get(w.userId);
      if (existing) {
        existing.warningsCount += 1;
      }
    });

    return Array.from(map.values());
  }, [firestoreUsers, posts, bannedUsers, warnings]);

  // Kullanıcı Sayaçları
  const activeUsersCount = useMemo(() => discoveredUsers.filter((u) => !u.isBanned).length, [discoveredUsers]);
  const bannedUsersCount = useMemo(() => discoveredUsers.filter((u) => u.isBanned).length, [discoveredUsers]);
  const registeredUsersCount = useMemo(() => discoveredUsers.filter((u) => !u.isAnonymous && u.email).length, [discoveredUsers]);
  const guestUsersCount = useMemo(() => discoveredUsers.filter((u) => u.isAnonymous || !u.email).length, [discoveredUsers]);

  // Toplam Yorum Sayısı
  const totalCommentsCount = useMemo(() => {
    return posts.reduce((acc, p) => acc + p.comments.length, 0);
  }, [posts]);

  // Tüm Yorumlar Listesi
  const allComments = useMemo(() => {
    const list: Array<{
      postId: string;
      postTitle: string;
      commentId: string;
      authorId: string;
      authorName: string;
      content: string;
      createdAt: string;
      isShadowbanned?: boolean;
    }> = [];

    posts.forEach((p) => {
      p.comments.forEach((c) => {
        list.push({
          postId: p.id,
          postTitle: p.title,
          commentId: c.id,
          authorId: c.authorId,
          authorName: c.authorName,
          content: c.content,
          createdAt: c.createdAt,
          isShadowbanned: c.isShadowbanned,
        });
      });
    });

    return list;
  }, [posts]);

  // Filtrelenmiş Postlar
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts;
    const q = searchQuery.toLowerCase();
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        p.authorName.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [posts, searchQuery]);

  // Filtrelenmiş Yorumlar
  const filteredComments = useMemo(() => {
    if (!searchQuery.trim()) return allComments;
    const q = searchQuery.toLowerCase();
    return allComments.filter(
      (c) =>
        c.content.toLowerCase().includes(q) ||
        c.authorName.toLowerCase().includes(q) ||
        c.postTitle.toLowerCase().includes(q)
    );
  }, [allComments, searchQuery]);

  // Filtrelenmiş Kullanıcılar
  const filteredUsers = useMemo(() => {
    let list = discoveredUsers;

    if (userStatusFilter === "active") {
      list = list.filter((u) => !u.isBanned);
    } else if (userStatusFilter === "banned") {
      list = list.filter((u) => u.isBanned);
    } else if (userStatusFilter === "registered") {
      list = list.filter((u) => !u.isAnonymous && u.email);
    } else if (userStatusFilter === "guest") {
      list = list.filter((u) => u.isAnonymous || !u.email);
    }

    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (u) =>
        u.userName.toLowerCase().includes(q) ||
        u.userId.toLowerCase().includes(q) ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.profession && u.profession.toLowerCase().includes(q)) ||
        (u.banReason && u.banReason.toLowerCase().includes(q))
    );
  }, [discoveredUsers, userStatusFilter, searchQuery]);

  // Filtrelenmiş İletişim / Randevu Mesajları (Firebase)
  const filteredMessages = useMemo(() => {
    if (!searchQuery.trim()) return contactMessages;
    const q = searchQuery.toLowerCase();
    return contactMessages.filter(
      (m) =>
        m.fullName.toLowerCase().includes(q) ||
        m.phone.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.serviceType.toLowerCase().includes(q) ||
        (m.message && m.message.toLowerCase().includes(q))
    );
  }, [contactMessages, searchQuery]);

  // Filtrelenmiş Bot & Gölge Erişim Sınırı Bildirimleri
  const filteredAlerts = useMemo(() => {
    if (!searchQuery.trim()) return securityAlerts;
    const q = searchQuery.toLowerCase();
    return securityAlerts.filter(
      (a) =>
        a.userName.toLowerCase().includes(q) ||
        a.reason.toLowerCase().includes(q) ||
        a.contentSnippet.toLowerCase().includes(q) ||
        (a.postTitle && a.postTitle.toLowerCase().includes(q)) ||
        (a.clientFingerprint && a.clientFingerprint.toLowerCase().includes(q)) ||
        a.userId.toLowerCase().includes(q)
    );
  }, [securityAlerts, searchQuery]);


  // -------------------------------------------------------------
  // EĞER GİRİŞ YAPILMAMIŞSA: KİLİT / ŞİFRE EKRANI
  // -------------------------------------------------------------
  if (!isAuth) {
    return (
      <div className="page-wrapper admin-login-wrapper">
        <BackgroundVideo />

        <div className="admin-login-container">
          <Link href="/" className="nav-logo" style={{ marginBottom: "20px" }}>
            <Image
              src="/logo.png"
              alt="PsikoWay Logo"
              width={60}
              height={60}
              priority
              className="nav-logo-img"
            />
          </Link>

          <div className="admin-lock-card animate-scale">
            <div className="lock-icon-badge">
              <Lock size={26} />
            </div>

            <h2>PsikoWay Yönetici Paneli</h2>
            <p>Moderasyon ve yönetim paneline erişmek için güvenlik şifresini giriniz.</p>

            {authError && (
              <div className="admin-error-box animate-fade-down">
                <AlertTriangle size={16} />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="admin-login-form">
              <div className="form-group" style={{ position: "relative" }}>
                <label htmlFor="admin-pass">Güvenlik Şifresi</label>
                <div className="password-input-wrapper">
                  <input
                    id="admin-pass"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Şifreyi giriniz..."
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="form-control admin-password-field"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="toggle-eye-btn"
                    aria-label="Şifreyi Göster"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="btn-primary-solid btn-admin-submit w-100"
              >
                {authLoading ? (
                  <span>Doğrulanıyor...</span>
                ) : (
                  <>
                    <Unlock size={18} />
                    <span>Yönetici Girişi Yap</span>
                  </>
                )}
              </button>
            </form>

            <div className="admin-login-hint">
              <Database size={14} style={{ color: "#e0b878" }} />
              <span>Şifre Firebase üzerinden doğrulanır. (Varsayılan: <strong>12345678</strong>)</span>
            </div>

            <div style={{ marginTop: "20px" }}>
              <Link href="/forum" className="back-link">
                ← Foruma Geri Dön
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // GİRİŞ YAPILMIŞ: YÖNETİCİ KONTROL PANELİ
  // -------------------------------------------------------------
  return (
    <div className="page-wrapper admin-dashboard-wrapper">
      <BackgroundVideo />

      {/* Toast */}
      {toast && (
        <div className="forum-toast animate-fade-down">
          <CheckCircle2 size={16} />
          <span>{toast}</span>
        </div>
      )}

      {/* Admin Başlık Çubuğu */}
      <header className="admin-navbar-glass">
        <div className="admin-nav-left">
          <Link href="/" className="nav-logo">
            <Image
              src="/logo.png"
              alt="PsikoWay Logo"
              width={44}
              height={44}
              priority
              className="nav-logo-img"
            />
          </Link>
          <div className="admin-brand-text">
            <span className="admin-brand-title">PsikoWay Yönetim & Moderasyon Paneli</span>
            <span className="admin-badge-live">
              <ShieldCheck size={13} />
              Yetkili Oturumu (Firebase Aktif)
            </span>
          </div>
        </div>

        <div className="admin-nav-right">
          <Link href="/forum" className="btn-white-outline btn-sm" target="_blank">
            <MessageSquareQuote size={15} />
            <span>Forumu Aç</span>
          </Link>
          <button
            type="button"
            onClick={loadAllData}
            className="btn-icon-glass"
            title="Verileri Yenile"
          >
            <RefreshCw size={16} />
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="btn-danger-outline btn-sm"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <LogOut size={15} />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </header>

      {/* Ana Yönetim Alanı */}
      <main className="admin-main-content">
        <div className="content-container">
          
          {/* BOT / SPAM GÖLGE ERİŞİM SINIRI ACİL UYARI BANNERI */}
          {activeBotAlertsCount > 0 && (
            <div 
              className="admin-alert-banner animate-fade-down"
              style={{
                background: "linear-gradient(135deg, rgba(239, 68, 68, 0.22) 0%, rgba(20, 12, 12, 0.95) 100%)",
                border: "1.5px solid rgba(239, 68, 68, 0.6)",
                borderRadius: "16px",
                padding: "16px 22px",
                marginBottom: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "14px",
                flexWrap: "wrap",
                boxShadow: "0 10px 30px rgba(239, 68, 68, 0.2)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "rgba(239, 68, 68, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#f87171", flexShrink: 0 }}>
                  <ShieldAlert size={22} />
                </div>
                <div>
                  <strong style={{ color: "#ffffff", fontSize: "15px", display: "block" }}>
                    ⚠️ Dikkat: {activeBotAlertsCount} Kullanıcıya Bot / Spam Nedeniyle Gölge Erişim Sınırı Uygulandı!
                  </strong>
                  <span style={{ color: "rgba(255, 255, 255, 0.78)", fontSize: "13px" }}>
                    Dakikada 2 defadan fazla yazan hesapların mesajları engellendi; kendi ekranlarında görünüyor ancak insanlara gitmedi.
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab("bot-alerts")}
                className="btn-primary-solid btn-sm"
                style={{ background: "#ef4444", borderColor: "#ef4444", display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                <span>Bildirimleri İncele ({activeBotAlertsCount})</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}

          {/* İstatistik Özet Kartları */}
          <div className="admin-stats-grid animate-fade-down">
            <div className="admin-stat-card">
              <div className="stat-card-icon" style={{ background: "rgba(224, 184, 120, 0.15)", color: "#e0b878" }}>
                <MessageSquareQuote size={24} />
              </div>
              <div className="stat-card-details">
                <span className="stat-title">Toplam Fikir / Gönderi</span>
                <span className="stat-val">{posts.length}</span>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="stat-card-icon" style={{ background: "rgba(99, 102, 241, 0.15)", color: "#818cf8" }}>
                <MessageCircle size={24} />
              </div>
              <div className="stat-card-details">
                <span className="stat-title">Toplam Yorum</span>
                <span className="stat-val">{totalCommentsCount}</span>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="stat-card-icon" style={{ background: "rgba(239, 68, 68, 0.15)", color: "#f87171" }}>
                <Ban size={24} />
              </div>
              <div className="stat-card-details">
                <span className="stat-title">Yasaklı (Banlı) Hesap</span>
                <span className="stat-val">{bannedUsers.length}</span>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="stat-card-icon" style={{ background: "rgba(245, 158, 11, 0.15)", color: "#fbbf24" }}>
                <AlertTriangle size={24} />
              </div>
              <div className="stat-card-details">
                <span className="stat-title">Aktif Uyarılar</span>
                <span className="stat-val">{warnings.length}</span>
              </div>
            </div>

            <div 
              className="admin-stat-card"
              onClick={() => setActiveTab("bot-alerts")}
              style={{
                cursor: "pointer",
                borderColor: activeBotAlertsCount > 0 ? "rgba(239, 68, 68, 0.6)" : undefined,
                background: activeBotAlertsCount > 0 ? "rgba(239, 68, 68, 0.12)" : undefined
              }}
            >
              <div className="stat-card-icon" style={{ background: "rgba(239, 68, 68, 0.2)", color: "#f87171" }}>
                <ShieldAlert size={24} />
              </div>
              <div className="stat-card-details">
                <span className="stat-title">Bot / Gölge Sınır</span>
                <span className="stat-val" style={{ color: activeBotAlertsCount > 0 ? "#f87171" : "#ffffff" }}>
                  {securityAlerts.length}
                </span>
              </div>
            </div>
          </div>

          {/* Sekme Butonları & Arama Barı */}
          <div className="admin-toolbar animate-fade-down delay-1">
            <div className="admin-tabs-list">
              <button
                type="button"
                onClick={() => setActiveTab("posts")}
                className={`admin-tab-btn ${activeTab === "posts" ? "active" : ""}`}
              >
                <MessageSquareQuote size={16} />
                <span>Gönderiler & Fikirler ({posts.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("comments")}
                className={`admin-tab-btn ${activeTab === "comments" ? "active" : ""}`}
              >
                <MessageCircle size={16} />
                <span>Yorumlar ({totalCommentsCount})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("users")}
                className={`admin-tab-btn ${activeTab === "users" ? "active" : ""}`}
              >
                <Users size={16} />
                <span>Kullanıcılar ({discoveredUsers.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("messages")}
                className={`admin-tab-btn ${activeTab === "messages" ? "active" : ""}`}
              >
                <Mail size={16} />
                <span>Gelen Mesajlar & Randevular ({contactMessages.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("bot-alerts")}
                className={`admin-tab-btn ${activeTab === "bot-alerts" ? "active" : ""}`}
                style={activeBotAlertsCount > 0 ? { border: "1px solid rgba(239, 68, 68, 0.6)", color: "#f87171" } : undefined}
              >
                <ShieldAlert size={16} />
                <span>Bot Bildirimleri ({securityAlerts.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("security")}
                className={`admin-tab-btn ${activeTab === "security" ? "active" : ""}`}
              >
                <KeyRound size={16} />
                <span>Güvenlik & Şifre</span>
              </button>
            </div>

            {activeTab !== "security" && (
              <div className="admin-search-box">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="İçerik, yazar veya kullanıcı ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="admin-search-input"
                />
                {searchQuery && (
                  <button type="button" onClick={() => setSearchQuery("")} className="clear-btn">
                    <X size={14} />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* ============================================================ */}
          {/* SEKME 1: GÖNDERİLER & FİKİRLER */}
          {/* ============================================================ */}
          {activeTab === "posts" && (
            <div className="admin-section animate-fade-up">

              {/* TOPLU İŞLEM & KISITLANMIŞLARI SİLME KONTROL BARI */}
              <div 
                className="admin-bulk-toolbar animate-fade-down"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "12px",
                  marginBottom: "16px",
                  padding: "14px 20px",
                  background: "rgba(22, 26, 38, 0.75)",
                  border: "1px solid rgba(224, 184, 120, 0.25)",
                  borderRadius: "14px",
                  backdropFilter: "blur(16px)",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.25)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={handleSelectOnlyShadowbannedPosts}
                    className="btn-white-outline btn-sm"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      borderColor: shadowbannedPosts.length > 0 ? "rgba(239, 68, 68, 0.5)" : "rgba(255, 255, 255, 0.15)",
                      color: shadowbannedPosts.length > 0 ? "#fca5a5" : "#e2e8f0",
                      background: shadowbannedPosts.length > 0 ? "rgba(239, 68, 68, 0.12)" : "rgba(255, 255, 255, 0.04)"
                    }}
                    title="Yalnızca kısıtlanmış fikirlerin kutucuklarını işaretle"
                  >
                    <ShieldAlert size={14} color="#f87171" />
                    <span>Kısıtlananları İşaretle ({shadowbannedPosts.length})</span>
                  </button>

                  {shadowbannedPosts.length > 0 && (
                    <button
                      type="button"
                      onClick={handleDeleteAllShadowbannedPosts}
                      className="btn-primary-solid btn-sm"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        background: "#ef4444",
                        borderColor: "#dc2626",
                        color: "#fff",
                        fontWeight: 700
                      }}
                      title="Kısıtlanmış fikirlerin hepsini tek tıkla sil"
                    >
                      <Trash2 size={14} />
                      <span>Tüm Kısıtlananları Tek Tıkla Sil ({shadowbannedPosts.length})</span>
                    </button>
                  )}
                </div>

                {selectedPostIds.length > 0 && (
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "13px", color: "#f1f5f9", display: "inline-flex", alignItems: "center", gap: "6px", fontWeight: 600 }}>
                      <CheckCircle2 size={16} color="#10b981" />
                      <strong>{selectedPostIds.length}</strong> fikir işaretlendi
                    </span>

                    <button
                      type="button"
                      onClick={handleBulkUnshadowbanPosts}
                      className="btn-white-outline btn-sm"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        color: "#4ade80",
                        borderColor: "rgba(74, 222, 128, 0.4)",
                        background: "rgba(74, 222, 128, 0.12)"
                      }}
                      title="İşaretlenen kısıtlı fikirleri yayına al"
                    >
                      <Check size={14} />
                      <span>Seçilenleri Yayına Al</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleBulkDeletePosts}
                      className="btn-danger-solid btn-sm"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        background: "#dc2626",
                        borderColor: "#b91c1c",
                        color: "#fff",
                        fontWeight: 600
                      }}
                      title="İşaretlenen fikirleri kalıcı olarak sil"
                    >
                      <Trash2 size={14} />
                      <span>Seçilenleri Sil ({selectedPostIds.length})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedPostIds([])}
                      className="btn-white-outline btn-sm"
                      style={{ fontSize: "12px", padding: "4px 10px" }}
                    >
                      İptal
                    </button>
                  </div>
                )}
              </div>

              <div className="admin-table-container">
                {filteredPosts.length === 0 ? (
                  <div className="admin-empty">Aramanıza uygun gönderi bulunamadı.</div>
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th style={{ width: "42px", textAlign: "center" }}>
                          <input
                            type="checkbox"
                            style={{ width: "17px", height: "17px", accentColor: "#e0b878", cursor: "pointer" }}
                            checked={filteredPosts.length > 0 && selectedPostIds.length === filteredPosts.length}
                            onChange={handleToggleSelectAllPosts}
                            title="Tümünü Seç / Seçimi Kaldır"
                          />
                        </th>
                        <th>Başlık & Detay</th>
                        <th>Yazar</th>
                        <th>Kategori</th>
                        <th>Tarih</th>
                        <th>Etkileşim</th>
                        <th style={{ textAlign: "right" }}>İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPosts.map((post, pIdx) => (
                        <tr 
                          key={post.id || `post-${pIdx}`}
                          style={selectedPostIds.includes(post.id) ? { background: "rgba(224, 184, 120, 0.08)" } : undefined}
                        >
                          <td style={{ textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              style={{ width: "17px", height: "17px", accentColor: "#e0b878", cursor: "pointer" }}
                              checked={selectedPostIds.includes(post.id)}
                              onChange={() => handleToggleSelectPost(post.id)}
                            />
                          </td>
                          <td style={{ maxWidth: "340px" }}>
                            <div className="table-post-title">{post.title}</div>
                            <div className="table-post-excerpt">
                              {post.content.slice(0, 100)}...
                            </div>
                            <div className="table-tags">
                              {post.tags.map((t, tIdx) => (
                                <span key={`${post.id || pIdx}-tag-${t}-${tIdx}`} className="table-tag-pill">
                                  #{t}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td>
                            <div className="table-user-name" style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                              <span>{post.isAnonymous ? "Anonim Düşünür" : post.authorName}</span>
                              {post.isShadowbanned && (
                                <span style={{ fontSize: "10.5px", background: "rgba(239, 68, 68, 0.2)", color: "#f87171", border: "1px solid rgba(239, 68, 68, 0.4)", padding: "2px 6px", borderRadius: "4px", fontWeight: 700 }}>
                                  👻 Gölge Kısıtlı
                                </span>
                              )}
                            </div>
                            <div className="table-user-id">ID: {post.authorId.slice(0, 8)}...</div>
                          </td>
                          <td>
                            <span className="table-cat-badge">{post.category}</span>
                          </td>
                          <td className="table-date">
                            {new Date(post.createdAt).toLocaleDateString("tr-TR", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                          <td>
                            <div className="table-stats-pill">
                              <span>❤️ {post.likes.length}</span>
                              <span>💬 {post.comments.length}</span>
                            </div>
                          </td>
                          <td>
                            <div className="table-actions-cell">
                              {post.isShadowbanned && (
                                <button
                                  type="button"
                                  onClick={() => handleUnshadowbanSinglePost(post.id, post.title)}
                                  className="btn-action-warn"
                                  style={{ color: "#4ade80", borderColor: "rgba(74, 222, 128, 0.4)", background: "rgba(74, 222, 128, 0.12)" }}
                                  title="Gölge Kısıtlamasını Kaldır ve Herkese Görünür Yap"
                                >
                                  <CheckCircle2 size={15} />
                                  <span>Yayına Al</span>
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => openWarnModal(post.authorId, post.authorName)}
                                className="btn-action-warn"
                                title="Yazara Uyarı Gönder"
                              >
                                <AlertTriangle size={15} />
                                <span>Uyar</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => openBanModal(post.authorId, post.authorName)}
                                className="btn-action-ban"
                                title="Yazarı Banla"
                              >
                                <Ban size={15} />
                                <span>Banla</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeletePost(post.id, post.title)}
                                className="btn-action-delete"
                                title="Fikri Kalıcı Olarak Sil"
                              >
                                <Trash2 size={15} />
                                <span>Sil</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* SEKME 2: YORUMLAR */}
          {/* ============================================================ */}
          {activeTab === "comments" && (
            <div className="admin-section animate-fade-up">

              {selectedCommentIds.length > 0 && (
                <div 
                  className="admin-bulk-toolbar animate-fade-down"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "12px",
                    marginBottom: "16px",
                    padding: "12px 20px",
                    background: "rgba(22, 26, 38, 0.75)",
                    border: "1px solid rgba(224, 184, 120, 0.25)",
                    borderRadius: "14px",
                    backdropFilter: "blur(16px)"
                  }}
                >
                  <span style={{ fontSize: "13px", color: "#f1f5f9", display: "inline-flex", alignItems: "center", gap: "6px", fontWeight: 600 }}>
                    <CheckCircle2 size={16} color="#10b981" />
                    <strong>{selectedCommentIds.length}</strong> yorum işaretlendi
                  </span>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <button
                      type="button"
                      onClick={handleBulkDeleteComments}
                      className="btn-danger-solid btn-sm"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        background: "#dc2626",
                        borderColor: "#b91c1c",
                        color: "#fff",
                        fontWeight: 600
                      }}
                      title="İşaretlenen yorumları kalıcı olarak sil"
                    >
                      <Trash2 size={14} />
                      <span>Seçilenleri Sil ({selectedCommentIds.length})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedCommentIds([])}
                      className="btn-white-outline btn-sm"
                      style={{ fontSize: "12px", padding: "4px 10px" }}
                    >
                      İptal
                    </button>
                  </div>
                </div>
              )}

              <div className="admin-table-container">
                {filteredComments.length === 0 ? (
                  <div className="admin-empty">Aramanıza uygun yorum bulunamadı.</div>
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th style={{ width: "42px", textAlign: "center" }}>
                          <input
                            type="checkbox"
                            style={{ width: "17px", height: "17px", accentColor: "#e0b878", cursor: "pointer" }}
                            checked={filteredComments.length > 0 && selectedCommentIds.length === filteredComments.length}
                            onChange={handleToggleSelectAllComments}
                            title="Tüm Yorumları Seç / Kaldır"
                          />
                        </th>
                        <th>Yorum İçeriği</th>
                        <th>Hangi Fikirde</th>
                        <th>Yazar</th>
                        <th>Tarih</th>
                        <th style={{ textAlign: "right" }}>İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredComments.map((comm, cIdx) => {
                        const commentKey = `${comm.postId}:::${comm.commentId}`;
                        const isSelected = selectedCommentIds.includes(commentKey);
                        return (
                          <tr 
                            key={comm.commentId || `comm-${cIdx}`}
                            style={isSelected ? { background: "rgba(224, 184, 120, 0.08)" } : undefined}
                          >
                            <td style={{ textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
                              <input
                                type="checkbox"
                                style={{ width: "17px", height: "17px", accentColor: "#e0b878", cursor: "pointer" }}
                                checked={isSelected}
                                onChange={() => handleToggleSelectComment(commentKey)}
                              />
                            </td>
                            <td style={{ maxWidth: "360px" }}>
                              <div className="table-comment-text">{comm.content}</div>
                            </td>
                            <td style={{ maxWidth: "200px" }}>
                              <div className="table-parent-post">{comm.postTitle}</div>
                            </td>
                            <td>
                              <div className="table-user-name" style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                                <span>{comm.authorName}</span>
                                {comm.isShadowbanned && (
                                  <span style={{ fontSize: "10.5px", background: "rgba(239, 68, 68, 0.2)", color: "#f87171", border: "1px solid rgba(239, 68, 68, 0.4)", padding: "2px 6px", borderRadius: "4px", fontWeight: 700 }}>
                                    👻 Gölge Kısıtlı
                                  </span>
                                )}
                              </div>
                              <div className="table-user-id">ID: {comm.authorId.slice(0, 8)}...</div>
                            </td>
                            <td className="table-date">
                              {new Date(comm.createdAt).toLocaleDateString("tr-TR", {
                                day: "numeric",
                                month: "short",
                              })}
                            </td>
                            <td>
                              <div className="table-actions-cell">
                                <button
                                  type="button"
                                  onClick={() => openWarnModal(comm.authorId, comm.authorName)}
                                  className="btn-action-warn"
                                  title="Yorum Sahibini Uyar"
                                >
                                  <AlertTriangle size={15} />
                                  <span>Uyar</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => openBanModal(comm.authorId, comm.authorName)}
                                  className="btn-action-ban"
                                  title="Yorum Sahibini Banla"
                                >
                                  <Ban size={15} />
                                  <span>Banla</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteComment(comm.postId, comm.commentId)}
                                  className="btn-action-delete"
                                  title="Yorumu Sil"
                                >
                                  <Trash2 size={15} />
                                  <span>Sil</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* SEKME 3: KULLANICILAR & MODERASYON */}
          {/* ============================================================ */}
          {activeTab === "users" && (
            <div className="admin-section animate-fade-up">

              {/* Firestore Kullanıcıları & Veritabanı Bilgi Bannerı */}
              <div
                className="admin-card"
                style={{
                  marginBottom: "16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "14px",
                  border: "1px solid rgba(52, 211, 153, 0.3)",
                  background: "linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(30, 41, 59, 0.5) 100%)",
                }}
              >
                <div>
                  <h4 style={{ color: "#34d399", display: "flex", alignItems: "center", gap: "8px", margin: 0, fontSize: "15.5px", fontWeight: 700 }}>
                    <Database size={18} /> Cloud Firestore Kullanıcı Veritabanı
                  </h4>
                  <p style={{ color: "rgba(255,255,255,0.78)", fontSize: "13px", margin: "4px 0 0" }}>
                    Tüm sistem profilleri ve yetkileri Cloud Firestore üzerinde canlı senkronizedir ({discoveredUsers.length} toplam kullanıcı). İstenen kullanıcı dilediğiniz an tek tıkla engellenebilir veya engeli kaldırılabilir.
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={loadAllData}
                    className="btn-white-outline btn-sm"
                    style={{ fontSize: "12.5px" }}
                    title="Kullanıcıları Yeniden Yükle"
                  >
                    <RefreshCw size={13} />
                    <span>Listeyi Yenile</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleMigrateUsers}
                    disabled={migratingUsers}
                    className="btn-primary"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 16px",
                      fontSize: "12.5px",
                      fontWeight: 600,
                      borderRadius: "8px",
                      cursor: migratingUsers ? "not-allowed" : "pointer",
                    }}
                    title="Cloud Firestore kullanıcılarını senkronize eder"
                  >
                    <RefreshCw size={13} className={migratingUsers ? "animate-spin" : ""} />
                    {migratingUsers ? "Senkronize Ediliyor..." : "Firestore Senkronizasyonu"}
                  </button>
                </div>
              </div>

              {/* KULLANICI İSTATİSTİK ÖZET ROZETLERİ */}
              <div 
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
                  gap: "12px",
                  marginBottom: "16px"
                }}
              >
                <div 
                  onClick={() => setUserStatusFilter("all")}
                  style={{
                    cursor: "pointer",
                    padding: "12px 16px",
                    background: userStatusFilter === "all" ? "rgba(224, 184, 120, 0.16)" : "rgba(255, 255, 255, 0.03)",
                    border: userStatusFilter === "all" ? "1.5px solid #e0b878" : "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "12px",
                    transition: "all 0.2s ease"
                  }}
                >
                  <div style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.65)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span>Toplam Kullanıcı</span>
                    <Users size={14} color="#e0b878" />
                  </div>
                  <strong style={{ fontSize: "20px", color: "#ffffff", display: "block", marginTop: "4px" }}>
                    {discoveredUsers.length}
                  </strong>
                </div>

                <div 
                  onClick={() => setUserStatusFilter("active")}
                  style={{
                    cursor: "pointer",
                    padding: "12px 16px",
                    background: userStatusFilter === "active" ? "rgba(52, 211, 153, 0.16)" : "rgba(255, 255, 255, 0.03)",
                    border: userStatusFilter === "active" ? "1.5px solid #34d399" : "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "12px",
                    transition: "all 0.2s ease"
                  }}
                >
                  <div style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.65)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span>Aktif Üyeler</span>
                    <UserCheck size={14} color="#34d399" />
                  </div>
                  <strong style={{ fontSize: "20px", color: "#34d399", display: "block", marginTop: "4px" }}>
                    {activeUsersCount}
                  </strong>
                </div>

                <div 
                  onClick={() => setUserStatusFilter("banned")}
                  style={{
                    cursor: "pointer",
                    padding: "12px 16px",
                    background: userStatusFilter === "banned" ? "rgba(239, 68, 68, 0.18)" : "rgba(255, 255, 255, 0.03)",
                    border: userStatusFilter === "banned" ? "1.5px solid #ef4444" : "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "12px",
                    transition: "all 0.2s ease"
                  }}
                >
                  <div style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.65)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span>Engellenenler (Banlı)</span>
                    <Ban size={14} color="#f87171" />
                  </div>
                  <strong style={{ fontSize: "20px", color: "#f87171", display: "block", marginTop: "4px" }}>
                    {bannedUsersCount}
                  </strong>
                </div>

                <div 
                  onClick={() => setUserStatusFilter("registered")}
                  style={{
                    cursor: "pointer",
                    padding: "12px 16px",
                    background: userStatusFilter === "registered" ? "rgba(99, 102, 241, 0.16)" : "rgba(255, 255, 255, 0.03)",
                    border: userStatusFilter === "registered" ? "1.5px solid #818cf8" : "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "12px",
                    transition: "all 0.2s ease"
                  }}
                >
                  <div style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.65)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span>Kayıtlı E-Postalar</span>
                    <Mail size={14} color="#818cf8" />
                  </div>
                  <strong style={{ fontSize: "20px", color: "#818cf8", display: "block", marginTop: "4px" }}>
                    {registeredUsersCount}
                  </strong>
                </div>

                <div 
                  onClick={() => setUserStatusFilter("guest")}
                  style={{
                    cursor: "pointer",
                    padding: "12px 16px",
                    background: userStatusFilter === "guest" ? "rgba(148, 163, 184, 0.16)" : "rgba(255, 255, 255, 0.03)",
                    border: userStatusFilter === "guest" ? "1.5px solid #94a3b8" : "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "12px",
                    transition: "all 0.2s ease"
                  }}
                >
                  <div style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.65)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span>Misafir / Anonim</span>
                    <User size={14} color="#94a3b8" />
                  </div>
                  <strong style={{ fontSize: "20px", color: "#cbd5e1", display: "block", marginTop: "4px" }}>
                    {guestUsersCount}
                  </strong>
                </div>
              </div>

              {/* TOPLU İŞLEM & KULLANICI SEÇİM KONTROL BARI */}
              <div 
                className="admin-bulk-toolbar animate-fade-down"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "12px",
                  marginBottom: "16px",
                  padding: "14px 20px",
                  background: "rgba(22, 26, 38, 0.8)",
                  border: "1px solid rgba(224, 184, 120, 0.25)",
                  borderRadius: "14px",
                  backdropFilter: "blur(16px)",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.25)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={handleToggleSelectAllUsers}
                    className="btn-white-outline btn-sm"
                    style={{ fontSize: "12px", padding: "6px 12px" }}
                  >
                    <span>{selectedUserIds.length === filteredUsers.length && filteredUsers.length > 0 ? "Seçimi Kaldır" : "Tümünü İşaretle"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSelectOnlyActiveUsers}
                    className="btn-white-outline btn-sm"
                    style={{ fontSize: "12px", padding: "6px 12px", color: "#34d399", borderColor: "rgba(52, 211, 153, 0.3)" }}
                  >
                    <Check size={13} />
                    <span>Aktifleri Seç ({activeUsersCount})</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSelectOnlyBannedUsers}
                    className="btn-white-outline btn-sm"
                    style={{ fontSize: "12px", padding: "6px 12px", color: "#f87171", borderColor: "rgba(239, 68, 68, 0.3)" }}
                  >
                    <Ban size={13} />
                    <span>Engellileri Seç ({bannedUsersCount})</span>
                  </button>
                </div>

                {selectedUserIds.length > 0 && (
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "13px", color: "#f1f5f9", display: "inline-flex", alignItems: "center", gap: "6px", fontWeight: 600 }}>
                      <CheckCircle2 size={16} color="#10b981" />
                      <strong>{selectedUserIds.length}</strong> kullanıcı seçildi
                    </span>

                    <button
                      type="button"
                      onClick={() => setBulkBanModalOpen(true)}
                      className="btn-primary-solid btn-sm"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        background: "#ef4444",
                        borderColor: "#dc2626",
                        color: "#fff",
                        fontWeight: 700
                      }}
                      title="İşaretlenen kullanıcıların erişimini engelle"
                    >
                      <Ban size={14} />
                      <span>Seçilenleri Engelle ({selectedUserIds.length})</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleBulkUnbanUsersConfirm}
                      className="btn-white-outline btn-sm"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        color: "#34d399",
                        borderColor: "rgba(52, 211, 153, 0.5)",
                        background: "rgba(52, 211, 153, 0.12)"
                      }}
                      title="İşaretlenen kullanıcıların engelini kaldır"
                    >
                      <Unlock size={14} />
                      <span>Engeli Kaldır ({selectedUserIds.length})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedUserIds([])}
                      className="btn-white-outline btn-sm"
                      style={{ fontSize: "12px", padding: "4px 10px" }}
                    >
                      İptal
                    </button>
                  </div>
                )}
              </div>

              {/* FİLTRE BUTONLARI */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "14px" }}>
                <span style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", gap: "4px", marginRight: "4px" }}>
                  <Filter size={13} /> Filtrele:
                </span>
                <button
                  type="button"
                  onClick={() => setUserStatusFilter("all")}
                  style={{
                    padding: "5px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    border: userStatusFilter === "all" ? "1px solid #e0b878" : "1px solid rgba(255,255,255,0.15)",
                    background: userStatusFilter === "all" ? "rgba(224, 184, 120, 0.2)" : "rgba(255,255,255,0.04)",
                    color: userStatusFilter === "all" ? "#e0b878" : "#fff"
                  }}
                >
                  Tümü ({discoveredUsers.length})
                </button>
                <button
                  type="button"
                  onClick={() => setUserStatusFilter("active")}
                  style={{
                    padding: "5px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    border: userStatusFilter === "active" ? "1px solid #34d399" : "1px solid rgba(255,255,255,0.15)",
                    background: userStatusFilter === "active" ? "rgba(52, 211, 153, 0.2)" : "rgba(255,255,255,0.04)",
                    color: userStatusFilter === "active" ? "#34d399" : "#fff"
                  }}
                >
                  Aktif ({activeUsersCount})
                </button>
                <button
                  type="button"
                  onClick={() => setUserStatusFilter("banned")}
                  style={{
                    padding: "5px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    border: userStatusFilter === "banned" ? "1px solid #ef4444" : "1px solid rgba(255,255,255,0.15)",
                    background: userStatusFilter === "banned" ? "rgba(239, 68, 68, 0.25)" : "rgba(255,255,255,0.04)",
                    color: userStatusFilter === "banned" ? "#fca5a5" : "#fff"
                  }}
                >
                  ⛔ Engellenenler ({bannedUsersCount})
                </button>
                <button
                  type="button"
                  onClick={() => setUserStatusFilter("registered")}
                  style={{
                    padding: "5px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    border: userStatusFilter === "registered" ? "1px solid #818cf8" : "1px solid rgba(255,255,255,0.15)",
                    background: userStatusFilter === "registered" ? "rgba(99, 102, 241, 0.2)" : "rgba(255,255,255,0.04)",
                    color: userStatusFilter === "registered" ? "#818cf8" : "#fff"
                  }}
                >
                  🌟 Kayıtlı Profiller ({registeredUsersCount})
                </button>
                <button
                  type="button"
                  onClick={() => setUserStatusFilter("guest")}
                  style={{
                    padding: "5px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    border: userStatusFilter === "guest" ? "1px solid #cbd5e1" : "1px solid rgba(255,255,255,0.15)",
                    background: userStatusFilter === "guest" ? "rgba(203, 213, 225, 0.2)" : "rgba(255,255,255,0.04)",
                    color: userStatusFilter === "guest" ? "#cbd5e1" : "#fff"
                  }}
                >
                  👤 Misafirler ({guestUsersCount})
                </button>
              </div>

              {/* Yasaklı Kullanıcılar Hızlı Kartı */}
              {bannedUsers.length > 0 && (
                <div className="admin-banned-alert-card" style={{ marginBottom: "16px" }}>
                  <div className="banned-card-header">
                    <ShieldAlert size={18} />
                    <h4>Yasaklanmış (Banlı) Hesaplar ({bannedUsers.length})</h4>
                  </div>

                  <div className="banned-users-tags">
                    {bannedUsers.map((b, bIdx) => (
                      <div key={b.userId || `ban-${bIdx}`} className="banned-user-pill">
                        <strong>{b.userName}</strong>
                        <span>({b.reason})</span>
                        <button
                          type="button"
                          onClick={() => handleUnban(b.userId, b.userName)}
                          className="btn-unban-pill"
                          title="Kullanıcının Engelini Kaldır"
                        >
                          Engeli Kaldır
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Kullanıcı Listesi Tablosu */}
              <div className="admin-table-container">
                {filteredUsers.length === 0 ? (
                  <div className="admin-empty" style={{ padding: "40px", textAlign: "center" }}>
                    <Users size={36} color="rgba(255,255,255,0.3)" style={{ margin: "0 auto 12px" }} />
                    <p style={{ margin: 0, fontSize: "15px", color: "rgba(255,255,255,0.8)" }}>
                      Seçilen filtreye veya arama kriterine uygun kullanıcı bulunamadı.
                    </p>
                  </div>
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th style={{ width: "42px", textAlign: "center" }}>
                          <input
                            type="checkbox"
                            style={{ width: "17px", height: "17px", accentColor: "#e0b878", cursor: "pointer" }}
                            checked={filteredUsers.length > 0 && selectedUserIds.length === filteredUsers.length}
                            onChange={handleToggleSelectAllUsers}
                            title="Tüm Kullanıcıları Seç / Kaldır"
                          />
                        </th>
                        <th>Kullanıcı & Hesap</th>
                        <th>Meslek & Katılım</th>
                        <th>Durum</th>
                        <th>Aktivite</th>
                        <th style={{ textAlign: "right" }}>Engelleme & Moderasyon</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((userItem, uIdx) => {
                        const isSelected = selectedUserIds.includes(userItem.userId);
                        return (
                          <tr 
                            key={userItem.userId || `user-${uIdx}`}
                            style={
                              isSelected 
                                ? { background: "rgba(224, 184, 120, 0.08)" } 
                                : userItem.isBanned 
                                ? { background: "rgba(239, 68, 68, 0.06)" } 
                                : undefined
                            }
                          >
                            <td style={{ textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
                              <input
                                type="checkbox"
                                style={{ width: "17px", height: "17px", accentColor: "#e0b878", cursor: "pointer" }}
                                checked={isSelected}
                                onChange={() => handleToggleSelectUser(userItem.userId)}
                              />
                            </td>
                            <td>
                              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                {userItem.photoURL ? (
                                  <img
                                    src={userItem.photoURL}
                                    alt={userItem.userName}
                                    style={{
                                      width: "38px",
                                      height: "38px",
                                      borderRadius: "50%",
                                      objectFit: "cover",
                                      border: "1.5px solid rgba(224, 184, 120, 0.4)",
                                      flexShrink: 0
                                    }}
                                  />
                                ) : (
                                  <div
                                    style={{
                                      width: "38px",
                                      height: "38px",
                                      borderRadius: "50%",
                                      background: userItem.isBanned ? "rgba(239, 68, 68, 0.25)" : "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
                                      color: userItem.isBanned ? "#f87171" : "#e0b878",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      fontSize: "15px",
                                      fontWeight: 700,
                                      border: "1px solid rgba(255,255,255,0.15)",
                                      flexShrink: 0
                                    }}
                                  >
                                    {userItem.userName.charAt(0).toUpperCase()}
                                  </div>
                                )}
                                <div>
                                  <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                                    <strong style={{ color: "#ffffff", fontSize: "14px" }}>
                                      {userItem.userName}
                                    </strong>
                                    {userItem.role === "admin" || userItem.userId === "seed-user-admin" ? (
                                      <span style={{ fontSize: "10px", background: "rgba(168, 85, 247, 0.2)", color: "#c084fc", border: "1px solid rgba(168, 85, 247, 0.5)", padding: "1px 6px", borderRadius: "10px", fontWeight: 700 }}>
                                        🛡️ Yönetici
                                      </span>
                                    ) : !userItem.isAnonymous && userItem.email ? (
                                      <span style={{ fontSize: "10px", background: "rgba(99, 102, 241, 0.15)", color: "#818cf8", border: "1px solid rgba(99, 102, 241, 0.4)", padding: "1px 6px", borderRadius: "10px", fontWeight: 600 }}>
                                        🌟 Kayıtlı
                                      </span>
                                    ) : (
                                      <span style={{ fontSize: "10px", background: "rgba(148, 163, 184, 0.15)", color: "#94a3b8", border: "1px solid rgba(148, 163, 184, 0.3)", padding: "1px 6px", borderRadius: "10px" }}>
                                        Misafir
                                      </span>
                                    )}
                                  </div>

                                  {userItem.email && (
                                    <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                                      <Mail size={11} color="#818cf8" />
                                      <span>{userItem.email}</span>
                                    </div>
                                  )}

                                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)", fontFamily: "monospace", display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                                    <span>ID: {userItem.userId.slice(0, 12)}...</span>
                                    <button
                                      type="button"
                                      onClick={() => copyUserId(userItem.userId)}
                                      style={{ background: "transparent", border: "none", color: copiedUserId === userItem.userId ? "#34d399" : "rgba(255,255,255,0.5)", cursor: "pointer", padding: "1px 3px" }}
                                      title="ID'yi Panoya Kopyala"
                                    >
                                      {copiedUserId === userItem.userId ? <Check size={11} /> : <Copy size={11} />}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td>
                              <div style={{ fontSize: "13px", color: "#e2e8f0", fontWeight: 500 }}>
                                {userItem.profession || "Düşünce Kaşifi"}
                              </div>
                              <div style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.5)", marginTop: "2px" }}>
                                {userItem.createdAt ? (
                                  <span>📅 {new Date(userItem.createdAt).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" })}</span>
                                ) : (
                                  <span>Topluluk Üyesi</span>
                                )}
                              </div>
                            </td>

                            <td>
                              {userItem.isBanned ? (
                                <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                                  <span 
                                    className="status-badge-banned"
                                    style={{
                                      background: "rgba(239, 68, 68, 0.22)",
                                      color: "#fca5a5",
                                      border: "1px solid rgba(239, 68, 68, 0.55)",
                                      padding: "3px 8px",
                                      borderRadius: "6px",
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: "5px",
                                      fontSize: "12px",
                                      fontWeight: 700,
                                      width: "fit-content"
                                    }}
                                  >
                                    <Ban size={12} /> Engellendi (Yasaklı)
                                  </span>
                                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.72)", maxWidth: "220px", lineHeight: "1.3" }}>
                                    {userItem.banReason || "Topluluk kurallarını ihlal"}
                                  </span>
                                  {userItem.bannedAt && (
                                    <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.45)" }}>
                                      {new Date(userItem.bannedAt).toLocaleDateString("tr-TR")}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <span className="status-badge-active" style={{ width: "fit-content" }}>
                                  <Check size={12} /> Aktif
                                </span>
                              )}
                            </td>

                            <td>
                              <div style={{ fontSize: "12.5px", color: "#f1f5f9" }}>
                                <strong>{userItem.postsCount}</strong> fikir &bull; <strong>{userItem.commentsCount}</strong> yorum
                              </div>
                              <div style={{ marginTop: "2px" }}>
                                {userItem.warningsCount > 0 ? (
                                  <span style={{ fontSize: "11px", color: "#fbbf24", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "3px" }}>
                                    <AlertTriangle size={11} />
                                    {userItem.warningsCount} uyarı
                                  </span>
                                ) : (
                                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>0 uyarı</span>
                                )}
                              </div>
                            </td>

                            <td>
                              <div className="table-actions-cell">
                                <button
                                  type="button"
                                  onClick={() => openWarnModal(userItem.userId, userItem.userName)}
                                  className="btn-action-warn"
                                  title="Kullanıcıya Uyarı Mesajı Gönder"
                                >
                                  <AlertTriangle size={14} />
                                  <span>Uyar</span>
                                </button>

                                {userItem.isBanned ? (
                                  <button
                                    type="button"
                                    onClick={() => handleUnban(userItem.userId, userItem.userName)}
                                    className="btn-action-unban"
                                    style={{
                                      background: "rgba(16, 185, 129, 0.18)",
                                      borderColor: "rgba(52, 211, 153, 0.6)",
                                      color: "#34d399",
                                      fontWeight: 700
                                    }}
                                    title="Kullanıcının forum engelini kaldır"
                                  >
                                    <Unlock size={14} />
                                    <span>Engeli Kaldır</span>
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => openBanModal(userItem.userId, userItem.userName)}
                                    className="btn-action-ban"
                                    style={{
                                      background: "#ef4444",
                                      borderColor: "#dc2626",
                                      color: "#ffffff",
                                      fontWeight: 700
                                    }}
                                    title="Kullanıcının foruma yazmasını ve etkileşimini engelle"
                                  >
                                    <Ban size={14} />
                                    <span>Engelle</span>
                                  </button>
                                )}

                                <Link
                                  href={getProfileUrl({ displayName: userItem.userName, uid: userItem.userId })}
                                  target="_blank"
                                  className="btn-white-outline btn-sm"
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    padding: "5px 9px",
                                    fontSize: "11.5px",
                                    borderRadius: "6px"
                                  }}
                                  title="Kullanıcının profilini yeni sekmede incele"
                                >
                                  <ExternalLink size={12} />
                                  <span>Profil</span>
                                </Link>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Aktif Uyarılar Listesi */}
              {warnings.length > 0 && (
                <div className="admin-warnings-section" style={{ marginTop: "32px" }}>
                  <h4 style={{ fontSize: "16px", color: "#fff", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <AlertTriangle size={18} color="#fbbf24" />
                    <span>Gönderilmiş Aktif Uyarılar ({warnings.length})</span>
                  </h4>
                  <div className="warnings-stream">
                    {warnings.map((w, wIdx) => (
                      <div key={w.id || `warn-${wIdx}`} className="warning-item-box">
                        <div className="warn-left">
                          <strong>{w.userName}</strong>
                          <span className="warn-msg">&quot;{w.message}&quot;</span>
                          <span className="warn-date">
                            {new Date(w.createdAt).toLocaleDateString("tr-TR", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteWarn(w.id)}
                          className="btn-delete-warn"
                          title="Uyarıyı Sil"
                        >
                          <Trash2 size={14} /> Kaldır
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* SEKME 4: GELEN RANDEVU & İLETİŞİM MESAJLARI (FİREBASE) */}
          {/* ============================================================ */}
          {activeTab === "messages" && (
            <div className="admin-section animate-fade-up">
              <div className="section-intro-bar">
                <div>
                  <h3>Gelen Randevu Talepleri & Mesajlar ({filteredMessages.length})</h3>
                  <p>Danışanların iletişim formundan gönderdiği mesajlar ve randevu talepleri Firebase RTDB&apos;de saklanır.</p>
                </div>
              </div>

              {filteredMessages.length === 0 ? (
                <div className="admin-empty">
                  Henüz gelen randevu talebi veya iletişim mesajı bulunmuyor.
                </div>
              ) : (
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Danışan Bilgileri</th>
                        <th>İstenen Terapi & Biçim</th>
                        <th>Zaman Tercihi</th>
                        <th>Mesaj Notu</th>
                        <th>Tarih & Durum</th>
                        <th style={{ textAlign: "right" }}>İşlem</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMessages.map((msg, mIdx) => (
                        <tr key={msg.id || `msg-${mIdx}`}>
                          <td>
                            <strong style={{ color: "#fff", display: "block" }}>{msg.fullName}</strong>
                            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)" }}>
                              <Phone size={12} style={{ display: "inline", marginRight: "4px" }} />
                              <a href={`tel:${msg.phone}`} style={{ color: "#e0b878", textDecoration: "none" }}>
                                {msg.phone}
                              </a>
                            </div>
                            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>
                              <Mail size={12} style={{ display: "inline", marginRight: "4px" }} />
                              {msg.email}
                            </div>
                          </td>
                          <td>
                            <span style={{ color: "#e0b878", fontWeight: 600, display: "block" }}>{msg.serviceType}</span>
                            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>{msg.sessionFormat}</span>
                          </td>
                          <td>
                            <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.85)" }}>{msg.preferredTime}</span>
                          </td>
                          <td style={{ maxWidth: "260px" }}>
                            <p style={{ margin: 0, fontSize: "12.5px", color: "rgba(255,255,255,0.8)", lineHeight: "1.4" }}>
                              {msg.message || <em style={{ color: "rgba(255,255,255,0.4)" }}>Not bırakılmamış</em>}
                            </p>
                          </td>
                          <td>
                            <div style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.5)", marginBottom: "4px" }}>
                              {new Date(msg.createdAt).toLocaleDateString("tr-TR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleToggleMessageStatus(msg.id, msg.status)}
                              className={`status-badge-active`}
                              style={{ border: "none", cursor: "pointer", fontSize: "11px", padding: "3px 8px", borderRadius: "6px" }}
                              title="Durumu değiştirmek için tıklayın"
                            >
                              {msg.status === "contacted" ? "✓ Arandı / İletişimde" : msg.status === "read" ? "Okundu" : "● Yeni Talep"}
                            </button>
                          </td>
                          <td>
                            <div className="table-actions-cell">
                              <a
                                href={`https://wa.me/${msg.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Sayın ${msg.fullName}, PsikoWay üzerinden aldığımız ${msg.serviceType} randevu talebiniz ile ilgili iletişime geçiyoruz.`)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="btn-action-warn"
                                style={{ background: "rgba(37, 211, 102, 0.15)", color: "#25D366", border: "1px solid rgba(37, 211, 102, 0.3)", textDecoration: "none" }}
                                title="Danışana WhatsApp'tan yaz"
                              >
                                <span>WhatsApp</span>
                              </a>
                              <button
                                type="button"
                                onClick={() => handleDeleteContactMessage(msg.id)}
                                className="btn-action-delete"
                                title="Mesajı Sil"
                              >
                                <Trash2 size={15} />
                                <span>Sil</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* SEKME 5: GÜVENLİK & ŞİFRE YÖNETİMİ */}
          {/* ============================================================ */}
          {activeTab === "security" && (
            <div className="admin-section animate-fade-up">
              <div className="security-cards-grid">
                
                {/* Şifre Değiştirme Kartı */}
                <div className="admin-card">
                  <div className="admin-card-header">
                    <KeyRound size={20} color="#e0b878" />
                    <div>
                      <h3>Admin Panel Şifresini Değiştir</h3>
                      <p>Yeni şifre doğrudan Firebase Realtime Database üzerine kaydedilecektir.</p>
                    </div>
                  </div>

                  {passwordChangeMsg && (
                    <div
                      className={
                        passwordChangeMsg.type === "success"
                          ? "admin-success-box"
                          : "admin-error-box"
                      }
                      style={{ marginBottom: "16px" }}
                    >
                      {passwordChangeMsg.type === "success" ? (
                        <CheckCircle2 size={16} />
                      ) : (
                        <AlertTriangle size={16} />
                      )}
                      <span>{passwordChangeMsg.text}</span>
                    </div>
                  )}

                  <form onSubmit={handleChangePassword} className="security-form">
                    <div className="form-group">
                      <label htmlFor="new-pass-1">Yeni Yönetici Şifresi</label>
                      <input
                        id="new-pass-1"
                        type="password"
                        required
                        placeholder="En az 4 karakterli şifre..."
                        value={newPasswordInput}
                        onChange={(e) => setNewPasswordInput(e.target.value)}
                        className="form-control"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="new-pass-2">Yeni Şifreyi Onaylayın</label>
                      <input
                        id="new-pass-2"
                        type="password"
                        required
                        placeholder="Şifreyi tekrar yazınız..."
                        value={newPasswordConfirm}
                        onChange={(e) => setNewPasswordConfirm(e.target.value)}
                        className="form-control"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={passwordChangeLoading}
                      className="btn-primary-solid"
                      style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
                    >
                      <Check size={16} />
                      <span>{passwordChangeLoading ? "Kaydediliyor..." : "Yeni Şifreyi Kaydet"}</span>
                    </button>
                  </form>
                </div>

                {/* Firebase Bağlantı Bilgisi */}
                <div className="admin-card">
                  <div className="admin-card-header">
                    <Database size={20} color="#60a5fa" />
                    <div>
                      <h3>Firebase Altyapı Durumu</h3>
                      <p>Sistem tamamen Cloud Firestore mimarisine taşınmıştır.</p>
                    </div>
                  </div>

                  <div className="firebase-status-list">
                    <div className="firebase-status-row">
                      <span>Veritabanı Altyapısı</span>
                      <strong style={{ color: "#34d399" }}>Cloud Firestore (100% Aktif)</strong>
                    </div>
                    <div className="firebase-status-row">
                      <span>Kullanıcı Profilleri</span>
                      <code>firestore.collection(&quot;users&quot;)</code>
                    </div>
                    <div className="firebase-status-row">
                      <span>Forum Fikirleri & Yorumlar</span>
                      <code>firestore.collection(&quot;forum_posts&quot;)</code>
                    </div>
                    <div className="firebase-status-row">
                      <span>İletişim & Randevu Mesajları</span>
                      <code>firestore.collection(&quot;contact_messages&quot;)</code>
                    </div>
                    <div className="firebase-status-row">
                      <span>Yönetici Şifre Ayarı</span>
                      <code>firestore.doc(&quot;adminConfig/security&quot;)</code>
                    </div>
                    <div className="firebase-status-row">
                      <span>Moderasyon (Yasaklılar)</span>
                      <code>firestore.doc(&quot;moderation/bannedUsers&quot;)</code>
                    </div>
                    <div className="firebase-status-row">
                      <span>Kullanıcı Uyarıları</span>
                      <code>firestore.doc(&quot;moderation/warnings&quot;)</code>
                    </div>
                  </div>
                </div>



              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* SEKME 6: BOT & GÖLGE ERİŞİM SINIRI BİLDİRİMLERİ            */}
          {/* ============================================================ */}
          {activeTab === "bot-alerts" && (
            <div className="admin-section animate-fade-up">
              <div 
                className="admin-card"
                style={{
                  marginBottom: "20px",
                  background: "linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(18, 12, 14, 0.7) 100%)",
                  border: "1px solid rgba(239, 68, 68, 0.35)",
                  padding: "18px 24px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <ShieldAlert size={26} color="#f87171" />
                  <div>
                    <h3 style={{ fontSize: "18px", color: "#ffffff", margin: "0 0 4px 0" }}>
                      Bot & Seri Spam Gölge Kısıtlama Sistemi
                    </h3>
                    <p style={{ margin: 0, fontSize: "13.5px", color: "rgba(255, 255, 255, 0.75)", lineHeight: "1.5" }}>
                      Kural: <strong>1 dakika içinde 2&apos;den fazla yazan hesaplara otomatik erişim sınırı getirilir.</strong> Kullanıcı mesajının paylaşıldığını sanır ve kendi sayfasında görmeye devam eder; ancak içerik diğer kullanıcılara gitmez ve sadece bu panelde moderasyonunuza sunulur.
                    </p>
                  </div>
                </div>
              </div>

              <div className="admin-table-container">
                {filteredAlerts.length === 0 ? (
                  <div className="empty-table-state">
                    <ShieldCheck size={48} style={{ color: "#34d399", margin: "0 auto 12px auto" }} />
                    <h4>Henüz bot veya spam erişim sınırı bildirimi bulunmuyor.</h4>
                    <p>Dakikada 2 defadan fazla yazan hesaplar tespit edildiğinde buraya anlık bildirim düşecektir.</p>
                  </div>
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Tarih & Saat</th>
                        <th>Kullanıcı / Parmak İzi</th>
                        <th>İşlem Türü</th>
                        <th>Tetikleyen Neden</th>
                        <th>Engellenen Mesaj</th>
                        <th>Durum</th>
                        <th>İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAlerts.map((alert, aIdx) => (
                        <tr key={alert.id || `alert-${aIdx}`}>
                          <td className="table-date" style={{ whiteSpace: "nowrap" }}>
                            {new Date(alert.timestamp).toLocaleDateString("tr-TR", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                          <td>
                            <strong style={{ color: "#ffffff", display: "block" }}>{alert.userName}</strong>
                            <span style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.55)", fontFamily: "monospace" }}>
                              {alert.clientFingerprint ? alert.clientFingerprint.slice(0, 14) + "..." : alert.userId.slice(0, 10)}
                            </span>
                          </td>
                          <td>
                            <span 
                              className="table-cat-badge"
                              style={{ 
                                background: alert.actionType === "post" ? "rgba(224, 184, 120, 0.2)" : "rgba(99, 102, 241, 0.2)",
                                color: alert.actionType === "post" ? "#e0b878" : "#818cf8"
                              }}
                            >
                              {alert.actionType === "post" ? "📝 Yeni Fikir" : "💬 Yorum"}
                            </span>
                          </td>
                          <td style={{ maxWidth: "220px", fontSize: "12.5px", color: "rgba(255, 255, 255, 0.85)" }}>
                            {alert.reason}
                          </td>
                          <td style={{ maxWidth: "260px" }}>
                            {alert.postTitle && (
                              <strong style={{ display: "block", fontSize: "13px", color: "#e0b878", marginBottom: "3px" }}>
                                {alert.postTitle}
                              </strong>
                            )}
                            <p style={{ margin: 0, fontSize: "12.5px", color: "rgba(255, 255, 255, 0.7)", whiteSpace: "pre-wrap", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}>
                              {alert.contentSnippet}
                            </p>
                          </td>
                          <td>
                            {alert.status === "shadowbanned" ? (
                              <span 
                                style={{ 
                                  display: "inline-block",
                                  fontSize: "11.5px", 
                                  fontWeight: 600,
                                  background: "rgba(239, 68, 68, 0.2)", 
                                  color: "#f87171", 
                                  border: "1px solid rgba(239, 68, 68, 0.5)",
                                  padding: "4px 8px",
                                  borderRadius: "6px",
                                  whiteSpace: "nowrap"
                                }}
                              >
                                👻 Gölge Kısıtlandı
                              </span>
                            ) : alert.status === "resolved" ? (
                              <span 
                                style={{ 
                                  display: "inline-block",
                                  fontSize: "11.5px", 
                                  fontWeight: 600,
                                  background: "rgba(52, 211, 153, 0.2)", 
                                  color: "#34d399", 
                                  border: "1px solid rgba(52, 211, 153, 0.5)",
                                  padding: "4px 8px",
                                  borderRadius: "6px",
                                  whiteSpace: "nowrap"
                                }}
                              >
                                ✓ Kısıtlama Kaldırıldı
                              </span>
                            ) : (
                              <span 
                                style={{ 
                                  display: "inline-block",
                                  fontSize: "11.5px", 
                                  fontWeight: 600,
                                  background: "rgba(239, 68, 68, 0.35)", 
                                  color: "#ffffff", 
                                  border: "1px solid #ef4444",
                                  padding: "4px 8px",
                                  borderRadius: "6px",
                                  whiteSpace: "nowrap"
                                }}
                              >
                                ⛔ Kalıcı Yasaklı
                              </span>
                            )}
                          </td>
                          <td>
                            <div className="table-actions-cell">
                              {alert.status === "shadowbanned" && (
                                <button
                                  type="button"
                                  onClick={() => handleUnshadowban(alert.userId || alert.clientFingerprint, alert.id)}
                                  className="btn-action-warn"
                                  style={{ color: "#34d399", borderColor: "rgba(52, 211, 153, 0.4)", background: "rgba(52, 211, 153, 0.1)" }}
                                  title="Gölge Kısıtlamayı Kaldır"
                                >
                                  <Unlock size={14} />
                                  <span>Kaldır</span>
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => openBanModal(alert.userId, alert.userName)}
                                className="btn-action-ban"
                                title="Kullanıcıyı Tamamen Banla"
                              >
                                <Ban size={14} />
                                <span>Banla</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteSecurityAlert(alert.id)}
                                className="btn-action-delete"
                                title="Bildirimi Sil"
                              >
                                <Trash2 size={14} />
                                <span>Sil</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* --- MODAL 1: BANLAMA MODALI --- */}
      {banModalOpen && targetBanUser && (
        <div className="modal-overlay" onClick={() => setBanModalOpen(false)}>
          <div className="modal-content-box admin-modal-box animate-scale" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div className="modal-icon-badge" style={{ background: "rgba(239, 68, 68, 0.15)", color: "#f87171" }}>
                  <Ban size={20} />
                </div>
                <div>
                  <h3>Kullanıcıyı Yasakla (Banla)</h3>
                  <p><strong>{targetBanUser.name}</strong> kullanıcısının forum erişimi engellenecek.</p>
                </div>
              </div>
              <button type="button" onClick={() => setBanModalOpen(false)} className="modal-close-btn">
                <X size={18} />
              </button>
            </div>

            <div className="form-group" style={{ margin: "16px 0" }}>
              <label>Yasaklama Gerekçesi</label>
              <input
                type="text"
                value={banReasonInput}
                onChange={(e) => setBanReasonInput(e.target.value)}
                placeholder="Örn: Topluluk kurallarına aykırı hakaret içeren paylaşımlar"
                className="form-control"
              />
              <div className="quick-reason-pills">
                <button type="button" onClick={() => setBanReasonInput("Topluluk kurallarını ihlal")}>İhlal</button>
                <button type="button" onClick={() => setBanReasonInput("Saygısız veya saldırgan dil")}>Saldırgan Dil</button>
                <button type="button" onClick={() => setBanReasonInput("Spam ve alakasız paylaşım")}>Spam</button>
              </div>
            </div>

            <div className="modal-actions-footer">
              <button type="button" onClick={() => setBanModalOpen(false)} className="btn-white-outline">
                İptal
              </button>
              <button type="button" onClick={handleConfirmBan} className="btn-danger-outline" style={{ background: "#ef4444", color: "#fff" }}>
                Hesabı Kesin Olarak Banla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 2: UYARI ATMA MODALI --- */}
      {warnModalOpen && targetWarnUser && (
        <div className="modal-overlay" onClick={() => setWarnModalOpen(false)}>
          <div className="modal-content-box admin-modal-box animate-scale" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div className="modal-icon-badge" style={{ background: "rgba(245, 158, 11, 0.15)", color: "#fbbf24" }}>
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h3>Kullanıcıya Uyarı Gönder</h3>
                  <p><strong>{targetWarnUser.name}</strong> kullanıcısına gösterilecek uyarı mesajını yazın.</p>
                </div>
              </div>
              <button type="button" onClick={() => setWarnModalOpen(false)} className="modal-close-btn">
                <X size={18} />
              </button>
            </div>

            <div className="form-group" style={{ margin: "16px 0" }}>
              <label>Uyarı Mesajı</label>
              <textarea
                rows={3}
                value={warnMessageInput}
                onChange={(e) => setWarnMessageInput(e.target.value)}
                placeholder="Kullanıcıya iletilecek şefkatli ama net uyarı..."
                className="form-control"
              />
              <div className="quick-reason-pills">
                <button type="button" onClick={() => setWarnMessageInput("Lütfen yorumlarınızda saygılı ve empatik bir dil kullanmaya özen gösteriniz.")}>Dil Uyarısı</button>
                <button type="button" onClick={() => setWarnMessageInput("Aynı içeriği tekrarlamak spam sayılmaktadır, lütfen tek başlık altında toplayınız.")}>Spam Uyarısı</button>
                <button type="button" onClick={() => setWarnMessageInput("Kişisel saldırı ve etiketlemeler PsikoWay topluluk ilkelerine aykırıdır.")}>Kişisel Saldırı</button>
              </div>
            </div>

            <div className="modal-actions-footer">
              <button type="button" onClick={() => setWarnModalOpen(false)} className="btn-white-outline">
                İptal
              </button>
              <button type="button" onClick={handleConfirmWarn} className="btn-primary-solid">
                Uyarıyı Kullanıcıya İlet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 3: TOPLU KULLANICI ENGELLEME MODALI --- */}
      {bulkBanModalOpen && (
        <div className="modal-overlay" onClick={() => setBulkBanModalOpen(false)}>
          <div className="modal-content-box admin-modal-box animate-scale" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div className="modal-icon-badge" style={{ background: "rgba(239, 68, 68, 0.15)", color: "#f87171" }}>
                  <Ban size={20} />
                </div>
                <div>
                  <h3>Seçilen Kullanıcıları Toplu Engelle</h3>
                  <p>Toplam <strong>{selectedUserIds.length}</strong> kullanıcının forum erişimi kısıtlanacak.</p>
                </div>
              </div>
              <button type="button" onClick={() => setBulkBanModalOpen(false)} className="modal-close-btn">
                <X size={18} />
              </button>
            </div>

            <div className="form-group" style={{ margin: "16px 0" }}>
              <label>Toplu Yasaklama / Engelleme Gerekçesi</label>
              <input
                type="text"
                value={bulkBanReason}
                onChange={(e) => setBulkBanReason(e.target.value)}
                placeholder="Örn: Spam ve topluluk kurallarını ihlal"
                className="form-control"
              />
              <div className="quick-reason-pills">
                <button type="button" onClick={() => setBulkBanReason("Topluluk kurallarını ihlal")}>İhlal</button>
                <button type="button" onClick={() => setBulkBanReason("Spam ve bot faaliyeti")}>Spam</button>
                <button type="button" onClick={() => setBulkBanReason("Saldırgan ve saygısız dil")}>Saldırgan Dil</button>
              </div>
            </div>

            <div className="modal-actions-footer">
              <button type="button" onClick={() => setBulkBanModalOpen(false)} className="btn-white-outline">
                İptal
              </button>
              <button 
                type="button" 
                onClick={handleBulkBanUsersConfirm} 
                className="btn-danger-outline" 
                style={{ background: "#ef4444", color: "#fff", fontWeight: 700 }}
              >
                Seçilen {selectedUserIds.length} Hesabı Engelle
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
