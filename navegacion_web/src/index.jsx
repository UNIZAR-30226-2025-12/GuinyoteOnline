import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css'
import Homepage from './pages/Homepage.jsx'
import GameOnlinepage from './components/GameOnlinepage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />}/>
        <Route path="/online_match" element={<GameOnlinepage />}/>
      </Routes>
    </Router>
    
  </StrictMode>,
)
