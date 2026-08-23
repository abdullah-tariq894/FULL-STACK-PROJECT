import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { totals } = useCart();
  const { user, openSignup, openLogin, logout } = useAuth();
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  function onSearch(e) {
    if (e.key === "Enter" && q.trim()) {
      navigate(`/category?search=${encodeURIComponent(q.trim())}`);
    }
  }

  return (
    <>
      <div className="announce">
        Sign up and get 20% off to your first order.
        <a href="#" onClick={(e) => { e.preventDefault(); openSignup(); }}> Sign Up Now</a>
      </div>

      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="logo">SHOP.CO</Link>
          <nav className="main-nav">
            <Link to="/category">Shop ▾</Link>
            <Link to="/category">On Sale</Link>
            <Link to="/category">New Arrivals</Link>
            <Link to="/category">Brands</Link>
          </nav>
          <div className="search-bar">
            🔍
            <input
              type="text"
              placeholder="Search for products..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={onSearch}
            />
          </div>
          <div className="header-icons">
            <Link className="icon-btn" to="/cart">
              🛒<span className="badge">{totals.count}</span>
            </Link>
            {user ? (
              <button className="icon-btn" title={`Logged in as ${user.name} — click to log out`} onClick={logout}>
                👤
              </button>
            ) : (
              <button className="icon-btn" title="Log in / Sign up" onClick={openLogin}>
                👤
              </button>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
