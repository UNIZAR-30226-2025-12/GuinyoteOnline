import React, { Component } from 'react';
import SoloPlayButton from './SoloPlayButton'
import OnlinePlayButton from './OnlinePlayButton'

class MatchFormatButtons extends Component {
        
    render() {

        const { className, onClickOnlinePlay, onClickSoloPlay } = this.props;

        return (
            <div className={className}>
                <OnlinePlayButton onClick={onClickOnlinePlay} />
                <SoloPlayButton onClick={onClickSoloPlay} />
            </div>
        );
    }
};

export default GameButtons;