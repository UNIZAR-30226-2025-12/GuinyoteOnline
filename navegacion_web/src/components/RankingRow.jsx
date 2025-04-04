import React, { Component } from 'react';
import userIcon from '/src/assets/login_button.png';
import '/src/styles/RankingModal.css';

class RankingRow extends Component {
    render() {

        const { keyValue, ranking, usuario, foto_perfil, victorias } = this.props;

        return (
            <tr key={keyValue}>
            <td>{ranking}</td>
            <td style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <img src={userIcon} alt="User Icon" style={{ marginRight: '10px', width: '30px', height: '30px', borderRadius: '50%' }} />
                <span>{usuario}</span>
            </td>
            <td>{victorias}</td>
            </tr>
        );
    }
}

export default RankingRow;