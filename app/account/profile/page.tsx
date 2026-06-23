"use client";

import { useAuth } from "@/components/auth-provider";
import { useState, useEffect } from "react";
import { updateProfile } from "firebase/auth";
import { getUserProfile, updateUserProfile } from "@/lib/firestore-profile";
import dynamic from "next/dynamic";

const MapPicker = dynamic(() => import("@/components/map-picker"), { ssr: false });

export default function ProfilePage() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState("");
  
  const [address, setAddress] = useState({
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: ""
  });
  
  const [position, setPosition] = useState<[number, number] | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      getUserProfile(user.uid).then(profile => {
        if (profile) {
          setAddress({
            phone: profile.phone || "",
            street: profile.street || "",
            city: profile.city || "",
            state: profile.state || "",
            pincode: profile.pincode || ""
          });
          if (profile.coordinates) {
            setPosition(profile.coordinates);
          }
        }
        setIsFetching(false);
      }).catch(() => {
        setIsFetching(false);
      });
    }
  }, [user]);

  if (!user) {
    return (
      <div style={{ padding: '50px 20px', textAlign: 'center' }}>
        <p>Please login to view your profile.</p>
      </div>
    );
  }

  if (isFetching) {
    return <div style={{ padding: '50px 20px', textAlign: 'center' }}>Loading profile...</div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage("");

    try {
      if (user.displayName !== displayName) {
        await updateProfile(user, { displayName });
      }
      
      await updateUserProfile(user.uid, {
        fullName: displayName,
        phone: address.phone,
        street: address.street,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        coordinates: position
      });

      setMessage("Profile updated successfully!");
    } catch (err: any) {
      setMessage(err.message || "Failed to update profile.");
    }
    
    setIsSaving(false);
  };

  return (
    <div>
      <h2 style={{ marginBottom: '30px' }}>Your Profile</h2>

      {message && (
        <div style={{ 
          background: message.includes("success") ? 'rgba(50,205,50,0.1)' : 'rgba(255,99,71,0.1)', 
          color: message.includes("success") ? '#32cd32' : 'var(--danger-color)', 
          padding: '15px', borderRadius: '8px', marginBottom: '20px' 
        }}>
          {message}
        </div>
      )}

      <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '600px' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ color: 'var(--muted)' }}>Email Address (Cannot be changed)</label>
            <input 
              type="email" 
              value={user.email || ""} 
              disabled 
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)', color: 'rgba(255,255,255,0.5)' }} 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ color: 'var(--muted)' }}>Full Name</label>
            <input 
              type="text" 
              value={displayName} 
              onChange={e => setDisplayName(e.target.value)} 
              required
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }} 
            />
          </div>
        </div>

        <h3 style={{ marginTop: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>Delivery Address</h3>

        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '10px', color: 'var(--muted)' }}>Default delivery location (Map)</label>
          <MapPicker position={position} setPosition={setPosition} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ color: 'var(--muted)' }}>Phone Number</span>
            <input required type="tel" name="phone" value={address.phone} onChange={handleChange} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ color: 'var(--muted)' }}>Street Address</span>
            <input required type="text" name="street" value={address.street} onChange={handleChange} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
          </label>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ color: 'var(--muted)' }}>City</span>
            <input required type="text" name="city" value={address.city} onChange={handleChange} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ color: 'var(--muted)' }}>State</span>
            <input required type="text" name="state" value={address.state} onChange={handleChange} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ color: 'var(--muted)' }}>PIN Code</span>
            <input required type="text" name="pincode" value={address.pincode} onChange={handleChange} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
          </label>
        </div>

        <button type="submit" className="button button--primary" disabled={isSaving} style={{ width: 'fit-content', marginTop: '20px' }}>
          {isSaving ? "Saving..." : "Save Profile & Address"}
        </button>
      </form>
    </div>
  );
}
