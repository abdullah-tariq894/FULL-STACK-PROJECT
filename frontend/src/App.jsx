import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AuthModal from "./components/AuthModal";
import Home from "./pages/Home";
import Product from "./pages/Product";
import Category from "./pages/Category";
import Cart from "./pages/Cart";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/category" element={<Category />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="*" element={<div className="container error-state">Page not found.</div>} />
        </Routes>
        <Footer />
        <AuthModal />
      </CartProvider>
    </AuthProvider>
  );
}
