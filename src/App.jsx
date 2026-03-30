import { Routes, Route } from 'react-router-dom';
import NavBar from './components/navBar';
import HomePage from './pages/homePage';
import Stories from './pages/mgaKwento';
  // import History from './pages/History';
  // import AboutUT from './pages/AboutUT';
import './App.css';

function App() {
  return (
    <>
      <header>
        <NavBar />
      </header>
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/mga-kwento" element={<Stories />} />
          {/* <Route path="/kasaysayan" element={<History />} />
          <Route path="/tungkol-sa" element={<AboutUT />} /> */}
        </Routes>
      </main>
    </>
  );
}

export default App;