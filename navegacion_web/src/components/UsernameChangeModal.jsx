import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import '../styles/UsernameChangeModal.css'; // puedes crear un css separado o reusarlo

function UsernameChangeModal({ show, handleClose }) {
  const { username, setUsername } = useUser();
  const [newUsername, setNewUsername] = useState(username);

  const handleSubmit = () => {
    if (newUsername.trim() !== '' && newUsername !== username) {
      // Aquí podrías añadir llamada a backend si hace falta
      setUsername(newUsername);
    }
    handleClose();
  };

  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Cambiar nombre de usuario</h3>
        <input
          type="text"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          placeholder="Nuevo nombre de usuario"
        />
        <div className="modal-buttons">
          <button onClick={handleSubmit}>Guardar</button>
          <button onClick={handleClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

export default UsernameChangeModal;
