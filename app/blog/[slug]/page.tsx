import { Metadata, ResolvingMetadata } from "next";
import { getPostBySlug } from "@/lib/blog";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type Props = {
  params: { slug: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Post Not Found | FuelBar",
    };
  }

  return {
    title: `${post.title} | FuelBar Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      authors: [post.author],
    },
  };
}

export default function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div style={{ minHeight: '100vh', paddingTop: '100px', background: 'var(--background-color)', paddingBottom: '100px' }}>
      <article style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
        
        <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', marginBottom: '40px', transition: 'color 0.2s' }} className="back-link">
          <ArrowLeft size={16} /> Back to Journal
        </Link>

        <header style={{ marginBottom: '50px', textAlign: 'center' }}>
          <div style={{ fontSize: '1rem', color: 'var(--primary-color)', marginBottom: '15px', fontWeight: 'bold' }}>
            {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <h1 style={{ fontSize: '3rem', margin: '0 0 20px 0', lineHeight: 1.2 }}>{post.title}</h1>
          <div style={{ color: 'rgba(255,255,255,0.6)' }}>By {post.author}</div>
        </header>

        <div 
          className="blog-content"
          style={{ lineHeight: 1.8, fontSize: '1.1rem', color: 'rgba(255,255,255,0.9)' }}
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />

      </article>

      <style>{`
        .back-link:hover { color: white !important; }
        .blog-content h2 { font-size: 2rem; margin-top: 40px; margin-bottom: 20px; color: white; }
        .blog-content p { margin-bottom: 25px; }
        .blog-content ul { margin-bottom: 25px; padding-left: 20px; }
        .blog-content li { margin-bottom: 10px; }
      `}</style>
    </div>
  );
}
