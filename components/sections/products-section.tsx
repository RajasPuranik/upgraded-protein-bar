"use client";

import { ShoppingBag } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { ProductVisual } from "@/components/sections/product-visual";
import { readProductsFromFirestore } from "@/lib/firestore-products";
import {
  flavorOptions,
  getProductsByFlavor,
  products as localProducts,
  type FlavorKey,
  type Product
} from "@/lib/products";

function formatMoney(value: number) {
  return `Rs. ${value}`;
}

export function ProductsSection() {
  const [selectedFlavor, setSelectedFlavor] = useState<FlavorKey>("chocolate-hazelnut");
  const [catalog, setCatalog] = useState<Product[]>(localProducts);
  const { addItem } = useCart();

  useEffect(() => {
    let isMounted = true;

    readProductsFromFirestore()
      .then((firestoreProducts) => {
        if (isMounted && firestoreProducts?.length) {
          setCatalog(firestoreProducts);
        }
      })
      .catch(() => {
        if (isMounted) {
          setCatalog(localProducts);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const visibleProducts = useMemo(
    () => getProductsByFlavor(selectedFlavor, catalog),
    [catalog, selectedFlavor]
  );

  return (
    <section className="products section-band" id="products">
      <div className="section-heading">
        <span className="eyebrow">Protein bar lineup</span>
        <h2>Pick your flavor. Match your hunger.</h2>
        <p>Every bar uses 25% complete whey protein and natural sweeteners.</p>
      </div>

      <div className="segmented-control" role="tablist" aria-label="Flavor tabs">
        {flavorOptions.map((flavor) => (
          <button
            aria-selected={selectedFlavor === flavor.key}
            className={selectedFlavor === flavor.key ? "is-active" : ""}
            key={flavor.key}
            onClick={() => setSelectedFlavor(flavor.key)}
            role="tab"
            type="button"
          >
            <strong>{flavor.label}</strong>
            <span>{flavor.note}</span>
          </button>
        ))}
      </div>

      <div className="product-grid">
        {visibleProducts.map((product) => {
          const proteinFill = Math.min(100, Math.round((product.proteinGrams / 25) * 100));
          const calorieFill = Math.min(100, Math.round((product.calories / 290) * 100));

          return (
            <article className="product-card" key={product.id}>
              {product.badge ? <span className="product-card__badge">{product.badge}</span> : null}
              <div className="product-card__visual">
                <ProductVisual flavorKey={product.flavorKey} sizeKey={product.sizeKey} />
              </div>
              <div className="product-card__body">
                <span className="product-card__meta">
                  {product.weightGrams}g - {product.flavorName}
                </span>
                <h3>{product.sizeName}</h3>
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
                  <button className="button button--primary" onClick={() => addItem(product)} type="button">
                    <ShoppingBag size={18} />
                    Add
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
