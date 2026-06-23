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
