import { useState, useEffect } from 'react';
import Loading from '../components/Loading.jsx';
import { bookingApi } from '../api/api.js';

const statusActions = {
  Pending: ['Confirmed', 'Cancelled'],
  Confirmed: ['Collected', 'Cancelled'],
  Collected: ['Returned'],
  Cancelled: [],
  Returned: []
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const response = await bookingApi.listAllBookings();
        setBookings(response.data);
      } catch (err) {
        setError('Unable to fetch bookings');
      } finally {
        setLoading(false);
      }
    };
    loadBookings();
  }, []);

  const changeStatus = async (id, status) => {
    try {
      const response = await bookingApi.updateBooking(id, { status });
      setBookings((prev) => prev.map((booking) => (booking._id === id ? response.data : booking)));
    } catch (err) {
      setError('Unable to update booking');
    }
  };

  return (
    <main className="section container admin-page">
      <div className="section-head">
        <h2>Booking Management</h2>
        <p className="muted">Confirm, collect, return or cancel reservations from the admin portal.</p>
      </div>
      {loading ? (
        <Loading />
      ) : error ? (
        <p className="alert-error">{error}</p>
      ) : (
        <div className="table-wrap">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Email</th>
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
                  <td>{booking.user.name}</td>
                  <td>{booking.user.email}</td>
                  <td>{booking.book.title}</td>
                  <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                  <td>{new Date(booking.pickupDate).toLocaleDateString()}</td>
                  <td>{booking.status}</td>
                  <td>
                    {statusActions[booking.status].map((action) => (
                      <button key={action} className="secondary-button" onClick={() => changeStatus(booking._id, action)}>
                        {action}
                      </button>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
