import React, { useState } from 'react';
import loginButtonIcon from '/src/assets/login_button.png';
import '/src/styles/Login_button.css';

const LoginButton = ({ className, loginButtonText, onClick }) => {

    return (
        <button className={`login-button ${className}`} onClick={onClick}>
            <img className='login-button-icon' src={loginButtonIcon} alt="Account Logo" />
            {loginButtonText}
        </button>
    );
};

export default LoginButton;