import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import NavBar from './components/navBar';
import HomePage from './pages/homePage';
import MgaKuwento from './pages/mgaKuwento';
import Footer from './components/footer';
import BookModal from './components/book-modal';
import './App.css';
import TungkolSa from './pages/tungkolSa';

// Resets scroll to top on every route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

function App() {
  useEffect(() => {
    const header = document.querySelector('header');
    if (!header) return;

    const updateHeaderHeight = () => {
      document.documentElement.style.setProperty(
        '--header-height',
        header.offsetHeight + 'px'
      );
    };

    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, []);

  return (
    <>
      <ScrollToTop />

      <header>
        <NavBar />
      </header>

      <main>
        <Routes>
          <Route path="/"            element={<HomePage />} />
          <Route path="/mga-kuwento" element={<MgaKuwento />} />
          <Route path="/tungkol-sa"  element={<TungkolSa />} />
        </Routes>
      </main>

      <footer>
        <Footer />
      </footer>

      <BookModal />
    </>
  );
}

export default App;