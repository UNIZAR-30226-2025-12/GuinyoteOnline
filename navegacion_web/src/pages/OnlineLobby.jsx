import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backButton from '/assets/back_button.png';
import '/src/styles/Lobby.css'
import '/src/styles/Homepage.css'
import MatchFormatButtons from '../components/navegacion/buttons/MatchFormatButtons';
import Lobby from '../components/navegacion/Lobby';

function OnlineLobby() {

  const navigate = useNavigate();

  const [itemSelected, setItemSelected] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handle1v1Click = () => {
  
      setItemSelected(true);
      setSelectedItem("1v1");

  }

  const handle2v2Click = () => {
  
      setItemSelected(true);
      setSelectedItem("2v2");

  }

  const handleBack = () => {
    navigate(-1);
  }


  return (
    <>
      {!itemSelected && (
        <>
          <div className='background-layer'/>
          <div className="lobby-container">
            <button className='lobby-back-button' onClick={handleBack} >
                <img src={backButton} alt="Volver atrás" />
            </button>
            <h1 className="game-title">Selecciona el formato de partida</h1>
            <MatchFormatButtons onClick2v2Match={handle2v2Click} onClick1v1Match={handle1v1Click} />
          </div>
        </>
      )}
      
      {itemSelected && selectedItem === "1v1" && (
        <>
          <button onClick={() => setItemSelected(false)}>Volver</button>
          <Lobby pairs={false} />
        </>
      )}

      {itemSelected && selectedItem === "2v2" && (
        <>
          <button onClick={() => setItemSelected(false)}>Volver</button>
          <Lobby pairs={true} />
        </>
      )}
    </>
  );
}

export default OnlineLobby;


