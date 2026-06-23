"use client";

import { MessageCircle, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";

export function CtaSection() {
  const { itemCount, openCart } = useCart();

  return (
    <section className="cta section-band" id="order">
      <span className="eyebrow">Ready to fuel up?</span>
      <h2>Build your box today.</h2>
      <p>
        Mix flavors, mix sizes, and unlock free pan-India delivery once the cart
        crosses Rs. 500.
      </p>
      <div className="cta__actions">
        <button className="button button--primary" onClick={openCart} type="button">
          <ShoppingBag size={18} />
          {itemCount > 0 ? `Open cart (${itemCount})` : "Open cart"}
        </button>
        <a
          className="button button--whatsapp"
          href="https://wa.me/916263099627?text=Hi%20FuelBar%2C%20please%20share%20today%27s%20available%20protein%20bar%20flavors."
          rel="noreferrer"
          target="_blank"
        >
          <MessageCircle size={18} />
          Ask on WhatsApp
        </a>
      </div>
      <div className="order-steps" aria-label="Order steps">
        {["Pick bars", "Add to cart", "Share on WhatsApp", "Get delivered"].map((step, index) => (
          <div key={step}>
            <strong>{String(index + 1).padStart(2, "0")}</strong>
            <span>{step}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
