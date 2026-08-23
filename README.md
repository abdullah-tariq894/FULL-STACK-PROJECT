# SHOP.CO — React + Node.js E-commerce Project

Full clone of the Figma "E-commerce Website Template (Freebie)" — React frontend,
Node.js backend REST API, product images & data served from `backend/data/dummy.json`.

## What's inside
- **frontend/** — React (Vite) app: Home, Product Detail, Category (with filters), Cart pages.
  All buttons are functional: Add to Cart, quantity +/-, remove item, checkout (demo alert),
  newsletter subscribe, search, filters/sort, and a working **Sign Up / Log In** modal.
- **backend/** — Pure Node.js REST API (no npm install needed for backend). Serves
  products from `backend/data/dummy.json`, handles cart, and handles signup/login.

## How to run (2 terminals)

### 1) Start the backend (API)
```bash
cd backend
node server.js
```
Runs at http://localhost:3000

### 2) Start the frontend (React)
```bash
cd frontend
npm install
npm run dev
```
Runs at http://localhost:5173 — open this in your browser.
(The Vite dev server proxies `/api/*` calls to the backend automatically.)

## Sign Up
Click **"Sign Up Now"** in the top announcement bar, or the 👤 icon in the header.
Fill the form → it calls `POST /api/auth/signup` on the backend and creates a real
in-memory account, then logs you in automatically.

## Editing product data / images
Open `backend/data/dummy.json` and change any `image` field to your own image URL,
or edit name/price/colors/sizes/description — the whole app updates automatically
since everything is fetched from the API, nothing is hardcoded in the React code.

## Notes
- Cart & signed-up users are stored in-memory on the backend (resets on server restart) —
  fine for an assignment/demo. For production, add a real database.
- No API keys required anywhere.
