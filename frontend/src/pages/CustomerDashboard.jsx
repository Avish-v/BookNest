import { useState, useEffect } from 'react';
import { bookingApi, bookApi } from '../api/api.js';
import Loading from '../components/Loading.jsx';

export default function CustomerDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [booksRes, bookingsRes] = await Promise.all([bookApi.fetchBooks(), bookingApi.listMyBookings()]);
        const bookings = bookingsRes.data;
        const active = bookings.filter((booking) => booking.status !== 'Cancelled' && booking.status !== 'Returned').length;
        const completed = bookings.filter((booking) => booking.status === 'Returned').length;
        setStats({ total: bookings.length, active, completed, books: booksRes.data.length });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) return <Loading />;
  return (
    <main className="section container dashboard-page">
      <div className="section-head">
        <h2>Welcome, Reader</h2>
        <p className="muted">Your booking summary and library activity in one place.</p>
      </div>
      <div className="stats-grid">
        <div className="stat-card card">
          <span>Total Bookings</span>
          <strong>{stats?.total ?? 0}</strong>
        </div>
        <div className="stat-card card">
          <span>Active Bookings</span>
          <strong>{stats?.active ?? 0}</strong>
        </div>
        <div className="stat-card card">
          <span>Completed Bookings</span>
          <strong>{stats?.completed ?? 0}</strong>
        </div>
        <div className="stat-card card">
          <span>Available Books</span>
          <strong>{stats?.books ?? 0}</strong>
        </div>
      </div>
    </main>
  );
}
