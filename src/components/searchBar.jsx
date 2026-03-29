import './searchBar.css';

function SearchBar({ className, expandable = false, expanded, onToggle }) {
  return (
    <div className={`search-bar ${className || ''} ${expandable && expanded ? 'expanded' : ''}`}>
      {expandable ? (
        <button
          className="search-bar-icon-btn"
          aria-label="Toggle search"
          onClick={onToggle}
        >
          <img src="/search.svg" alt="Search" className="search-img" />
        </button>
      ) : (
        <span className="search-bar-icon">
          <img src="/search.svg" alt="Search" className="search-img" />
        </span>
      )}
      <input
        type="text"
        placeholder="Maghanap..."
        className="search-bar-input"
      />
    </div>
  );
}

export default SearchBar;