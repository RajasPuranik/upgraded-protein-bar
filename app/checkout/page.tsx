"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/cart-provider";
import { useAuth } from "@/components/auth-provider";
import { QRCodeSVG } from "qrcode.react";

function formatMoney(value: number) {
  return `Rs. ${value}`;
}

const UPI_ID = "rajastalk2u@oksbi";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, deliveryFee, total, clearCart } = useCart();
  const { user, loading, signIn } = useAuth();

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    email: "",
    street: "",
    city: "",
    state: "",
    pincode: ""
  });

  const [step, setStep] = useState<"ADDRESS" | "PAYMENT">("ADDRESS");
  const [utrNumber, setUtrNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate UPI deep link
  const upiUrl = `upi://pay?pa=${UPI_ID}&pn=FuelBar&am=${total}&cu=INR&tn=Order`;

  // If cart is empty, redirect to home
  useEffect(() => {
    if (items.length === 0) {
      router.push("/");
    }
  }, [items, router]);

  // Pre-fill email/name if logged in
  useEffect(() => {
    if (user) {
      setAddress(prev => ({
        ...prev,
        fullName: prev.fullName || user.displayName || "",
        email: prev.email || user.email || ""
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const proceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to continue checkout.");
      return;
    }
    setStep("PAYMENT");
  };

  const handleVerifyOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (utrNumber.length < 12) {
      setError("Please enter a valid 12-digit UTR/Transaction ID");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const createRes = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          subtotal,
          deliveryFee,
          total,
          shippingAddress: address,
          userId: user?.uid,
          utrNumber
        })
      });

      const orderData = await createRes.json();

      if (!createRes.ok) {
        throw new Error(orderData.error || "Failed to create order");
      }

      clearCart();
      router.push("/account/orders?success=true");
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setIsProcessing(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="section-band" style={{ paddingTop: '100px', minHeight: '80vh' }}>
      
      <div className="checkout-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Left Col: Address / Payment Form */}
        <div>
          <h2>Checkout</h2>
          
          {!loading && !user && (
            <div style={{ marginBottom: '20px', padding: '15px', background: 'var(--surface-color)', borderRadius: '8px' }}>
              <p style={{ marginBottom: '10px' }}>You must be logged in to order.</p>
              <button className="button button--secondary button--small" onClick={signIn} type="button">
                Login with Google
              </button>
            </div>
          )}

          {step === "ADDRESS" ? (
            <form onSubmit={proceedToPayment} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <h3>Shipping Details</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <label>
                  Full Name
                  <input required type="text" name="fullName" value={address.fullName} onChange={handleChange} disabled={!user} />
                </label>
                <label>
                  Phone
                  <input required type="tel" name="phone" value={address.phone} onChange={handleChange} disabled={!user} />
                </label>
              </div>

              <label>
                Email
                <input required type="email" name="email" value={address.email} onChange={handleChange} disabled={!user} />
              </label>

              <label>
                Street Address
                <input required type="text" name="street" value={address.street} onChange={handleChange} disabled={!user} />
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                <label>
                  City
                  <input required type="text" name="city" value={address.city} onChange={handleChange} disabled={!user} />
                </label>
                <label>
                  State
                  <input required type="text" name="state" value={address.state} onChange={handleChange} disabled={!user} />
                </label>
                <label>
                  PIN Code
                  <input required type="text" name="pincode" value={address.pincode} onChange={handleChange} disabled={!user} />
                </label>
              </div>

              <button 
                className="button button--primary" 
                type="submit" 
                disabled={!user}
                style={{ marginTop: '20px', width: '100%', justifyContent: 'center' }}
              >
                Proceed to Payment
              </button>
            </form>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3>Pay with GPay / UPI</h3>
              <p>Scan the QR code or tap the button below to pay <strong>{formatMoney(total)}</strong>.</p>
              
              <div style={{ background: 'white', padding: '20px', borderRadius: '12px', alignSelf: 'flex-start' }}>
                <QRCodeSVG value={upiUrl} size={200} />
              </div>

              <a 
                href={upiUrl}
                className="button button--primary"
                style={{ width: 'fit-content' }}
              >
                Pay with GPay app
              </a>

              <form onSubmit={handleVerifyOrder} style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
                <label>
                  Enter 12-digit UTR / Transaction ID (after paying)
                  <input 
                    required 
                    type="text" 
                    value={utrNumber} 
                    onChange={e => setUtrNumber(e.target.value)} 
                    placeholder="e.g. 301234567890"
                    disabled={isProcessing}
                    style={{ marginTop: '10px' }}
                  />
                </label>

                {error && <p style={{ color: 'var(--danger-color)', marginTop: '10px' }}>{error}</p>}

                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                  <button type="button" className="button button--ghost" onClick={() => setStep("ADDRESS")} disabled={isProcessing}>Back</button>
                  <button type="submit" className="button button--primary" disabled={isProcessing}>
                    {isProcessing ? "Verifying..." : "Confirm Payment"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Right Col: Order Summary */}
        <div style={{ background: 'var(--surface-color)', padding: '30px', borderRadius: '16px', height: 'fit-content' }}>
          <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px', marginBottom: '20px' }}>Order Summary</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
            {items.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{item.quantity}x {item.sizeName} ({item.flavorName})</span>
                <strong>{formatMoney(item.price * item.quantity)}</strong>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Subtotal</span>
              <span>{formatMoney(subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Delivery</span>
              <span>{deliveryFee === 0 ? "Free" : formatMoney(deliveryFee)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', marginTop: '10px', color: 'var(--primary-color)' }}>
              <strong>Total</strong>
              <strong>{formatMoney(total)}</strong>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
