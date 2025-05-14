import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';

import Homepage from './pages/Homepage.jsx';
import OnlineGame from './pages/OnlineGame.jsx';
import Game from './pages/Game.jsx';
import AccountManagement from './pages/AccountManagement.jsx';
import OnlineLobby from './pages/OnlineLobby.jsx';
import OfflineLobby from './pages/OfflineLobby.jsx';

import { UserProvider } from './context/UserContext';
import { SocketProvider } from './context/SocketContext'; 
import { GameProvider } from './context/GameContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <SocketProvider>
        <GameProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/online_match" element={<OnlineGame />} />
              <Route path="/offline_lobby" element={<OfflineLobby />} />
              <Route path="/offline_match" element={<Game />} />
              <Route path="/lobby" element={<OnlineLobby />} />
              <Route path="/account" element={<AccountManagement />} />
              <Route path="/account/:profileId" element={<AccountManagement />} />
          </Routes>
          </Router>
        </GameProvider> 
      </SocketProvider>
    </UserProvider>
  </StrictMode>,
);

