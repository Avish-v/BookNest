import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Loading from '../components/Loading.jsx';
import BookingModal from '../components/BookingModal.jsx';
import { bookApi, bookingApi, getToken } from '../api/api.js';

export default function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingOpen, setBookingOpen] = useState(false);
  const [success, setSuccess] = useState('');
  const [pending, setPending] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await bookApi.fetchBook(id);
        setBook(response.data);
      } catch (err) {
        setError('Book not found or unavailable');
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleReserve = () => {
    if (!getToken()) {
      navigate('/login');
      return;
    }
    setBookingOpen(true);
  };

  const submitBooking = async (values) => {
    setPending(true);
    try {
      const response = await bookingApi.createBooking(values);
      setSuccess(`Booking Successful! Reservation ID: ${response.data._id}`);
      setBookingOpen(false);
      setBook((prev) => ({ ...prev, availableCopies: prev.availableCopies - 1 }));
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to reserve this book');
    } finally {
      setPending(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <main className="section container"><p className="alert-error">{error}</p></main>;

  return (
    <main className="section container book-details-page">
      <div className="details-grid card blur-panel">
        <div className="details-image" style={{ backgroundImage: `url(${book.image})` }} />
        <div className="details-content">
          <h1>{book.title}</h1>
          <p className="muted">by {book.author}</p>
          <div className="details-meta">
            <span>{book.category}</span>
            <span>ISBN: {book.isbn}</span>
            <span>⭐ {book.rating.toFixed(1)}</span>
          </div>
          <p>{book.description}</p>
          <div className="availability-row">
            <span>Total Copies: {book.totalCopies}</span>
            <span>Available Copies: {book.availableCopies}</span>
            <span>Booked Copies: {book.totalCopies - book.availableCopies}</span>
          </div>
          <div className={`availability-badge ${book.availableCopies > 0 ? 'available' : 'unavailable'}`}>
            {book.availableCopies > 0 ? '🟢 Available' : '🔴 Currently Unavailable'}
          </div>
          <button className="glow-button" disabled={book.availableCopies <= 0} onClick={handleReserve}>
            Pre-Book
          </button>
          {success && <p className="alert-success">{success}</p>}
        </div>
      </div>
      {bookingOpen && <BookingModal book={book} onClose={() => setBookingOpen(false)} onSubmit={submitBooking} isLoading={pending} />}
    </main>
  );
}
