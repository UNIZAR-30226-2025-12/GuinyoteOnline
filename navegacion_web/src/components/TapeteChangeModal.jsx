import React, { useState } from 'react';
import { useUser } from '../context/UserContext';  // Importamos el contexto del usuario
import '../styles/TapeteChangeModal.css'; 
import usePut from '../customHooks/usePut';

function TapeteChangeModal({ show, handleClose }) {
  const { setTapete, tapete } = useUser(); // Accedemos al tapete actual desde el contexto
  const [newTapete, setNewTapete] = useState(tapete); // Estado para el nuevo tapete seleccionado
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { putData } = usePut('https://guinyoteonline-hkio.onrender.com');  // Llamada PUT

  const handleSubmit = async () => {
    if (newTapete !== tapete) {  // Solo hacemos algo si el tapete es diferente
        setLoading(true);
        setErrorMsg('');
        
        // Simula una espera para cargar (puedes quitar esto si no lo necesitas)
        setTimeout(() => {
          setLoading(false);
          setTapete(newTapete); // Actualizamos el estado del tapete en el contexto
          handleClose(); // Cerramos el modal
        }, 500);
      } else {
        handleClose(); // Cerrar modal sin hacer cambios si no hay selección
      }
  };

  if (!show) return null;

  return (
    <div className="tapete-modal-overlay" onClick={handleClose}>
        <div className="tapete-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Cambiar tapete</h3>
            <div className="tapete-options">
                <div className="tapete-option" onClick={() => setNewTapete('tapete1')}>Tapete 1</div>
                <div className="tapete-option" onClick={() => setNewTapete('tapete2')}>Tapete 2</div>
                <div className="tapete-option" onClick={() => setNewTapete('tapete3')}>Tapete 3</div>
            </div>
            {loading && <p className="tapete-modal-loading">Guardando...</p>}
            {errorMsg && <p className="tapete-modal-error">{errorMsg}</p>}
            <div className="tapete-modal-buttons">
                <button onClick={handleSubmit} disabled={loading}>Guardar</button>
                <button onClick={handleClose} disabled={loading}>Cancelar</button>
            </div>
        </div>
    </div>
  );
}

export default TapeteChangeModal;
