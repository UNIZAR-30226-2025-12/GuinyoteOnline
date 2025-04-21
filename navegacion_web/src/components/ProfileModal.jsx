import React from 'react';
import '/src/styles/ProfileModal.css';

function ProfileModal() {
  return (
    <div className="profile-modal">
      <h2>Mi perfil</h2>

      <div className="user-info-section">
        <div className="profile-pic-section">
          <div className="profile-pic" />
          <button className="change-pic-button">Cambiar</button>
        </div>

        <div className="name-password-section">
          <div className="name-field">
            <input type="text" placeholder="Nombre de usuario" />
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
