import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import SearchBar from './searchBar';
import './navBar.css';

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);
  const location = useLocation();

  const isHome = location.pathname === '/';

  // Track viewport width to know which mode we're in
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 640;
      setIsMobile(mobile);
      // Clean up states when crossing the breakpoint
      if (!mobile) {
        setIsOpen(false);
      } else {
        setSearchOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSearchToggle = () => {
    setSearchOpen(prev => !prev);
    if (isOpen) setIsOpen(false);
  };

  const handleNavToggle = () => {
    setIsOpen(prev => !prev);
    if (searchOpen) setSearchOpen(false);
  };

  const handleNavLinkClick = () => {
    setIsOpen(false);
  };

  // Only hide nav-links when search is open on DESKTOP
  const navLinksHidden = searchOpen && !isMobile;

  return (
    <div className="nav-wrapper">

      <NavLink to="/" className="nav-logo" aria-label="Home">
        <img src="/logo-final.png" alt="Logo" className="nav-logo-img" />
        <h1>E-Nazareno</h1>
      </NavLink>

      <div
        className={[
          'nav-search',
          searchOpen ? 'expanded' : '',
          isHome ? 'desktop-hidden' : '',
        ].filter(Boolean).join(' ')}
      >
        <SearchBar
          expandable={true}
          expanded={searchOpen}
          onToggle={handleSearchToggle}
        />
      </div>

      <ul className={[
        'nav-links',
        isOpen         ? 'open'   : '',
        navLinksHidden ? 'hidden' : '',   // ← only on desktop
      ].filter(Boolean).join(' ')}>
        <li><NavLink to="/" onClick={handleNavLinkClick}>Home</NavLink></li>
        <li><NavLink to="/mga-kuwento" onClick={handleNavLinkClick}>Mga Kuwento</NavLink></li>
        <li><NavLink to="/kasaysayan" onClick={handleNavLinkClick}>Kasaysayan</NavLink></li>
        <li><NavLink to="/tungkol-sa" onClick={handleNavLinkClick}>Tungkol Sa</NavLink></li>
      </ul>

      <button
        className={`nav-toggle${isOpen ? ' open' : ''}`}
        aria-label="Toggle navigation"
        onClick={handleNavToggle}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

    </div>
  );
}

export default NavBar;