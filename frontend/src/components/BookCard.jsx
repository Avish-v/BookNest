import { Link } from 'react-router-dom';

export default function BookCard({ book, onPrebook }) {
  const available = book.availableCopies > 0;
  return (
    <article className="book-card card">
      <div className="book-cover" style={{ backgroundImage: `url(${book.image})` }} />
      <div className="book-card-body">
        <div>
          <h3>{book.title}</h3>
          <p className="muted">{book.author}</p>
        </div>
        <div className="book-meta">
          <span>{book.category}</span>
          <span>⭐ {book.rating.toFixed(1)}</span>
        </div>
        <div className="availability-row">
          <span>Total: {book.totalCopies}</span>
          <span>Available: {book.availableCopies}</span>
        </div>
        <div className={`availability-badge ${available ? 'available' : 'unavailable'}`}>
          {available ? '🟢 Available' : '🔴 Currently Unavailable'}
        </div>
        <div className="book-actions">
          <Link to={`/books/${book._id}`} className="secondary-button">
            View Details
          </Link>
          <button className="glow-button" onClick={() => onPrebook(book)} disabled={!available}>
            Pre-Book
          </button>
        </div>
      </div>
    </article>
  );
}
