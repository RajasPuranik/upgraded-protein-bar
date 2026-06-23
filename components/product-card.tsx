"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { ProductVisual } from "@/components/sections/product-visual";
import type { Product } from "@/lib/products";
import Link from "next/link";

function formatMoney(value: number) {
  return `Rs. ${value}`;
}

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  const proteinFill = Math.min(100, Math.round((product.proteinGrams / 25) * 100));
  const calorieFill = Math.min(100, Math.round((product.calories / 290) * 100));

  return (
    <article className="product-card" style={{ position: 'relative' }}>
      {product.badge ? <span className="product-card__badge">{product.badge}</span> : null}
      
      <Link href={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
        <div className="product-card__visual">
          <ProductVisual flavorKey={product.flavorKey} sizeKey={product.sizeKey} />
        </div>
      </Link>

      <div className="product-card__body">
        <span className="product-card__meta">
          {product.weightGrams}g - {product.flavorName}
        </span>
        
        <Link href={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3>{product.sizeName}</h3>
        </Link>
        
        <p>{product.description}</p>

        <div className="meter">
          <div>
            <span>Protein</span>
            <strong>{product.proteinGrams}g</strong>
          </div>
          <div className="meter__track">
            <span style={{ width: `${proteinFill}%` }} />
          </div>
        </div>
        <div className="meter meter--energy">
          <div>
            <span>Energy</span>
            <strong>{product.calories} kcal</strong>
          </div>
          <div className="meter__track">
            <span style={{ width: `${calorieFill}%` }} />
          </div>
        </div>

        <div className="product-card__footer">
          <strong>{formatMoney(product.price)}</strong>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link href={`/product/${product.id}`} className="button button--ghost button--small">
              Details
            </Link>
            <button className="button button--primary button--small" onClick={() => addItem(product)} type="button">
              <ShoppingBag size={16} style={{ marginRight: '5px' }} />
              Add
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
