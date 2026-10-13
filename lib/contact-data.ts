import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc 
} from "firebase/firestore";
import { firestore } from "./firebase";

export interface ContactMessage {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  serviceType: string;
  sessionFormat: string;
  preferredTime: string;
  message: string;
  createdAt: string;
  status: "new" | "read" | "contacted";
}

const LOCAL_STORAGE_KEY = "psikoway_contact_messages_v1";
const CONTACT_COLLECTION = "contact_messages";

/**
 * İletişim / Randevu formundan atılan mesajı Cloud Firestore'a kaydeder.
 * Firestore'da 'contact_messages/{id}' altına yazılır ve kalıcı olarak orada kalır.
 */
export const saveContactMessageToFirebase = async (
  data: Omit<ContactMessage, "id" | "createdAt" | "status">
): Promise<ContactMessage> => {
  const id = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const message: ContactMessage = {
    ...data,
    id,
    createdAt: new Date().toISOString(),
    status: "new",
  };

  // 1. Cloud Firestore'a kaydet
  try {
    const msgRef = doc(firestore, CONTACT_COLLECTION, id);
    await setDoc(msgRef, message);
  } catch (err) {
    console.warn("Firestore contact message save error:", err);
  }

  // 2. Çevrimdışı/Yedek önbelleğe de kaydet
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY) || "[]";
      const list: ContactMessage[] = JSON.parse(raw);
      list.unshift(message);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn("Local storage cache save error:", e);
    }
  }

  return message;
};

/**
 * Cloud Firestore'daki tüm randevu ve iletişim mesajlarını çeker.
 */
export const getContactMessages = async (): Promise<ContactMessage[]> => {
  try {
    const colRef = collection(firestore, CONTACT_COLLECTION);
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const list: ContactMessage[] = [];
      snap.forEach((d) => {
        list.push(d.data() as ContactMessage);
      });
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      if (typeof window !== "undefined") {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
      }
      return list;
    }
  } catch (err) {
    console.warn("Firestore fetch contact messages error:", err);
  }

  // Fallback cache
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
  }

  return [];
};

/**
 * Admin tarafından mesaj durumunu güncelleme (okundu / arandı)
 */
export const updateMessageStatus = async (
  messageId: string,
  status: "new" | "read" | "contacted"
): Promise<void> => {
  try {
    const msgRef = doc(firestore, CONTACT_COLLECTION, messageId);
    await updateDoc(msgRef, { status });
  } catch (e) {
    console.warn("Firestore message status update error:", e);
  }
};

/**
 * Admin tarafından mesajı silme
 */
export const deleteContactMessage = async (messageId: string): Promise<void> => {
  try {
    const msgRef = doc(firestore, CONTACT_COLLECTION, messageId);
    await deleteDoc(msgRef);
  } catch (e) {
    console.warn("Firestore message delete error:", e);
  }

  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY) || "[]";
      const list: ContactMessage[] = JSON.parse(raw);
      const filtered = list.filter((m) => m.id !== messageId);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
    } catch {}
  }
};

