import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { money } from "../api";

export default function Cart() {
  const { items, totals, loading, updateQty, removeItem } = useCart();
  const [promo, setPromo] = useState("");
  const [promoMsg, setPromoMsg] = useState("");

  function applyPromo(e) {
    e.preventDefault();
    if (!promo.trim()) return;
    setPromoMsg("Promo code applied (demo) — 20% discount is already reflected below.");
  }

  function checkout() {
    alert("This is an assignment demo project — payment/checkout is not implemented.");
  }

  return (
    <div className="container">
      <div className="breadcrumb">
        <Link to="/">Home</Link> / <span className="current">Cart</span>
      </div>
      <h1 style={{ margin: "10px 0 24px" }}>YOUR CART</h1>

      {loading ? (
        <div className="loading-state">Loading cart…</div>
      ) : (
        <div className="cart-layout">
          <div className="cart-box">
            {items.length === 0 ? (
              <div className="empty-state">
                Your cart is empty. <Link to="/" style={{ textDecoration: "underline" }}>Continue shopping</Link>
              </div>
            ) : (
              items.map((item) => (
                <div className="cart-item" key={item.itemId}>
                  <img src={item.image} alt={item.name} />
                  <div className="cart-item-info">
                    <div className="cart-item-top">
                      <div>
                        <div className="cart-item-name">{item.name}</div>
                        <div className="cart-item-meta">
                          Size: {item.size} &nbsp;|&nbsp; Color:{" "}
                          <span style={{ display: "inline-block", width: 12, height: 12, borderRadius: "50%", background: item.color, verticalAlign: "middle" }} />
                        </div>
                      </div>
                      <button className="remove-btn" onClick={() => removeItem(item.itemId)}>Remove</button>
                    </div>
                    <div className="cart-item-bottom">
                      <div className="cart-item-price">{money(item.price * item.qty)}</div>
                      <div className="qty-control">
                        <button onClick={() => updateQty(item.itemId, Math.max(1, item.qty - 1))} aria-label="Decrease">−</button>
                        <span>{item.qty}</span>
                        <button onClick={() => updateQty(item.itemId, item.qty + 1)} aria-label="Increase">+</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="summary-box">
            <h3>Order Summary</h3>
            <div className="summary-row"><span>Subtotal</span><span>{money(totals.subtotal)}</span></div>
            <div className="summary-row"><span>Discount (-20%)</span><span>-{money(totals.discount)}</span></div>
            <div className="summary-row"><span>Delivery Fee</span><span>{money(totals.deliveryFee)}</span></div>
            <div className="summary-row total"><span>Total</span><span>{money(totals.total)}</span></div>

            <form className="promo-row" onSubmit={applyPromo}>
              <input
                type="text"
                placeholder="Add promo code"
                value={promo}
                onChange={(e) => setPromo(e.target.value)}
              />
              <button className="btn btn-black btn-sm" type="submit">Apply</button>
            </form>
            {promoMsg && <div className="newsletter-msg" style={{ color: "var(--green)" }}>{promoMsg}</div>}

            <button
              className="btn btn-black btn-full"
              disabled={items.length === 0}
              onClick={checkout}
            >
              Go to Checkout →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
