import React, { Component } from 'react';

class Amigos extends Component {
    render() {

        const {handleBack} = this.props;

        return (
            <>
                <button className='friend-list-back-button' onClick={handleBack} >
                    <img src="https://img.icons8.com/?size=100&id=2889&format=png&color=000000" alt="Volver atrás" />
                </button>
                <h2 className='friend-list-title'>Lista de amigos</h2>

                {/* Hay que incluir el muestreo de la lista de amigos, un componente para cada amigo, el búscador por username, si puede ser que cargue elementos dinámicamente para ahorrar recursos */}

            </>
        );
    }
}

export default Amigos;