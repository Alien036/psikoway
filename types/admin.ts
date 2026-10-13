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
  isBanned: boolean;
  banReason?: string;
  bannedAt?: string;
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
  actionType: "post" | "comment";
  contentSnippet: string;
  postTitle?: string;
  timestamp: string;
  status: "shadowbanned" | "resolved" | "banned";
  attemptsInWindow: number;
}

