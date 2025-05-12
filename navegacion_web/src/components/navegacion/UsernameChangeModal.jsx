import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import '/src/styles/UsernameChangeModal.css'; 
import usePut from '../../customHooks/usePut';

function UsernameChangeModal({ show,  handleClose }) {
  const { username, setUsername, mail} = useUser();
  const [newUsername, setNewUsername] = useState(username);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { putData } = usePut('https://guinyoteonline-hkio.onrender.com');

  const handleSubmit = async () => {
    if (newUsername.trim() !== '' && newUsername !== username) {
      setLoading(true);
      setErrorMsg('');
      const encodedMail = encodeURIComponent(mail);
      const response = await putData({ nombre: newUsername }, `/usuarios/perfil/cambiarUsername/${encodedMail}`);
    
      setLoading(false);
      
      if (response.error) {
        console.error('Error:', response.error);
        setErrorMsg('Error al actualizar el nombre. Inténtalo de nuevo.');
        return; // No cerrar modal si hay error
      }

      setUsername(newUsername);
      handleClose();
    } else {
      handleClose(); // Cerrar aunque no se haya modificado nada
    }
  };

  if (!show) return null;

  return (
    <div className="usernamechange-modal-overlay" onClick={handleClose}>
      <div className="usernamechange-modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Cambiar nombre de usuario</h3>
        <input
          type="text"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          placeholder="Nuevo nombre de usuario"
        />
        {loading && <p className="usernamechange-modal-loading">Guardando...</p>}
        {errorMsg && <p className="usernamechange-modal-error">{errorMsg}</p>}
        <div className="usernamechange-modal-buttons">
          <button onClick={handleSubmit} disabled={loading}>
            Guardar
          </button>
          <button onClick={handleClose} disabled={loading}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default UsernameChangeModal;
