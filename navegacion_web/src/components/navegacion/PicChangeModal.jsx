import React from 'react';
import '/src/styles/PicChangeModal.css';
import { useUser } from '../../context/UserContext';
import usePut from '../../customHooks/usePut';

const avataresUrl = '/assets/avatares/';
const av1 = 'av1.png';
const av2 = 'av2.png';
const av3 = 'av3.png';
const av4 = 'av4.png';
const av5 = 'default.png';

function PicChangeModal({ show, handleClose }) {
  if (!show) return null;
  
  const exampleImages = [av1, av2, av3, av4, av5];
  const {mail, profilePic, setProfilePic } = useUser();
  const { putData } = usePut('https://guinyoteonline-hkio.onrender.com');
  
  const handleImageSelect = async (pic) => {
    console.log("Imagen seleccionada:", avataresUrl + pic);
    // Aquí puedes actualizar la imagen de perfil en el estado global
    const encodedMail = encodeURIComponent(mail);
    const response = await putData( {foto_perfil: pic}, `/usuarios/perfil/cambiarFoto/${encodedMail}`)

    if(response.error) {
      // Maneja el error 
      console.error('Error:', response.error);
    }
    else {
      setProfilePic(pic);
    }
    
    handleClose(); // Cierra el modal después de seleccionar
  };

  return (
    <div className="picchange-modal-overlay">
      <div className="picchange-modal-content">
        <h3>Selecciona una nueva imagen de perfil</h3>
        <div className="picchange-image-options">
          {exampleImages.map((pic, index) => (
            <img
              key={index}
              src={avataresUrl + pic}
              alt={`Opción ${index + 1}`}
              onClick={() => handleImageSelect(pic)}
            />
          ))}
        </div>
        <button className="picchange-close-modal-button" onClick={handleClose}>
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default PicChangeModal;
