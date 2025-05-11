import React from 'react';
const avataresUrl = '/src/assets/avatares/';
import '/src/styles/PlayerSlot.css'; // Create a CSS file for styling

class PlayerSlot extends React.Component {
    render() {
        const { nombre, email, foto_perfil, onClick, index } = this.props;

        const handleClick = () => {
            if (onClick) {
                onClick(index);
            }
        }

        return (
            <div className="player-slot" onClick={handleClick}>
                {foto_perfil && <img src={avataresUrl + foto_perfil} alt={`${nombre}'s avatar`} className="player-avatar" />}
                <div className="player-info">
                    <h3 className="player-username">{nombre}</h3>
                </div>
            </div>
        );
    }
}

export default PlayerSlot;