import { useEffect, useRef, useState } from 'react';
import './tungkolSa.css';

const KATEGORYA_CARDS = [
  { id: 1, src: '/kategorya1.jpg', label: 'Kasaysayan',    side: 'left'  },
  { id: 2, src: '/kategorya2.jpg', label: 'Prusisyon',     side: 'right' },
  { id: 3, src: '/kategorya3.jpg', label: 'Mga Deboto',    side: 'left'  },
  { id: 4, src: '/kategorya4.jpg', label: 'Tradisyon',     side: 'right' },
  { id: 5, src: '/kategorya5.jpg', label: 'Panalangin',    side: 'left'  },
  { id: 6, src: '/kategorya6.jpg', label: 'Pagmamahal',    side: 'right' },
];

const LAYUNIN_CARDS = [
  { src: '/layunin1.jpg', alt: 'Bawat pagluhod',   label: 'Bawat pagluhod',   hasImage: true  },
  { src: '',              alt: '',                  label: 'Bawat hiling',      hasImage: false },
  { src: '',              alt: '',                  label: 'Bawat pasasalamat', hasImage: false },
];

const OBSERVER_OPTS = { threshold: 0.1, rootMargin: '0px 0px -20px 0px' };

// Total bands: 6 cards + 2 buffer = 8 viewports
const TOTAL_BANDS = 6;
const CARD_COUNT  = KATEGORYA_CARDS.length;

function KategoryaStack() {
  const trackRef  = useRef(null);
  const stickyRef = useRef(null);
  const [cards, setCards] = useState(KATEGORYA_CARDS.map(() => ({ progress: 0 })));

  useEffect(() => {
    const track  = trackRef.current;
    const sticky = stickyRef.current;
    if (!track || !sticky) return;

    const onScroll = () => {
      const rect    = track.getBoundingClientRect();
      const vh      = window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      const bandH   = vh; // one full viewport per card

      // ── Card progress ──
      setCards(KATEGORYA_CARDS.map((_, i) => {
        const raw = (scrolled - i * bandH) / bandH;
        return { progress: Math.max(0, Math.min(1, raw)) };
      }));

      // ── BG zoom ──
      // overall progress through the entire track: 0 → 1
      const totalScroll = TOTAL_BANDS * vh;
      const overallP    = Math.max(0, Math.min(1, scrolled / totalScroll));

      // Zoom curve: 1 at entry, peaks at 1.15 at mid-scroll, back to 1 at exit
      const zoomAmount = 0.15; // max extra scale
      const bgScale    = 1 + zoomAmount * Math.sin(Math.PI * overallP);

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
            const p      = cards[i].progress;
            const xStart = card.side === 'left' ? -85 : 85;

            return (
              <div
                key={card.id}
                className="kat-card"
                style={{
                  transform: `translateX(${xStart * (1 - p)}%) scale(${0.35 + p * 0.65})`,
                  opacity: Math.min(1, p * 2),
                  zIndex:  Math.round(p * 10) + i,
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
    title:     useRef(null),
    sub:       useRef(null),
    body:      useRef(null),
    about:     useRef(null),
    layunin:   useRef(null),
    kategorya: useRef(null),
  };

  useEffect(() => {
    const targets  = Object.values(refs).map(r => r.current).filter(Boolean);
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
            <p className="tungkolSa-kategorya-body tungkolSa-kategorya-body--accent">
              binubuksan ng kagamitang ito ang pinto upang masilip ang masalimuot ngunit matatag na
              ugnayan ng mga tao sa Poong Nazareno.<br>
              </br>

              Ang bawat salaysay ay maingat na hinabi bilang mga interaktibong kuwento upang mas maging
              malapit at madaling maunawaan ng mga mambabasa ang tibay ng pananalig na nagmumula sa
              barangay Dalas patungo sa buong bayan.
            </p>
          </section>
        </div>

      </section>

      <section className="tungkolSa-">

      </section>
    </div>
  );
}