import React, { Component } from 'react';
import Match1v1Button from './Match1v1Button';
import Match2v2Button from './Match2v2Button';
import JoinRoomButton from './JoinRoomButton';
import '/src/styles/MatchFormatButtons.css';

class MatchFormatButtons extends Component {
    render() {
        const { onClick2v2Match, onClick1v1Match, onClickJoinRoom } = this.props;

        return (
            <div className="buttons-container">
                <Match1v1Button onClick={onClick1v1Match} />
                <Match2v2Button onClick={onClick2v2Match} />
            </div>
        );
    }
}

export default MatchFormatButtons;