"use client";

import { MessageCircle, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useCart } from "@/components/cart/cart-provider";

function formatMoney(value: number) {
  return `Rs. ${value}`;
}

export function CartDrawer() {
  const {
    clearCart,
    closeCart,
    decrementItem,
    deliveryFee,
    incrementItem,
    isOpen,
    itemCount,
    items,
    removeItem,
    subtotal,
    total
  } = useCart();
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const amountForFreeDelivery = Math.max(0, 500 - subtotal);

  const checkoutUrl = useMemo(() => {
    const orderLines = items
      .map(
        (item) =>
          `${item.quantity}x ${item.sizeName} - ${item.flavorName} (${item.weightGrams}g) = Rs. ${
            item.quantity * item.price
          }`
      )
      .join("\n");
    const deliveryLine = deliveryFee === 0 ? "Free delivery" : `Delivery: ${formatMoney(deliveryFee)}`;
    const details = [
      customerName ? `Name: ${customerName}` : "",
      phone ? `Phone: ${phone}` : "",
      address ? `Address: ${address}` : ""
    ]
      .filter(Boolean)
      .join("\n");
    const message = [
      "Hi FuelBar, I want to place this order:",
      "",
      orderLines,
      "",
      `Subtotal: ${formatMoney(subtotal)}`,
      deliveryLine,
      `Total: ${formatMoney(total)}`,
      details ? `\n${details}` : "",
      "",
      "Please confirm availability and payment details."
    ].join("\n");

    return `https://wa.me/916263099627?text=${encodeURIComponent(message)}`;
  }, [address, customerName, deliveryFee, items, phone, subtotal, total]);

  return (
    <>
      <div className={`drawer-backdrop ${isOpen ? "is-open" : ""}`} onClick={closeCart} />
      <aside aria-label="Shopping cart" className={`cart-drawer ${isOpen ? "is-open" : ""}`}>
        <div className="cart-drawer__header">
          <div>
            <span className="eyebrow">Cart</span>
            <h2>Your FuelBox</h2>
          </div>
          <button aria-label="Close cart" className="icon-button" onClick={closeCart} type="button">
            <X size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-drawer__empty">
            <ShoppingBag size={36} />
            <h3>Your cart is empty</h3>
            <p>Add bars from the product section and build your box.</p>
          </div>
        ) : (
          <>
            <div className="cart-drawer__items">
              {items.map((item) => (
                <div className="cart-line" key={item.id}>
                  <div className="cart-line__main">
                    <strong>{item.sizeName}</strong>
                    <span>
                      {item.flavorName} - {item.weightGrams}g - {item.proteinGrams}g protein
                    </span>
                    <b>{formatMoney(item.price * item.quantity)}</b>
                  </div>
                  <div className="cart-line__controls">
                    <button
                      aria-label={`Decrease ${item.sizeName}`}
                      className="icon-button"
                      onClick={() => decrementItem(item.id)}
                      type="button"
                    >
                      <Minus size={16} />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      aria-label={`Increase ${item.sizeName}`}
                      className="icon-button"
                      onClick={() => incrementItem(item.id)}
                      type="button"
                    >
                      <Plus size={16} />
                    </button>
                    <button
                      aria-label={`Remove ${item.sizeName}`}
                      className="icon-button icon-button--danger"
                      onClick={() => removeItem(item.id)}
                      type="button"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-drawer__customer">
              <label>
                Name
                <input
                  onChange={(event) => setCustomerName(event.target.value)}
                  placeholder="Full name"
                  type="text"
                  value={customerName}
                />
              </label>
              <label>
                Phone
                <input
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="+91"
                  type="tel"
                  value={phone}
                />
              </label>
              <label>
                Address
                <textarea
                  onChange={(event) => setAddress(event.target.value)}
                  placeholder="Flat, street, city, state, PIN"
                  value={address}
                />
              </label>
            </div>

            <div className="cart-summary">
              <div>
                <span>Items</span>
                <strong>{itemCount}</strong>
              </div>
              <div>
                <span>Subtotal</span>
                <strong>{formatMoney(subtotal)}</strong>
              </div>
              <div>
                <span>Delivery</span>
                <strong>{deliveryFee === 0 ? "Free" : formatMoney(deliveryFee)}</strong>
              </div>
              <div className="cart-summary__total">
                <span>Total</span>
                <strong>{formatMoney(total)}</strong>
              </div>
            </div>

            <p className="delivery-note">
              {subtotal >= 500
                ? "Free pan-India delivery unlocked."
                : `Add ${formatMoney(amountForFreeDelivery)} more for free delivery.`}
            </p>

            <div className="cart-drawer__actions">
              <a className="button button--primary" href={checkoutUrl} rel="noreferrer" target="_blank">
                <MessageCircle size={18} />
                WhatsApp checkout
              </a>
              <button className="button button--ghost" onClick={clearCart} type="button">
                Clear cart
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
