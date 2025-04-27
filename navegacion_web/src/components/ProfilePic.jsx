import React from 'react';
import '/src/styles/ProfileModal.css'; // Usa los estilos ya definidos

function ProfilePic({ imageUrl, onChangePic }) {
  return (
    <div className="profile-pic-section">
      <div
        className="profile-pic"
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <button className="change-pic-button" onClick={onChangePic}>
        Cambiar
      </button>
    </div>
  );
}

export default ProfilePic;

