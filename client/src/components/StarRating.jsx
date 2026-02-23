import { useState } from 'react';
import './StarRating.css';

export default function StarRating({ rating = 0, readonly = false, size = 'md', onChange }) {
  const [hovered, setHovered] = useState(0);
  const display = readonly ? rating : (hovered || rating);

  function handleClick(val) {
    if (!readonly && onChange) onChange(val);
  }

  return (
    <div className={`star-rating star-rating--${size}${readonly ? ' star-rating--readonly' : ''}`} aria-label={`Rating: ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          className={`star${display >= star ? ' filled' : ''}${display >= star - 0.5 && display < star ? ' half' : ''}`}
          onClick={() => handleClick(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          disabled={readonly}
          aria-label={`${star} star${star !== 1 ? 's' : ''}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
