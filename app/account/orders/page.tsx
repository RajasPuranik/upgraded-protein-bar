"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { getUserOrders, type Order } from "@/lib/firestore-orders";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function OrdersPage() {
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [fetching, setFetching] = useState(true);
  
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get("success") === "true";

  useEffect(() => {
    if (loading) return;
    
    if (!user) {
      setFetching(false);
      return;
    }

    getUserOrders(user.uid)
      .then(fetchedOrders => {
        setOrders(fetchedOrders);
        setFetching(false);
      })
      .catch(err => {
        console.error("Failed to fetch orders", err);
        setFetching(false);
      });
  }, [user, loading]);

  if (loading || fetching) {
    return <div style={{ padding: '150px 20px', textAlign: 'center' }}>Loading your orders...</div>;
  }

  if (!user) {
    return (
      <div style={{ padding: '150px 20px', textAlign: 'center', minHeight: '60vh' }}>
        <h2>Order History</h2>
        <p>Please login to view your orders.</p>
      </div>
    );
  }

  return (
    <div className="section-band" style={{ paddingTop: '120px', minHeight: '80vh', maxWidth: '1000px', margin: '0 auto' }}>
      {isSuccess && (
        <div style={{ background: 'rgba(50, 205, 50, 0.1)', border: '1px solid #32cd32', color: '#32cd32', padding: '15px', borderRadius: '8px', marginBottom: '30px' }}>
          🎉 Payment Successful! Your order has been placed.
        </div>
      )}

      <h2 style={{ marginBottom: '30px' }}>Your Orders</h2>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', background: 'var(--surface-color)', padding: '50px', borderRadius: '16px' }}>
          <p style={{ marginBottom: '20px' }}>You haven't placed any orders yet.</p>
          <Link href="/#products" className="button button--primary">Shop Now</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map(order => (
            <div key={order.id} style={{ background: 'var(--surface-color)', padding: '20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
                <div>
                  <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>Order ID: {order.id}</span>
                  <p style={{ margin: '5px 0 0 0' }}>Placed on: {new Date(order.createdAt as any).toLocaleDateString()}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ 
                    background: order.status === 'PAID' ? 'rgba(50,205,50,0.2)' : 'rgba(255,255,255,0.1)', 
                    color: order.status === 'PAID' ? '#32cd32' : 'white',
                    padding: '4px 10px', 
                    borderRadius: '20px', 
                    fontSize: '0.85rem',
                    fontWeight: 'bold'
                  }}>
                    {order.status}
                  </span>
                  <p style={{ margin: '5px 0 0 0', fontWeight: 'bold' }}>Rs. {order.total}</p>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '1rem', marginBottom: '10px' }}>Items</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  {order.items.map(item => (
                    <li key={item.id} style={{ color: 'rgba(255,255,255,0.8)' }}>
                      {item.quantity}x {item.sizeName} ({item.flavorName})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
