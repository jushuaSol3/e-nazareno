import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback } from 'react';
import SearchBar from '../components/searchBar';
import books from '../data/books.json';
import './homePage.css';
import './featured.css';

function BookCard({ book, featured }) {
  const navigate = useNavigate();

  return (
    <div
      className={`book-card ${featured ? 'featured-card' : ''}`}
      onClick={() => navigate(`/book/${book.id}`)}
    >
      <div className="book-cover">
        {book.cover ? (
          <img
            src={book.cover}
            alt={book.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div className="book-cover-placeholder">
            <span className="book-cover-initials">
              {book.title.charAt(0)}
            </span>
          </div>
        )}
      </div>
      <div className="book-info">
        <p className="book-title">{book.title}</p>
        <p className="book-author">{book.author}</p>
        <p className="book-chapter">Chapter {book.chapter}</p>
      </div>
      {featured && <button className="book-arrow">›</button>}
    </div>
  );
}

function Carousel() {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const autoPlayRef = useRef(null);
  const resumeTimerRef = useRef(null);

  const startAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      setActive(i => (i + 1) % books.length);
    }, 2500);
  }, []);

  const pauseAndResume = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      startAutoPlay();
    }, 10000);
  }, [startAutoPlay]);

  useEffect(() => {
    startAutoPlay();
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, [startAutoPlay]);

  const prev = () => {
    pauseAndResume();
    setActive(i => (i - 1 + books.length) % books.length);
  };

  const next = () => {
    pauseAndResume();
    setActive(i => (i + 1) % books.length);
  };

  const handleCardClick = (index, isActive) => {
    if (isActive) {
      navigate(`/book/${books[index].id}`);
    } else {
      pauseAndResume();
      setActive(index);
    }
  };

  const getPos = (index) => {
    let diff = index - active;
    if (diff > books.length / 2) diff -= books.length;
    if (diff < -books.length / 2) diff += books.length;
    return diff;
  };

  return (
    <div className="carousel-wrapper">
      <button className="carousel-btn left" onClick={prev}>‹</button>

      <div className="carousel-track">
        {books.map((book, index) => {
          const pos = getPos(index);
          const abs = Math.abs(pos);
          const isActive = pos === 0;
          if (abs > 2) return null;

          return (
            <div
              key={book.id}
              className={`carousel-card ${isActive ? 'active' : ''}`}
              onClick={() => handleCardClick(index, isActive)}
              style={{
                transform: `translateX(calc(${pos} * var(--card-offset))) scale(${isActive ? 1 : 1 - abs * 0.08}) translateY(${abs * 20}px)`,
                zIndex: 10 - abs,
                opacity: abs === 2 ? 0.35 : abs === 1 ? 0.65 : 1,
                filter: isActive ? 'none' : `brightness(${abs === 1 ? 0.6 : 0.4})`,
              }}
            >
              <div className="carousel-cover">
                {book.cover ? (
                  <img
                    src={book.cover}
                    alt={book.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                ) : (
                  <div className="carousel-cover-placeholder">
                    <span className="carousel-cover-initials">
                      {book.title.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div className={`carousel-info ${isActive ? 'visible' : ''}`}>
                <p className="book-title">{book.title}</p>
                <p className="book-author">{book.author}</p>
              </div>
            </div>
          );
        })}
      </div>

      <button className="carousel-btn right" onClick={next}>›</button>
    </div>
  );
}

function HomePage() {
  const featured = books.filter(b => b.featured);

  return (
    <>
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-inner">

          <h1 className="hero-title">E-NAZARENO</h1>

          <img src="/hero-banner.png" alt="Main focus" className="hero-main-img" />

          <div className="hero-content">
            <p>
              Kalipunan ng mga <strong>KUWENTO</strong> sa likod ng <strong>DEBOSYON</strong>
            </p>
            <button className="hero-btn">Simulan ang Pagbabasa</button>
          </div>

          <div className="hero-search">
            <SearchBar />
          </div>

        </div>
      </section>

      {/* ── Stories Content ── */}
      <div className="stories-page">
        <section className="section-featured" id="featured">
          <h2 className="section-title">Featured</h2>
          <div className="featured-list">
            {featured.map(book => (
              <BookCard key={book.id} book={book} featured={true} />
            ))}
          </div>
        </section>

        <section className="section-all">
          <div className="section-header">
            <h2 className="section-title">All Books</h2>
            <a href="#" className="view-all">View all →</a>
          </div>
          <Carousel />
        </section>
      </div>
    </>
  );
}

export default HomePage;