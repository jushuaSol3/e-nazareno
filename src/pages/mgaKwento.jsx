import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import books from '../data/books.json';
import './mgaKwento.css';

function MgaKwento() {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const autoPlayRef = useRef(null);
  const resumeTimerRef = useRef(null);

  const startAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      setActive(i => (i + 1) % books.length);
    }, 3000);
  }, []);

  const pauseAndResume = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(startAutoPlay, 8000);
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

  const goTo = (i) => {
    pauseAndResume();
    setActive(i);
  };

  const book = books[active];

  return (
    <div className="kwento-page">

      {/* ── Hero Carousel ── */}
      <section className="kwento-hero">

        <div className="kwento-card">

          {/* Nav buttons — inside the card */}
          <button className="kwento-btn left" onClick={prev} aria-label="Previous">‹</button>
          <button className="kwento-btn right" onClick={next} aria-label="Next">›</button>

          {/* Left: text */}
          <div className="kwento-card-text">
            <h1 className="kwento-card-title">{book.title}</h1>
            <p className="kwento-card-excerpt">
              "{book.title} — isang kwento ng pananampalataya ni {book.author}."
            </p>
            <button
              className="kwento-read-btn"
              onClick={() => navigate(`/book/${book.id}`)}
            >
              Simulan ang pagbasa
            </button>
          </div>

          {/* Right: cover */}
          <div className="kwento-card-cover">
            {book.cover ? (
              <img src={book.cover} alt={book.title} />
            ) : (
              <div className="kwento-cover-placeholder">
                <span>{book.title.charAt(0)}</span>
              </div>
            )}
            <div className="kwento-card-meta">
              <p className="kwento-meta-title">{book.title}</p>
              <p className="kwento-meta-author">{book.author}</p>
              <p className="kwento-meta-excerpt">
                "{book.title} — isang kwento ng pananampalataya ni {book.author}."
              </p>
                {/* Dots */}
        <div className="kwento-dots">
          {books.map((_, i) => (
            <button
              key={i}
              className={`kwento-dot ${i === active ? 'active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
            </div>
          </div>

        </div>

    

        {/* Counter */}
        <div className="kwento-counter">
          {String(active + 1).padStart(3, '0')} / {String(books.length).padStart(3, '0')}
        </div>

      </section>

    </div>
  );
}

export default MgaKwento;