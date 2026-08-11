import { useState } from 'react';

export default function BookingModal({ book, onClose, onSubmit, isLoading }) {
  const [bookingDate, setBookingDate] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  return (
    <div className="modal-backdrop">
      <div className="modal-card card modal-animate">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Reserve {book.title}</h2>
        <p className="muted">Select your booking and pickup dates.</p>
        <div className="modal-field">
          <label>Booking Date</label>
          <input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} />
        </div>
        <div className="modal-field">
          <label>Pickup Date</label>
          <input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} />
        </div>
        <button
          className="glow-button"
          disabled={!bookingDate || !pickupDate || isLoading}
          onClick={() => onSubmit({ bookId: book._id, bookingDate, pickupDate })}
        >
          {isLoading ? 'Booking...' : 'Confirm Reservation'}
        </button>
      </div>
    </div>
  );
}
