import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="section container notfound-page">
      <div className="card blur-panel notfound-card">
        <h1>404</h1>
        <p>Page not found. The library map does not include this route.</p>
        <Link to="/" className="glow-button">Return Home</Link>
      </div>
    </main>
  );
}
