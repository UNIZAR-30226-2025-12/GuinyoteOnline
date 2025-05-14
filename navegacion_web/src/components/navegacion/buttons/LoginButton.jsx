import React, { useState } from 'react';
import loginIcon from '/assets/login_button.png';
const avataresUrl = '/assets/avatares/';
import '/src/styles/LoginButton.css';

const LoginButton = ({ className, isLoggedIn, loginButtonText, loginButtonIcon, onClick }) => {

    return (
        <button className={`login-button ${className}`} onClick={onClick}>
            {!isLoggedIn && <img className='login-button-icon' src={loginIcon} alt="Account Logo" />}
            {isLoggedIn && <img className='login-button-avatar' src={avataresUrl + loginButtonIcon} alt="Account Logo" />}
            {loginButtonText}
        </button>
    );
};

export default LoginButton;