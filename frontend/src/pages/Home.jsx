import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar.jsx';
import BookCard from '../components/BookCard.jsx';
import { bookApi } from '../api/api.js';
import Loading from '../components/Loading.jsx';

export default function Home() {
  const [search, setSearch] = useState('');
  const [books, setBooks] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingBook, setBookingBook] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const response = await bookApi.fetchBooks('');
        setBooks(response.data);
        setFeatured(response.data.slice(0, 4));
      } catch (error) {
        console.error(error);
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

  return (
    <main>
      <section className="hero section">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Premium Library Experience</span>
            <h1>Discover Your Next Great Book</h1>
            <p>Search. Reserve. Read. Experience modern library booking with a premium animated interface.</p>
            <div className="hero-actions">
              <button className="glow-button" onClick={() => navigate('/books')}>Search Books</button>
              <button className="secondary-button" onClick={() => navigate('/register')}>Start Reading</button>
            </div>
          </div>
          <div className="hero-visual blur-panel">
            <div className="hero-card">
              <p>Popular reads trending now</p>
              <div className="hero-books">
                <div className="hero-book-item">Atomic Habits</div>
                <div className="hero-book-item">The Hobbit</div>
                <div className="hero-book-item">1984</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="section-head">
          <h2>Browse Books</h2>
          <p className="muted">Search by title, author, category or ISBN and reserve your next reading adventure.</p>
        </div>
        <SearchBar value={search} onChange={setSearch} />
      </section>

      <section className="section container">
        <div className="section-head">
          <h2>Featured Books</h2>
        </div>
        {loading ? (
          <Loading />
        ) : (
          <div className="books-grid">
            {featured.map((book) => (
              <BookCard key={book._id} book={book} onPrebook={() => navigate(`/books/${book._id}`)} />
            ))}
          </div>
        )}
      </section>

      <section className="section container">
        <div className="section-head">
          <h2>Popular Picks</h2>
        </div>
        {loading ? (
          <Loading />
        ) : (
          <div className="books-grid">
            {filteredBooks.slice(0, 6).map((book) => (
              <BookCard key={book._id} book={book} onPrebook={() => navigate(`/books/${book._id}`)} />
            ))}
          </div>
        )}
      </section>

      <section className="section container glass-section">
        <div className="how-grid">
          <div className="how-card card">
            <h3>1. Search</h3>
            <p>Find your ideal book using smart filters and instant recommendations.</p>
          </div>
          <div className="how-card card">
            <h3>2. Reserve</h3>
            <p>Pre-book available copies and lock the pickup date instantly.</p>
          </div>
          <div className="how-card card">
            <h3>3. Enjoy</h3>
            <p>Collect your book and dive into a world of knowledge and stories.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
