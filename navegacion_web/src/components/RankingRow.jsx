import React, { Component } from 'react';
import '/src/styles/RankingModal.css';

const avataresUrl = '/src/assets/avatares/';

class RankingRow extends Component {
    render() {

        const { keyValue, ranking, usuario, foto_perfil, victorias } = this.props;

        return (
            <tr key={keyValue}>
            <td>{ranking}</td>
            <td style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <img src={avataresUrl + foto_perfil} alt="User Icon" style={{ marginRight: '10px', width: '30px', height: '30px', borderRadius: '50%' }} />
                <span>{usuario}</span>
            </td>
            <td>{victorias}</td>
            </tr>
        );
    }
}

export default RankingRow;