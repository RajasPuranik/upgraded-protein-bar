"use client";

import { ShoppingBag } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { ProductCard } from "@/components/product-card";
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
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
