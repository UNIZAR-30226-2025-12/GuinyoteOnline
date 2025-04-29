import React from 'react';
import '/src/styles/PicChangeModal.css';
import { useUser } from '../context/UserContext';

import av1 from '/src/assets/avatares/av1.png';
import av2 from '/src/assets/avatares/av2.png';
import av3 from '/src/assets/avatares/av3.png';
import av4 from '/src/assets/avatares/av4.png';
import av5 from '/src/assets/avatares/av5.png';

function PicChangeModal({ show, handleClose }) {
  if (!show) return null;

  const exampleImages = [av1, av2, av3, av4, av5];
  const {profilePic, setProfilePic } = useUser();
  
  const handleImageSelect = (url) => {
    console.log("Imagen seleccionada:", url);
    // Aquí puedes actualizar la imagen de perfil en el estado global
    setProfilePic(url);
    handleClose(); // Cierra el modal después de seleccionar
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Selecciona una nueva imagen de perfil</h3>
        <div className="image-options">
          {exampleImages.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Opción ${index + 1}`}
              onClick={() => handleImageSelect(url)}
            />
          ))}
        </div>
        <button className="close-modal-button" onClick={handleClose}>
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default PicChangeModal;
