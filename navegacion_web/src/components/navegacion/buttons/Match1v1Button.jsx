import React, { Component } from 'react';
import CmSquaredButton from './base_buttons/CmSquaredButton';

class Match1v1Button extends Component {

    render() {
        const { onClick } = this.props;
        return (
            <CmSquaredButton buttonText='Partida 1 vs 1' onClick={onClick} />
        );
    }
}

export default Match1v1Button;