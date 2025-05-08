import React, { Component } from 'react';
import CmSquaredButton from './base_buttons/CmSquaredButton';

class Match2v2Button extends Component {

    render() {
        const { onClick } = this.props;
        return (
            <CmSquaredButton buttonText='Partida 2 vs 2' onClick={onClick} />
        );
    }
}

export default Match2v2Button;
