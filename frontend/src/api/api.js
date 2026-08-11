import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const setToken = (token) => {
  if (token) {
    localStorage.setItem('booknest_token', token);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem('booknest_token');
    delete api.defaults.headers.common.Authorization;
  }
};

export const getToken = () => localStorage.getItem('booknest_token');

export const getUserRole = () => {
  const user = localStorage.getItem('booknest_user');
  if (!user) return null;
  try {
    return JSON.parse(user).role;
  } catch {
    return null;
  }
};

export const getUser = () => {
  const user = localStorage.getItem('booknest_user');
  if (!user) return null;
  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
};

export const setUser = (user) => {
  localStorage.setItem('booknest_user', JSON.stringify(user));
};

export const clearAuth = () => {
  setToken(null);
  localStorage.removeItem('booknest_user');
};

export const authApi = {
  register: (payload) => api.post('/auth/register', payload),
  login: (payload) => api.post('/auth/login', payload),
  me: () => api.get('/auth/me')
};

export const bookApi = {
  fetchBooks: (search) => api.get('/books', { params: { search } }),
  fetchBook: (id) => api.get(`/books/${id}`),
  createBook: (payload) => api.post('/books', payload),
  updateBook: (id, payload) => api.put(`/books/${id}`, payload),
  deleteBook: (id) => api.delete(`/books/${id}`)
};

export const bookingApi = {
  createBooking: (payload) => api.post('/bookings', payload),
  listMyBookings: () => api.get('/bookings/my'),
  listAllBookings: () => api.get('/bookings'),
  updateBooking: (id, payload) => api.put(`/bookings/${id}`, payload),
  deleteBooking: (id) => api.delete(`/bookings/${id}`)
};

if (getToken()) {
  api.defaults.headers.common.Authorization = `Bearer ${getToken()}`;
}

export default api;
