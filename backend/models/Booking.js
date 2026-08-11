import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    bookingDate: { type: Date, required: true },
    pickupDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Collected', 'Cancelled', 'Returned'],
      default: 'Pending'
    }
  },
  { timestamps: true }
);

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
