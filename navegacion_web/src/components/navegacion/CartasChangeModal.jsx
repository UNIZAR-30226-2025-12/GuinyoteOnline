import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import '/src/styles/CartasChangeModal.css'; // Asegúrate de tener este CSS o copiar el del tapete y adaptarlo
import usePut from '../../customHooks/usePut';

import defaultCartasImage from '../../assets/stacks/default_stack.png';
import stack2Image from '../../assets/stacks/stack2.png';
import stack3Image from '../../assets/stacks/stack3.png';

const opcionesCartas = {
  default_stack: defaultCartasImage,
  stack2: stack2Image,
  stack3: stack3Image
};

function CartasChangeModal({ show, handleClose }) {
  const { mail, setCartas, cartas } = useUser();
  const [newCartas, setNewCartas] = useState(cartas);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { putData } = usePut('https://guinyoteonline-hkio.onrender.com');

  const handleSubmit = async () => {
    if (newCartas !== cartas) {
      setLoading(true);
      setErrorMsg('');

      const encodedMail = encodeURIComponent(mail);
      const response = await putData({ imagen_carta: newCartas }, `/usuarios/perfil/cambiarCartas/${encodedMail}`);

      setLoading(false);

      if (response.error) {
        console.error('Error actualizando cartas:');
        setErrorMsg('Error al guardar el cambio. Intenta de nuevo.');
      } else {
        setCartas(newCartas);
        handleClose();
      }
    } else {
      handleClose();
    }
  };

  if (!show) return null;

  return (
    <div className="cartas-modal-overlay" onClick={handleClose}>
      <div className="cartas-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="cartas-options">
          {Object.entries(opcionesCartas).map(([key, src]) => (
            <div
              key={key}
              className={`cartas-option ${newCartas === key ? 'selected' : ''}`}
              onClick={() => setNewCartas(key)}
            >
              <img src={src} alt={key} />
            </div>
          ))}
        </div>

        <div className="cartas-preview">
          <h3>Vista previa</h3>
          <img src={opcionesCartas[newCartas]} alt="Vista previa de las cartas" />
          {loading && <p className="cartas-modal-loading">Guardando...</p>}
          {errorMsg && <p className="cartas-modal-error">{errorMsg}</p>}
          <div className="cartas-modal-buttons">
            <button onClick={handleSubmit} disabled={loading}>Guardar</button>
            <button onClick={handleClose} disabled={loading}>Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartasChangeModal;
