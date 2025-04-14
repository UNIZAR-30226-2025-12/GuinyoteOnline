import React from 'react';
import { useNavigate } from 'react-router-dom';

function AccountManagement() {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/'); // Para volver al inicio si quieres
  };

  return (
    <div>
      <h1>Gestión de Cuenta</h1>
      <button onClick={handleBackClick}>Volver al inicio</button>
      {/* Aquí luego pones cosas como cambiar contraseña, cerrar sesión, etc */}
    </div>
  );
}

export default AccountManagement;