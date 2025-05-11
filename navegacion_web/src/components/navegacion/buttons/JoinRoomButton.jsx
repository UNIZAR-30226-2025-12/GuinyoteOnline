import React, { Component } from 'react';
import CmSquaredButton from './base_buttons/CmSquaredButton';

class JoinRoomButton extends Component {

    render() {
        const { onClick } = this.props;
        return (
            <CmSquaredButton buttonText='Unir sala' onClick={onClick} />
        );
    }
}

export default JoinRoomButton;