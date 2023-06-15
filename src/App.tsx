import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import GamePage from './pages/Game/GamePage';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<GamePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
