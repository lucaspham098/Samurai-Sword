import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import GamePage from './pages/Game/GamePage';
import Lobby from './components/Lobby/Lobby';
import Home from './pages/Home/Home';
import io from 'socket.io-client'

const socket = io(`http://localhost:8080`);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home socket={socket} />} />
        {/* <Route path='/lobby/:room' element={<Lobby />} /> */}
        <Route path='/game/:room' element={<GamePage socket={socket} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
