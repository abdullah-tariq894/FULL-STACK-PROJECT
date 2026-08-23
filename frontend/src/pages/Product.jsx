import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Api, stars, money } from "../api";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [color, setColor] = useState(null);
  const [size, setSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [addMsg, setAddMsg] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    setAddMsg("");
    Api.getProduct(id)
      .then((p) => {
        if (!active) return;
        setProduct(p);
        setColor(p.colors[0]);
        setSize(p.sizes[0]);
        setQty(1);
        return Api.getProducts({ category: p.category });
      })
      .then((list) => {
        if (!active || !list) return;
        setRelated(list.filter((p) => String(p.id) !== String(id)).slice(0, 4));
      })
      .catch((e) => active && setError(e.message || "Product not found"))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [id]);

  async function onAddToCart() {
    try {
      await addToCart({ productId: product.id, color, size, qty });
      setAddMsg("Added to cart ✓");
      setTimeout(() => setAddMsg(""), 2500);
    } catch (e) {
      setAddMsg("Failed to add to cart");
    }
  }

  if (loading) return <div className="container loading-state">Loading product…</div>;
  if (error || !product) return <div className="container error-state">Product not found. <Link to="/category">Back to shop</Link></div>;

  return (
    <div className="container">
      <div className="breadcrumb">
        <Link to="/">Home</Link> / <Link to="/category">Shop</Link> / <span className="current">{product.name}</span>
      </div>

      <div className="pdp">
        <div className="pdp-gallery">
          <div className="pdp-thumbs">
            {[product.image, product.image, product.image].map((img, i) => (
              <img key={i} src={img} alt="" className={i === 0 ? "active" : ""} />
            ))}
          </div>
          <div className="pdp-main-img">
            <img src={product.image} alt={product.name} />
          </div>
        </div>

        <div className="pdp-info">
          <h1>{product.name}</h1>
          <div className="rating">{stars(product.rating)} <span>{product.rating.toFixed(1)}/5</span></div>
          <div className="pdp-price">
            {money(product.price)}
            {product.oldPrice ? <span className="old">{money(product.oldPrice)}</span> : null}
            {product.discount ? <span className="pill">-{product.discount}%</span> : null}
          </div>
          <p className="pdp-desc">{product.description}</p>

          <div className="pdp-block">
            <h4>SELECT COLORS</h4>
            <div className="swatches">
              {product.colors.map((c) => (
                <button
                  key={c}
                  className={`swatch ${c === color ? "active" : ""}`}
                  style={{ background: c }}
                  onClick={() => setColor(c)}
                  aria-label={`Color ${c}`}
                />
              ))}
            </div>
          </div>

          <div className="pdp-block">
            <h4>CHOOSE SIZE</h4>
            <div className="size-list">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  className={`size-btn ${s === size ? "active" : ""}`}
                  onClick={() => setSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="pdp-block pdp-actions">
            <div className="qty-box">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity">+</button>
            </div>
            <button className="btn btn-black" style={{ flex: 1 }} onClick={onAddToCart}>Add to Cart</button>
          </div>
          {addMsg && <div className="add-msg">{addMsg}</div>}

          <div className="pdp-block">
            <button className="btn btn-outline btn-full" onClick={() => navigate("/cart")}>Go to Cart</button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <h2 className="section-title">YOU MIGHT ALSO LIKE</h2>
          <div className="product-grid">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
