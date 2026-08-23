export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="logo">SHOP.CO</div>
            <p style={{ marginTop: 14, color: "var(--gray-500)", fontSize: 14, maxWidth: 260 }}>
              We have clothes that suit your style and which you're proud to wear. From women to men.
            </p>
          </div>
          <div>
            <h4>COMPANY</h4>
            <ul><li>About</li><li>Features</li><li>Works</li><li>Career</li></ul>
          </div>
          <div>
            <h4>HELP</h4>
            <ul><li>Customer Support</li><li>Delivery Details</li><li>Terms & Conditions</li><li>Privacy Policy</li></ul>
          </div>
          <div>
            <h4>FAQ</h4>
            <ul><li>Account</li><li>Manage Deliveries</li><li>Orders</li><li>Payments</li></ul>
          </div>
          <div>
            <h4>RESOURCES</h4>
            <ul><li>Free eBooks</li><li>Development Tutorial</li><li>How to - Blog</li></ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>SHOP.CO © 2026, All Rights Reserved (Assignment Demo Project)</span>
          <div className="payment-icons">
            <span>Visa</span><span>Mastercard</span><span>PayPal</span><span>ApplePay</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
