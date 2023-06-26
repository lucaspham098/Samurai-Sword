import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import GamePage from './pages/Game/GamePage';
import Lobby from './components/Lobby/Lobby';
import Home from './pages/Home/Home';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        {/* <Route path='/lobby/:room' element={<Lobby />} /> */}
        <Route path='/game/:room' element={<GamePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
