import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import '../styles/UsernameChangeModal.css'; // puedes crear un css separado o reusarlo
import usePut from '../customHooks/usePut';

function UsernameChangeModal({ show,  handleClose }) {
  const { username, setUsername, mail} = useUser();
  const [newUsername, setNewUsername] = useState(username);

  const { putData } = usePut('https://guinyoteonline-hkio.onrender.com');

  const handleSubmit = async () => {
    if (newUsername.trim() !== '' && newUsername !== username) {
      const encodedMail = encodeURIComponent(mail);
      const response = await putData({ nombre: newUsername }, `/usuarios/perfil/cambiarUsername/${encodedMail}`);
    
      if (response.error) {
        // Maneja el error 
        console.error('Error:', response.error);
      } else {
        // Si todo sale bien, actualiza el nombre de usuario
        setUsername(newUsername);
      }
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
