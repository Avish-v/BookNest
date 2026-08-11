import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Book from '../models/Book.js';

dotenv.config();

const books = [
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    category: 'Self-Improvement',
    isbn: '9780735211292',
    description: 'Tiny changes, remarkable results. A practical guide to building good habits and breaking bad ones.',
    image: 'https://images-na.ssl-images-amazon.com/images/I/51-uspgqWIL._SX324_BO1,204,203,200_.jpg',
    rating: 4.8,
    totalCopies: 6,
    availableCopies: 6
  },
  {
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    category: 'Fiction',
    isbn: '9780061122415',
    description: 'A young shepherd travels from Spain to Egypt seeking treasure and discovers his destiny.',
    image: 'https://images-na.ssl-images-amazon.com/images/I/51Z0nLAfLmL._SX331_BO1,204,203,200_.jpg',
    rating: 4.7,
    totalCopies: 5,
    availableCopies: 5
  },
  {
    title: 'Clean Code',
    author: 'Robert C. Martin',
    category: 'Programming',
    isbn: '9780132350884',
    description: 'A handbook of agile software craftsmanship with principles and best practices for writing clean code.',
    image: 'https://images-na.ssl-images-amazon.com/images/I/41xShlnTZTL._SX374_BO1,204,203,200_.jpg',
    rating: 4.6,
    totalCopies: 4,
    availableCopies: 4
  },
  {
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    category: 'Personal Finance',
    isbn: '9780857197689',
    description: 'Timeless lessons on wealth, greed, and happiness from the author of The Collaborative Fund.',
    image: 'https://images-na.ssl-images-amazon.com/images/I/41CmxUQ-12L._SX329_BO1,204,203,200_.jpg',
    rating: 4.7,
    totalCopies: 5,
    availableCopies: 5
  },
  {
    title: 'Rich Dad Poor Dad',
    author: 'Robert Kiyosaki',
    category: 'Finance',
    isbn: '9781612680194',
    description: 'A narrative on wealth building and financial mindset from two vastly different father figures.',
    image: 'https://images-na.ssl-images-amazon.com/images/I/41uPjEenkFL._SX331_BO1,204,203,200_.jpg',
    rating: 4.4,
    totalCopies: 5,
    availableCopies: 5
  },
  {
    title: 'Ikigai',
    author: 'Héctor García and Francesc Miralles',
    category: 'Wellness',
    isbn: '9780143130727',
    description: 'The Japanese secret to a long and happy life focusing on purpose and harmony.',
    image: 'https://images-na.ssl-images-amazon.com/images/I/41XnB4TW5hL._SX331_BO1,204,203,200_.jpg',
    rating: 4.3,
    totalCopies: 4,
    availableCopies: 4
  },
  {
    title: 'Deep Work',
    author: 'Cal Newport',
    category: 'Productivity',
    isbn: '9781455586691',
    description: 'Rules for focused success in a distracted world and the benefits of deep professional work.',
    image: 'https://images-na.ssl-images-amazon.com/images/I/41wC0LBFy2L._SX329_BO1,204,203,200_.jpg',
    rating: 4.5,
    totalCopies: 5,
    availableCopies: 5
  },
  {
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    category: 'Fantasy',
    isbn: '9780261103344',
    description: 'Bilbo Baggins embarks on an epic adventure that begins a legendary tale of Middle-earth.',
    image: 'https://images-na.ssl-images-amazon.com/images/I/51aeK8M7cNL._SX331_BO1,204,203,200_.jpg',
    rating: 4.8,
    totalCopies: 6,
    availableCopies: 6
  },
  {
    title: '1984',
    author: 'George Orwell',
    category: 'Dystopian',
    isbn: '9780451524935',
    description: 'A chilling portrayal of total surveillance and authoritarian control in a dystopian future.',
    image: 'https://images-na.ssl-images-amazon.com/images/I/41AX-2SN34L._SX324_BO1,204,203,200_.jpg',
    rating: 4.7,
    totalCopies: 5,
    availableCopies: 5
  },
  {
    title: 'Harry Potter and the Philosopher\'s Stone',
    author: 'J.K. Rowling',
    category: 'Fantasy',
    isbn: '9780747532743',
    description: 'The first magical adventure of Harry Potter as he discovers the wizarding world.',
    image: 'https://images-na.ssl-images-amazon.com/images/I/51UoqRAxwEL._SX331_BO1,204,203,200_.jpg',
    rating: 4.9,
    totalCopies: 6,
    availableCopies: 6
  }
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await User.deleteMany({});
    await Book.deleteMany({});

    const adminPassword = await bcrypt.hash('Admin@123', 10);
    await User.create({ name: 'Library Admin', email: 'admin@booknest.com', password: adminPassword, role: 'admin' });
    await User.create({ name: 'Sample Reader', email: 'reader@booknest.com', password: await bcrypt.hash('Reader@123', 10), role: 'customer' });
    await Book.insertMany(books);

    console.log('Seed completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
};

seed();
