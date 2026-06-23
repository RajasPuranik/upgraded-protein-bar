import { Metadata } from "next";
import { blogPosts } from "@/lib/blog";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog & Nutrition Science | FuelBar",
  description: "Read about protein, recovery, sugar-free diets, and the science behind FuelBar.",
};

export default function BlogIndexPage() {
  return (
    <div style={{ minHeight: '100vh', paddingTop: '120px', background: 'var(--background-color)' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span className="eyebrow">FuelBar Journal</span>
          <h1 style={{ fontSize: '3rem', margin: '10px 0' }}>Nutrition Science & Insights</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
            Deep dives into protein, healthy snacking, and living a zero-added-sugar lifestyle.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
          {blogPosts.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <article style={{ 
                background: 'var(--surface-color)', 
                padding: '30px', 
                borderRadius: '16px', 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                cursor: 'pointer'
              }} className="blog-card">
                <div style={{ fontSize: '0.85rem', color: 'var(--primary-color)', marginBottom: '15px', fontWeight: 'bold' }}>
                  {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', lineHeight: 1.3 }}>{post.title}</h2>
                <p style={{ color: 'rgba(255,255,255,0.7)', flex: 1, marginBottom: '20px', lineHeight: 1.6 }}>{post.excerpt}</p>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-color)', fontWeight: 'bold' }}>
                  Read article <ArrowRight size={16} />
                </div>
              </article>
            </Link>
          ))}
        </div>

      </div>
      <style>{`
        .blog-card:hover { transform: translateY(-5px); }
      `}</style>
    </div>
  );
}
