export default function AvailabilityBadge({ availableCopies }) {
  const status = availableCopies > 0 ? '🟢 Available' : '🔴 Currently Unavailable';
  return <div className={`availability-badge ${availableCopies > 0 ? 'available' : 'unavailable'}`}>{status}</div>;
}
