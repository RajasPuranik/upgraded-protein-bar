import { collection, doc, setDoc, getDocs, query, where, orderBy, Timestamp } from "firebase/firestore";
import { getFirebaseServices } from "@/lib/firebase";
import type { CartItem } from "@/components/cart/cart-provider";

export type OrderStatus = "PENDING" | "PENDING_VERIFICATION" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export type ShippingAddress = {
  fullName: string;
  phone: string;
  email: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
};

export type Order = {
  id: string; // Razorpay order ID or custom ID
  userId: string | null; // null if guest checkout, though we prefer logged-in
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  createdAt: Timestamp | Date;
  utrNumber?: string; // For GPay / UPI tracking
  razorpayPaymentId?: string;
  razorpaySignature?: string;
};

const ORDERS_COLLECTION = "orders";

export async function createOrder(orderData: Omit<Order, "createdAt">): Promise<void> {
  const services = getFirebaseServices();
  if (!services) throw new Error("Firebase not configured");

  const orderRef = doc(services.db, ORDERS_COLLECTION, orderData.id);
  await setDoc(orderRef, {
    ...orderData,
    createdAt: Timestamp.now()
  });
}

export async function updateOrderStatus(
  orderId: string, 
  status: OrderStatus, 
  paymentDetails?: { razorpayPaymentId: string; razorpaySignature: string }
): Promise<void> {
  const services = getFirebaseServices();
  if (!services) throw new Error("Firebase not configured");

  const orderRef = doc(services.db, ORDERS_COLLECTION, orderId);
  const updateData: any = { status };
  
  if (paymentDetails) {
    updateData.razorpayPaymentId = paymentDetails.razorpayPaymentId;
    updateData.razorpaySignature = paymentDetails.razorpaySignature;
  }

  await setDoc(orderRef, updateData, { merge: true });
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  const services = getFirebaseServices();
  if (!services) return [];

  const ordersRef = collection(services.db, ORDERS_COLLECTION);
  const q = query(
    ordersRef,
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      createdAt: data.createdAt?.toDate() || new Date()
    } as Order;
  });
}

export async function getAllOrders(): Promise<Order[]> {
  const services = getFirebaseServices();
  if (!services) return [];

  const ordersRef = collection(services.db, ORDERS_COLLECTION);
  const q = query(ordersRef, orderBy("createdAt", "desc"));

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      createdAt: data.createdAt?.toDate() || new Date()
    } as Order;
  });
}
