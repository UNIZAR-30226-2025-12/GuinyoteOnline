import React, { useState } from 'react';
import LoginButton from './buttons/Login_button'
import GroupButtons from './buttons/GroupButtons'
import GameButtons from './buttons/GameButtons'
import RulesButton from './buttons/RulesButton'
import LoginModal from './LoginModal'
import RegisterModal from './RegisterModal';
import RankingModal from './RankingModal';
import FriendsModal from './FriendsModal';


import '/src/styles/Homepage.css'

function Homepage() {

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isUserRegistered, setIsUserRegistered] = useState(false);
  const [showRanking, setShowRanking] = useState(false);
  const [showFriends, setShowFriends] = useState(false);

  // Almacenamos los datos del usuario para la correcta ejecución de la aplicación
  const [username, setUsername] = useState('');
  const [mail, setMail] = useState('');

  const handleLoginModalClose = () => {
    setShowLoginModal(false);
  };

  const handleLoginModal = () => {
    setShowLoginModal(true);
  };

  const handleRegisterModalClose = () => {
    setShowRegisterModal(false);
  };

  const handleRegisterModal = () => {
    setShowRegisterModal(true);
  };

  const handleRankingModalOpen = () => {
    setShowRanking(true);
  }

  const handleRankingModalClose = () => {
    setShowRanking(false);
  }

  const handleFriendsModalOpen = () => {
    setShowFriends(true);
  }

  const handleFriendsModalClose = () => {
    setShowFriends(false);
  }

  const handleLoginClick = () => {
    if (!isUserRegistered) {
      setShowLoginModal(true);
    } else {
      // Lógica para usuarios registrados
    }
  };

 

  const redirigirReglas = () => {
    window.location.href = 'https://www.nhfournier.es/como-jugar/guinote/';
  }

  const tryButtons = () => {
    alert('Funcionalidad no disponible');
  }

  const handleRegisterSubmit = (event) => {
    event.preventDefault();

    const mail = event.target.mail.value; 
    const username = event.target.username.value;
    const password = event.target.password.value;
    const reppassword = event.target.reppassword.value;

    if(password === reppassword){
      setIsUserRegistered(true);
      setShowLoginModal(false);
      setUsername(username);
      alert('Registro enviado', { username, password, mail });
      alert('Registro correcto');
    }
    else{
      alert('Error en el registro');
    };
  };

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;

    // Aquí puedes agregar la lógica para manejar el inicio de sesión, por ejemplo, una petición de validación de usuario
    alert('Inicio de sesión enviado', { username, password });

    // Simulación de validación de usuario
    if (username === 'usuario' && password === 'contraseña') {
      setIsUserRegistered(true);
      setShowLoginModal(false);
      setUsername(event.target.username.value);
      alert('Inicio de sesión correcto');
    } else {
      alert('Error en el inicio de sesión');
    }
  };

  return (
    <>
      <LoginButton className='login-button-position' loginButtonText={username != '' ? username : 'Iniciar sesión'} onClick={handleLoginClick}/>
      <GroupButtons className='gb-container-position' onClickFriends={handleFriendsModalOpen} onClickSettings={tryButtons} onClickRanking={handleRankingModalOpen}/>
      <GameButtons className='gab-container-position' onClickSoloPlay={tryButtons} onClickOnlinePlay={tryButtons}/>
      <RulesButton className='rules-button-position' onClick={redirigirReglas}/>
      <LoginModal show={showLoginModal} handleClose={handleLoginModalClose} handleLoginSubmit={handleLoginSubmit} handleRegister={handleRegisterModal} />
      <RegisterModal show={showRegisterModal} handleClose={handleRegisterModalClose} handleRegisterSubmit={handleRegisterSubmit} handleLogin={handleLoginModal}/>
      <RankingModal show={showRanking} handleClose={handleRankingModalClose} username={username}/>
      <FriendsModal show={showFriends} handleClose={handleFriendsModalClose} mail={mail}/>
    </>
  )
}

export default Homepage
