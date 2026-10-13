export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  profession?: string; // Meslek / Uzmanlık alanı
  bio?: string;        // Biyografi / Kendini tanıtma
  instagram?: string;  // Instagram hesabı / linki (örn: @kullaniciadi veya https://instagram.com/kullaniciadi)
  youtube?: string;    // YouTube kanalı / linki (örn: @kanaladi veya https://youtube.com/@kanaladi)
  createdAt?: string;
  isAnonymous: boolean;
}

export interface UserStats {
  postsCount: number;
  commentsCount: number;
  likesReceived: number;
}
