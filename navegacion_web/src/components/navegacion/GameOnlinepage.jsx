import React, { useState } from 'react';
import MatchFormatButtons from './buttons/MatchFormatButtons';
import CmRoundButton from './buttons/base_buttons/CmRoundButton';
import LoginButton from './buttons/LoginButton'
import GroupButtons from './buttons/GroupButtons'
import GameButtons from './buttons/GameButtons'
import RulesButton from './buttons/RulesButton'
import LoginModal from './LoginModal'
import RegisterModal from './RegisterModal';
import RankingModal from './RankingModal';
import FriendsModal from './FriendsModal';
import usePost from '../../customHooks/usePost';

function GameOnlinepage({handleMiCuentaClick, handle2v2MatchClick, handle1v1MatchClick}) {

  const url = 'https://guinyoteonline-hkio.onrender.com';
  const login_url = '/usuarios/inicioSesion';
  const register_url = '/usuarios/registro';

  const { postData } = usePost(url);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isUserRegistered, setIsUserRegistered] = useState(false);
  const [showRanking, setShowRanking] = useState(false);
  const [showFriends, setShowFriends] = useState(false);

  // Almacenamos los datos del usuario para la correcta ejecución de la aplicación
  const [username, setUsername] = useState('');
  const [mail, setMail] = useState('');

  const handle1v1Click = () => {
    if (isUserRegistered) {
      handle1v1MatchClick();
    } else {
      setShowLoginModal(true);
    }
  }

  const handle2v2Click = () => {
    if (isUserRegistered) {
      handle2v2MatchClick();
    } else {
      setShowLoginModal(true);
    }
  }
  return (
    <div className='game-container'>
      <h1 className="game-title">Partida online</h1>

      

      <h1>Bienvenido a la Sala de Juego</h1>
      <p>Aquí puedes jugar y divertirte.</p>
      {/* Puedes agregar más funcionalidad para la sala de juego */}
    </div>
  );
  return (
    <div className="game-container">
      

      <div className="game-buttons">
        <MatchFormatButtons className={position='fixed'} onClick2v2Match={handle2v2Click} onClick1v1Match={handle1v1Click}/>
      </div>
    </div>
  )
}

export default GameOnlinepage;


