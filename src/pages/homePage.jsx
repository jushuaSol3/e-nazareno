import { useState, useEffect, useRef, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import SearchBar from '../components/searchBar';
import books from '../data/books.json';
import { useBookModal } from '../components/book-modal-context';
import './homePage.css';
import './featured.css';

function shuffled(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}




function Carousel() {
  const { openModal } = useBookModal();
  const [pool] = useState(() => shuffled(books).slice(0, 3));
  const [active, setActive] = useState(1);
  const autoPlayRef = useRef(null);
  const resumeTimerRef = useRef(null);

  // Touch tracking
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const isSwiping = useRef(false);

  const startAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      setActive(i => (i + 1) % pool.length);
    }, 3000);
  }, [pool.length]);

  const pauseAndResume = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(startAutoPlay, 10000);
  }, [startAutoPlay]);

  useEffect(() => {
    startAutoPlay();
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, [startAutoPlay]);

  const handleCardClick = (index) => {
    if (index !== active) {
      pauseAndResume();
      setActive(index);
    }
  };

  // ── Swipe handlers ──
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isSwiping.current = false;
  };

  const handleTouchMove = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;
    // Only lock as horizontal swipe if mostly horizontal
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8) {
      isSwiping.current = true;
      e.preventDefault(); // prevent page scroll while swiping
    }
  };

  const handleTouchEnd = (e) => {
    if (!isSwiping.current || touchStartX.current === null) {
      touchStartX.current = null;
      return;
    }
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const threshold = 40;

    if (dx < -threshold) {
      // Swipe left → next card
      pauseAndResume();
      setActive(i => Math.min(i + 1, pool.length - 1));
    } else if (dx > threshold) {
      // Swipe right → prev card
      pauseAndResume();
      setActive(i => Math.max(i - 1, 0));
    }

    touchStartX.current = null;
    touchStartY.current = null;
    isSwiping.current = false;
  };

  return (
    <div
      className="exp-carousel"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {pool.map((book, index) => {
        const isActive = index === active;
        return (
          <div
            key={book.id}
            className={`exp-card ${isActive ? 'exp-card--active' : 'exp-card--side'}`}
            onClick={() => handleCardClick(index)}
          >
            <div className="exp-card__cover">
              {book.cover ? (
                <img src={book.cover} alt={book.title} />
              ) : (
                <div className="exp-card__placeholder">
                  {book.title.charAt(0)}
                </div>
              )}
            </div>

            <div className={`exp-card__overlay ${isActive ? 'exp-card__overlay--visible' : ''}`}>
              <p className="exp-card__title">{book.title}</p>
              <p className="exp-card__author">{book.author}</p>
              <button
                className="exp-card__read"
                onClick={(e) => {
                  e.stopPropagation();
                  openModal(book);
                }}
              >
                Basahin
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}




function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <h1 className="hero-title">E-NAZARENO</h1>
          <img src="/hero-banner.png" alt="Main focus" className="hero-main-img" />
          <div className="hero-content">
            <p>
              Kalipunan ng mga <strong>KUWENTO</strong> sa likod ng <strong>DEBOSYON</strong>
            </p>
            <NavLink to='./mga-kuwento' className="hero-btn">Simulan ang Pagbabasa</NavLink>
          </div>
          <div className="hero-search">
            <SearchBar />
          </div>
        </div>
      </section>

      <div className="stories-page">
        <section className="section-all">
          <div className="section-header">
            <h2 className="section-title">ITINATAMPOK</h2>
            <NavLink to="/mga-kuwento" className="view-all">Tingnan lahat →</NavLink>
          </div>
          <Carousel />
        </section>
      </div>
    </>
  );
}

export default HomePage;