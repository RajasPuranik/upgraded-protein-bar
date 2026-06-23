"use client";

import { ShoppingBag, Plus, Minus } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { ProductVisual } from "@/components/sections/product-visual";
import type { Product } from "@/lib/products";
import Link from "next/link";

function formatMoney(value: number) {
  return `Rs. ${value}`;
}

export function ProductCard({ product }: { product: Product }) {
  const { addItem, items, incrementItem, decrementItem } = useCart();

  const proteinFill = Math.min(100, Math.round((product.proteinGrams / 25) * 100));
  const calorieFill = Math.min(100, Math.round((product.calories / 290) * 100));

  const cartItem = items.find(item => item.id === product.id);

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
            
            {cartItem ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '24px', padding: '2px' }}>
                <button 
                  onClick={() => decrementItem(product.id)} 
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', background: 'var(--surface-color)', color: 'white', border: 'none', cursor: 'pointer' }}
                >
                  <Minus size={14} />
                </button>
                <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: 'bold' }}>{cartItem.quantity}</span>
                <button 
                  onClick={() => incrementItem(product.id)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary-color)', color: 'black', border: 'none', cursor: 'pointer' }}
                >
                  <Plus size={14} />
                </button>
              </div>
            ) : (
              <button className="button button--secondary button--small" onClick={() => addItem(product)} type="button">
                <ShoppingBag size={16} style={{ marginRight: '5px' }} />
                Add
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
