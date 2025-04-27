import React, { useState } from 'react';
import '/src/styles/ProfileModal.css';
import ProfilePic from './ProfilePic';
import PicChangeModal from './PicChangeModal';
import { useUser } from '../context/UserContext';
import UsernameChangeModal from './UsernameChangeModal';

function ProfileModal() {

  const [showPicChangeModal,setShowPicChangeModal] = useState(false);
  const [showUsernameChangeModal,setShowUsernameChangeModal] = useState(false);

    const {
      username,
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
      
  return (
    <div className="profile-modal">
      <h2>Mi perfil</h2>

      <div className="user-info-section">
        

        <ProfilePic imageUrl="https://via.placeholder.com/80" onChangePic={handlePicChange} />
        <PicChangeModal show={showPicChangeModal} handleClose={handlePicChangeModalClose}/>
        <div className="name-password-section">
          <div className="name-field"> 
            {username} 
            <button onClick={handleUsernameChangeModallOpen}>Cambiar nombre</button>
            <UsernameChangeModal  show={showUsernameChangeModal} handleClose={handleUsernameChangeModalClose} />
          </div>
          
          <button>Cambiar contraseña</button>
        </div>
      </div>

      <div className="divider" />

      <div className="customization-section">
        <div className="customization-box">Tapete <br /> Pulsar para cambiar</div>
        <div className="customization-box">Parte trasera cartas <br /> Pulsar para cambiar</div>
      </div>

      <div className="logout-button">Cerrar sesión</div>
    </div>
  );
}

export default ProfileModal;
