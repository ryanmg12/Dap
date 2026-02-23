import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-logo">dap<span className="footer-dot">.</span></span>
          <p>Celebrating and supporting Black-owned businesses across America.</p>
        </div>
        <div className="footer-links">
          <h4>Explore</h4>
          <a href="/businesses">Browse All</a>
          <a href="/businesses?category=Food+%26+Dining">Food & Dining</a>
          <a href="/businesses?category=Beauty+%26+Wellness">Beauty & Wellness</a>
          <a href="/businesses?category=Shopping">Shopping</a>
        </div>
        <div className="footer-links">
          <h4>Community</h4>
          <a href="/businesses/add">Add Your Business</a>
          <a href="/businesses">Write a Review</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 Dap. Proudly supporting Black-owned businesses. ✊🏾</p>
      </div>
    </footer>
  );
}
