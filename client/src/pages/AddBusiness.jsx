import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './AddBusiness.css';

const CATEGORIES = [
  'Arts & Entertainment',
  'Beauty & Wellness',
  'Books & Education',
  'Food & Dining',
  'Health & Fitness',
  'Media & Tech',
  'Shopping',
  'Other',
];

const US_STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC'];

export default function AddBusiness() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', category: '', description: '', address: '', city: '', state: '',
    phone: '', website: '', image_url: '', owner_name: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  }

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Business name is required.';
    if (!form.category) errs.category = 'Please select a category.';
    if (!form.owner_name.trim()) errs.owner_name = 'Owner name is required.';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setSubmitError(data.error || 'Failed to add business.'); setSubmitting(false); return; }
      navigate(`/businesses/${data.id}?new=1`);
    } catch {
      setSubmitError('Network error. Please try again.');
      setSubmitting(false);
    }
  }

  return (
    <div className="add-page">
      <div className="add-header">
        <div className="add-header-inner">
          <Link to="/businesses" className="add-back">← Back</Link>
          <h1>List Your Business</h1>
          <p>Add your Black-owned business to the Dap directory for free.</p>
        </div>
      </div>

      <div className="add-content">
        <form className="add-form" onSubmit={handleSubmit} noValidate>
          <div className="form-section">
            <h2>Basic Information</h2>
            <div className="form-grid">
              <div className={`form-group${errors.name ? ' error' : ''}`}>
                <label htmlFor="name">Business Name <span className="req">*</span></label>
                <input id="name" name="name" type="text" placeholder="e.g. Sweet Auburn Bread Co." value={form.name} onChange={handleChange} />
                {errors.name && <span className="field-error">{errors.name}</span>}
              </div>

              <div className={`form-group${errors.category ? ' error' : ''}`}>
                <label htmlFor="category">Category <span className="req">*</span></label>
                <select id="category" name="category" value={form.category} onChange={handleChange}>
                  <option value="">Select a category…</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.category && <span className="field-error">{errors.category}</span>}
              </div>

              <div className={`form-group full-width${errors.owner_name ? ' error' : ''}`}>
                <label htmlFor="owner_name">Owner Name <span className="req">*</span></label>
                <input id="owner_name" name="owner_name" type="text" placeholder="Your full name" value={form.owner_name} onChange={handleChange} />
                {errors.owner_name && <span className="field-error">{errors.owner_name}</span>}
              </div>

              <div className="form-group full-width">
                <label htmlFor="description">Description</label>
                <textarea id="description" name="description" rows={4} placeholder="Tell customers what makes your business special…" value={form.description} onChange={handleChange} />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Location & Contact</h2>
            <div className="form-grid">
              <div className="form-group full-width">
                <label htmlFor="address">Street Address</label>
                <input id="address" name="address" type="text" placeholder="123 Main St" value={form.address} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label htmlFor="city">City</label>
                <input id="city" name="city" type="text" placeholder="Atlanta" value={form.city} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label htmlFor="state">State</label>
                <select id="state" name="state" value={form.state} onChange={handleChange}>
                  <option value="">Select…</option>
                  {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input id="phone" name="phone" type="tel" placeholder="(404) 555-0100" value={form.phone} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label htmlFor="website">Website</label>
                <input id="website" name="website" type="url" placeholder="https://yourbusiness.com" value={form.website} onChange={handleChange} />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Media</h2>
            <div className="form-grid">
              <div className="form-group full-width">
                <label htmlFor="image_url">Image URL</label>
                <input id="image_url" name="image_url" type="url" placeholder="https://example.com/photo.jpg" value={form.image_url} onChange={handleChange} />
                <span className="field-hint">Link to a photo of your business (from Unsplash, your website, etc.)</span>
              </div>
            </div>
          </div>

          {submitError && <p className="submit-error">{submitError}</p>}

          <div className="form-actions">
            <button type="submit" className="btn-submit" disabled={submitting}>
              {submitting ? 'Submitting…' : 'Add My Business ✊🏾'}
            </button>
            <Link to="/businesses" className="btn-cancel">Cancel</Link>
          </div>
        </form>

        <aside className="add-sidebar">
          <div className="add-sidebar-card">
            <h3>Why List on Dap?</h3>
            <ul>
              <li>📍 Get discovered by local customers</li>
              <li>⭐ Collect reviews and build your reputation</li>
              <li>🆓 100% free to list</li>
              <li>🤝 Join a community of Black entrepreneurs</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
