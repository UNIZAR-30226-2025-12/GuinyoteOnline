import React, { Component } from 'react';
import userIcon from '../assets/login_button.png';
import '../styles/RankingComponent.css';

class RankingRow extends Component {
    render() {

        const { keyValue, ranking, usuario, victorias } = this.props;

        return (
            <tr key={keyValue}>
            <td>{ranking}</td>
            <td style={{position: 'relative', display: 'flex'}}>
                <img src={userIcon} alt="User Icon" style={{ position: 'absolute', left: '10px', width: '30px', height: '30px' }} />
                <span style={{ marginLeft: '50px' }}>{usuario}</span>
            </td>
            <td>{victorias}</td>
            </tr>
        );
    }
}

export default RankingRow;