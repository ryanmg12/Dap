import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import BusinessCard from '../components/BusinessCard';
import './Businesses.css';

const CATEGORIES = ['All', 'Arts & Entertainment', 'Beauty & Wellness', 'Books & Education', 'Food & Dining', 'Health & Fitness', 'Media & Tech', 'Shopping'];

export default function Businesses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || 'All';

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category && category !== 'All') params.set('category', category);

    fetch(`/api/businesses?${params}`)
      .then(r => r.json())
      .then(data => { setBusinesses(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [search, category]);

  function setCategory(cat) {
    const next = new URLSearchParams(searchParams);
    if (cat === 'All') next.delete('category');
    else next.set('category', cat);
    setSearchParams(next);
  }

  function clearSearch() {
    const next = new URLSearchParams(searchParams);
    next.delete('search');
    setSearchParams(next);
  }

  return (
    <div className="businesses-page">
      <div className="businesses-header">
        <div className="businesses-header-inner">
          <h1>
            {search ? `Results for "${search}"` : category !== 'All' ? category : 'All Black-Owned Businesses'}
          </h1>
          <p className="businesses-subtitle">
            {loading ? 'Loading…' : `${businesses.length} business${businesses.length !== 1 ? 'es' : ''} found`}
          </p>
          {search && (
            <button className="clear-search" onClick={clearSearch}>
              ✕ Clear search
            </button>
          )}
        </div>
      </div>

      <div className="businesses-main">
        {/* Sidebar filters */}
        <aside className="businesses-sidebar">
          <h3>Category</h3>
          <ul className="category-list">
            {CATEGORIES.map(cat => (
              <li key={cat}>
                <button
                  className={`category-btn${category === cat ? ' active' : ''}`}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
          <div className="sidebar-cta">
            <Link to="/businesses/add" className="btn-add-sidebar">+ List Your Business</Link>
          </div>
        </aside>

        {/* Results */}
        <main className="businesses-results">
          {loading ? (
            <div className="businesses-grid">
              {[...Array(6)].map((_, i) => <div key={i} className="skeleton-card" />)}
            </div>
          ) : businesses.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>No businesses found</h3>
              <p>Try adjusting your search or filters, or be the first to add one!</p>
              <Link to="/businesses/add" className="btn-add-first">Add a Business</Link>
            </div>
          ) : (
            <div className="businesses-grid">
              {businesses.map(b => <BusinessCard key={b.id} business={b} />)}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
