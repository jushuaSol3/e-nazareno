import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Data from '../data/books.json';
import './searchBar.css';

function SearchBar({ className, expandable = false, expanded, onToggle }) {
  const [search, setSearch] = useState('');
  const searchClose = useRef(null);
  const [isOpen, setOpen] = useState(false);
  const [sortAscending, setSortAscending] = useState(true);

  const navigate = useNavigate();

  const filteredSearch = Data.filter((book) =>
    book.title.toLowerCase().includes(search.toLowerCase())
  ).sort((now, next) => {
    if (sortAscending) {
      return now.title.localeCompare(next.title);
    } else {
      return next.title.localeCompare(now.title);
    }
  });

  // Keep only ONE useEffect for outside-click detection
  useEffect(() => {
    function clickedOutside(event) {
      if (searchClose.current && !searchClose.current.contains(event.target)) {
        setOpen(false);
        setSearch('');
      }
    }
    document.addEventListener('mousedown', clickedOutside);
    document.addEventListener('touchstart', clickedOutside);
    return () => {
      document.removeEventListener('mousedown', clickedOutside);
      document.removeEventListener('touchstart', clickedOutside);
    };
  }, []);

  function handleSortToggle() {
    setSortAscending((prev) => !prev);
  }




  useEffect(() => {
    function clickedOutside(event) {
      if (searchClose.current && !searchClose.current.contains(event.target)) {
        setOpen(false);
        setSearch('');
      }
    }
    document.addEventListener('mousedown', clickedOutside);
    document.addEventListener('touchstart', clickedOutside); // ← add this
    return () => {
      document.removeEventListener('mousedown', clickedOutside);
      document.removeEventListener('touchstart', clickedOutside); // ← and this
    };
  }, []);





  return (
    <>
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
            type="text"
            placeholder="Maghanap..."
            className="search-bar-input"
            value={search}
            onFocus={() => { if (search !== '') setOpen(true); }}  // ← ADD THIS
            onChange={(ev) => {
              setSearch(ev.target.value);
              setOpen(true);
            }}
          />
        </div>

        {search !== '' && isOpen && (
          <div
            className="srch-container-ls"
            // FIX: preventDefault stops the input from losing focus when
            // the user taps a dropdown item on mobile (mousedown fires before
            // blur, which was closing the dropdown before onClick could fire)
            onMouseDown={(e) => e.preventDefault()}
            // FIX: stopPropagation prevents the touchstart outside-click
            // listener above from treating a tap inside the dropdown as
            // an outside click and closing it prematurely
            onTouchStart={(e) => e.stopPropagation()}


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
                  onClick={() => {
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
    </>
  );
}

export default SearchBar;