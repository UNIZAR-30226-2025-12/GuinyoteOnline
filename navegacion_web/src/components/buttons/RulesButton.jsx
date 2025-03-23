import React, { Component } from 'react';
import CommonButton from './base_buttons/CommonButton';
import rulesButtonIcon from '/src/assets/rules_button.png';

class RulesButton extends Component {
    render() {
        const { className, onClick } = this.props;
        return (
            <CommonButton onClick={onClick} className={className} imagePath={rulesButtonIcon} buttonText='Reglas'/>
        );
    }
}

export default RulesButton;