import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './Navbar.css';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const navigate = useNavigate();

  function handleSearch(e) {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/businesses?search=${encodeURIComponent(searchVal.trim())}`);
      setSearchVal('');
      setMenuOpen(false);
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <span className="logo-dap">dap</span>
          <span className="logo-dot">.</span>
        </Link>

        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search businesses…"
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            aria-label="Search businesses"
          />
          <button type="submit" aria-label="Submit search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
        </form>

        <div className={`navbar-links${menuOpen ? ' open' : ''}`}>
          <Link to="/businesses" onClick={() => setMenuOpen(false)}>Browse</Link>
          <Link to="/businesses/add" className="btn-add" onClick={() => setMenuOpen(false)}>+ Add Business</Link>
        </div>

        <button className="navbar-hamburger" onClick={() => setMenuOpen(v => !v)} aria-label="Toggle menu">
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}
