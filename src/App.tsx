import React from 'react';
import './App.scss'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ThreePlayerGamePage from './pages/ThreePlayerGamePage/ThreePlayerGamePage';
import Lobby from './components/Lobby/Lobby';
import Home from './pages/Home/Home';
import io from 'socket.io-client'
import FourPlayerGamePage from './pages/FourPlayerGamePage/FourPlayerGamePage';

// const socket = io(`http://localhost:8080`);
const socket = io(`https://samurai-sword-4c84a9f6080d.herokuapp.com`);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home socket={socket} />} />
        <Route path='lobby/:room/:name' element={<Lobby socket={socket} />} />
        <Route path='/3-player-game/:room/' element={<ThreePlayerGamePage socket={socket} />} />
        <Route path='/4-player-game/:room/' element={<FourPlayerGamePage socket={socket} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
