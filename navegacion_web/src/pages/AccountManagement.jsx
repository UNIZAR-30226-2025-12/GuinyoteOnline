import React, { useState } from 'react';  
import { useNavigate } from 'react-router-dom';
import ProfileButton from '../components/navegacion/buttons/ProfileButton';
import HistorialPartidasButton from '../components/navegacion/buttons/HistorialPartidasButton';
import '/src/styles/AccountManagement.css';
import ProfileModal from '../components/navegacion/ProfileModal';
import FriendProfileInfoModal from '../components/navegacion/FriendProfileInfoModal';
import HistorialPartidasModal from '../components/navegacion/HistorialPartidasModal';
import { useUser } from '../context/UserContext';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function AccountManagement() {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedOption, setSelectedOption] = useState('perfil'); // Inicializamos en 'perfil'

  const { myProfile, setMyProfile, profileId, setProfileId } = useUser();

  const [stats, setStats] = useState({ victorias: 0, derrotas: 0 });

  useEffect(() => {
    
   
    if (location.pathname == '/account') {
      setMyProfile(true);
      setProfileId('');
    }
  }, [location]);

  const handlePerfilClick = () => {
    setSelectedOption('perfil');
  };

  const handleHistorialClick = () => {
    setSelectedOption('historial');
  };

  const handleBackClick = () => {
    setMyProfile(true);  // O false, dependiendo de qué signifique "por defecto"
    setProfileId('');
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
        {selectedOption === 'perfil' && (
          myProfile ? <ProfileModal /> : <FriendProfileInfoModal />
        )}
        {selectedOption === 'historial' && <HistorialPartidasModal myProfile={myProfile} profileId={profileId} setStats={setStats}/>}
      </div>
    </div>
  );

}

export default AccountManagement;
