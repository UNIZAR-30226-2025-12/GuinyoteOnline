import React, { Component } from 'react';
import CommonButton from './base_buttons/CommonButton';
import signOutIcon from '/src/assets/signOutIcon.png';

class SignOutButton extends Component {
    render() {
        const { onClick } = this.props;
        return (
            <CommonButton imagePath={signOutIcon} buttonText='Cerrar sesión' onClick={onClick} />
        );
    }
}

export default SignOutButton;