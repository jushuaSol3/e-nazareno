import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Data from '../data/books.json';
import './searchBar.css';

function SearchBar({ className, expandable = false, expanded, onToggle }) {
  const [search, setSearch] = useState('');
  const searchClose = useRef(null);
  const inputRef = useRef(null);
  const [isOpen, setOpen] = useState(false);
  const [sortAscending, setSortAscending] = useState(true);
  const navigate = useNavigate();

  const filteredSearch = Data.filter((book) =>
    book.title.toLowerCase().includes(search.toLowerCase())
  ).sort((now, next) =>
    sortAscending
      ? now.title.localeCompare(next.title)
      : next.title.localeCompare(now.title)
  );

  useEffect(() => {
    // Use 'pointerdown' to catch both mouse and touch
    function handleOutsideClick(event) {
      // If the tap/click is inside our wrapper, do nothing
      if (searchClose.current && searchClose.current.contains(event.target)) {
        return;
      }
      // If the active element is our input (keyboard is open), do nothing
      if (document.activeElement === inputRef.current) {
        return;
      }
      setOpen(false);
      setSearch('');
    }

    document.addEventListener('pointerdown', handleOutsideClick);
    return () => {
      document.removeEventListener('pointerdown', handleOutsideClick);
    };
  }, []);

  // Prevent the dropdown from closing when scrolling inside it on mobile
  function handleDropdownTouch(e) {
    e.stopPropagation();
  }

  function handleSortToggle() {
    setSortAscending((prev) => !prev);
  }

  return (
    <div className="wrapper" ref={searchClose}>
      <div
        className={`search-bar ${className || ''} ${expandable && expanded ? 'expanded' : ''
          }`}
      >
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
          ref={inputRef}
          type="text"
          placeholder="Maghanap..."
          className="search-bar-input"
          value={search}
          onChange={(ev) => {
            setSearch(ev.target.value);
            setOpen(true);
          }}
          // Keep dropdown open when input is focused (e.g. keyboard re-opens)
          onFocus={() => {
            if (search !== '') setOpen(true);
          }}
        />
      </div>

      {search !== '' && isOpen && (
        <div
          className="srch-container-ls"
          onTouchStart={handleDropdownTouch}
        >
          <div className="sort-setting">
            <button onClick={handleSortToggle}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#000000"
              >
                <path d="M220-360v-180h-60v-60h120v240h-60Zm140 0v-100q0-17 11.5-28.5T400-500h80v-40H360v-60h140q17 0 28.5 11.5T540-560v60q0 17-11.5 28.5T500-460h-80v40h120v60H360Zm240 0v-60h120v-40h-80v-40h80v-40H600v-60h140q17 0 28.5 11.5T780-560v160q0 17-11.5 28.5T740-360H600Z" />
              </svg>
            </button>
            <div id="sort-text">{sortAscending ? 'A-Z' : 'Z-A'}</div>
          </div>

          {filteredSearch.length > 0 ? (
            filteredSearch.map((val, key) => (
              <div
                className="list-item"
                key={key}
                // Use onPointerDown instead of onClick so it fires before blur
                onPointerDown={(e) => {
                  e.preventDefault(); // prevents input blur before navigation
                  navigate(`/book/${val.id}`);
                  setOpen(false);
                  setSearch('');
                }}
              >
                {val.title}
              </div>
            ))
          ) : (
            <div className="list-item">{`${search} is not found`}</div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;