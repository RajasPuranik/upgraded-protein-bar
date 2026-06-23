"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { signInWithEmail } from "@/lib/firebase-auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, user } = useAuth();
  const router = useRouter();

  if (user) {
    router.push("/account/orders");
    return null;
  }

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await signInWithEmail(email, password);
      router.push("/account/orders");
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please check your credentials.");
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn();
      router.push("/account/orders");
    } catch (err: any) {
      setError(err.message || "Failed to sign in with Google.");
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 20px', background: 'var(--background-color)' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', marginBottom: '30px' }} className="back-link">
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <h1 style={{ marginBottom: '10px' }}>Welcome Back</h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '30px' }}>Sign in to continue to FuelBar.</p>

        {error && <div style={{ background: 'rgba(255,99,71,0.1)', color: 'var(--danger-color)', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>{error}</div>}

        <form onSubmit={handleEmailSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            Email
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            Password
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
          </label>
          <button type="submit" className="button button--primary" disabled={isSubmitting} style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', margin: '30px 0', color: 'rgba(255,255,255,0.5)' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
          <span>OR</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
        </div>

        <button onClick={handleGoogleSignIn} className="button button--secondary" style={{ width: '100%', justifyContent: 'center' }}>
          Sign In with Google
        </button>

        <p style={{ textAlign: 'center', marginTop: '30px', color: 'rgba(255,255,255,0.7)' }}>
          Don't have an account? <Link href="/register" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 'bold' }}>Sign Up</Link>
        </p>
      </div>
      <style>{`
        .back-link:hover { color: white !important; }
      `}</style>
    </div>
  );
}
