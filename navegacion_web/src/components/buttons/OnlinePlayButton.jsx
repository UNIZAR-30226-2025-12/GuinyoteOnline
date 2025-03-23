import React from 'react';
import CmLongButton from './base_buttons/CmLongButton';

class OnlinePlayButton extends React.Component {

    render() {
        const { onClick } = this.props;
        return (
            <CmLongButton buttonText='Partida online' onClick={onClick} />
        );
    }
}

export default OnlinePlayButton;