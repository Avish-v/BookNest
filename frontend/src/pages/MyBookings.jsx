import { useState, useEffect } from 'react';
import Loading from '../components/Loading.jsx';
import { bookingApi } from '../api/api.js';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const response = await bookingApi.listMyBookings();
        setBookings(response.data);
      } catch (err) {
        setError('Unable to load bookings');
      } finally {
        setLoading(false);
      }
    };
    loadBookings();
  }, []);

  const handleCancel = async (id) => {
    try {
      await bookingApi.updateBooking(id, { status: 'Cancelled' });
      setBookings((prev) => prev.map((booking) => (booking._id === id ? { ...booking, status: 'Cancelled' } : booking)));
    } catch (err) {
      setError('Unable to cancel booking');
    }
  };

  return (
    <main className="section container">
      <div className="section-head">
        <h2>My Bookings</h2>
        <p className="muted">Manage your reservations and view current booking status.</p>
      </div>
      {loading ? (
        <Loading />
      ) : error ? (
        <p className="alert-error">{error}</p>
      ) : bookings.length ? (
        <div className="table-wrap">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Book</th>
                <th>Booking Date</th>
                <th>Pickup Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td>{booking._id.slice(-8)}</td>
                  <td>{booking.book.title}</td>
                  <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                  <td>{new Date(booking.pickupDate).toLocaleDateString()}</td>
                  <td>{booking.status}</td>
                  <td>
                    {booking.status === 'Pending' ? (
                      <button className="secondary-button" onClick={() => handleCancel(booking._id)}>
                        Cancel
                      </button>
                    ) : (
                      <span className="muted">No action</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="muted">You have no bookings yet. Explore our collection and reserve a book.</p>
      )}
    </main>
  );
}
