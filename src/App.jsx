import { useState } from 'react';
import NavBar from './components/navBar';
import MainPage from './components/mainPage';

import './App.css';

function App() {

  return (
    <>

      <header>
        <NavBar />
      </header>

      <main>
        <MainPage />
      </main>
    </>
  );
}

export default App;