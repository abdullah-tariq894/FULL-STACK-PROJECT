import { Link } from "react-router-dom";
import { stars, money } from "../api";

export default function ProductCard({ product }) {
  return (
    <Link className="product-card" to={`/product/${product.id}`}>
      <div className="product-thumb">
        {product.discount ? <span className="discount-pill">-{product.discount}%</span> : null}
        <img src={product.image} alt={product.name} loading="lazy" />
      </div>
      <div className="product-name">{product.name}</div>
      <div className="rating">{stars(product.rating)} <span>{product.rating.toFixed(1)}/5</span></div>
      <div className="price-row">
        {money(product.price)}
        {product.oldPrice ? <span className="old">{money(product.oldPrice)}</span> : null}
      </div>
    </Link>
  );
}
