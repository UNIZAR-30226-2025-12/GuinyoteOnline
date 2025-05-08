import React, { Component } from 'react';
import CmLongButton from './base_buttons/CmLongButton';

class SoloPlayButton extends Component {

    render() {
        const { onClick } = this.props;
        return (
            <CmLongButton buttonText='Partida IA' onClick={onClick} />
        );
    }
}

export default SoloPlayButton;