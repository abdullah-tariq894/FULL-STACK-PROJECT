/**
 * SHOP.CO - Backend Server (Pure Node.js, no npm install required)
 * Run:  node server.js   ->  http://localhost:3000
 *
 * API Endpoints:
 *   GET    /api/products              -> all products (?category=&section=&search=)
 *   GET    /api/products/:id          -> single product
 *   GET    /api/categories            -> distinct category list
 *   GET    /api/cart                  -> current cart + totals
 *   POST   /api/cart                  -> add item  { productId, size, color, qty }
 *   PUT    /api/cart/:itemId          -> update qty { qty }
 *   DELETE /api/cart/:itemId          -> remove item
 *   POST   /api/auth/signup           -> create account { name, email, password }
 *   POST   /api/auth/login            -> login { email, password }
 */

const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "data", "dummy.json");

const products = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
let cart = [];
let cartItemSeq = 1;
let users = []; // { id, name, email, password } - demo only, plaintext (assignment use)
let userSeq = 1;

function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  res.end(JSON.stringify(data, null, 2));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (c) => (raw += c));
    req.on("end", () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
}

function cartTotals() {
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = Math.round(subtotal * 0.2 * 100) / 100;
  const deliveryFee = cart.length ? 15 : 0;
  const total = Math.max(subtotal - discount + deliveryFee, 0);
  return { subtotal, discount, deliveryFee, total, count: cart.reduce((n, i) => n + i.qty, 0) };
}

const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true);
  const { pathname, query } = parsed;

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    return res.end();
  }

  if (!pathname.startsWith("/api/")) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    return res.end("This is the SHOP.CO API server. Run the React frontend separately (npm run dev).");
  }

  try {
    if (pathname === "/api/products" && req.method === "GET") {
      let result = products;
      if (query.category) result = result.filter((p) => p.category.toLowerCase() === String(query.category).toLowerCase());
      if (query.section) result = result.filter((p) => p.section === query.section);
      if (query.search) {
        const q = String(query.search).toLowerCase();
        result = result.filter((p) => p.name.toLowerCase().includes(q));
      }
      return sendJSON(res, 200, result);
    }

    const productMatch = pathname.match(/^\/api\/products\/(\d+)$/);
    if (productMatch && req.method === "GET") {
      const product = products.find((p) => p.id === Number(productMatch[1]));
      if (!product) return sendJSON(res, 404, { error: "Product not found" });
      return sendJSON(res, 200, product);
    }

    if (pathname === "/api/categories" && req.method === "GET") {
      return sendJSON(res, 200, [...new Set(products.map((p) => p.category))]);
    }

    if (pathname === "/api/cart" && req.method === "GET") {
      return sendJSON(res, 200, { items: cart, totals: cartTotals() });
    }

    if (pathname === "/api/cart" && req.method === "POST") {
      const body = await readBody(req);
      const product = products.find((p) => p.id === Number(body.productId));
      if (!product) return sendJSON(res, 400, { error: "Invalid productId" });
      const item = {
        itemId: cartItemSeq++,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size: body.size || product.sizes[0],
        color: body.color || product.colors[0],
        qty: Number(body.qty) > 0 ? Number(body.qty) : 1,
      };
      cart.push(item);
      return sendJSON(res, 201, { items: cart, totals: cartTotals() });
    }

    const putMatch = pathname.match(/^\/api\/cart\/(\d+)$/);
    if (putMatch && req.method === "PUT") {
      const body = await readBody(req);
      const item = cart.find((i) => i.itemId === Number(putMatch[1]));
      if (!item) return sendJSON(res, 404, { error: "Cart item not found" });
      item.qty = Math.max(1, Number(body.qty) || 1);
      return sendJSON(res, 200, { items: cart, totals: cartTotals() });
    }

    const delMatch = pathname.match(/^\/api\/cart\/(\d+)$/);
    if (delMatch && req.method === "DELETE") {
      cart = cart.filter((i) => i.itemId !== Number(delMatch[1]));
      return sendJSON(res, 200, { items: cart, totals: cartTotals() });
    }

    // ---- Auth (demo, in-memory) ----
    if (pathname === "/api/auth/signup" && req.method === "POST") {
      const body = await readBody(req);
      const { name, email, password } = body;
      if (!name || !email || !password) {
        return sendJSON(res, 400, { error: "name, email and password are required" });
      }
      if (users.find((u) => u.email.toLowerCase() === String(email).toLowerCase())) {
        return sendJSON(res, 409, { error: "An account with this email already exists" });
      }
      const user = { id: userSeq++, name, email, password };
      users.push(user);
      return sendJSON(res, 201, { message: "Account created successfully", user: { id: user.id, name: user.name, email: user.email } });
    }

    if (pathname === "/api/auth/login" && req.method === "POST") {
      const body = await readBody(req);
      const user = users.find((u) => u.email.toLowerCase() === String(body.email).toLowerCase() && u.password === body.password);
      if (!user) return sendJSON(res, 401, { error: "Invalid email or password" });
      return sendJSON(res, 200, { message: "Login successful", user: { id: user.id, name: user.name, email: user.email } });
    }

    return sendJSON(res, 404, { error: "Unknown API route" });
  } catch (err) {
    return sendJSON(res, 500, { error: "Server error", details: err.message });
  }
});

server.listen(PORT, () => {
  console.log(`\n🛍  SHOP.CO API server running at http://localhost:${PORT}\n`);
});
