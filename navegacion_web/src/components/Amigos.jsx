import React, { Component } from 'react';
import backButton from '/src/assets/back_button.png';

class Amigos extends Component {
    render() {

        const {handleBack} = this.props;

        return (
            <>
                <button className='friend-list-back-button' onClick={handleBack} >
                    <img src={backButton} alt="Volver atrás" />
                </button>
                <h2 className='friend-list-title'>Lista de amigos</h2>

                {/* Hay que incluir el muestreo de la lista de amigos, un componente para cada amigo, el búscador por username, si puede ser que cargue elementos dinámicamente para ahorrar recursos */}

            </>
        );
    }
}

export default Amigos;