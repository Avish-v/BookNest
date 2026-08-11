import express from 'express';
import Book from '../models/Book.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { isbn: { $regex: search, $options: 'i' } }
      ];
    }
    const books = await Book.find(query).sort({ title: 1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch books' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch book details' });
  }
});

router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { title, author, category, isbn, description, image, rating, totalCopies } = req.body;
    const book = await Book.create({
      title,
      author,
      category,
      isbn,
      description,
      image,
      rating,
      totalCopies,
      availableCopies: totalCopies
    });
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Unable to create book' });
  }
});

router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { title, author, category, isbn, description, image, rating, totalCopies } = req.body;
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    const bookedCopies = book.totalCopies - book.availableCopies;
    const newAvailable = Math.max(0, totalCopies - bookedCopies);
    book.title = title;
    book.author = author;
    book.category = category;
    book.isbn = isbn;
    book.description = description;
    book.image = image;
    book.rating = rating;
    book.totalCopies = totalCopies;
    book.availableCopies = newAvailable;
    await book.save();
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Unable to update book' });
  }
});

router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Unable to delete book' });
  }
});

export default router;
