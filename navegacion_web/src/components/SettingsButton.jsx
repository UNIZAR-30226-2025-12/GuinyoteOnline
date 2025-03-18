import React, { Component } from 'react';
import settingsButtonIcon from '../assets/settings_button.png';
import CommonButton from './CommonButton';

class SettingsButton extends Component {
    render() {
        const { onClick } = this.props;
        return (
            <CommonButton 
            imagePath={settingsButtonIcon} 
            buttonText='Ajustes' 
            onClick={onClick} 
            />
        );
    }
}

export default SettingsButton;