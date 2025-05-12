import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import '/src/styles/PasswordChangeModal.css'; 
import usePut from '../../customHooks/usePut';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function PasswordChangeDialog({ show, handleClose }) {
  const { mail } = useUser();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { putData } = usePut('https://guinyoteonline-hkio.onrender.com');

  const handleSubmit = async () => {
    setErrorMsg('');
    setSuccessMsg('');

    if (!oldPassword || !newPassword || !confirmPassword) {
      setErrorMsg('Por favor, completa todos los campos.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);

    const encodedMail = encodeURIComponent(mail);
    const response = await putData(
      { contrasena_antigua: oldPassword, contrasena_nueva: newPassword },
      `/usuarios/perfil/cambiarContrasena/${encodedMail}`
    );

    setLoading(false);

    if (response.error) {
      console.error('Error:', response.error);
      setErrorMsg('Error al cambiar la contraseña. Verifica los datos e inténtalo de nuevo.');
      return;
    }

    setSuccessMsg('Contraseña actualizada correctamente.');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(handleClose, 500);
  };

  const togglePasswordVisibility = (type) => {
    if (type === 'old') setShowOldPassword(!showOldPassword);
    if (type === 'new') setShowNewPassword(!showNewPassword);
    if (type === 'confirm') setShowConfirmPassword(!showConfirmPassword);
  };

  if (!show) return null;

  return (
    <div className="passwordchange-modal-overlay" onClick={handleClose}>
      <div className="passwordchange-modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Cambiar contraseña</h3>

        <div className="password-field">
          <input
            type={showOldPassword ? 'text' : 'password'}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Contraseña actual"
          />
          <button className="eye-icon" onClick={() => togglePasswordVisibility('old')}>
            {showOldPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <div className="password-field">
          <input
            type={showNewPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Nueva contraseña"
          />
          <button className="eye-icon" onClick={() => togglePasswordVisibility('new')}>
            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <div className="password-field">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirmar nueva contraseña"
          />
          <button className="eye-icon" onClick={() => togglePasswordVisibility('confirm')}>
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {loading && <p className="passwordchange-modal-loading">Actualizando...</p>}
        {errorMsg && <p className="passwordchange-modal-error">{errorMsg}</p>}
        {successMsg && <p className="passwordchange-modal-success">{successMsg}</p>}

        <div className="modal-buttons">
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

export default PasswordChangeDialog;
