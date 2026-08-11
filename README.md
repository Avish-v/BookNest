# BookNest

BookNest is a complete full-stack library book search and pre-booking application built with React, Vite, Node.js, Express, MongoDB, JWT, and bcrypt.

## Features

- Modern animated React UI
- Book search by title, author, category, or ISBN
- Pre-booking system with availability tracking
- Customer and admin dashboards
- JWT authentication and bcrypt password hashing
- MongoDB seed data with admin and sample books

## Project structure

- `frontend/` - React application with Vite
- `backend/` - Node.js Express API with MongoDB

## Local setup

1. Install dependencies:

   ```bash
   cd frontend
   npm install
   cd ../backend
   npm install
   ```

2. Configure backend environment:

   Create `backend/.env` with:

   ```bash
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/booknest
   JWT_SECRET=your_super_secret_key
   ```

3. Seed the database:

   ```bash
   cd backend
   npm run seed
   ```

4. Run the backend and frontend:

   ```bash
   cd backend
   npm run dev
   ```

   ```bash
   cd frontend
   npm run dev
   ```

5. Open the app at `http://localhost:5173`.

## Admin credentials

- Email: `admin@booknest.com`
- Password: `Admin@123`

## Deployment

- Deploy backend to a Node/Mongo host
- Deploy frontend to Vercel, Netlify, or similar static hosting
- Set environment variables for `MONGO_URI` and `JWT_SECRET`
