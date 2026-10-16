export interface BannedUser {
  userId: string;
  userName: string;
  reason: string;
  bannedAt: string;
  bannedBy?: string;
}

export interface UserWarning {
  id: string;
  userId: string;
  userName: string;
  message: string;
  createdAt: string;
  isRead?: boolean;
}

export interface AdminModerationUser {
  userId: string;
  userName: string;
  email?: string;
  photoURL?: string;
  profession?: string;
  bio?: string;
  createdAt?: string;
  isAnonymous?: boolean;
  role?: string;
  isBanned: boolean;
  banReason?: string;
  bannedAt?: string;
  bannedBy?: string;
  warningsCount: number;
  postsCount: number;
  commentsCount: number;
}

export interface SecurityAlert {
  id: string;
  userId: string;
  clientFingerprint: string;
  userName: string;
  reason: string;
  actionType: "post" | "comment" | "register" | "honeypot";
  contentSnippet: string;
  postTitle?: string;
  timestamp: string;
  status: "shadowbanned" | "resolved" | "banned" | "crisis";
  attemptsInWindow: number;
}


