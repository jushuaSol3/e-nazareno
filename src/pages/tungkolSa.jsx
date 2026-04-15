import { useEffect, useRef, useState, useCallback } from 'react';
import './tungkolSa.css';
import openBooks from '../data/openBook.json';
import books from '../data/books.json';

const KATEGORYA_CARDS = [
  { id: 1, src: '/ILLUSTRATION_HISTORIKAL.png', label: 'Historikal', side: 'left', },
  { id: 2, src: '/ILLUSTRATION_FOR_ESPIRITUWAL_v3.png', label: 'Espirituwal', side: 'right' },
  { id: 3, src: '/illustration-for-kultural-3.png', label: 'Kultural', side: 'left' },
  { id: 4, src: '/ILLUSTRATION-FOR-PANINIWALA-2.png', label: 'Paniniwala', side: 'right' },
  { id: 5, src: '/ILLUSTRATION_FOR_HILING_2_FINAL.png', label: 'Hiling', side: 'left' },
  { id: 6, src: '/ILLUSTRATION-FOR-PASASALAMAT-3.png', label: 'Pasasalamat', side: 'right' },
];

const LAYUNIN_CARDS = [
  { src: '/luhod.jpg', alt: 'Bawat pagluhod', label: 'Bawat pagluhod', hasImage: true },
  { src: '/bawat-hiling.png', alt: '', label: 'Bawat hiling', hasImage: true },
  { src: '/bawat-pasasalamat.jpg', alt: '', label: 'Bawat pasasalamat', hasImage: true },
];

const OBSERVER_OPTS = { threshold: 0.1, rootMargin: '0px 0px -20px 0px' };

const TOTAL_BANDS = 6;
const CARD_COUNT = KATEGORYA_CARDS.length;

const LYRIC_LINES = [
  { text: 'Gamit ang makabagong Audio Feature,', start: 0, end: 5 },
  { text: 'binigyang-buhay ng platapormang ito', start: 5, end: 10 },
  { text: 'ang tradisyong oral ng ating mga ninuno,', start: 10, end: 16 },
  { text: 'kung saan ang boses ng pananampalataya', start: 16, end: 22 },
  { text: 'ay direktang naririnig at nadarama,', start: 22, end: 28 },
  { text: 'hindi lamang nababasa.', start: 28, end: 34 },
];

const TOTAL_DURATION = LYRIC_LINES[LYRIC_LINES.length - 1].end;

// ── BookCarousel component ───────────────────────────────────────────
function BookCarousel({ authorName }) {
  const authorBooks = books.filter((b) =>
    b.author.toUpperCase().includes(authorName.toUpperCase())
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef(null);

  const startCarousel = useCallback(() => {
    if (authorBooks.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % authorBooks.length);
    }, 5000);
  }, [authorBooks.length]);

  useEffect(() => {
    startCarousel();
    return () => clearInterval(intervalRef.current);
  }, [startCarousel]);

  if (authorBooks.length === 0) return null;

  const currentBook = authorBooks[activeIndex];

  return (
    <div className="awtor-book-carousel">
      <div className="awtor-book-cover">
        <img src={currentBook.cover} alt={currentBook.title} />
      </div>
      <p className="awtor-book-title">{currentBook.title}</p>
    </div>
  );
}

// ── MusicPlayer component ───────────────────────────────────────────
function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const rafRef = useRef(null);
  const lastTSRef = useRef(null);

  const tick = useCallback((ts) => {
    if (lastTSRef.current !== null) {
      const delta = (ts - lastTSRef.current) / 1000;
      setCurrentTime(prev => {
        const next = prev + delta;
        if (next >= TOTAL_DURATION) {
          setIsPlaying(false);
          lastTSRef.current = null;
          return 0;
        }
        return next;
      });
    }
    lastTSRef.current = ts;
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      lastTSRef.current = null;
      rafRef.current = requestAnimationFrame(tick);
    } else {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTSRef.current = null;
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying, tick]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handlePrev = () => setCurrentTime(t => Math.max(0, t - 8));
  const handleNext = () => setCurrentTime(t => Math.min(TOTAL_DURATION - 0.1, t + 8));

  const getLyricClass = (line) => {
    if (currentTime >= line.start && currentTime < line.end) return 'lyric-line lyr--active';
    if (currentTime >= line.end) return 'lyric-line lyr--past';
    return 'lyric-line';
  };

  return (
    <div className={`music-container-sample${isPlaying ? ' is-playing' : ''}`}>

      <div className="music-lyrics-sample">
        {LYRIC_LINES.map((line, i) => (
          <span key={i} className={getLyricClass(line)}>
            {line.text}
          </span>
        ))}
      </div>

      <div className="audio-player-buttons">
        <img src="/mlist.png" alt="list-audio" />
        <img
          src="/prev.png"
          alt="prev"
          onClick={handlePrev}
          style={{ cursor: 'pointer' }}
        />
        <img
          src="/play.png"
          alt="play"
          onClick={handlePlay}
          style={{ cursor: 'pointer', display: isPlaying ? 'none' : 'block' }}
        />
        <img
          src="/pause.png"
          alt="pause"
          onClick={handlePause}
          style={{ cursor: 'pointer', display: isPlaying ? 'block' : 'none' }}
        />
        <img
          src="/next.png"
          alt="next"
          onClick={handleNext}
          style={{ cursor: 'pointer' }}
        />
        <img src="/shuffle.png" alt="shuffle" />
      </div>

    </div>
  );
}

