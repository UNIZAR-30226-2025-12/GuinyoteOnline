import React from 'react';
import CmLongButton from './CmLongButton';

class OnlinePlayButton extends React.Component {

    render() {
        const { onClick } = this.props;
        return (
            <CmLongButton buttonText='Partida online' onClick={onClick} />
        );
    }
}

export default OnlinePlayButton;