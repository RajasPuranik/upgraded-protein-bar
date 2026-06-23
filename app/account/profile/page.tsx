"use client";

import { useAuth } from "@/components/auth-provider";
import { useState } from "react";
import { updateProfile } from "firebase/auth";

export default function ProfilePage() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  if (!user) {
    return (
      <div style={{ padding: '50px 20px', textAlign: 'center' }}>
        <p>Please login to view your profile.</p>
      </div>
    );
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage("");

    try {
      await updateProfile(user, { displayName });
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

      <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '500px' }}>
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
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }} 
          />
        </div>

        <button type="submit" className="button button--primary" disabled={isSaving} style={{ width: 'fit-content', marginTop: '10px' }}>
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
