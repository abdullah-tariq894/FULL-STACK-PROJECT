import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Api } from "../api";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [totals, setTotals] = useState({ subtotal: 0, discount: 0, deliveryFee: 0, total: 0, count: 0 });
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = await Api.getCart();
      setItems(data.items);
      setTotals(data.totals);
    } catch (e) {
      console.error("Failed to load cart", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addToCart = useCallback(
    async (payload) => {
      const data = await Api.addToCart(payload);
      setItems(data.items);
      setTotals(data.totals);
      return data;
    },
    []
  );

  const updateQty = useCallback(async (itemId, qty) => {
    const data = await Api.updateCartItem(itemId, qty);
    setItems(data.items);
    setTotals(data.totals);
  }, []);

  const removeItem = useCallback(async (itemId) => {
    const data = await Api.removeCartItem(itemId);
    setItems(data.items);
    setTotals(data.totals);
  }, []);

  return (
    <CartContext.Provider value={{ items, totals, loading, refresh, addToCart, updateQty, removeItem }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
