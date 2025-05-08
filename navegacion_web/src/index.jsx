import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css'
import Homepage from './pages/Homepage.jsx'
import AccountManagement from './pages/AccountManagement.jsx';
import { UserProvider } from './context/UserContext';
import OnlineLobby from './pages/OnlineLobby.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <Router>
          <Routes>
            <Route path="/" element={<Homepage />}/>
            <Route path="/lobby" element={<OnlineLobby />}/>  
            <Route path="/account" element={<AccountManagement />}/>
          </Routes>
        </Router>
    </UserProvider>
  </StrictMode>,
)
