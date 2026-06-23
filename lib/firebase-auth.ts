"use client";

import { onAuthStateChanged, signInAnonymously, signOut, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, type User } from "firebase/auth";
import { getFirebaseServices } from "@/lib/firebase";
import { getUserProfile, updateUserProfile } from "@/lib/firestore-profile";

export function subscribeToAuth(callback: (user: User | null) => void) {
  const services = getFirebaseServices();

  if (!services) {
    callback(null);
    return () => undefined;
  }

  return onAuthStateChanged(services.auth, callback);
}

export async function signInGuest() {
  const services = getFirebaseServices();

  if (!services) {
    return null;
  }

  const credential = await signInAnonymously(services.auth);
  return credential.user;
}

export async function signInWithGoogle() {
  const services = getFirebaseServices();

  if (!services) {
    return null;
  }

  const provider = new GoogleAuthProvider();
  const credential = await signInWithPopup(services.auth, provider);
  
  if (credential.user) {
    const existing = await getUserProfile(credential.user.uid);
    if (!existing) {
      await updateUserProfile(credential.user.uid, {
        fullName: credential.user.displayName || "",
      });
    }
  }
  
  return credential.user;
}

export async function signOutUser() {
  const services = getFirebaseServices();

  if (!services) {
    return;
  }

  await signOut(services.auth);
}

export async function signInWithEmail(email: string, pass: string) {
  const services = getFirebaseServices();
  if (!services) return null;
  const credential = await signInWithEmailAndPassword(services.auth, email, pass);
  return credential.user;
}

export async function registerWithEmail(email: string, pass: string, fullName: string) {
  const services = getFirebaseServices();
  if (!services) return null;
  const credential = await createUserWithEmailAndPassword(services.auth, email, pass);
  if (credential.user) {
    await updateProfile(credential.user, { displayName: fullName });
    await updateUserProfile(credential.user.uid, {
      fullName: fullName,
    });
  }
  return credential.user;
}
