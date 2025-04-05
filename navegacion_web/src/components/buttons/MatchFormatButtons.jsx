import React, { Component } from 'react';
import Match1v1Button from './Match1v1Button'
import Match2v2Button from './Match2v2Button'

class MatchFormatButtons extends Component {
        
    render() {

        const { className, onClick2v2Match, onClick1v1Match } = this.props;

        return (
            <div className={className}>
                <Match2v2Button onClick={onClick2v2Match} />
                {/* Puede que sea necesario especificar el espacio entre los dos */}
                <Match1v1Button onClick={onClick1v1Match} />
            </div>
        );
    }
};

export default MatchFormatButtons;