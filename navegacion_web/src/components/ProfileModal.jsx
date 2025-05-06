import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '/src/styles/ProfileModal.css';
import ProfilePic from './ProfilePic';
import PicChangeModal from './PicChangeModal';
import { useUser } from '../context/UserContext';
import UsernameChangeModal from './UsernameChangeModal';
import SignOutButton from './buttons/SignOutButton'
const avataresUrl = '/src/assets/avatares/';

function ProfileModal() {

  const [showPicChangeModal,setShowPicChangeModal] = useState(false);
  const [showUsernameChangeModal,setShowUsernameChangeModal] = useState(false);

  const navigate = useNavigate();

  const {
    username,
    setUsername,
    mail,
    setMail,
    profilePic,
    setProfilePic,
    isUserRegistered,
    setIsUserRegistered
  } = useUser();

  const handlePicChange = () => {
      console.log("Abrir modal para cambiar la foto de perfil");
      // Aquí iría la lógica para abrir el modal de selección de imagen
      setShowPicChangeModal(true);
  };

  const handlePicChangeModalClose = () => {
      setShowPicChangeModal(false);
  };

  const handleUsernameChangeModallOpen = () => {
    setShowUsernameChangeModal(true);
  }

  const handleUsernameChangeModalClose = () => {
    setShowUsernameChangeModal(false);
  }

  const handleSignOut = () => {
    console.log("Cerrar sesión");
  
    // Limpiar estado
    setUsername('');
    setMail('');
    setIsUserRegistered(false);
  
    // Limpiar localStorage
    localStorage.removeItem('username');
    localStorage.removeItem('mail');
    localStorage.removeItem('isUserRegistered');
  
    // Redirigir
    navigate('/');
  };
      
  return (
    <div className="profile-modal">
      <h2>Mi perfil</h2>

      <div className="user-info-section">
        

        <ProfilePic imageUrl={avataresUrl + profilePic} onChangePic={handlePicChange} />
        <PicChangeModal show={showPicChangeModal} handleClose={handlePicChangeModalClose}/>
        <div className="name-password-section">
          <div className="name-field"> 
            {username} 
            <button onClick={handleUsernameChangeModallOpen}>Cambiar nombre</button>
            <UsernameChangeModal  show={showUsernameChangeModal} handleClose={handleUsernameChangeModalClose} mail={mail}/>
          </div>
          
          <button>Cambiar contraseña</button>
        </div>
      </div>

      <div className="divider" />

      <div className="customization-section">
        <div className="customization-box"><b>Tapete</b><br /> Pulsar para cambiar</div>
        <div className="customization-box"><b>Parte trasera cartas</b><br /> Pulsar para cambiar</div>
      </div>

      <SignOutButton className="logout-button" onClick={handleSignOut} />
    </div>
  );
}

export default ProfileModal;
