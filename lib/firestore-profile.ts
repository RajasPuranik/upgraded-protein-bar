import { getFirebaseServices } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export type UserProfileData = {
  fullName?: string;
  phone?: string;
  street?: string;
  city?: string;
  state?: string;
  pincode?: string;
  coordinates?: [number, number] | null;
  updatedAt?: string;
};

export async function getUserProfile(userId: string): Promise<UserProfileData | null> {
  const services = getFirebaseServices();
  if (!services) return null;

  try {
    const docRef = doc(services.db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as UserProfileData;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

export async function updateUserProfile(userId: string, data: Partial<UserProfileData>): Promise<void> {
  const services = getFirebaseServices();
  if (!services) throw new Error("Firebase not initialized");

  const docRef = doc(services.db, "users", userId);
  
  await setDoc(docRef, {
    ...data,
    updatedAt: new Date().toISOString()
  }, { merge: true });
}
