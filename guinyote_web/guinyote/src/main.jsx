import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Game from './Game.jsx'
import { UserProvider } from '../../../navegacion_web/src/context/UserContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <Game />
    </UserProvider>
  </StrictMode>,
)
