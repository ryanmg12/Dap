import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import StarRating from '../components/StarRating';
import './BusinessDetail.css';

export default function BusinessDetail() {
  const { id } = useParams();
  const [business, setBusiness] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Review form state
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`/api/businesses/${id}`),
      fetch(`/api/businesses/${id}/reviews`),
    ])
      .then(async ([bRes, rRes]) => {
        if (bRes.status === 404) { setNotFound(true); setLoading(false); return; }
        const [bData, rData] = await Promise.all([bRes.json(), rRes.json()]);
        setBusiness(bData);
        setReviews(rData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  async function handleSubmitReview(e) {
    e.preventDefault();
    if (!reviewRating) { setSubmitError('Please select a rating.'); return; }
    if (!reviewName.trim()) { setSubmitError('Please enter your name.'); return; }

    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch(`/api/businesses/${id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewer_name: reviewName.trim(), rating: reviewRating, comment: reviewComment.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setSubmitError(data.error || 'Failed to submit review.'); setSubmitting(false); return; }

      setReviews(prev => [data, ...prev]);
      setBusiness(prev => ({
        ...prev,
        review_count: (prev.review_count || 0) + 1,
        avg_rating: prev.review_count
          ? ((prev.avg_rating * prev.review_count + reviewRating) / (prev.review_count + 1)).toFixed(1)
          : reviewRating,
      }));
      setReviewName('');
      setReviewRating(0);
      setReviewComment('');
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 4000);
    } catch {
      setSubmitError('Network error. Please try again.');
    }
    setSubmitting(false);
  }

  if (loading) return <div className="detail-loading"><div className="spinner" /></div>;
  if (notFound) return (
    <div className="not-found">
      <h2>Business not found</h2>
      <Link to="/businesses">← Back to businesses</Link>
    </div>
  );

  const { name, category, description, address, city, state, phone, website, image_url, owner_name, avg_rating, review_count } = business;

  return (
    <div className="detail-page">
      {/* Hero image */}
      <div className="detail-hero">
        {image_url ? (
          <img src={image_url} alt={name} className="detail-hero-img" />
        ) : (
          <div className="detail-hero-placeholder"><span>{name.charAt(0)}</span></div>
        )}
        <div className="detail-hero-overlay">
          <Link to="/businesses" className="back-link">← Back</Link>
          <span className="detail-category-badge">{category}</span>
        </div>
      </div>

      <div className="detail-content">
        <div className="detail-main">
          {/* Business info */}
          <div className="detail-info-card">
            <h1 className="detail-name">{name}</h1>
            {owner_name && <p className="detail-owner">✊🏾 Black-owned by <strong>{owner_name}</strong></p>}
            <div className="detail-rating-row">
              <StarRating rating={avg_rating || 0} readonly size="md" />
              <span className="detail-avg">{avg_rating ? Number(avg_rating).toFixed(1) : '—'}</span>
              <span className="detail-count">({review_count || 0} review{review_count !== 1 ? 's' : ''})</span>
            </div>
            {description && <p className="detail-description">{description}</p>}
          </div>

          {/* Reviews */}
          <div className="detail-reviews">
            <h2>Reviews</h2>
            {reviews.length === 0 ? (
              <p className="no-reviews">No reviews yet. Be the first!</p>
            ) : (
              <ul className="reviews-list">
                {reviews.map(review => (
                  <li key={review.id} className="review-item">
                    <div className="review-header">
                      <span className="review-author">{review.reviewer_name}</span>
                      <StarRating rating={review.rating} readonly size="sm" />
                      <span className="review-date">{new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>
                    {review.comment && <p className="review-comment">{review.comment}</p>}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Review form */}
          <div className="review-form-section">
            <h2>Write a Review</h2>
            <form className="review-form" onSubmit={handleSubmitReview}>
              <div className="form-group">
                <label htmlFor="reviewer-name">Your Name</label>
                <input
                  id="reviewer-name"
                  type="text"
                  placeholder="Your name"
                  value={reviewName}
                  onChange={e => setReviewName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Rating</label>
                <StarRating rating={reviewRating} onChange={setReviewRating} size="lg" />
              </div>
              <div className="form-group">
                <label htmlFor="review-comment">Comment (optional)</label>
                <textarea
                  id="review-comment"
                  rows={4}
                  placeholder="Share your experience…"
                  value={reviewComment}
                  onChange={e => setReviewComment(e.target.value)}
                />
              </div>
              {submitError && <p className="form-error">{submitError}</p>}
              {submitSuccess && <p className="form-success">Review submitted! Thank you ✊🏾</p>}
              <button type="submit" className="btn-submit" disabled={submitting}>
                {submitting ? 'Submitting…' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="detail-sidebar">
          <div className="detail-sidebar-card">
            <h3>Business Info</h3>
            {(address || city) && (
              <div className="sidebar-info-row">
                <span className="sidebar-icon">📍</span>
                <span>{[address, city, state].filter(Boolean).join(', ')}</span>
              </div>
            )}
            {phone && (
              <div className="sidebar-info-row">
                <span className="sidebar-icon">📞</span>
                <a href={`tel:${phone}`}>{phone}</a>
              </div>
            )}
            {website && (
              <div className="sidebar-info-row">
                <span className="sidebar-icon">🌐</span>
                <a href={website} target="_blank" rel="noopener noreferrer" className="website-link">
                  Visit Website ↗
                </a>
              </div>
            )}
          </div>
          <Link to="/businesses" className="back-btn">← All Businesses</Link>
        </aside>
      </div>
    </div>
  );
}
