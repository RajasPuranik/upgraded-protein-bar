"use client";

import { onAuthStateChanged, signInAnonymously, signOut, type User } from "firebase/auth";
import { getFirebaseServices } from "@/lib/firebase";

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

export async function signOutUser() {
  const services = getFirebaseServices();

  if (!services) {
    return;
  }

  await signOut(services.auth);
}
