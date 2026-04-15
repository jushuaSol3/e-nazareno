import { useState, useEffect, useRef } from 'react'; // add useRef
import { NavLink, useLocation } from 'react-router-dom';
import SearchBar from './searchBar';
import './navBar.css';

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);
  const location = useLocation();
  const navSearchRef = useRef(null); // add ref

  const isHome = location.pathname === '/';

  useEffect(() => {
    setSearchOpen(false);
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    let lastWidth = window.innerWidth;
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      if (currentWidth === lastWidth) return;
      lastWidth = currentWidth;
      const mobile = currentWidth <= 640;
      setIsMobile(mobile);
      if (!mobile) {
        setIsOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close search when clicking outside the nav-search container
  useEffect(() => {
    function handleClickOutside(e) {
      if (navSearchRef.current && !navSearchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handleSearchToggle = () => {
    const activeEl = document.activeElement;
    if (activeEl && activeEl.classList.contains('search-bar-input')) return;
    setSearchOpen(prev => !prev);
    if (isOpen) setIsOpen(false);
  };

  const handleNavToggle = () => {
    setIsOpen(prev => !prev);
    if (searchOpen) setSearchOpen(false);
  };

  const handleNavLinkClick = () => {
    setIsOpen(false);
    setSearchOpen(false);
  };

  const handleLogoClick = () => {
    setIsOpen(false);
    setSearchOpen(false);
  };

  const navLinksHidden = !isHome && searchOpen && !isMobile;

  return (
    <div className="nav-wrapper">

      <NavLink to="/" className="nav-logo" aria-label="Home" onClick={handleLogoClick}>
        <img src="/NAZARENO_LOGO.png" alt="Logo" className="nav-logo-img" />
      </NavLink>

      <div
        ref={navSearchRef} // attach ref here
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
        isOpen ? 'open' : '',
        navLinksHidden ? 'hidden' : '',
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