import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import '/src/styles/TapeteChangeModal.css';
import usePut from '../../customHooks/usePut';

const tapetesUrl = '/src/assets/tapetes/';
const tapete1 = 'default.png';
const tapete2 = 'tapete1.png';
const tapete3 = 'tapete2.png';

function TapeteChangeModal({ show, handleClose }) {

  const exampleTapetes = [tapete1,tapete2,tapete3];
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
          {exampleTapetes.map((filename) => (
            <div
              key={filename}
              className={`tapete-option ${newTapete === filename ? 'selected' : ''}`}
              onClick={() => setNewTapete(filename)}
            >
              <img src={tapetesUrl + filename} alt={filename} />
            </div>
          ))}
</div>

        <div className="tapete-preview">
          <h3>Vista previa</h3>
          <img src={tapetesUrl + newTapete} alt="Vista previa del tapete" />
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
