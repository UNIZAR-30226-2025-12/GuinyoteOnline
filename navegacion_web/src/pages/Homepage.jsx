import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginButton from '../components/buttons/LoginButton'
import GroupButtons from '../components/buttons/GroupButtons'
import GameButtons from '../components/buttons/GameButtons'
import RulesButton from '../components/buttons/RulesButton'
import LoginModal from '../components/LoginModal'
import RegisterModal from '../components/RegisterModal';
import RankingModal from '../components/RankingModal';
import FriendsModal from '../components/FriendsModal';
import '/src/styles/Homepage.css'
import usePost from '../customHooks/usePost';
import { useUser } from '../context/UserContext';

function Homepage() {

  const url = 'https://guinyoteonline-hkio.onrender.com';
  const login_url = '/usuarios/inicioSesion';
  const register_url = '/usuarios/registro';

  const navigate = useNavigate();

  const { postData } = usePost(url);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  //const [isUserRegistered, setIsUserRegistered] = useState(false);
  const [showRanking, setShowRanking] = useState(false);
  const [showFriends, setShowFriends] = useState(false); 

  // Almacenamos los datos del usuario para la correcta ejecución de la aplicación
  /*const [username, setUsername] = useState('');
  const [mail, setMail] = useState('');*/

  const {
    username,
    setUsername,
    mail,
    setMail,
    isUserRegistered,
    setIsUserRegistered
  } = useUser();

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
    if (isUserRegistered) {
      setShowFriends(true);
    } else {
      setShowLoginModal(true);
    }
  }

  const handleFriendsModalClose = () => {
    setShowFriends(false);
  }

  const handleLoginClick = () => {
    if (!isUserRegistered) {
      setShowLoginModal(true);
    } else {
      // Lógica para usuarios registrados
      handleAccountManagementClick();
    }
  };

  const redirigirReglas = () => {
    window.location.href = 'https://es.wikipedia.org/wiki/Gui%C3%B1ote';
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
    // Llamar a postData y esperar que se complete
    const response = await postData(inputData, register_url); // Llamada a la API

    if (response.error != null) {
        console.log('Error:', response.error);
        return; // Salir de la función si hay un error
    } else {
      console.log('Respuesta:', response.responseData);
      setIsUserRegistered(true);
      setShowRegisterModal(false);
      setUsername(username);
      setMail(mail);
    }
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    const mail = event.target.mail.value;
    const password = event.target.password.value;

    const inputData = ({correo: mail, contrasena: password});

    const response = await postData(inputData, login_url);

    if (response.error != null) {
      console.log('Error:', response.error);
      return;
    } else {
      console.log('Respuesta:', response.responseData);
      setIsUserRegistered(true);
      setShowLoginModal(false);
      setUsername(response.responseData[0].nombre);
      setMail(mail);
    }
  };

  const handlePartidaOnlineClick = () => {
    if (isUserRegistered) {
      navigate('/online_match');  // Necesitamos pasar el contexto
    } else {
      setShowLoginModal(true);
    }
  }

  const handlePartidaOfflineClick = () => {
    navigate('/offline_match'); // Necesitamos pasar el contexto 
  }

  const handleAccountManagementClick = () => {
    if (isUserRegistered) {
      navigate('/account');
    }
  }

  return (
    <div className='background-container'>
      <div className='background-layer'>

      </div>
      <LoginButton className='login-button-position' loginButtonText={username != '' ? username : 'Iniciar sesión'} onClick={handleLoginClick}/>
      <GroupButtons className='gb-container-position' onClickFriends={handleFriendsModalOpen} onClickRanking={handleRankingModalOpen}/>
      <GameButtons className='gab-container-position' onClickSoloPlay={handlePartidaOfflineClick} onClickOnlinePlay={handlePartidaOnlineClick}/>
      <RulesButton className='rules-button-position' onClick={redirigirReglas}/>
      <LoginModal show={showLoginModal} handleClose={handleLoginModalClose} handleLoginSubmit={handleLoginSubmit} handleRegister={handleRegisterModal} />
      <RegisterModal show={showRegisterModal} handleClose={handleRegisterModalClose} handleRegisterSubmit={handleRegisterSubmit} handleLogin={handleLoginModal}/>
      <RankingModal show={showRanking} handleClose={handleRankingModalClose} />
      <FriendsModal show={showFriends} handleClose={handleFriendsModalClose} mail={mail}/>
    </div>
  )
}

export default Homepage
