import { Link } from 'react-router-dom';
import StarRating from './StarRating';
import './BusinessCard.css';

export default function BusinessCard({ business }) {
  const { id, name, category, description, city, state, image_url, avg_rating, review_count } = business;

  return (
    <Link to={`/businesses/${id}`} className="business-card">
      <div className="card-image">
        {image_url ? (
          <img src={image_url} alt={name} loading="lazy" />
        ) : (
          <div className="card-image-placeholder">
            <span>{name.charAt(0)}</span>
          </div>
        )}
        <span className="card-category">{category}</span>
      </div>
      <div className="card-body">
        <h3 className="card-name">{name}</h3>
        <div className="card-meta">
          {city && state && (
            <span className="card-location">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              {city}, {state}
            </span>
          )}
        </div>
        {description && (
          <p className="card-description">{description.length > 100 ? description.slice(0, 100) + '…' : description}</p>
        )}
        <div className="card-rating">
          <StarRating rating={avg_rating || 0} readonly size="sm" />
          <span className="card-reviews">
            {avg_rating ? avg_rating.toFixed(1) : 'No reviews'}
            {review_count > 0 && ` (${review_count})`}
          </span>
        </div>
      </div>
    </Link>
  );
}
