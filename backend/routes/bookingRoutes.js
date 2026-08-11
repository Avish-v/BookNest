import express from 'express';
import Booking from '../models/Booking.js';
import Book from '../models/Book.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.post('/', authenticate, async (req, res) => {
  try {
    const { bookId, bookingDate, pickupDate } = req.body;
    if (!bookId || !bookingDate || !pickupDate) {
      return res.status(400).json({ message: 'Please select a book and date range' });
    }
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: 'This book is currently unavailable' });
    }
    const booking = await Booking.create({
      user: req.user._id,
      book: book._id,
      bookingDate: new Date(bookingDate),
      pickupDate: new Date(pickupDate),
      status: 'Pending'
    });
    book.availableCopies -= 1;
    await book.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Unable to create booking' });
  }
});

router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find().populate('user', 'name email').populate('book', 'title author');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch bookings' });
  }
});

router.get('/my', authenticate, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate('book');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch your bookings' });
  }
});

router.put('/:id', authenticate, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id).populate('book');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    if (req.user.role !== 'admin' && booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const previousStatus = booking.status;
    booking.status = status || booking.status;
    await booking.save();
    if ((status === 'Cancelled' || status === 'Returned') && previousStatus !== 'Cancelled' && previousStatus !== 'Returned') {
      const book = await Book.findById(booking.book._id);
      if (book) {
        book.availableCopies += 1;
        await book.save();
      }
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Unable to update booking' });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('book');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const wasPending = booking.status === 'Pending';
    await booking.remove();
    if (wasPending) {
      const book = await Book.findById(booking.book._id);
      if (book) {
        book.availableCopies += 1;
        await book.save();
      }
    }
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Unable to delete booking' });
  }
});

export default router;
