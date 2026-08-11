import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi, setToken, setUser } from '../api/api.js';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    if (!name || !email || !password || !confirmPassword) {
      setError('Please complete all registration fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const response = await authApi.register({ name, email, password, confirmPassword });
      setToken(response.data.token);
      setUser(response.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="section container auth-page">
      <div className="auth-card card blur-panel">
        <h2>Create your account</h2>
        <p className="muted">Register now to reserve books, manage bookings, and enjoy curated library access.</p>
        <form onSubmit={submit} className="auth-form">
          <label>Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Choose a password" />
          <label>Confirm Password</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat password" />
          {error && <p className="alert-error">{error}</p>}
          <button type="submit" className="glow-button" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
      </div>
    </main>
  );
}
