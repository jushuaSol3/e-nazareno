import './mainPage.css';

function MainPage() {
  return (
    <div className="hero">

      <h1 className="hero-title">E-NAZARENO</h1>

      <img src="/public/hero-banner.png" alt="Main focus" className="hero-main-img" />

      <div className="hero-content">
        <p>
          Kalipunan ng mga <strong>KUWENTO</strong> sa likod ng <strong>DEBOSYON</strong>
        </p>
        <button className="hero-btn">Simulan ang Pagbabasa</button>
      </div>

     <div className="hero-search">
  <span className="hero-search-icon">
    <img 
      src="/public/search.svg" 
      alt="Search" 
      className="search-img"
    />
  </span>
  <input 
    type="text" 
    placeholder="Maghanap..." 
    className="hero-search-input" 
  />
</div>
    </div>
  );
}

export default MainPage;