// ── KategoryaStack ──────────────────────────────────────────────────
function KategoryaStack() {
  const trackRef = useRef(null);
  const stickyRef = useRef(null);
  const [cards, setCards] = useState(KATEGORYA_CARDS.map(() => ({ progress: 0 })));

  useEffect(() => {
    const track = trackRef.current;
    const sticky = stickyRef.current;
    if (!track || !sticky) return;

    const onScroll = () => {
      const rect = track.getBoundingClientRect();
      const vh = window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      const bandH = vh;

      setCards(KATEGORYA_CARDS.map((_, i) => {
        const raw = (scrolled - i * bandH) / bandH;
        return { progress: Math.max(0, Math.min(1, raw)) };
      }));

      const totalScroll = TOTAL_BANDS * vh;
      const overallP = Math.max(0, Math.min(1, scrolled / totalScroll));
      const zoomAmount = 0.15;
      const bgScale = 1 + zoomAmount * Math.sin(Math.PI * overallP);
      sticky.style.setProperty('--kat-bg-scale', bgScale.toFixed(4));
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div ref={trackRef} className="kat-track">
      <div ref={stickyRef} className="kat-sticky">
        <div className="kat-scene">
          {KATEGORYA_CARDS.map((card, i) => {
            const p = cards[i].progress;
            const xStart = card.side === 'left' ? -85 : 85;

            return (
              <div
                key={card.id}
                className="kat-card"
                style={{
                  transform: `translateX(${xStart * (1 - p)}%) scale(${0.35 + p * 0.65})`,
                  opacity: Math.min(1, p * 2),
                  zIndex: Math.round(p * 10) + i,
                }}
              >
                <img src={card.src} alt={card.label} className="kat-card-img" loading="lazy" />
                <div className="kat-card-overlay">
                  <span className="kat-card-counter">
                    {String(i + 1).padStart(2, '0')} / {String(CARD_COUNT).padStart(2, '0')}
                  </span>
                  <div className="kat-card-text">
                    <p className="kat-card-sub">{card.sub}</p>
                    <h4 className="kat-card-label">{card.label}</h4>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function TungkolSa() {
  const refs = {
    title: useRef(null),
    sub: useRef(null),
    body: useRef(null),
    about: useRef(null),
    layunin: useRef(null),
    kategorya: useRef(null),
  };

  useEffect(() => {
    const targets = Object.values(refs).map(r => r.current).filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          observer.unobserve(e.target);
        }
      });
    }, OBSERVER_OPTS);

    targets.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="tungkolSa-page">

      <section className="tungkolSa-banner" aria-label="Banner">
        <figure className="tungkolSa-banner-img-wrap">
          <img src="/banner2.jpg" alt="Banner ng E-Nazareno" />
          <figcaption className="tungkolSa-banner-overlay">
            <h1>Tungkol sa amin</h1>
          </figcaption>
        </figure>
      </section>

      <section className="tungkolSa-intro" aria-labelledby="intro-title">

        <h2 ref={refs.title} id="intro-title" className="tungkolSa-intro-title">
          E-NAZARENO
        </h2>

        <p ref={refs.sub} className="tungkolSa-intro-sub">
          "Isang Digital na <mark>Dambana</mark> ng Pananampalataya"
        </p>

        <div ref={refs.body} className="tungkolSa-body-wrap">
          <p className="tungkolSa-intro-body">
            Ang E-Nazareno ay isang makabagong digital na espasyo na nagsisilbing dambana
            ng mga kuwento, kasaysayan, at buhay na pananampalataya ng mga deboto ng Poong
            Itim na Nazareno sa Bayan ng Labo, Camarines Norte.
          </p>
          <img
            src="/simbahan_front.png"
            alt="Harapan ng Simbahan ng Bayan ng Labo"
            className="tungkolSa-body-img"
            loading="lazy"
          />
          <img
            src="/cross.png"
            alt=""
            aria-hidden="true"
            className="tungkolSa-cross"
          />
        </div>

        <div className="tungkolSa-about-section">
          <div ref={refs.about} className="tungkolSa-about-wrap">
            <div className="tungkolSa-about-bg-clip">
              <img src="/about_background.png" alt="" className="tungkolSa-about-bg" loading="lazy" />
            </div>
            <p className="tungkolSa-about-overlay-text">
              <span>
                Higit sa pagiging isang arkibo, ang platapormang ito ay isang pagsisikap na
                dalumatin ang yaman ng lokal na debosyon na madalas ay nananatiling nakatago
                sa likod ng mga tanyag na dambana sa bansa.
              </span>
            </p>
          </div>
          <div className="tungkolSa-about-logo">
            <img src="/logo-final.png" alt="E-Nazareno Logo" loading="lazy" />
          </div>
        </div>

        <section ref={refs.layunin} className="tungkolSa-layunin-section" aria-labelledby="layunin-title">
          <h3 id="layunin-title" className="tungkolSa-layunin-heading">
            Layunin nitong ipakita na ang
          </h3>
          <div className="tungkolSa-layunin-grid">
            {LAYUNIN_CARDS.map(({ src, alt, label, hasImage }) => (
              <div
                key={label}
                className={`tungkolSa-layunin-card${hasImage ? ' tungkolSa-layunin-card--has-image' : ''}`}
              >
                {hasImage && (
                  <img src={src} alt={alt} className="tungkolSa-layunin-card-img" loading="lazy" />
                )}
                <span className="tungkolSa-layunin-card-label">{label}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="tungkolSa-kategorya-bg-wrap">
          <section ref={refs.kategorya} className="tungkolSa-kategorya-section" aria-labelledby="kategorya-title">
            <h3 id="kategorya-title" className="tungkolSa-kategorya-heading">
              Sa pamamagitan ng anim na susing kategorya
            </h3>
            <div className="tungkolSa-kategorya-divider" aria-hidden="true" />

            <KategoryaStack />

            <MusicPlayer />

            <p className="tungkolSa-kategorya-body tungkolSa-kategorya-body--accent">
              binubuksan ng kagamitang ito ang pinto upang masilip ang masalimuot ngunit matatag na
              ugnayan ng mga tao sa Poong Nazareno.<br>
              </br>
            </p>
          </section>
        </div>

        <br />

        <div>
          <p>
            Ang bawat salaysay ay maingat na hinabi bilang mga interaktibong kuwento upang mas maging malapit at madaling maunawaan ng mga mambabasa ang tibay ng pananalig na nagmumula sa barangay Dalas patungo sa buong bayan.
          </p>

          <br />
          <p>
            Ito rin ay nagsisilbing isang paanyaya sa mga susunod na henerasyon na balikan ang kanilang pinag-ugatan at kilalanin ang Poong Nazareno hindi lamang bilang isang imahen, kundi bilang katuwang sa bawat danas ng buhay-Laboeño.
          </p>
          <br />
          <p>
            Sa huli, ang E-Nazareno ay naninindigan na ang tunay na lakas ng isang debosyon ay wala sa laki ng simbahan, kundi sa lalim ng mga kuwentong ipinapasa at sa ningning ng pananampalatayang patuloy na nagbubuklod sa isang pamayanan.

          </p>
        </div>
      </section>

      <section className="our-team">

        <div className='awtor'>
          <h2>MGA AWTOR</h2>
          <br />
        </div>


        <div className='awtor-hover awtor-container'>
          <div className='title-container'>
            <p className=''>
              AWTOR
            </p>
            <p>
              CORTEZ
            </p>
          </div>
          <div className='profile-container'>
            <img src='/cortez.png' alt='Kate Cortez' />
          </div>
          <BookCarousel authorName="CORTEZ" />
        </div>
        {/*  separation */}
        <div className='awtor-hover awtor-container'>
          <div className='title-container'>
            <p className=''>
              AWTOR
            </p>
            <p>
              MARCA
            </p>

          </div>
          <div className='profile-container'>
            <img src='/MARCA.png' alt='Stephanie Marca' />
          </div>
          <BookCarousel authorName="MARCA" />
        </div>

      </section>
    </div>
  );
}


{/*
 
  */}