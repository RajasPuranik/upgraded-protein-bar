"use client";

import { collection, getDocs } from "firebase/firestore";
import { getFirebaseServices } from "@/lib/firebase";
import { products, type Product } from "@/lib/products";

export const PRODUCTS_COLLECTION = "products";

function isProduct(value: Partial<Product>): value is Product {
  return Boolean(
    value.id &&
      value.flavorKey &&
      value.sizeKey &&
      typeof value.price === "number" &&
      typeof value.weightGrams === "number"
  );
}

export async function readProductsFromFirestore(): Promise<Product[] | null> {
  const services = getFirebaseServices();

  if (!services) {
    return null;
  }

  const snapshot = await getDocs(collection(services.db, PRODUCTS_COLLECTION));
  const firestoreProducts = snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() } as Partial<Product>))
    .filter(isProduct)
    .filter((product) => product.active)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return firestoreProducts.length ? firestoreProducts : products;
}

export async function createProduct(productData: Product): Promise<void> {
  const services = getFirebaseServices();
  if (!services) throw new Error("Firebase not configured");
  
  const { doc, setDoc } = await import("firebase/firestore");
  const productRef = doc(services.db, PRODUCTS_COLLECTION, productData.id);
  await setDoc(productRef, productData);
}

export async function updateProduct(productId: string, updates: Partial<Product>): Promise<void> {
  const services = getFirebaseServices();
  if (!services) throw new Error("Firebase not configured");
  
  const { doc, updateDoc } = await import("firebase/firestore");
  const productRef = doc(services.db, PRODUCTS_COLLECTION, productId);
  await updateDoc(productRef, updates as any);
}

export async function deleteProduct(productId: string): Promise<void> {
  const services = getFirebaseServices();
  if (!services) throw new Error("Firebase not configured");
  
  const { doc, deleteDoc } = await import("firebase/firestore");
  const productRef = doc(services.db, PRODUCTS_COLLECTION, productId);
  await deleteDoc(productRef);
}
