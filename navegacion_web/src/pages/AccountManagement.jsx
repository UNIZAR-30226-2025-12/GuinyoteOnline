import React, { useState } from 'react';  
import { useNavigate } from 'react-router-dom';
import ProfileButton from '../components/buttons/ProfileButton';
import HistorialPartidasButton from '../components/buttons/HistorialPartidasButton';
import '/src/styles/AccountManagement.css';

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
        <ProfileButton onClick={handlePerfilClick} />
        <HistorialPartidasButton onClick={handleHistorialClick} />
      </div>

      <div className="right-panel">
        {selectedOption === 'perfil' && <p>Perfil seleccionado</p>}
        {selectedOption === 'historial' && <p>Historial Partidas seleccionado</p>}
      </div>
    </div>
  );
}

export default AccountManagement;
