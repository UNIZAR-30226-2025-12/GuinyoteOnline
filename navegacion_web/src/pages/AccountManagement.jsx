import React, { useState } from 'react';  
import { useNavigate } from 'react-router-dom';
import ProfileButton from '../components/buttons/ProfileButton';
import HistorialPartidasButton from '../components/buttons/HistorialPartidasButton';
import '/src/styles/AccountManagement.css';
import ProfileModal from '../components/ProfileModal';

function AccountManagement() {
  const navigate = useNavigate();

  const [selectedOption, setSelectedOption] = useState('perfil'); // Inicializamos en 'perfil'

  const handlePerfilClick = () => {
    setSelectedOption('perfil');
  };

  const handleHistorialClick = () => {
    setSelectedOption('historial');
  };

  const handleBackClick = () => {
    navigate('/'); // Para volver al inicio si quieres
  };

  return (
    <div className="account-management-container">
      
      <div className="left-panel">
        <button className="back-button" onClick={handleBackClick}> Volver</button>

        <div className="options">
          <ProfileButton onClick={handlePerfilClick} isActive={selectedOption === 'perfil'} />
          <HistorialPartidasButton onClick={handleHistorialClick} isActive={selectedOption === 'historial'} />
        </div>
      </div>

      <div className="right-panel">
        {selectedOption === 'perfil' && <ProfileModal />}
        {selectedOption === 'historial' && <p>Historial Partidas seleccionado</p>}
      </div>
    </div>
  );
}

export default AccountManagement;
