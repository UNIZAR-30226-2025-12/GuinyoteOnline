import React, { Component } from 'react';
import '/src/styles/LogRegModal.css';

class RegisterModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            email: ''
        };
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {

        const { show, handleClose, handleRegisterSubmit, handleLogin} = this.props;

        if (!show) {
            return null;
        }

        const handleCancelarClick = () => {
            handleClose();
            handleLogin();
        };

        return (
            <div className="modal-overlay">
                <div className="modal-content">
                
                    <button className='modal-exit-button' onClick={handleClose}>
                        <img src="https://img.icons8.com/material-rounded/24/000000/close-window.png" alt="Cerrar" />
                    </button>
                
                    <h2>Crear cuenta</h2>
                
                    <form onSubmit={handleRegisterSubmit} className='modal-form'>
                        <label>
                            Username:
                            <input
                                type="text"
                                name="username"
                                value={this.state.username}
                                onChange={this.handleChange}
                            />
                        </label>
                        <label>
                            Email:
                            <input
                                type="email"
                                name="email"
                                value={this.state.email}
                                onChange={this.handleChange}
                            />
                        </label>
                        <label>
                            Password:
                            <input
                                type="password"
                                name="password"
                                value={this.state.password}
                                onChange={this.handleChange}
                            />
                        </label>
                        <button type="submit" className='modal-form-send'>Crear cuenta</button>
                        <button type="button" className='modal-form-secondary-button' onClick={handleCancelarClick}>Cancelar</button>
                    </form>
                </div>
            </div>
        );
    }
}

export default RegisterModal;