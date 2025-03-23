import React, { Component } from 'react';
import settingsButtonIcon from '/src/assets/settings_button.png';
import CommonButton from './base_buttons/CommonButton';

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