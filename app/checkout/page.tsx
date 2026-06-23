"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/cart-provider";
import { useAuth } from "@/components/auth-provider";
import { QRCodeSVG } from "qrcode.react";
import dynamic from "next/dynamic";

import { getUserProfile } from "@/lib/firestore-profile";

const MapPicker = dynamic(() => import("@/components/map-picker"), { ssr: false });

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

  const [position, setPosition] = useState<[number, number] | null>(null);

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

  // Pre-fill profile data if logged in
  useEffect(() => {
    if (user) {
      getUserProfile(user.uid).then(profile => {
        setAddress(prev => ({
          ...prev,
          fullName: profile?.fullName || user.displayName || "",
          phone: profile?.phone || "",
          email: user.email || "",
          street: profile?.street || "",
          city: profile?.city || "",
          state: profile?.state || "",
          pincode: profile?.pincode || ""
        }));
        if (profile?.coordinates) {
          setPosition(profile.coordinates);
        }
      });
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
    if (!position) {
      alert("Please drop a pin on the map for your delivery location.");
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
          shippingAddress: { ...address, coordinates: position },
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
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px' }}>Pin your delivery location</label>
                <MapPicker position={position} setPosition={setPosition} />
                {!position && <p style={{ color: 'var(--primary-color)', fontSize: '0.85rem', marginTop: '5px' }}>Click on the map to set your location.</p>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span>Full Name</span>
                  <input className="input-field" required type="text" name="fullName" value={address.fullName} onChange={handleChange} disabled={!user} />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span>Phone</span>
                  <input className="input-field" required type="tel" name="phone" value={address.phone} onChange={handleChange} disabled={!user} />
                </label>
              </div>

              <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '15px' }}>
                <span>Email</span>
                <input className="input-field" required type="email" name="email" value={address.email} onChange={handleChange} disabled={!user} />
              </label>

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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center', textAlign: 'center', background: 'var(--surface-strong)', padding: '30px', borderRadius: '16px' }}>
              <div>
                <h3 style={{ margin: '0 0 8px 0' }}>Pay with UPI</h3>
                <p style={{ margin: 0, color: 'var(--muted)' }}>Scan the QR code with any UPI app to pay <strong>{formatMoney(total)}</strong>.</p>
              </div>
              
              <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', display: 'inline-block' }}>
                <QRCodeSVG value={upiUrl} size={220} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', width: '100%' }}>
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', flex: 1 }} />
                <span style={{ color: 'var(--muted)', fontSize: '0.85rem', fontWeight: 600 }}>OR TAP TO PAY</span>
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', flex: 1 }} />
              </div>

              <a 
                href={upiUrl}
                className="button button--primary"
                style={{ width: '100%', maxWidth: '300px', height: '48px', fontSize: '1.1rem' }}
              >
                Open GPay / PhonePe App
              </a>

              <form onSubmit={handleVerifyOrder} style={{ width: '100%', marginTop: '10px', textAlign: 'left' }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span>Enter 12-digit UTR / Transaction ID (after paying)</span>
                  <input 
                    className="input-field"
                    required 
                    type="text" 
                    value={utrNumber} 
                    onChange={e => setUtrNumber(e.target.value)} 
                    placeholder="e.g. 301234567890"
                    disabled={isProcessing}
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
