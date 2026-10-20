export interface UserProfile {
  uid: string;
  username?: string;   // Kullanıcı adı / Profil URL slug'ı (örn: dr-selin-yilmaz)
  email: string;
  displayName: string;
  photoURL?: string;
  profession?: string; // Meslek / Uzmanlık alanı
  bio?: string;        // Biyografi / Kendini tanıtma
  instagram?: string;  // Instagram hesabı / linki (örn: @kullaniciadi veya https://instagram.com/kullaniciadi)
  youtube?: string;    // YouTube kanalı / linki (örn: @kanaladi veya https://youtube.com/@kanaladi)
  createdAt?: string;
  isAnonymous: boolean;
  role?: string;
  isBanned?: boolean;
  banReason?: string;
  bannedAt?: string;
  bannedBy?: string;
}

export interface UserStats {
  postsCount: number;
  commentsCount: number;
  likesReceived: number;
}
