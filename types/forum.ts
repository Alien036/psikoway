export interface ForumComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorProfession?: string;
  isAnonymous?: boolean;
  content: string;
  createdAt: string;
  likes: string[]; // User IDs who liked
  isShadowbanned?: boolean;
  shadowClientFingerprint?: string;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorProfession?: string;
  authorBio?: string;
  isAnonymous?: boolean;
  createdAt: string;
  likes: string[]; // User IDs who liked
  views: number;
  comments: ForumComment[];
  isPinned?: boolean;
  isShadowbanned?: boolean;
  shadowClientFingerprint?: string;
}

export type ForumCategory =
  | "Tümü"
  | "Psikoloji & Zihin"
  | "Günün Sorusu"
  | "Fikirler & Teoriler"
  | "İlişkiler & Empati"
  | "Deneyim & Hikaye"
  | "Kitap, Film & Sanat"
  | "Kişisel Gelişim";

export type ForumSortOption = "newest" | "popular" | "discussed";
