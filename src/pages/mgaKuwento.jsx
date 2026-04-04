import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback } from 'react';
import books from '../data/books.json';
import { useBookModal } from '../components/book-modal-context';
import './mgaKuwento.css';

function MgaKuwento() {
  const { openModal } = useBookModal();
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [held, setHeld] = useState(false);
  const autoPlayRef = useRef(null);
  const resumeTimerRef = useRef(null);
  const holdTimerRef = useRef(null);
  const dotsRef = useRef(null);
  const heldRef = useRef(false);

  // Keep heldRef in sync with held state so pointer handlers always
  // see the current value without needing held in their dependency arrays.
  useEffect(() => {
    heldRef.current = held;
  }, [held]);

  const goTo = useCallback((nextIndex) => {
    setTransitioning(true);
    setTimeout(() => {
      setActive(nextIndex);
      setTransitioning(false);
    }, 350);
  }, []);

  const startAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      setActive(i => {
        const next = (i + 1) % books.length;
        goTo(next);
        return i;
      });
    }, 3000);
  }, [goTo]);

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
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    };
  }, [startAutoPlay]);

  const prev = () => {
    pauseAndResume();
    goTo((active - 1 + books.length) % books.length);
  };

  const next = () => {
    pauseAndResume();
    goTo((active + 1) % books.length);
  };

  const handleDot = (i) => {
    pauseAndResume();
    goTo(i);
  };

  // ── Hold + drag-to-navigate logic ──

  // Returns the dot index whose bounding rect contains clientX, or null.
  const getDotIndexFromPoint = (clientX) => {
    if (!dotsRef.current) return null;
    const dotEls = dotsRef.current.querySelectorAll('.kuwento-dot');
    for (let i = 0; i < dotEls.length; i++) {
      const rect = dotEls[i].getBoundingClientRect();
      if (clientX >= rect.left && clientX <= rect.right) return i;
    }
    return null;
  };

  const handleDotPointerDown = (e, i) => {
    // Capture pointer so pointermove keeps firing even as finger slides
    // across sibling dots or outside the button's own hit area.
    e.currentTarget.setPointerCapture(e.pointerId);

    holdTimerRef.current = setTimeout(() => {
      heldRef.current = true;
      setHeld(true);
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    }, 180);
  };

  // Fires while finger/mouse drags across the dot pill.
  const handleDotPointerMove = (e) => {
    if (!heldRef.current) return;
    const idx = getDotIndexFromPoint(e.clientX);
    if (idx !== null) {
      // Instant (no fade) — scrubbing should feel like a thumb slider.
      setActive(idx);
    }
  };

  const handleDotPointerUp = (e, i) => {
    clearTimeout(holdTimerRef.current);
    if (heldRef.current) {
      // Releasing a hold — resume autoplay after a short grace period.
      heldRef.current = false;
      setHeld(false);
      resumeTimerRef.current = setTimeout(startAutoPlay, 1500);
    } else {
      // Quick tap — navigate with transition.
      handleDot(i);
    }
  };

  // Fires when the pointer leaves the entire dots container.
  const handleDotsPointerLeave = () => {
    clearTimeout(holdTimerRef.current);
    if (heldRef.current) {
      heldRef.current = false;
      setHeld(false);
      resumeTimerRef.current = setTimeout(startAutoPlay, 1500);
    }
  };

  const book = books[active];
  const tc = transitioning ? 'is-transitioning' : '';

  return (
    <div className="kuwento-page">

      <section className="kuwento-hero">
        <div className="kuwento-card">

          <button className="kuwento-btn left" onClick={prev} aria-label="Previous">‹</button>
          <button className="kuwento-btn right" onClick={next} aria-label="Next">›</button>

          <div className={`kuwento-card-text ${tc}`}>
            <h1 className="kuwento-card-title">{book.title}</h1>
            <p className="kuwento-card-excerpt">
              "{book.title} — isang kwento ng pananampalataya ni {book.author}."
            </p>
            <button
              className="kuwento-read-btn"
              onClick={() => navigate(`/book/${book.id}`)}
            >
              Simulan ang pagbasa
            </button>
          </div>

          <div
            className={`kuwento-dots ${held ? 'is-held' : ''}`}
            ref={dotsRef}
            onPointerMove={handleDotPointerMove}
            onPointerLeave={handleDotsPointerLeave}
          >
            {books.map((_, i) => (
              <button
                key={i}
                className={`kuwento-dot ${i === active ? 'active' : ''}`}
                aria-label={`Go to slide ${i + 1}`}
                onPointerDown={(e) => handleDotPointerDown(e, i)}
                onPointerUp={(e) => handleDotPointerUp(e, i)}
              />
            ))}
          </div>

          <div className={`kuwento-card-cover ${tc}`}>
            {book.cover ? (
              <img src={book.cover} alt={book.title} />
            ) : (
              <div className="kuwento-cover-placeholder">
                <span>{book.title.charAt(0)}</span>
              </div>
            )}
            <div className="kuwento-card-meta">
              <p className="kuwento-meta-title">{book.title}</p>
              <p className="kuwento-meta-author">{book.author}</p>
              <p className="kuwento-meta-excerpt">
                "{book.title} — isang kwento ng pananampalataya ni {book.author}."
              </p>
            </div>
          </div>

        </div>
      </section>

      <section className="kuwento-grid-section">
        <div className="kuwento-grid-inner">
          <h2 className="kuwento-grid-heading">Lahat ng Kuwento</h2>
          <div className="kuwento-grid-wrapper">
            <div className="kuwento-grid">
              {books.map((b) => (
                <div
                  key={b.id}
                  className="kuwento-grid-item"
                  onClick={() => openModal(b)}
                >
                  <div className="kuwento-grid-cover">
                    {b.cover ? (
                      <img src={b.cover} alt={b.title} />
                    ) : (
                      <div className="kuwento-grid-placeholder">
                        <span>{b.title.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <p className="kuwento-grid-title">{b.title}</p>
                  <p className="kuwento-grid-author">{b.author}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default MgaKuwento;