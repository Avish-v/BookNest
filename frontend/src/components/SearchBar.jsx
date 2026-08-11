export default function SearchBar({ value, onChange, placeholder = '🔍 Search books, authors or categories...' }) {
  return (
    <div className="search-bar blur-panel">
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}
