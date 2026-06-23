"use client";

import { Menu, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { useAuth } from "@/components/auth-provider";
import Link from "next/link";

const navLinks = [
  { href: "#products", label: "Products" },
  { href: "#nutrition", label: "Nutrition" },
  { href: "#ingredients", label: "Ingredients" },
  { href: "#delivery", label: "Delivery" }
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { itemCount, openCart } = useCart();
  const { user, loading, signIn } = useAuth();

  return (
    <header className="navbar">
      <a className="brand" href="#top" onClick={() => setIsMenuOpen(false)}>
        Fuel<span>Bar</span>
      </a>

      <nav className="navbar__links" aria-label="Main navigation">
        {navLinks.map((link) => (
          <a href={link.href} key={link.href}>
            {link.label}
          </a>
        ))}
      </nav>

      <div className="navbar__actions">
        <button className="button button--small" onClick={openCart} type="button">
          <ShoppingBag size={17} />
          Cart
          {itemCount > 0 ? <span className="button__count">{itemCount}</span> : null}
        </button>
        {loading ? null : user ? (
          <Link className="button button--small button--secondary" href="/account/orders">
            Account
          </Link>
        ) : (
          <button className="button button--small button--secondary" onClick={signIn} type="button">
            Login
          </button>
        )}
        <button
          aria-label="Open navigation"
          className="icon-button navbar__menu-button"
          onClick={() => setIsMenuOpen(true)}
          type="button"
        >
          <Menu size={21} />
        </button>
      </div>

      <div className={`mobile-menu ${isMenuOpen ? "is-open" : ""}`}>
        <button
          aria-label="Close navigation"
          className="icon-button mobile-menu__close"
          onClick={() => setIsMenuOpen(false)}
          type="button"
        >
          <X size={22} />
        </button>
        {navLinks.map((link) => (
          <a href={link.href} key={link.href} onClick={() => setIsMenuOpen(false)}>
            {link.label}
          </a>
        ))}
        <button
          className="button button--primary"
          onClick={() => {
            setIsMenuOpen(false);
            openCart();
          }}
          type="button"
        >
          <ShoppingBag size={18} />
          Open cart
        </button>
      </div>
    </header>
  );
}
