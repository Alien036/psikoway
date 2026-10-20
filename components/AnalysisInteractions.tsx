"use client";

import React, { useState, useEffect } from "react";
import { 
  Heart, 
  MessageSquare, 
  Send, 
  User as UserIcon, 
  Clock, 
  Sparkles,
  Share2,
  Check
} from "lucide-react";
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove
} from "firebase/firestore";
import { firestore } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import { moderateTextWithAI } from "../lib/ai-moderation";

interface AnalysisCommentItem {
  id: string;
  analysisId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt?: any;
}

interface AnalysisInteractionsProps {
  analysisId: string;
  analysisTitle: string;
}

export default function AnalysisInteractions({
  analysisId,
  analysisTitle,
}: AnalysisInteractionsProps) {
  const { user, userProfile, getUserDisplayName } = useAuth();

  // Beğeni (Like) Durumu
  const [likesCount, setLikesCount] = useState<number>(0);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [isLiking, setIsLiking] = useState<boolean>(false);

  // Yorumlar Durumu
  const [comments, setComments] = useState<AnalysisCommentItem[]>([]);
  const [commentText, setCommentText] = useState<string>("");
  const [guestName, setGuestName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Ziyaretçi ID'si (Giriş yapmamış kullanıcılar için yerel belirteç)
  const [localUserId, setLocalUserId] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      let storedId = localStorage.getItem("psikoway_visitor_id");
      if (!storedId) {
        storedId = "guest_" + Math.random().toString(36).substring(2, 9);
        localStorage.setItem("psikoway_visitor_id", storedId);
      }
      setLocalUserId(storedId);
    }
  }, []);

  const activeUserId = user?.uid || localUserId;

  // 1. Beğeni Verisini Firestore'dan Dinle / Çek
  useEffect(() => {
    if (!analysisId) return;

    const likeDocRef = doc(firestore, "analysis_likes", analysisId);
    const unsubscribe = onSnapshot(
      likeDocRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          const count = data.likeCount || 0;
          const likedUsers = data.likedUsers || [];
          setLikesCount(count);
          if (activeUserId) {
            setHasLiked(likedUsers.includes(activeUserId));
          }
        } else {
          setLikesCount(0);
          setHasLiked(false);
        }
      },
      (error) => {
        console.warn("Firestore like sync notice:", error);
      }
    );

    return () => unsubscribe();
  }, [analysisId, activeUserId]);

  // 2. Yorumları Firestore'dan Dinle / Çek
  useEffect(() => {
    if (!analysisId) return;

    const commentsRef = collection(firestore, "analysis_comments");
    const q = query(
      commentsRef,
      where("analysisId", "==", analysisId)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetched: AnalysisCommentItem[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          fetched.push({
            id: doc.id,
            analysisId: data.analysisId,
            authorId: data.authorId,
            authorName: data.authorName || "Anonim Okur",
            authorAvatar: data.authorAvatar || "",
            content: data.content || "",
            createdAt: data.createdAt,
          });
        });
        // İstemci tarafında güvenli kronolojik sıralama (Firestore bileşik indeks hatasını önler)
        fetched.sort((a, b) => {
          const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt ? new Date(a.createdAt).getTime() : 0);
          const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt ? new Date(b.createdAt).getTime() : 0);
          return timeB - timeA;
        });
        setComments(fetched);
      },
      (error) => {
        console.warn("Firestore comments sync notice:", error);
      }
    );

    return () => unsubscribe();
  }, [analysisId]);

  // Beğen / Beğeniden Vazgeç
  const handleToggleLike = async () => {
    if (isLiking || !activeUserId || !analysisId) return;
    setIsLiking(true);

    const likeDocRef = doc(firestore, "analysis_likes", analysisId);

    try {
      if (hasLiked) {
        // Geri al
        setHasLiked(false);
        setLikesCount((prev) => Math.max(0, prev - 1));
        await setDoc(
          likeDocRef,
          {
            analysisId,
            likeCount: increment(-1),
            likedUsers: arrayRemove(activeUserId),
            lastUpdated: serverTimestamp(),
          },
          { merge: true }
        );
      } else {
        // Beğen
        setHasLiked(true);
        setLikesCount((prev) => prev + 1);
        await setDoc(
          likeDocRef,
          {
            analysisId,
            likeCount: increment(1),
            likedUsers: arrayUnion(activeUserId),
            lastUpdated: serverTimestamp(),
          },
          { merge: true }
        );
      }
    } catch (err) {
      console.error("Beğeni güncellenirken hata oluştu:", err);
    } finally {
      setIsLiking(false);
    }
  };

  // Yeni Yorum Gönder
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = commentText.trim();
    if (!trimmed || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const authorName = user 
        ? getUserDisplayName() 
        : (guestName.trim() || "Misafir Okur");

      const moderationCheck = await moderateTextWithAI(`${authorName} ${trimmed}`, "comment");
      if (!moderationCheck.isAllowed) {
        alert(
          moderationCheck.reason ||
            "🛡️ Yapay Zeka Sansür Filtresi: Yorumunuzda küfür veya uygunsuz ifadeler tespit edildiği için paylaşılamadı."
        );
        setIsSubmitting(false);
        return;
      }

      const authorAvatar = user?.photoURL || userProfile?.photoURL || "";

      await addDoc(collection(firestore, "analysis_comments"), {
        analysisId,
        authorId: activeUserId,
        authorName,
        authorAvatar,
        content: trimmed,
        createdAt: serverTimestamp(),
      });

      setCommentText("");
    } catch (err) {
      console.error("Yorum eklenirken hata:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Paylaşım bağlantısını kopyala
  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <section className="analysis-interactions-section animate-fade-up">
      {/* Etkileşim Butonları (Beğeni & Paylaşım) */}
      <div className="interactions-bar">
        <div className="interactions-left">
          <button
            onClick={handleToggleLike}
            disabled={isLiking}
            className={`interaction-btn like-btn ${hasLiked ? "liked" : ""}`}
            title={hasLiked ? "Beğeniyi Geri Al" : "Bu Analizi Beğen"}
          >
            <Heart 
              size={18} 
              fill={hasLiked ? "#ef4444" : "transparent"} 
              color={hasLiked ? "#ef4444" : "currentColor"} 
            />
            <span>{likesCount} Beğeni</span>
          </button>

          <div className="interaction-stat">
            <MessageSquare size={17} color="#e0b878" />
            <span>{comments.length} Yorum</span>
          </div>
        </div>

        <div className="interactions-right">
          <button 
            onClick={handleShare} 
            className="interaction-btn share-btn"
            title="Analiz bağlantısını kopyala"
          >
            {copiedLink ? <Check size={16} color="#10b981" /> : <Share2 size={16} />}
            <span>{copiedLink ? "Kopyalandı!" : "Paylaş"}</span>
          </button>
        </div>
      </div>

      {/* Yorum Başlığı & Açıklama */}
      <div className="comments-section-header">
        <div className="comments-header-title">
          <Sparkles size={18} color="#e0b878" />
          <h3>Karakter Yorumları &amp; Topluluk Analizleri</h3>
        </div>
        <p className="comments-header-sub">
          Bu psikolojik profil hakkındaki gözlemlerini veya hipotezlerini paylaş:
        </p>
      </div>

      {/* Yorum Ekleme Formu */}
      <form onSubmit={handleAddComment} className="comment-input-card">
        {!user && (
          <div className="guest-name-field">
            <UserIcon size={16} color="#e0b878" />
            <input
              type="text"
              placeholder="İsminiz (isteğe bağlı)"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              maxLength={40}
              className="guest-name-input"
            />
          </div>
        )}

        <div className="comment-textarea-wrap">
          <textarea
            placeholder={
              user
                ? `${getUserDisplayName()}, bu karakter hakkındaki düşüncelerini yaz...`
                : "Bu karakterin davranışları veya savunma mekanizmaları hakkında ne düşünüyorsun?"
            }
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            rows={3}
            maxLength={1000}
            required
            className="comment-textarea"
          />
        </div>

        <div className="comment-actions-bar">
          <span className="comment-char-counter">
            {commentText.length}/1000
          </span>

          <button
            type="submit"
            disabled={isSubmitting || !commentText.trim()}
            className="comment-submit-btn"
          >
            <Send size={15} />
            <span>{isSubmitting ? "Gönderiliyor..." : "Yorumu Paylaş"}</span>
          </button>
        </div>
      </form>

      {/* Yorumlar Listesi */}
      <div className="comments-stream-container">
        {comments.length === 0 ? (
          <div className="comments-empty-state">
            <MessageSquare size={32} color="#e0b878" style={{ opacity: 0.6 }} />
            <p>Bu vaka dosyasına henüz yorum yapılmadı.</p>
            <span>İlk klinik yorumu ve gözlemi sen bırak!</span>
          </div>
        ) : (
          <div className="comments-stream-list">
            {comments.map((comm) => (
              <div key={comm.id} className="comment-bubble-card">
                <div className="comment-bubble-head">
                  <div className="comment-author-info">
                    <div className="comment-avatar">
                      {comm.authorAvatar ? (
                        <img src={comm.authorAvatar} alt={comm.authorName} />
                      ) : (
                        <UserIcon size={14} color="#e0b878" />
                      )}
                    </div>
                    <span className="comment-author-name">{comm.authorName}</span>
                  </div>

                  {comm.createdAt && (
                    <span className="comment-date">
                      <Clock size={12} />
                      {comm.createdAt.toDate 
                        ? new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(comm.createdAt.toDate())
                        : "Yeni"}
                    </span>
                  )}
                </div>

                <p className="comment-bubble-text">{comm.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .analysis-interactions-section {
          margin-top: 2.5rem;
          padding: 2rem;
          background: rgba(18, 20, 29, 0.75);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
        }

        .interactions-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .interactions-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .interaction-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1.2rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 9999px;
          color: #f1f5f9;
          font-size: 0.88rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .interaction-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(224, 184, 120, 0.4);
          transform: translateY(-1px);
        }

        .like-btn.liked {
          background: rgba(239, 68, 68, 0.15);
          border-color: rgba(239, 68, 68, 0.4);
          color: #fca5a5;
        }

        .interaction-stat {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          color: #94a3b8;
          font-size: 0.88rem;
          padding: 0.6rem 0.8rem;
        }

        .share-btn {
          color: #e0b878;
        }

        .comments-section-header {
          margin-bottom: 1.5rem;
        }

        .comments-header-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.35rem;
        }

        .comments-header-title h3 {
          font-size: 1.2rem;
          font-weight: 600;
          color: #f8fafc;
          margin: 0;
        }

        .comments-header-sub {
          color: #94a3b8;
          font-size: 0.9rem;
          margin: 0;
        }

        .comment-input-card {
          background: rgba(12, 14, 20, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 2rem;
        }

        .guest-name-field {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 0.8rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          margin-bottom: 0.75rem;
          max-width: 280px;
        }

        .guest-name-input {
          background: transparent;
          border: none;
          outline: none;
          color: #f1f5f9;
          font-size: 0.85rem;
          width: 100%;
        }

        .comment-textarea-wrap {
          margin-bottom: 0.75rem;
        }

        .comment-textarea {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          color: #f8fafc;
          font-size: 0.92rem;
          resize: vertical;
          min-height: 70px;
          line-height: 1.5;
        }

        .comment-actions-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }

        .comment-char-counter {
          font-size: 0.75rem;
          color: #64748b;
        }

        .comment-submit-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #e0b878;
          color: #12141d;
          font-weight: 600;
          font-size: 0.85rem;
          padding: 0.5rem 1.1rem;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .comment-submit-btn:hover:not(:disabled) {
          background: #eed5a7;
          transform: translateY(-1px);
        }

        .comment-submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .comments-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2.5rem 1rem;
          text-align: center;
          gap: 0.5rem;
          color: #94a3b8;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 12px;
          border: 1px dashed rgba(255, 255, 255, 0.08);
        }

        .comments-empty-state p {
          margin: 0;
          font-weight: 500;
          color: #cbd5e1;
        }

        .comments-empty-state span {
          font-size: 0.82rem;
          color: #64748b;
        }

        .comments-stream-list {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .comment-bubble-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          padding: 1rem 1.2rem;
          transition: border-color 0.2s ease;
        }

        .comment-bubble-card:hover {
          border-color: rgba(224, 184, 120, 0.2);
        }

        .comment-bubble-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .comment-author-info {
          display: flex;
          align-items: center;
          gap: 0.55rem;
        }

        .comment-avatar {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(224, 184, 120, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .comment-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .comment-author-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: #f1f5f9;
        }

        .comment-date {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.75rem;
          color: #64748b;
        }

        .comment-bubble-text {
          font-size: 0.9rem;
          line-height: 1.55;
          color: #cbd5e1;
          margin: 0;
          white-space: pre-wrap;
          word-break: break-word;
        }

        @media (max-width: 640px) {
          .analysis-interactions-section {
            margin-top: 1.5rem;
            padding: 1.25rem 1rem;
            border-radius: 14px;
          }

          .interactions-bar {
            padding-bottom: 1rem;
            margin-bottom: 1.25rem;
            gap: 0.65rem;
          }

          .interactions-left {
            gap: 0.5rem;
            flex-wrap: wrap;
          }

          .interaction-btn {
            padding: 0.55rem 0.95rem;
            font-size: 0.82rem;
            min-height: 40px;
          }

          .interaction-stat {
            font-size: 0.82rem;
            padding: 0.45rem 0.6rem;
          }

          .comments-header-title h3 {
            font-size: 1.05rem;
          }

          .comments-header-sub {
            font-size: 0.82rem;
          }

          .comment-input-card {
            padding: 0.85rem;
            margin-bottom: 1.25rem;
          }

          .guest-name-field {
            max-width: 100%;
            padding: 0.5rem 0.75rem;
          }

          .guest-name-input {
            font-size: 16px;
          }

          .comment-textarea {
            font-size: 16px;
          }

          .comment-actions-bar {
            flex-wrap: wrap;
            gap: 0.5rem;
          }

          .comment-submit-btn {
            padding: 0.6rem 1rem;
            min-height: 42px;
          }

          .comment-bubble-card {
            padding: 0.85rem 0.95rem;
          }

          .comment-bubble-head {
            flex-wrap: wrap;
            gap: 0.35rem;
          }
        }
      `}</style>
    </section>
  );
}
