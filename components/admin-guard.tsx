"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";

const ADMIN_EMAIL = "rajastalk2u@gmail.com"; 

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    
    // If no user is logged in, or the email doesn't match, kick them out
    if (!user || user.email !== ADMIN_EMAIL) {
      router.replace("/");
    }
  }, [user, loading, router]);

  if (loading || !user || user.email !== ADMIN_EMAIL) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Checking permissions...</p>
      </div>
    );
  }

  return <>{children}</>;
}
