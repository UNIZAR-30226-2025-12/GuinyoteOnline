import React, { useState } from 'react';
import LoginButton from './Login_button'
import GroupButtons from './GroupButtons'
import GameButtons from './GameButtons'
import RulesButton from './RulesButton'
import LoginModal from './LoginModal'
import './App.css'


function App() {

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isUserRegistered, setIsUserRegistered] = useState(false); // Simulación de estado de registro del usuario
  const [username, setUsername] = useState('');

  const handleLoginClick = () => {
    if (!isUserRegistered) {
      setShowLoginModal(true);
    } else {
      // Lógica para usuarios registrados
    }
  };

  const handleLoginModalClose = () => {
    setShowLoginModal(false);
  };

  const handleRegisterModal = () => {
    setShowRegisterModal(true);
  };

  const handleRegisterModalClose = () => {
    setShowRegisterModal(false);
  };

  const redirigirReglas = () => {
    window.location.href = 'https://www.nhfournier.es/como-jugar/guinote/';
  }

  const tryButtons = () => {
    alert('Try buttons');
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
      setUsername(username);
      alert('Inicio de sesión correcto');
    } else {
      alert('Error en el inicio de sesión');
    }
  };

  return (
    <>
      <LoginButton className='login-button-position' loginButtonText={username != '' ? username : 'Iniciar sesión'} onClick={handleLoginClick}/>
      <GroupButtons className='gb-container-position' onClickFriends={tryButtons} onClickSettings={tryButtons} onClickRanking={tryButtons}/>
      <GameButtons className='gab-container-position' onClickSoloPlay={tryButtons} onClickOnlinePlay={tryButtons}/>
      <RulesButton className='rules-button-position' onClick={redirigirReglas}/>
      <LoginModal show={showLoginModal} handleClose={handleLoginModalClose} handleLoginSubmit={handleLoginSubmit} handleRegister={handleRegisterModal} />
      <RegisterModal show={showRegisterModal} handleClose={handleRegisterModalClose} handleRegisterSubmit={handleRegisterSubmit}/>
    </>
  )
}

export default App
