import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import '/src/styles/TapeteChangeModal.css';
import usePut from '../../customHooks/usePut';

import tapete1Image from '../../assets/tapetes/tapete1.png';
import tapete2Image from '../../assets/tapetes/tapete2.png';
import tapete3Image from '../../assets/tapetes/tapete3.png';

const tapetes = {
  tapete1: tapete1Image,
  tapete2: tapete2Image,
  tapete3: tapete3Image
};

function TapeteChangeModal({ show, handleClose }) {
  const { mail, setTapete, tapete } = useUser();
  const [newTapete, setNewTapete] = useState(tapete);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { putData } = usePut('https://guinyoteonline-hkio.onrender.com');

  const handleSubmit = async () => {
    if (newTapete !== tapete) {
      setLoading(true);
      setErrorMsg('');

      const encodedMail = encodeURIComponent(mail);
      const response = await putData( {tapete: newTapete}, `/usuarios/perfil/cambiarTapete/${encodedMail}`)

      setLoading(false);
      
      if (response.error) {
        console.error('Error actualizando tapete:');
        setErrorMsg('Error al guardar el cambio. Intenta de nuevo.');
      } else {
        setTapete(newTapete);
        handleClose();
      }
    } else {
      handleClose();
    }
  };

  if (!show) return null;

  return (
    <div className="tapete-modal-overlay" onClick={handleClose}>
      <div className="tapete-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="tapete-options">
          {Object.entries(tapetes).map(([key, src]) => (
            <div
              key={key}
              className={`tapete-option ${newTapete === key ? 'selected' : ''}`}
              onClick={() => setNewTapete(key)}
            >
              <img src={src} alt={key} />
            </div>
          ))}
        </div>

        <div className="tapete-preview">
          <h3>Vista previa</h3>
          <img src={tapetes[newTapete]} alt="Vista previa del tapete" />
          {loading && <p className="tapete-modal-loading">Guardando...</p>}
          {errorMsg && <p className="tapete-modal-error">{errorMsg}</p>}
          <div className="tapete-modal-buttons">
            <button onClick={handleSubmit} disabled={loading}>Guardar</button>
            <button onClick={handleClose} disabled={loading}>Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TapeteChangeModal;
