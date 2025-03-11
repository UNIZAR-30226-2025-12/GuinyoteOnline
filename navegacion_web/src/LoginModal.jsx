import React from 'react';
import './LoginModal.css';

const LoginModal = ({ show, handleClose, handleLoginSubmit, handleRegister }) => {
  if (!show) {
    return null;
  }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className='modal-exit-button' onClick={handleClose}>
                    <img src="https://img.icons8.com/material-rounded/24/000000/close-window.png" alt="Cerrar" />
                </button>
                
                <h2>Inicio de Sesión</h2>
                <form onSubmit={handleLoginSubmit} className='login-form'>
                    <label>
                        Usuario:
                        <input type="text" name="username" />
                    </label>
                    <label>
                        Contraseña:
                        <input type="password" name="password" />
                    </label>
                    <button type="submit" className='login-form-login'>Iniciar Sesión</button>
                    <button type="button" className='login-form-register' onClick={handleClose || handleRegister}>Crear cuenta</button>
                </form>
            </div>
        </div>
    );
};

export default LoginModal;