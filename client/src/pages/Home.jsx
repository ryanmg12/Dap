import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BusinessCard from '../components/BusinessCard';
import './Home.css';

const CATEGORIES = [
  { label: 'Food & Dining', icon: '🍽️' },
  { label: 'Beauty & Wellness', icon: '💅' },
  { label: 'Shopping', icon: '🛍️' },
  { label: 'Arts & Entertainment', icon: '🎭' },
  { label: 'Health & Fitness', icon: '💪' },
  { label: 'Books & Education', icon: '📚' },
  { label: 'Media & Tech', icon: '💻' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchVal, setSearchVal] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/featured')
      .then(r => r.json())
      .then(data => { setFeatured(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/businesses?search=${encodeURIComponent(searchVal.trim())}`);
    }
  }

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-inner">
          <h1>
            Discover <span className="hero-accent">Black-Owned</span><br />
            Businesses Near You
          </h1>
          <p className="hero-subtitle">
            Find, support, and celebrate Black entrepreneurs and businesses across the country.
          </p>
          <form className="hero-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search by name, category, or city…"
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              aria-label="Search businesses"
            />
            <button type="submit">Search</button>
          </form>
          <div className="hero-actions">
            <Link to="/businesses" className="btn-secondary">Browse All</Link>
            <Link to="/businesses/add" className="btn-outline">Add Your Business</Link>
          </div>
        </div>
        <div className="hero-stats">
          <div className="stat"><span className="stat-num">12+</span><span className="stat-label">Businesses</span></div>
          <div className="stat"><span className="stat-num">7</span><span className="stat-label">Categories</span></div>
          <div className="stat"><span className="stat-num">6+</span><span className="stat-label">Cities</span></div>
        </div>
      </section>

      {/* Categories */}
      <section className="section categories-section">
        <div className="section-inner">
          <h2 className="section-title">Browse by Category</h2>
          <div className="categories-grid">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.label}
                to={`/businesses?category=${encodeURIComponent(cat.label)}`}
                className="category-chip"
              >
                <span className="cat-icon">{cat.icon}</span>
                <span>{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="section featured-section">
        <div className="section-inner">
          <div className="section-header">
            <h2 className="section-title">Featured Businesses</h2>
            <Link to="/businesses" className="see-all">See all →</Link>
          </div>
          {loading ? (
            <div className="loading-grid">
              {[...Array(6)].map((_, i) => <div key={i} className="skeleton-card" />)}
            </div>
          ) : (
            <div className="businesses-grid">
              {featured.map(b => <BusinessCard key={b.id} business={b} />)}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-inner">
          <h2>Own a Black Business?</h2>
          <p>Get your business discovered by thousands of customers who want to support you.</p>
          <Link to="/businesses/add" className="btn-cta">List Your Business — It's Free</Link>
        </div>
      </section>
    </div>
  );
}
