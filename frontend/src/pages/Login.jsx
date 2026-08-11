import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi, setToken, setUser } from '../api/api.js';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please provide email and password');
      return;
    }
    setLoading(true);
    try {
      const response = await authApi.login({ email, password });
      setToken(response.data.token);
      setUser(response.data.user);
      navigate(response.data.user.role === 'admin' ? '/dashboard' : '/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="section container auth-page">
      <div className="auth-card card blur-panel">
        <h2>Welcome back</h2>
        <p className="muted">Login to manage your bookings and discover new library favorites.</p>
        <form onSubmit={submit} className="auth-form">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" />
          {error && <p className="alert-error">{error}</p>}
          <button type="submit" className="glow-button" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </div>
    </main>
  );
}
