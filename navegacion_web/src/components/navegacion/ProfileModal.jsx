import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '/src/styles/ProfileModal.css';
import PicChangeModal from './PicChangeModal';
import { useUser } from '../../context/UserContext';
import UsernameChangeModal from './UsernameChangeModal';
import SignOutButton from './buttons/SignOutButton'
import ConfirmLogoutModal from './ConfirmLogoutModal';
import TapeteChangeModal from './TapeteChangeModal';
import CartasChangeModal from './CartasChangeModal';
import PasswordChangeModal from './PasswordChangeModal';

const avataresUrl = '/src/assets/avatares/';

function ProfileModal() {

  const [showPicChangeModal,setShowPicChangeModal] = useState(false);
  const [showUsernameChangeModal,setShowUsernameChangeModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showTapeteChangeModal, setShowTapeteChangeModal] = useState(false);
  const [showCartasChangeModal, setShowCartasChangeModal] = useState(false);
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);

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

  const handleConfirmLogoutModalOpen = () => {
    setShowLogoutModal(true);
  }

  const handleConfirmLogoutModalClose = () => {
    setShowLogoutModal(false);
  }
  

  const handleSignOut = () => {
    console.log("Cerrar sesión");
  
    // Limpiar estado
    setUsername('');
    setMail('');
    setProfilePic('');
    setIsUserRegistered(false);
  
    // Limpiar localStorage
    localStorage.removeItem('username');
    localStorage.removeItem('mail');
    localStorage.removeItem('profilePic')
    localStorage.removeItem('isUserRegistered');
  
    // Redirigir
    navigate('/');
  };

  const handleTapeteChangeModalOpen = () => {
    setShowTapeteChangeModal(true); 
  };

  const handleTapeteChangeModalClose = () => {
    setShowTapeteChangeModal(false); 
  };

  const handleCartasChangeModalOpen = () => {
    setShowCartasChangeModal(true); 
  };

  const handleCartasChangeModalClose = () => {
    setShowCartasChangeModal(false); 
  };

  const handlePasswordChangeModalOpen = () => {
    setShowPasswordChangeModal(true);
  };
  
  const handlePasswordChangeModalClose = () => {
    setShowPasswordChangeModal(false);
  };
      
  return (
    <div className="profile-modal">

  
    <div className="profile-top-section">
      <div className="profile-left">
        <div
          className="profile-pic"
          style={{ backgroundImage: `url(${avataresUrl + profilePic})` }}
          onClick={handlePicChange}
        />
        <button className="change-pic-button" onClick={handlePicChange}>Cambiar</button>
      </div>
  
      <div className="profile-center">
        <h3 className="username">{username}</h3>
      </div>
  
      <div className="profile-right">
        <button onClick={handleUsernameChangeModallOpen}>Cambiar nombre</button>
        <button onClick={handlePasswordChangeModalOpen}>Cambiar contraseña</button>
      </div>
    </div>
  
    <div className="divider" />
  
    <div className="customization-section">
      <button className="customization-button" onClick={handleTapeteChangeModalOpen}>Editar tapete</button>
      <button className="customization-button" onClick={handleCartasChangeModalOpen}>Editar cartas</button>
    </div>
  
    
    <SignOutButton className="logout-button red" onClick={handleConfirmLogoutModalOpen} />
    {/* Modales */}
    <PicChangeModal show={showPicChangeModal} handleClose={handlePicChangeModalClose} />
    <UsernameChangeModal show={showUsernameChangeModal} handleClose={handleUsernameChangeModalClose} mail={mail} />
    <PasswordChangeModal show={showPasswordChangeModal} handleClose={handlePasswordChangeModalClose} mail={mail}/>
    <ConfirmLogoutModal show={showLogoutModal} onConfirm={handleSignOut} onCancel={handleConfirmLogoutModalClose} />
    <TapeteChangeModal show={showTapeteChangeModal} handleClose={handleTapeteChangeModalClose} />
    <CartasChangeModal show={showCartasChangeModal} handleClose={handleCartasChangeModalClose} />
  </div>
  
  );
}

export default ProfileModal;