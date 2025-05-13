import React, { useEffect } from 'react';
import LobbySlots from './LobbySlots';
import { useNavigate } from 'react-router-dom';
import botPic from '/src/assets/avatares/default.png';
import backButton from '/src/assets/back_button.png';
import '/src/styles/Lobby.css'

const OfflineLobby = ({ pairs }) => {

  const navigate = useNavigate();

  const maxPlayers = !pairs ? 2 : 4;

  useEffect(() => {
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

    setUsers(allPlayers);
  }, [pairs, username, mail, profilePic, maxPlayers]);

  const handleStart = () => {
    navigate("/offline_game", { state: { pairs } });
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

      <LobbySlots slotCount={maxPlayers} playerSlotArgs={users}/>

      <div className="lobby-buttons">
          <button onClick={handleStart}>Empezar</button>
      </div>
    </>
  );
};

export default OfflineLobby;