import { Metadata, ResolvingMetadata } from "next";
import { readProductsFromFirestore } from "@/lib/firestore-products";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(
  props: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  const products = await readProductsFromFirestore();
  const product = products?.find(p => p.id === params.id);

  if (!product) {
    return {
      title: "Product Not Found | FuelBar",
    };
  }

  return {
    title: `${product.flavorName} - ${product.sizeName} | FuelBar`,
    description: `${product.tagline}. ${product.proteinGrams}g of premium whey protein, 0g added sugar. Order now for Rs. ${product.price}.`,
    openGraph: {
      title: `${product.flavorName} Protein Bar | FuelBar`,
      description: `${product.proteinGrams}g protein, zero sugar. Order yours today.`,
      images: ['/og-image.jpg'],
    },
  };
}

export default async function ProductPage(props: Props) {
  const params = await props.params;
  const products = await readProductsFromFirestore();
  const product = products?.find(p => p.id === params.id);

  if (!product) {
    notFound();
  }

  return (
    <div style={{ minHeight: '100vh', paddingTop: '100px', background: 'var(--background-color)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        
        <Link href="/#products" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', marginBottom: '40px', transition: 'color 0.2s' }} className="back-link">
          <ArrowLeft size={16} /> Back to all products
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px', maxWidth: '600px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h1 style={{ fontSize: '3rem', margin: '0 0 10px 0', lineHeight: 1.1 }}>{product.flavorName}</h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--primary-color)', margin: 0 }}>{product.tagline}</p>
          </div>

          <ProductCard product={product} />

          <div style={{ background: 'var(--surface-color)', padding: '30px', borderRadius: '16px', marginTop: '20px' }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Nutritional Information</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>Protein</span>
                <strong>{product.proteinGrams}g</strong>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>Weight</span>
                <strong>{product.weightGrams}g</strong>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px' }}>
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>Added Sugar</span>
                <strong>0g</strong>
              </li>
            </ul>
          </div>

        </div>
      </div>
      <style>{`
        .back-link:hover { color: white !important; }
      `}</style>
    </div>
  );
}
