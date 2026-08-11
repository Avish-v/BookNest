import { Navigate } from 'react-router-dom';
import { getToken, getUserRole } from '../api/api.js';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const token = getToken();
  const role = getUserRole();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (adminOnly && role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return children;
}
