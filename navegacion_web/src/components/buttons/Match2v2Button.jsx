import React, { Component } from 'react';
import CmRoundButton from './base_buttons/CmRoundButton';

class Match2v2Button extends Component {

    render() {
        const { onClick } = this.props;
        return (
            <CmRoundButton buttonText='Partida 2 vs 2' onClick={onClick} />
        );
    }
}

export default Match2v2Button;
