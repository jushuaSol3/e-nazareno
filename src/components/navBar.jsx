import { useState } from 'react';
import SearchBar from './searchBar';
import './navBar.css';

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <div className="nav-top-row">
        <SearchBar
          className="nav-search"
          expandable={true}
          expanded={searchOpen}
          onToggle={() => setSearchOpen(prev => !prev)}
        />

        <button
          className={`nav-toggle ${isOpen ? 'open' : ''}`}
          aria-label="Toggle navigation"
          onClick={() => setIsOpen(prev => !prev)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <ul className={isOpen ? 'open' : ''}>
        <li><a href="/">Home</a></li>
        <li><a href="/kasaysayan">Kasaysayan</a></li>
        <li><a href="/mga-kwento">Mga Kwento</a></li>
        <li><a href="/tungkol-sa">Tungkol Sa</a></li>
      </ul>
    </>
  );
}

export default NavBar;