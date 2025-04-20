import React from 'react';
import '/src/styles/ProfileButton.css'; // Asegúrate de tener los estilos adecuados

const ProfileButton = ({ onClick, isActive }) => {
  return (
    <button 
      className={`profile-button ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      Perfil
    </button>
  );
};

export default ProfileButton;