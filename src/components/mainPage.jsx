import { useRef } from 'react';
import './mainPage.css';

function MainPage() {
  const heroRef = useRef(null);

  const handleFocus = () => heroRef.current?.classList.add('search-active');
  const handleBlur  = () => heroRef.current?.classList.remove('search-active');

  return (
    <div className="hero" ref={heroRef}>

      <h1 className="hero-title">E-NAZARENO</h1>

      <img src="/hero-banner.png" alt="Main focus" className="hero-main-img" />

      <div className="hero-content">
        <p>
          Kalipunan ng mga <strong>KUWENTO</strong> sa likod ng <strong>DEBOSYON</strong>
        </p>
        <button className="hero-btn">Simulan ang Pagbabasa</button>
      </div>

      <div className="hero-search">
        <span className="hero-search-icon">
          <img src="/search.svg" alt="Search" className="search-img" />
        </span>
        <input
          type="text"
          placeholder="Maghanap..."
          className="hero-search-input"
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>

    </div>
  );
}

export default MainPage;