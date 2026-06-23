"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import type { Product } from "@/lib/products";

const CART_STORAGE_KEY = "fuelbar-cart-v1";

export type CartItem = Pick<
  Product,
  | "id"
  | "flavorName"
  | "sizeName"
  | "weightGrams"
  | "price"
  | "calories"
  | "proteinGrams"
  | "description"
> & {
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  subtotal: number;
  deliveryFee: number;
  total: number;
  itemCount: number;
  addItem: (product: Product) => void;
  incrementItem: (productId: string) => void;
  decrementItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

function toCartItem(product: Product): CartItem {
  return {
    id: product.id,
    flavorName: product.flavorName,
    sizeName: product.sizeName,
    weightGrams: product.weightGrams,
    price: product.price,
    calories: product.calories,
    proteinGrams: product.proteinGrams,
    description: product.description,
    quantity: 1
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Cart is now strictly in-memory per user request to clear on refresh
    setItems([]);
  }, []);

  const addItem = useCallback((product: Product) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [...currentItems, toCartItem(product)];
    });
  }, []);

  const incrementItem = useCallback((productId: string) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }, []);

  const decrementItem = useCallback((productId: string) => {
    setItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: Math.max(0, item.quantity - 1) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );
  const deliveryFee = subtotal === 0 || subtotal >= 500 ? 0 : 60;
  const total = subtotal + deliveryFee;
  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      isOpen,
      subtotal,
      deliveryFee,
      total,
      itemCount,
      addItem,
      incrementItem,
      decrementItem,
      removeItem,
      clearCart,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false)
    }),
    [
      addItem,
      clearCart,
      decrementItem,
      deliveryFee,
      incrementItem,
      isOpen,
      itemCount,
      items,
      removeItem,
      subtotal,
      total
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
