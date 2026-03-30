import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import SearchBar from './searchBar';
import './navBar.css';

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSearchToggle = () => {
    setSearchOpen(prev => !prev);
    if (isOpen) setIsOpen(false);
  };

  return (
    <>
      {/* ── Desktop layout ── */}
      <div className="nav-desktop">

        {/* 1st: Search icon/bar */}
        <SearchBar
          className={`nav-search-desktop${searchOpen ? ' expanded' : ''}`}
          expandable={true}
          expanded={searchOpen}
          onToggle={handleSearchToggle}
        />

        {/* 2nd: Nav links — Home is first inside */}
        <ul className={`nav-links${searchOpen ? ' hidden' : ''}`}>
          <li><NavLink to="/" end>Home</NavLink></li>
          <li><NavLink to="/mga-kwento">Mga Kwento</NavLink></li>
          <li><NavLink to="/kasaysayan">Kasaysayan</NavLink></li>
          <li><NavLink to="/tungkol-sa">Tungkol Sa</NavLink></li>
        </ul>
      </div>

      {/* ── Mobile layout ── */}
      <div className="nav-top-row">
        <SearchBar
          className={`nav-search${searchOpen ? ' expanded' : ''}`}
          expandable={true}
          expanded={searchOpen}
          onToggle={handleSearchToggle}
        />
        <button
          className={`nav-toggle${isOpen ? ' open' : ''}`}
          aria-label="Toggle navigation"
          onClick={() => setIsOpen(prev => !prev)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <ul className={`nav-links-mobile${isOpen ? ' open' : ''}`}>
        <li><NavLink to="/" end>Home</NavLink></li>
        <li><NavLink to="/mga-kwento">Mga Kwento</NavLink></li>
        <li><NavLink to="/kasaysayan">Kasaysayan</NavLink></li>
        <li><NavLink to="/tungkol-sa">Tungkol Sa</NavLink></li>
      </ul>
    </>
  );
}

export default NavBar;