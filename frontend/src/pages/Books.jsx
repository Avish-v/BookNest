import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar.jsx';
import BookCard from '../components/BookCard.jsx';
import BookingModal from '../components/BookingModal.jsx';
import Loading from '../components/Loading.jsx';
import { bookApi, bookingApi, getToken } from '../api/api.js';

export default function Books() {
  const [search, setSearch] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingBook, setBookingBook] = useState(null);
  const [bookingPending, setBookingPending] = useState(false);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const response = await bookApi.fetchBooks();
        setBooks(response.data);
      } catch (err) {
        setError('Unable to load books. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    loadBooks();
  }, []);

  const filteredBooks = books.filter((book) => {
    const query = search.toLowerCase();
    return (
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.category.toLowerCase().includes(query) ||
      book.isbn.toLowerCase().includes(query)
    );
  });

  const handlePrebook = (book) => {
    if (!getToken()) {
      navigate('/login');
      return;
    }
    setBookingBook(book);
  };

  const submitBooking = async (values) => {
    setBookingPending(true);
    setError('');
    try {
      const response = await bookingApi.createBooking(values);
      setSuccess(`Booking Successful! Your reservation ID: ${response.data._id}`);
      setBookingBook(null);
      setBooks((prev) => prev.map((item) => (item._id === values.bookId ? { ...item, availableCopies: item.availableCopies - 1 } : item)));
    } catch (err) {
      setError(err?.response?.data?.message || 'Booking failed.');
    } finally {
      setBookingPending(false);
    }
  };

  return (
    <main className="section container">
      <div className="section-head">
        <h2>Library Collection</h2>
        <p className="muted">Browse the full catalog and reserve books instantly.</p>
      </div>
      <SearchBar value={search} onChange={setSearch} />
      {error && <p className="alert-error">{error}</p>}
      {success && <p className="alert-success">{success}</p>}
      {loading ? (
        <Loading />
      ) : (
        <div className="books-grid">
          {filteredBooks.length ? (
            filteredBooks.map((book) => <BookCard key={book._id} book={book} onPrebook={() => handlePrebook(book)} />)
          ) : (
            <p className="muted">No books match your search query.</p>
          )}
        </div>
      )}
      {bookingBook && (
        <BookingModal
          book={bookingBook}
          onClose={() => setBookingBook(null)}
          onSubmit={submitBooking}
          isLoading={bookingPending}
        />
      )}
    </main>
  );
}
