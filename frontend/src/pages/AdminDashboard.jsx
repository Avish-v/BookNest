import { useState, useEffect } from 'react';
import { bookApi, bookingApi } from '../api/api.js';
import Loading from '../components/Loading.jsx';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAdminStats = async () => {
      try {
        const [booksRes, bookingsRes] = await Promise.all([bookApi.fetchBooks(), bookingApi.listAllBookings()]);
        const books = booksRes.data;
        const totalCopies = books.reduce((sum, book) => sum + book.totalCopies, 0);
        const available = books.reduce((sum, book) => sum + book.availableCopies, 0);
        const booked = totalCopies - available;
        const activeBookings = bookingsRes.data.filter((booking) => booking.status !== 'Cancelled' && booking.status !== 'Returned').length;
        setStats({ totalBooks: books.length, totalCopies, availableCopies: available, bookedCopies: booked, activeBookings });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadAdminStats();
  }, []);

  if (loading) return <Loading />;
  return (
    <main className="section container dashboard-page">
      <div className="section-head">
        <h2>Admin Dashboard</h2>
        <p className="muted">Manage inventory, booking flow, and monitor the library health.</p>
      </div>
      <div className="stats-grid">
        <div className="stat-card card">
          <span>Total Books</span>
          <strong>{stats?.totalBooks ?? 0}</strong>
        </div>
        <div className="stat-card card">
          <span>Total Copies</span>
          <strong>{stats?.totalCopies ?? 0}</strong>
        </div>
        <div className="stat-card card">
          <span>Available Copies</span>
          <strong>{stats?.availableCopies ?? 0}</strong>
        </div>
        <div className="stat-card card">
          <span>Booked Copies</span>
          <strong>{stats?.bookedCopies ?? 0}</strong>
        </div>
        <div className="stat-card card">
          <span>Active Bookings</span>
          <strong>{stats?.activeBookings ?? 0}</strong>
        </div>
      </div>
    </main>
  );
}
