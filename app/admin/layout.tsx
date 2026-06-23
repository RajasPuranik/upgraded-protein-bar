"use client";

import { AdminGuard } from "@/components/admin-guard";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingCart, Package } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const links = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
    { href: "/admin/products", label: "Products", icon: Package },
  ];

  return (
    <AdminGuard>
      <div style={{ display: 'flex', minHeight: '100vh', paddingTop: '70px' }}>
        
        {/* Sidebar */}
        <aside style={{ width: '250px', background: 'var(--surface-color)', padding: '30px 20px', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '30px', color: 'var(--primary-color)' }}>Admin Panel</h2>
          
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {links.map(link => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.href} 
                  href={link.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    background: isActive ? 'rgba(226, 254, 83, 0.1)' : 'transparent',
                    color: isActive ? 'var(--primary-color)' : 'white',
                    textDecoration: 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  <Icon size={18} />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, padding: '40px', background: 'var(--background-color)', overflowY: 'auto' }}>
          {children}
        </main>
        
      </div>
    </AdminGuard>
  );
}
