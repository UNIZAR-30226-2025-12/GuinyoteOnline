import React from 'react';
import '/src/styles/PicChangeModal.css';

function PicChangeModal({ show, handleClose }) {
  if (!show) return null;

  const exampleImages = [
    "https://i.imgur.com/4Z7bK3J.jpg",
    "https://i.imgur.com/JgG2kU8.png",
    "https://i.imgur.com/RRUe0Mo.png"
  ];

  const handleImageSelect = (url) => {
    console.log("Imagen seleccionada:", url);
    // Aquí podrías llamar a una función para cambiar la imagen de perfil en el estado global
    handleClose(); // Cerrar el modal después de seleccionar
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
