import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Api } from "../api";
import ProductCard from "../components/ProductCard";

const STYLES = [
  { label: "Casual", tall: false, img: "https://picsum.photos/seed/style-casual/220/220" },
  { label: "Formal", tall: true, img: "https://picsum.photos/seed/style-formal/220/260" },
  { label: "Party", tall: false, img: "https://picsum.photos/seed/style-party/220/220" },
  { label: "Gym", tall: false, img: "https://picsum.photos/seed/style-gym/220/220" },
];

const TESTIMONIALS = [
  { name: "Sarah M.", text: "The quality exceeded my expectations. Fit was perfect and the fabric feels premium." },
  { name: "Alex K.", text: "Finding clothes that matched my style used to be a challenge — not anymore!" },
  { name: "James L.", text: "Great collection and fast delivery. Will definitely be ordering again." },
];

export default function Home() {
  const [newArrivals, setNewArrivals] = useState([]);
  const [topSelling, setTopSelling] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subEmail, setSubEmail] = useState("");
  const [subMsg, setSubMsg] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([
      Api.getProducts({ section: "new-arrivals" }),
      Api.getProducts({ section: "top-selling" }),
    ])
      .then(([a, b]) => {
        if (!active) return;
        setNewArrivals(a);
        setTopSelling(b);
      })
      .catch((e) => console.error("Failed to load products", e))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  function onSubscribe(e) {
    e.preventDefault();
    setSubMsg(`Subscribed! We'll send offers to ${subEmail}.`);
    setSubEmail("");
  }

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <h1>FIND CLOTHES THAT MATCHES YOUR STYLE</h1>
            <p>Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.</p>
            <Link to="/category" className="btn btn-black">Shop Now</Link>
            <div className="hero-stats">
              <div><strong>200+</strong><span>International Brands</span></div>
              <div><strong>2,000+</strong><span>High-Quality Products</span></div>
              <div><strong>30,000+</strong><span>Happy Customers</span></div>
            </div>
          </div>
          <div className="hero-image">
            <img src="https://picsum.photos/seed/shopco-hero-fashion/600/600" alt="Fashion models" />
          </div>
        </div>
      </section>

      <div className="brand-strip">
        <div className="container">
          <span>VERSACE</span><span>ZARA</span><span>GUCCI</span><span>PRADA</span><span>Calvin Klein</span>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <h2 className="section-title">NEW ARRIVALS</h2>
          {loading ? (
            <div className="loading-state">Loading products…</div>
          ) : (
            <div className="product-grid">
              {newArrivals.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
          <div className="view-all-wrap"><Link to="/category" className="btn btn-outline">View All</Link></div>
        </div>
      </section>

      <hr className="divider" />

      <section className="section">
        <div className="container">
          <h2 className="section-title">TOP SELLING</h2>
          {loading ? (
            <div className="loading-state">Loading products…</div>
          ) : (
            <div className="product-grid">
              {topSelling.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
          <div className="view-all-wrap"><Link to="/category" className="btn btn-outline">View All</Link></div>
        </div>
      </section>

      <section className="section">
        <div className="container style-banner">
          <h2 className="section-title">BROWSE BY DRESS STYLE</h2>
          <div className="style-grid">
            {STYLES.map((s) => (
              <Link key={s.label} className={`style-card ${s.tall ? "tall" : ""}`} to="/category">
                <span className="label">{s.label}</span>
                <img src={s.img} alt={s.label} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">OUR HAPPY CUSTOMERS</h2>
          <div className="testimonial-track">
            {TESTIMONIALS.map((t) => (
              <div className="testimonial-card" key={t.name}>
                <div className="stars">★★★★★</div>
                <div className="name">{t.name}</div>
                <p>{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container">
        <div className="newsletter">
          <h3>STAY UPTO DATE ABOUT OUR LATEST OFFERS</h3>
          <div>
            <form onSubmit={onSubscribe}>
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={subEmail}
                onChange={(e) => setSubEmail(e.target.value)}
              />
              <button className="btn btn-black" type="submit">Subscribe to Newsletter</button>
            </form>
            {subMsg && <div className="newsletter-msg">{subMsg}</div>}
          </div>
        </div>
      </div>
    </>
  );
}
