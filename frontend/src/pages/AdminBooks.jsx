import { useState, useEffect } from 'react';
import Loading from '../components/Loading.jsx';
import { bookApi } from '../api/api.js';

export default function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ title: '', author: '', category: '', isbn: '', description: '', image: '', rating: 4.5, totalCopies: 1 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const response = await bookApi.fetchBooks();
        setBooks(response.data);
      } catch (err) {
        setError('Unable to load books');
      } finally {
        setLoading(false);
      }
    };
    load();
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

  const handleSelect = (book) => {
    setSelected(book);
    setForm({
      title: book.title,
      author: book.author,
      category: book.category,
      isbn: book.isbn,
      description: book.description,
      image: book.image,
      rating: book.rating,
      totalCopies: book.totalCopies
    });
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (selected) {
        const response = await bookApi.updateBook(selected._id, form);
        setBooks((prev) => prev.map((book) => (book._id === selected._id ? response.data : book)));
        setSelected(null);
      } else {
        const response = await bookApi.createBook(form);
        setBooks((prev) => [response.data, ...prev]);
      }
      setForm({ title: '', author: '', category: '', isbn: '', description: '', image: '', rating: 4.5, totalCopies: 1 });
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to save book');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      await bookApi.deleteBook(id);
      setBooks((prev) => prev.filter((book) => book._id !== id));
      if (selected?._id === id) setSelected(null);
    } catch (err) {
      setError('Unable to delete book');
    }
  };

  return (
    <main className="section container admin-page">
      <div className="section-head">
        <h2>Book Management</h2>
        <p className="muted">Add, edit, or remove inventory and keep the library catalog fresh.</p>
      </div>
      <div className="admin-grid">
        <div className="admin-panel card blur-panel">
          <h3>{selected ? 'Edit Book' : 'Add Book'}</h3>
          <form onSubmit={handleSave} className="admin-form">
            <label>Title</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <label>Author</label>
            <input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} required />
            <label>Category</label>
            <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
            <label>ISBN</label>
            <input value={form.isbn} onChange={(e) => setForm({ ...form, isbn: e.target.value })} required />
            <label>Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows="4" />
            <label>Image URL</label>
            <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} required />
            <label>Rating</label>
            <input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} required />
            <label>Total Copies</label>
            <input type="number" min="1" value={form.totalCopies} onChange={(e) => setForm({ ...form, totalCopies: Number(e.target.value) })} required />
            {error && <p className="alert-error">{error}</p>}
            <button type="submit" className="glow-button" disabled={saving}>
              {saving ? 'Saving...' : selected ? 'Update Book' : 'Add Book'}
            </button>
            {selected && (
              <button type="button" className="secondary-button" onClick={() => setSelected(null)}>
                Cancel Edit
              </button>
            )}
          </form>
        </div>
        <div className="admin-table card blur-panel">
          <div className="table-top">
            <h3>Inventory</h3>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search books..." />
          </div>
          {loading ? (
            <Loading />
          ) : (
            <div className="table-wrap">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Book</th>
                    <th>Author</th>
                    <th>Category</th>
                    <th>Total</th>
                    <th>Available</th>
                    <th>Booked</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBooks.map((book) => (
                    <tr key={book._id}>
                      <td>{book.title}</td>
                      <td>{book.author}</td>
                      <td>{book.category}</td>
                      <td>{book.totalCopies}</td>
                      <td>{book.availableCopies}</td>
                      <td>{book.totalCopies - book.availableCopies}</td>
                      <td className="table-actions">
                        <button className="secondary-button" onClick={() => handleSelect(book)}>Edit</button>
                        <button className="ghost-button" onClick={() => handleDelete(book._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
