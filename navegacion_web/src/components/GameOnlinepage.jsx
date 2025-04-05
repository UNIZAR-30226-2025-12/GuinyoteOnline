import React, { useState } from 'react';
import LoginButton from './buttons/LoginButton'
import GroupButtons from './buttons/GroupButtons'
import GameButtons from './buttons/GameButtons'
import RulesButton from './buttons/RulesButton'
import LoginModal from './LoginModal'
import RegisterModal from './RegisterModal';
import RankingModal from './RankingModal';
import FriendsModal from './FriendsModal';
import '/src/styles/Gamepage.css'
import usePost from '../customHooks/usePost';

function GameOnlinepage({handleMiCuentaClick, handlePartidaOnlineClick, handlePartidaOfflineClick}) {

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
      handleMiCuentaClick();
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
    alert("Mensaje enviado: " + mail + " --- " + username + " --- " + password);

    // Llamar a postData y esperar que se complete
    const response = await postData(inputData, register_url); // Llamada a la API

    if (response.error != null) {
        console.log('Error:', response.error);
        return; // Salir de la función si hay un error
    }else{
      console.log('Respuesta:', response.responseData);
      setIsUserRegistered(true);
      setShowRegisterModal(false);
      setUsername(username);
    }
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;

    const inputData = ({correo: username, contrasena: password});
  
    alert("Mensaje enviado" + username + " --- " + password);

    const response = await postData(inputData, login_url);

    if (response.error != null) {
      console.log('Error:', response.error);
      return;
    } else {
      console.log('Respuesta:', response.responseData);
      setIsUserRegistered(true);
      setShowLoginModal(false);
      setUsername(username);
    }
  };

  const handleOnlineClick = () => {
    if (isUserRegistered) {
      handlePartidaOnlineClick();
    } else {
      setShowLoginModal(true);
    }
  }

  return (
    <div className="game-container">
      <h1 className="game-title">Partida online</h1>

      <div className="flex flex-wrap gap-4 justify-center">
        <button
          className={`px-4 py-3 rounded-md border border-gray-300 w-32 text-center ${
            selectedMode === "2vs2" ? "bg-blue-100 border-blue-500" : ""
          }`}
          onClick={() => handleModeSelect("2vs2")}
        >
          Partida 2 vs 2
        </button>

        <button
          className={`px-4 py-3 rounded-md border border-gray-300 w-32 text-center ${
            selectedMode === "1vs1" ? "bg-blue-100 border-blue-500" : ""
          }`}
          onClick={() => handleModeSelect("1vs1")}
        >
          Partida 1 vs 1
        </button>
      </div>
    </div>
  )
}


