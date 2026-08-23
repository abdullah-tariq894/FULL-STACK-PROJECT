/* Talks to the Node backend at /api/* (proxied by Vite dev server to :3000) */
const API_BASE = "/api";

async function handle(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || "Request failed");
    err.status = res.status;
    throw err;
  }
  return data;
}

export const Api = {
  getProducts: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return fetch(`${API_BASE}/products${qs ? "?" + qs : ""}`).then(handle);
  },
  getProduct: (id) => fetch(`${API_BASE}/products/${id}`).then(handle),
  getCategories: () => fetch(`${API_BASE}/categories`).then(handle),
  getCart: () => fetch(`${API_BASE}/cart`).then(handle),
  addToCart: (payload) =>
    fetch(`${API_BASE}/cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then(handle),
  updateCartItem: (itemId, qty) =>
    fetch(`${API_BASE}/cart/${itemId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ qty }),
    }).then(handle),
  removeCartItem: (itemId) =>
    fetch(`${API_BASE}/cart/${itemId}`, { method: "DELETE" }).then(handle),
  signup: (payload) =>
    fetch(`${API_BASE}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then(handle),
  login: (payload) =>
    fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then(handle),
};

export function stars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  let out = "★".repeat(full);
  if (half) out += "☆";
  return out.padEnd(5, "✩");
}

export function money(n) {
  return `$${Number(n).toFixed(0)}`;
}
