import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Api } from "../api";
import ProductCard from "../components/ProductCard";

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

export default function Category() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const [all, setAll] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [maxPrice, setMaxPrice] = useState(300);
  const [sort, setSort] = useState("featured");

  useEffect(() => {
    let active = true;
    Promise.all([Api.getProducts(), Api.getCategories()])
      .then(([products, cats]) => {
        if (!active) return;
        setAll(products);
        setCategories(cats);
      })
      .catch((e) => console.error("Failed to load category data", e))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const allColors = useMemo(() => {
    const set = new Set();
    all.forEach((p) => p.colors.forEach((c) => set.add(c)));
    return [...set];
  }, [all]);

  function toggle(list, setList, value) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  const filtered = useMemo(() => {
    let result = all;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }
    if (selectedCategories.length) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }
    if (selectedColors.length) {
      result = result.filter((p) => p.colors.some((c) => selectedColors.includes(c)));
    }
    result = result.filter((p) => p.price <= maxPrice);

    result = [...result];
    if (sort === "price-asc") result.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") result.sort((a, b) => b.price - a.price);
    if (sort === "rating") result.sort((a, b) => b.rating - a.rating);

    return result;
  }, [all, searchQuery, selectedCategories, selectedColors, maxPrice, sort]);

  function clearFilters() {
    setSelectedCategories([]);
    setSelectedColors([]);
    setMaxPrice(300);
  }

  return (
    <div className="container">
      <div className="breadcrumb">
        Home / <span className="current">{searchQuery ? `Search: "${searchQuery}"` : "Shop"}</span>
      </div>

      <div className="category-layout">
        <aside className="filters-box">
          <h3>Filters <button className="remove-btn" onClick={clearFilters}>Clear</button></h3>

          <div className="filter-group">
            <h4>Category</h4>
            {categories.map((c) => (
              <label key={c}>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(c)}
                  onChange={() => toggle(selectedCategories, setSelectedCategories, c)}
                />
                {c}
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h4>Price <span>Up to ${maxPrice}</span></h4>
            <input
              type="range"
              min="20"
              max="300"
              step="10"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              style={{ width: "100%" }}
            />
          </div>

          <div className="filter-group">
            <h4>Colors</h4>
            <div className="color-dots">
              {allColors.map((c) => (
                <button
                  key={c}
                  className={`color-dot ${selectedColors.includes(c) ? "active" : ""}`}
                  style={{ background: c }}
                  onClick={() => toggle(selectedColors, setSelectedColors, c)}
                  aria-label={`Color ${c}`}
                />
              ))}
            </div>
          </div>
        </aside>

        <div>
          <div className="category-results-head">
            <div>{loading ? "Loading…" : `Showing ${filtered.length} of ${all.length} products`}</div>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          {loading ? (
            <div className="loading-state">Loading products…</div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">No products match your filters. Try clearing them.</div>
          ) : (
            <div className="product-grid">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
