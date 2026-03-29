import SearchBar from './searchBar';
import './mainPage.css';

function MainPage() {
  return (
    <div className="hero">

      <h1 className="hero-title">E-NAZARENO</h1>

      <img src="/hero-banner.png" alt="Main focus" className="hero-main-img" />

      <div className="hero-content">
        <p>
          Kalipunan ng mga <strong>KUWENTO</strong> sa likod ng <strong>DEBOSYON</strong>
        </p>
        <button className="hero-btn">Simulan ang Pagbabasa</button>
      </div>

      <SearchBar className="hero-search" />

    </div>
  );
}

export default MainPage;