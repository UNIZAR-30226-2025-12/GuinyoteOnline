import React, { useState, useEffect } from 'react';  
import { useNavigate, useParams } from 'react-router-dom';
import ProfileButton from '../components/navegacion/buttons/ProfileButton';
import HistorialPartidasButton from '../components/navegacion/buttons/HistorialPartidasButton';
import '/src/styles/AccountManagement.css';
import ProfileModal from '../components/navegacion/ProfileModal';
import FriendProfileInfoModal from '../components/navegacion/FriendProfileInfoModal';
import HistorialPartidasModal from '../components/navegacion/HistorialPartidasModal';
import { useUser } from '../context/UserContext';

function AccountManagement() {
  const navigate = useNavigate();
  
  const { profileId: paramProfileId } = useParams(); // obtenemos /account/:profileId

  const [selectedOption, setSelectedOption] = useState('perfil');

  const { setMyProfile, setProfileId, myProfile } = useUser();

  useEffect(() => {
    if (paramProfileId) {
      // Si hay un profileId en la URL, no es tu perfil
      setMyProfile(false);
      setProfileId(paramProfileId);
    } else {
      // Si no hay, estás viendo tu propio perfil
      setMyProfile(true);
      setProfileId('');
    }
  }, [paramProfileId]);

  const handlePerfilClick = () => {
    setSelectedOption('perfil');
  };

  const handleHistorialClick = () => {
    setSelectedOption('historial');
  };

  const handleBackClick = () => {
    setMyProfile(true);
    setProfileId('');
    navigate('/'); // volver al inicio
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
        {selectedOption === 'historial' && <HistorialPartidasModal />}
      </div>
    </div>
  );
}

export default AccountManagement;
