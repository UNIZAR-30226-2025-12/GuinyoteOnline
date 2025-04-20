import React from 'react';
import '/src/styles/HistorialPartidasButton.css'; // Asegúrate de tener los estilos adecuados

const HistorialPartidasButton = ({ onClick, isActive }) => {
  return (
    <button 
      className={`historial-button ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      Historial Partidas
    </button>
  );
};

export default HistorialPartidasButton;
