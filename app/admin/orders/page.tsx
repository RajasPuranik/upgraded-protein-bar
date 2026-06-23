"use client";

import { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus, type Order, type OrderStatus } from "@/lib/firestore-orders";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    setLoading(true);
    getAllOrders()
      .then(fetchedOrders => {
        setOrders(fetchedOrders);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch orders", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      // Optimistic UI update
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      alert("Failed to update status.");
      console.error(err);
    }
  };

  if (loading && orders.length === 0) {
    return <div>Loading orders...</div>;
  }

  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  });

  return (
    <div>
      <h1 style={{ marginBottom: '30px' }}>Order Management</h1>

      <div style={{ background: 'var(--surface-color)', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
              <th style={{ padding: '15px 20px', fontWeight: '500' }}>Order ID & Date</th>
              <th style={{ padding: '15px 20px', fontWeight: '500' }}>Customer</th>
              <th style={{ padding: '15px 20px', fontWeight: '500' }}>Items</th>
              <th style={{ padding: '15px 20px', fontWeight: '500' }}>Total & UTR</th>
              <th style={{ padding: '15px 20px', fontWeight: '500' }}>Status / Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                
                {/* ID & Date */}
                <td style={{ padding: '15px 20px', fontSize: '0.9rem', verticalAlign: 'top' }}>
                  <strong>{order.id}</strong><br/>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>
                    {new Date(order.createdAt as any).toLocaleString()}
                  </span>
                </td>
                
                {/* Customer */}
                <td style={{ padding: '15px 20px', fontSize: '0.9rem', verticalAlign: 'top' }}>
                  <strong>{order.shippingAddress.fullName}</strong><br/>
                  <a href={`tel:${order.shippingAddress.phone}`} style={{ color: 'var(--primary-color)' }}>{order.shippingAddress.phone}</a><br/>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>
                    {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}
                  </span>
                </td>

                {/* Items */}
                <td style={{ padding: '15px 20px', fontSize: '0.85rem', verticalAlign: 'top' }}>
                  <ul style={{ margin: 0, paddingLeft: '15px', color: 'rgba(255,255,255,0.8)' }}>
                    {order.items.map(item => (
                      <li key={item.id}>{item.quantity}x {item.flavorName} ({item.sizeName})</li>
                    ))}
                  </ul>
                </td>

                {/* Total & UTR */}
                <td style={{ padding: '15px 20px', verticalAlign: 'top' }}>
                  <strong>{formatter.format(order.total)}</strong>
                  {order.utrNumber && (
                    <div style={{ marginTop: '10px', fontSize: '0.85rem', background: 'rgba(255,255,255,0.1)', padding: '5px 8px', borderRadius: '4px' }}>
                      <span style={{ color: 'rgba(255,255,255,0.6)' }}>UTR:</span><br/>
                      <strong style={{ letterSpacing: '1px' }}>{order.utrNumber}</strong>
                    </div>
                  )}
                </td>

                {/* Status / Action */}
                <td style={{ padding: '15px 20px', verticalAlign: 'top' }}>
                  <select 
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                    style={{
                      background: 'rgba(0,0,0,0.5)',
                      color: 'white',
                      border: '1px solid rgba(255,255,255,0.2)',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      outline: 'none',
                      cursor: 'pointer',
                      width: '100%',
                      borderColor: order.status === 'PENDING_VERIFICATION' ? 'orange' : 
                                   order.status === 'PAID' ? '#32cd32' : 'rgba(255,255,255,0.2)'
                    }}
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="PENDING_VERIFICATION">PENDING VERIFICATION (Check UTR)</option>
                    <option value="PAID">PAID (Verified)</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>

                  {order.status === "PENDING_VERIFICATION" && (
                    <button 
                      onClick={() => handleStatusChange(order.id, "PAID")}
                      className="button button--primary button--small"
                      style={{ marginTop: '10px', width: '100%', justifyContent: 'center' }}
                    >
                      Verify & Approve
                    </button>
                  )}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
        
        {orders.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>
            No orders found.
          </div>
        )}
      </div>
    </div>
  );
}
