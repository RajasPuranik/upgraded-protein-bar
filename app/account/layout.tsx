"use client";

import { useAuth } from "@/components/auth-provider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, User, Package } from "lucide-react";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut } = useAuth();
  const pathname = usePathname();

  if (loading) {
    return <div style={{ padding: '150px 20px', textAlign: 'center' }}>Loading...</div>;
  }

  if (!user) {
    return children; // let individual pages handle not-logged-in state
  }

  return (
    <div className="section-band" style={{ paddingTop: '120px', minHeight: '80vh', maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
      
      {/* Sidebar Navigation */}
      <aside style={{ width: '250px', background: 'var(--surface-color)', padding: '20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '10px', flexShrink: 0 }}>
        <h3 style={{ marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>My Account</h3>
        
        <Link 
          href="/account/profile" 
          style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '8px', textDecoration: 'none', background: pathname === '/account/profile' ? 'rgba(255,255,255,0.1)' : 'transparent', color: pathname === '/account/profile' ? 'var(--text)' : 'var(--muted)' }}
        >
          <User size={18} /> Profile
        </Link>
        
        <Link 
          href="/account/orders" 
          style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '8px', textDecoration: 'none', background: pathname === '/account/orders' ? 'rgba(255,255,255,0.1)' : 'transparent', color: pathname === '/account/orders' ? 'var(--text)' : 'var(--muted)' }}
        >
          <Package size={18} /> Orders
        </Link>
        
        <button 
          onClick={signOut} 
          style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '8px', textDecoration: 'none', background: 'transparent', color: 'var(--danger-color)', border: 'none', cursor: 'pointer', textAlign: 'left', marginTop: 'auto' }}
        >
          <LogOut size={18} /> Sign Out
        </button>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, background: 'var(--surface-color)', padding: '30px', borderRadius: '12px' }}>
        {children}
      </main>

    </div>
  );
}
