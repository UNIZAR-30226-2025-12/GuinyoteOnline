import '/src/styles/LogRegModal.css';
import React, { Component } from 'react';

class LoginModal extends Component {

    render() {

        const { show, handleClose, handleLoginSubmit, handleRegister } = this.props;

        if (!show) {
            return null;
        }
        
        const handleRegisterClick = () => {
            handleClose();
            handleRegister();
        };

        return (
            <div className="modal-overlay">
                <div className="modal-content">
                    <button className='modal-exit-button' onClick={handleClose} >
                        <img src="https://img.icons8.com/material-rounded/24/000000/close-window.png" alt="Cerrar" />
                    </button>
                    
                    <h2>Inicio de Sesión</h2>
                    <form onSubmit={handleLoginSubmit} className='modal-form'>
                        <label>
                            Correo electrónico:
                            <input type="text" name="mail" />
                        </label>
                        <label>
                            Contraseña:
                            <input type="password" name="password" />
                        </label>
                        <button type="submit" className='modal-form-send'>Iniciar Sesión</button>
                        <button type="button" className='modal-form-secondary-button' onClick={handleRegisterClick}>Crear cuenta</button>
                    </form>
                </div>
            </div>
        );
    }
}

export default LoginModal;