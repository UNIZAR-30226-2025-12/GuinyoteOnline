import React, { Component } from 'react';
import CmRoundButton from './base_buttons/CmRoundButton';

class Match1v1Button extends Component {

    render() {
        const { onClick } = this.props;
        return (
            <CmRoundButton buttonText='Partida 1 vs 1' onClick={onClick} />
        );
    }
}

export default Match1v1Button;