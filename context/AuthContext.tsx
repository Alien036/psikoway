"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  signInAnonymously, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut 
} from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, googleProvider, firestore } from "../lib/firebase";
import { UserProfile } from "../types/user";
import { getUserProfile, saveUserProfile, migrateAllUsersFromRTDBToFirestore, toUsernameSlug, isUsernameTaken } from "../lib/profile-data";
import { isDisposableEmail } from "../lib/anti-spam";

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signInWithEmail: (email: string, pass: string) => Promise<User | null>;
  signUpWithEmail: (email: string, pass: string, displayName: string, profession?: string, username?: string) => Promise<User | null>;
  signInWithGoogle: () => Promise<User | null>;
  signInGuest: () => Promise<User | null>;
  logout: () => Promise<void>;
  getUserDisplayName: () => string;
  updateProfileData: (data: Partial<UserProfile>) => Promise<UserProfile>;
  isRegisteredUser: boolean;
  isAnonymousUser: boolean;
  isUserBanned: boolean;
  banReason?: string;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  signInWithEmail: async () => null,
  signUpWithEmail: async () => null,
  signInWithGoogle: async () => null,
  signInGuest: async () => null,
  logout: async () => {},
  getUserDisplayName: () => "Ziyaretçi",
  updateProfileData: async () => ({} as UserProfile),
  isRegisteredUser: false,
  isAnonymousUser: true,
  isUserBanned: false,
  banReason: undefined,
  refreshProfile: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Profil verisini yükle
  const loadProfile = async (firebaseUser: User | null) => {
    if (!firebaseUser) {
      setUserProfile(null);
      return;
    }
    try {
      const prof = await getUserProfile(firebaseUser.uid);
      if (prof) {
        // Eğer profilde photoURL veya email eksikse ve Firebase Auth'da varsa birleştirip güncelle
        if ((!prof.photoURL && firebaseUser.photoURL) || (!prof.email && firebaseUser.email)) {
          const updated: UserProfile = {
            ...prof,
            photoURL: prof.photoURL || firebaseUser.photoURL || "",
            email: prof.email || firebaseUser.email || "",
          };
          const saved = await saveUserProfile(updated);
          setUserProfile(saved);
        } else {
          setUserProfile(prof);
        }
      } else {
        // Yeni profil oluştur ve eksiksiz Firestore'a kaydet
        const initialProfile: UserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || "",
          displayName: firebaseUser.displayName || (firebaseUser.isAnonymous ? "Misafir Düşünür" : "PsikoWay Üyesi"),
          photoURL: firebaseUser.photoURL || "",
          profession: firebaseUser.isAnonymous ? "Misafir Okuyucu" : "Düşünce Kaşifi",
          bio: "İnsan psikolojisi ve zihin dünyasını keşfetmeyi seven bir zihin.",
          instagram: "",
          youtube: "",
          createdAt: new Date().toISOString(),
          isAnonymous: firebaseUser.isAnonymous,
          isBanned: false,
        };
        const saved = await saveUserProfile(initialProfile);
        setUserProfile(saved);
      }
    } catch (err) {
      console.warn("loadProfile error:", err);
    }
  };

  useEffect(() => {
    // Realtime Database'deki eski kullanıcıları Firestore'a tek seferlik güvenli arka plan senkronizasyonu
    if (typeof window !== "undefined" && localStorage.getItem("psikoway_rtdb_to_firestore_migrated") !== "true") {
      migrateAllUsersFromRTDBToFirestore().catch((err) => {
        console.warn("Background user migration notice:", err);
      });
    }

    let unsubUserDoc: (() => void) | null = null;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      await loadProfile(currentUser);
      setLoading(false);

      if (unsubUserDoc) {
        unsubUserDoc();
        unsubUserDoc = null;
      }

      if (currentUser) {
        try {
          unsubUserDoc = onSnapshot(doc(firestore, "users", currentUser.uid), (snap) => {
            if (snap.exists()) {
              const data = snap.data() as UserProfile;
              setUserProfile((prev) => (prev ? { ...prev, ...data } : data));
            }
          }, (err) => {
            console.warn("Live user profile listener warning:", err);
          });
        } catch (e) {
          console.warn("onSnapshot setup error:", e);
        }
      }
    });

    return () => {
      unsubscribe();
      if (unsubUserDoc) unsubUserDoc();
    };
  }, []);


  // 1. E-posta ile Giriş
  const signInWithEmail = async (email: string, pass: string): Promise<User | null> => {
    try {
      const res = await signInWithEmailAndPassword(auth, email.trim(), pass);
      await loadProfile(res.user);
      return res.user;
    } catch (error) {
      console.error("Email sign in error:", error);
      throw error;
    }
  };

  // 2. E-posta ile Kayıt Ol
  const signUpWithEmail = async (
    email: string, 
    pass: string, 
    displayName: string, 
    profession?: string,
    username?: string
  ): Promise<User | null> => {
    const trimmedEmail = email.trim();
    if (isDisposableEmail(trimmedEmail)) {
      throw new Error("Geçici ve tek kullanımlık e-posta adresleri (temp-mail) ile kayıt olunamaz. Lütfen kalıcı ve geçerli bir e-posta adresi kullanın.");
    }

    const cleanName = displayName.trim() || "PsikoWay Üyesi";
    const cleanUsername = toUsernameSlug(username?.trim() || cleanName);

    const taken = await isUsernameTaken(cleanUsername);
    if (taken) {
      throw new Error(`"@${cleanUsername}" kullanıcı adı zaten başka bir üye tarafından kullanılıyor. Lütfen farklı bir kullanıcı adı seçin.`);
    }

    try {
      const res = await createUserWithEmailAndPassword(auth, trimmedEmail, pass);
      
      // Firebase Auth Profilini Güncelle
      await updateProfile(res.user, { displayName: cleanName });

      // Veritabanı profilini eksiksiz kaydet
      const newProf: UserProfile = {
        uid: res.user.uid,
        username: cleanUsername,
        email: email.trim(),
        displayName: cleanName,
        photoURL: "",
        profession: profession?.trim() || "Düşünce Kaşifi",
        bio: "Kendini ve insan zihnini keşfetme yolculuğunda yeni bir düşünür.",
        instagram: "",
        youtube: "",
        createdAt: new Date().toISOString(),
        isAnonymous: false,
      };
      const saved = await saveUserProfile(newProf);
      setUserProfile(saved);
      return res.user;
    } catch (error) {
      console.error("Email sign up error:", error);
      throw error;
    }
  };

  // 3. Google ile Giriş
  const signInWithGoogle = async (): Promise<User | null> => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      await loadProfile(res.user);
      return res.user;
    } catch (error) {
      console.error("Google sign in error:", error);
      throw error;
    }
  };

  // 4. Misafir Girişi (Sadece Okuma Modu)
  const signInGuest = async (): Promise<User | null> => {
    try {
      const res = await signInAnonymously(auth);
      await loadProfile(res.user);
      return res.user;
    } catch (error) {
      console.error("Guest sign in error:", error);
      throw error;
    }
  };

  // 5. Çıkış Yap
  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  };

  // Profil Güncelle
  const updateProfileData = async (data: Partial<UserProfile>): Promise<UserProfile> => {
    if (!user || !userProfile) throw new Error("Giriş yapılmış bir kullanıcı bulunamadı.");
    const merged: UserProfile = {
      ...userProfile,
      ...data,
      photoURL: data.photoURL !== undefined ? (data.photoURL || "") : (userProfile.photoURL || ""),
      uid: user.uid,
    };
    const saved = await saveUserProfile(merged);
    setUserProfile(saved);
    return saved;
  };

  const refreshProfile = async () => {
    if (user) {
      await loadProfile(user);
    }
  };

  const getUserDisplayName = (): string => {
    if (userProfile?.displayName) return userProfile.displayName;
    if (user?.displayName) return user.displayName;
    if (user?.isAnonymous) return "Misafir (Okuyucu)";
    if (user?.email) return user.email.split("@")[0];
    return "Ziyaretçi";
  };

  const isRegisteredUser = Boolean(user && !user.isAnonymous);
  const isAnonymousUser = Boolean(!user || user.isAnonymous);
  const isUserBanned = Boolean(userProfile?.isBanned);
  const banReason = userProfile?.banReason;

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signInGuest,
        logout,
        getUserDisplayName,
        updateProfileData,
        isRegisteredUser,
        isAnonymousUser,
        isUserBanned,
        banReason,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
