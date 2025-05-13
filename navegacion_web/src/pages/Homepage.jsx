import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backButton from '/src/assets/back_button.png';
import LoginButton from '../components/navegacion/buttons/LoginButton'
import GroupButtons from '../components/navegacion/buttons/GroupButtons'
import GameButtons from '../components/navegacion/buttons/GameButtons'
import RulesButton from '../components/navegacion/buttons/RulesButton'
import LoginModal from '../components/navegacion/LoginModal'
import RegisterModal from '../components/navegacion/RegisterModal';
import RankingModal from '../components/navegacion/RankingModal';
import FriendsModal from '../components/navegacion/FriendsModal';
import MatchFormatButtons from '../components/navegacion/buttons/MatchFormatButtons';
import '/src/styles/Homepage.css'
import '/src/styles/Lobby.css'
import usePost from '../customHooks/usePost';
import { cartaToStack, useUser } from '../context/UserContext';
import ProfilePic from '../components/navegacion/ProfilePic';


function Homepage() {

  const url = 'https://guinyoteonline-hkio.onrender.com';
  const login_url = '/usuarios/inicioSesion';
  const register_url = '/usuarios/registro';

  const navigate = useNavigate();

  const { postData } = usePost(url);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showRanking, setShowRanking] = useState(false);
  const [showFriends, setShowFriends] = useState(false);
  const [mostrarOfflineOption, setMostrarOfflineOption] = useState(false);

  const {
    username,
    setUsername,
    mail,
    setMail,
    profilePic,
    setProfilePic,
    setTapete,
    setCartas,
    setStack,
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
      handleAccountManagementClick();
    }
  };

  const redirigirReglas = () => {
    window.location.href = 'https://es.wikipedia.org/wiki/Gui%C3%B1ote';
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
      setProfilePic("default.png");
      setTapete("default.png");
      setCartas("default.png");
      setStack("default.png");
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
      setUsername(response.responseData.nombre);
      setMail(mail);
      setProfilePic(response.responseData.foto_perfil);
      setTapete(response.responseData.tapete);
      setCartas(response.responseData.imagen_carta);
      setStack(cartaToStack(response.responseData.imagen_carta));
    }
  };

  const handlePartidaOnlineClick = () => {
    if (isUserRegistered) {
      navigate('/lobby'); // Cambiar a la ruta de la sala de espera
    } else {
      setShowLoginModal(true);
    }
  }

  const handlePartidaOfflineClick = () => {
    setMostrarOfflineOption(true);
  };

  const handleAccountManagementClick = () => {
    if (isUserRegistered) {
      navigate('/account');
    }
  }

  const handle1v1Click = () => {
  
      setMostrarOfflineOption(false);
      navigate('/offline_lobby', { state: { pairs: false } });

  }

  const handle2v2Click = () => {
  
      setMostrarOfflineOption(false);
      navigate('/offline_lobby', { state: { pairs: false } });

  }

  const handleBack = () => {
    setMostrarOfflineOption(false);
  }

  return (
    <>
      <div className='background-container'>
        <div className='background-layer'/>
          <GameButtons className='gab-container-position' onClickSoloPlay={handlePartidaOfflineClick} onClickOnlinePlay={handlePartidaOnlineClick}/> 
          <LoginButton className='login-button-position' isLoggedIn={isUserRegistered} loginButtonText={username != '' ? username : 'Iniciar sesión'} loginButtonIcon={profilePic} onClick={handleLoginClick}/>
          <GroupButtons className='gb-container-position' onClickFriends={handleFriendsModalOpen} onClickRanking={handleRankingModalOpen}/>
          <RulesButton className='rules-button-position' onClick={redirigirReglas}/>
          <LoginModal show={showLoginModal} handleClose={handleLoginModalClose} handleLoginSubmit={handleLoginSubmit} handleRegister={handleRegisterModal} />
          <RegisterModal show={showRegisterModal} handleClose={handleRegisterModalClose} handleRegisterSubmit={handleRegisterSubmit} handleLogin={handleLoginModal}/>
          <RankingModal show={showRanking} handleClose={handleRankingModalClose} />
          <FriendsModal show={showFriends} handleClose={handleFriendsModalClose} mail={mail}/>
      </div>

      {mostrarOfflineOption && (
        <>
          <div className='modal-overlay'/>
            <div className="modal-lobby-container ">
              <button className='lobby-back-button' onClick={handleBack} >
                  <img src={backButton} alt="Volver atrás" />
              </button>
              <h1 className="game-title">Selecciona el formato de partida</h1>
              <MatchFormatButtons onClick2v2Match={handle2v2Click} onClick1v1Match={handle1v1Click} />
            </div>
        </>
      )}
    </>
  )
}

export default Homepage
