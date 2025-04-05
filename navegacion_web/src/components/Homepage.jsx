import React, { useState } from 'react';
import LoginButton from './buttons/LoginButton'
import GroupButtons from './buttons/GroupButtons'
import GameButtons from './buttons/GameButtons'
import RulesButton from './buttons/RulesButton'
import LoginModal from './LoginModal'
import RegisterModal from './RegisterModal';
import RankingModal from './RankingModal';
import FriendsModal from './FriendsModal';
import '/src/styles/Homepage.css'
import usePost from '../customHooks/usePost';
import useFetch from '../customHooks/useFetch';

function Homepage() {

  const url = 'https://guinyoteonline-hkio.onrender.com';
  const login_url = '/usuarios/inicioSesion';
  const register_url = '/usuarios/registro';

  const { data, error, loading, postData } = usePost(url);

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

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();

    const mail = event.target.email.value; 
    const username = event.target.username.value;
    const password = event.target.password.value;

    const inputData = { nombre: username, correo: mail, contrasena: password };
    alert("Mensaje enviado: " + mail + " --- " + username + " --- " + password);

    // Llamar a postData y esperar que se complete
    await postData(inputData, register_url); // Llamada a la API

    // Después de la llamada, verifica el estado de loading, error y data
    if (loading) {
        console.log('Cargando...');
    }

    if (error) {
        console.error('Error:', error);
        return; // Salir de la función si hay un error
    }

    if (data) {
        setIsUserRegistered(true);
        setShowRegisterModal(false);
        setUsername(username);
        console.log('Usuario registrado exitosamente:', data);
    }
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;

    const inputData = ({correo: username, contrasena: password});
  
    alert("Mensaje enviado" + username + " --- " + password);

    await postData(inputData, login_url);
    console.log({loading, error, data});

    if (loading) {
      console.log('Cargando...');
    }
    if (error) {
      console.error('Error:', error);
    }
    if (data) {
      console.log('Respuesta:', data);
      setIsUserRegistered(true);
      setShowLoginModal(false);
      setUsername(username);
    }
  };

  return (
    <div className='background-container'>
      <div className='background-layer'>

      </div>
      <LoginButton className='login-button-position' loginButtonText={username != '' ? username : 'Iniciar sesión'} onClick={handleLoginClick}/>
      <GroupButtons className='gb-container-position' onClickFriends={handleFriendsModalOpen} onClickRanking={handleRankingModalOpen}/>
      <GameButtons className='gab-container-position' onClickSoloPlay={tryButtons} onClickOnlinePlay={tryButtons}/>
      <RulesButton className='rules-button-position' onClick={redirigirReglas}/>
      <LoginModal show={showLoginModal} handleClose={handleLoginModalClose} handleLoginSubmit={handleLoginSubmit} handleRegister={handleRegisterModal} />
      <RegisterModal show={showRegisterModal} handleClose={handleRegisterModalClose} handleRegisterSubmit={handleRegisterSubmit} handleLogin={handleLoginModal}/>
      <RankingModal show={showRanking} handleClose={handleRankingModalClose} username={username}/>
      <FriendsModal show={showFriends} handleClose={handleFriendsModalClose} mail={mail}/>
    </div>
  )
}

export default Homepage
