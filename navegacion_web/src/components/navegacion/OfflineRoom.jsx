import React, { useEffect, useState } from 'react';
import LobbySlots from './LobbySlots';
import { useNavigate } from 'react-router-dom';
import backButton from '/assets/back_button.png';
import { useUser } from '/src/context/UserContext';
import { useGameContext } from '../../context/GameContext';
import '/src/styles/Lobby.css'

const OfflineRoom = ({ pairs }) => {

  const navigate = useNavigate();

  const game = useGameContext() ;

  const botPic = "default.png" ;

  const { username, mail, profilePic } = useUser() ;

  const maxPlayers = !pairs ? 2 : 4;

  const botsNeeded = maxPlayers - 1;

  const bots = Array.from({ length: botsNeeded }, (_, i) => ({
      nombre: `Bot ${i + 1}`,
      email: `bot${i + 1}@ai.local`,
      foto_perfil: botPic
  }));

  const allPlayers = [
      { nombre: username, email: mail, foto_perfil: profilePic },
      ...bots
    ];

  const handleStart = () => {
    navigate("/offline_match");
    game.setNumPlayers(maxPlayers) ;
  };

  const handleBack = () => {
    navigate(-1);
  }


  return (
    <>
      <button className='lobby-back-button' onClick={handleBack}>
        <img src={backButton} alt="Volver atrás" />
      </button>

      <h1>{pairs ? "Sala de Partida 2 vs 2" : "Sala de Partida 1 vs 1"}</h1>

      <LobbySlots slotCount={maxPlayers} playerSlotArgs={allPlayers}/>

      <div className="lobby-buttons">
          <button onClick={handleStart}>Empezar</button>
      </div>
    </>
  );
};

export default OfflineRoom;