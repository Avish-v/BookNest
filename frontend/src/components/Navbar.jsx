import { Link, useNavigate } from 'react-router-dom';
import { getToken, getUser, clearAuth } from '../api/api.js';
import { useState } from 'react';
import logo from '../assets/logo.svg';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const token = getToken();
  const user = getUser();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <header className="navbar blur-panel">
      <div className="container nav-inner">
        <Link to="/" className="brand">
          <img src={logo} alt="BookNest logo" className="brand-logo" />
          <span>Book</span>Nest
        </Link>
        <button className="nav-toggle" onClick={() => setMenuOpen((prev) => !prev)}>
          <span />
          <span />
          <span />
        </button>
        <nav className={menuOpen ? 'nav-links active' : 'nav-links'}>
          <Link to="/">Home</Link>
          <Link to="/books">Browse Books</Link>
          <Link to="/my-bookings">My Bookings</Link>
          {token ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <button className="ghost-button" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="ghost-button">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
