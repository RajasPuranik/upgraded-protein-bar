"use client";

import { useEffect, useState } from "react";
import { getAllOrders, type Order } from "@/lib/firestore-orders";
import { IndianRupee, ShoppingCart, Clock } from "lucide-react";

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllOrders()
      .then(fetchedOrders => {
        setOrders(fetchedOrders);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch orders", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  const totalRevenue = orders
    .filter(o => o.status === "PAID" || o.status === "SHIPPED" || o.status === "DELIVERED")
    .reduce((sum, order) => sum + order.total, 0);

  const pendingCount = orders.filter(o => o.status === "PENDING_VERIFICATION").length;
  
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  });

  return (
    <div>
      <h1 style={{ marginBottom: '30px' }}>Dashboard Overview</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        
        {/* Metric Card */}
        <div style={{ background: 'var(--surface-color)', padding: '24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ background: 'rgba(226, 254, 83, 0.1)', padding: '15px', borderRadius: '50%', color: 'var(--primary-color)' }}>
            <IndianRupee size={24} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>Total Revenue</p>
            <h2 style={{ margin: '5px 0 0 0', fontSize: '1.8rem' }}>{formatter.format(totalRevenue)}</h2>
          </div>
        </div>

        {/* Metric Card */}
        <div style={{ background: 'var(--surface-color)', padding: '24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '15px', borderRadius: '50%', color: 'white' }}>
            <ShoppingCart size={24} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>Total Orders</p>
            <h2 style={{ margin: '5px 0 0 0', fontSize: '1.8rem' }}>{orders.length}</h2>
          </div>
        </div>

        {/* Metric Card */}
        <div style={{ background: 'var(--surface-color)', padding: '24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '20px', border: pendingCount > 0 ? '1px solid var(--danger-color)' : 'none' }}>
          <div style={{ background: 'rgba(255, 99, 71, 0.1)', padding: '15px', borderRadius: '50%', color: 'var(--danger-color)' }}>
            <Clock size={24} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>Pending Verification</p>
            <h2 style={{ margin: '5px 0 0 0', fontSize: '1.8rem' }}>{pendingCount}</h2>
          </div>
        </div>

      </div>

      <h2>Recent Orders</h2>
      <div style={{ background: 'var(--surface-color)', borderRadius: '12px', overflow: 'hidden', marginTop: '20px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
              <th style={{ padding: '15px 20px', fontWeight: '500' }}>Order ID</th>
              <th style={{ padding: '15px 20px', fontWeight: '500' }}>Date</th>
              <th style={{ padding: '15px 20px', fontWeight: '500' }}>Customer</th>
              <th style={{ padding: '15px 20px', fontWeight: '500' }}>Status</th>
              <th style={{ padding: '15px 20px', fontWeight: '500' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 5).map(order => (
              <tr key={order.id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '15px 20px', fontSize: '0.9rem' }}>{order.id}</td>
                <td style={{ padding: '15px 20px', fontSize: '0.9rem' }}>{new Date(order.createdAt as any).toLocaleDateString()}</td>
                <td style={{ padding: '15px 20px', fontSize: '0.9rem' }}>{order.shippingAddress.fullName}</td>
                <td style={{ padding: '15px 20px' }}>
                  <span style={{ 
                    fontSize: '0.8rem', 
                    padding: '4px 8px', 
                    borderRadius: '4px',
                    background: order.status === 'PAID' ? 'rgba(50,205,50,0.2)' : 
                               order.status === 'PENDING_VERIFICATION' ? 'rgba(255,165,0,0.2)' : 'rgba(255,255,255,0.1)',
                    color: order.status === 'PAID' ? '#32cd32' : 
                           order.status === 'PENDING_VERIFICATION' ? 'orange' : 'white'
                  }}>
                    {order.status}
                  </span>
                </td>
                <td style={{ padding: '15px 20px', fontWeight: 'bold' }}>{formatter.format(order.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
