import React from 'react';
import './App.scss'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ThreePlayerGamePage from './pages/ThreePlayerGamePage/ThreePlayerGamePage';
import Lobby from './pages/Lobby/Lobby';
import Home from './pages/Home/Home';
import io from 'socket.io-client'
import FourPlayerGamePage from './pages/FourPlayerGamePage/FourPlayerGamePage';
import FivePlayerGamePage from './pages/FivePlayerGamePage/FivePlayerGamePage';
import SixPlayerGamePage from './pages/SixPlayerGamePage/SixPlayerGamePage';
import SevenPlayerGamePage from './pages/SevenPlayerGamePage/SevenPlayerGamePage';
import Rules_HowToPlay from './pages/Rules_HowToPlay/Rules_HowToPlay';

// const socket = io(`http://localhost:8080`);
const socket = io(`https://samurai-sword-4c84a9f6080d.herokuapp.com`);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home socket={socket} />} />
        <Route path='lobby/:room/:name' element={<Lobby socket={socket} />} />
        <Route path='rules-&-how-to-play' element={<Rules_HowToPlay />} />
        <Route path='/3-player-game/:room/' element={<ThreePlayerGamePage socket={socket} />} />
        <Route path='/4-player-game/:room/' element={<FourPlayerGamePage socket={socket} />} />
        <Route path='/5-player-game/:room/' element={<FivePlayerGamePage socket={socket} />} />
        <Route path='/6-player-game/:room/' element={<SixPlayerGamePage socket={socket} />} />
        <Route path='/7-player-game/:room/' element={<SevenPlayerGamePage socket={socket} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
