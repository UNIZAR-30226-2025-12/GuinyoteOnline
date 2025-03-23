import React, { Component } from 'react';

class Solicitudes extends Component {
    render() {

        const { handleBack } = this.props;

        return (
            <>
                <button className='friend-list-back-button' onClick={handleBack} >
                    <img src="https://img.icons8.com/?size=100&id=2889&format=png&color=000000" alt="Volver atrás" />
                </button>
                <h2 className='friend-list-title'>Solicitudes de amistad</h2>


                {/* Hay que incluir el muestreo de la lista de solicitudes, crear el componente para mostrarlas, si puede ser que cargue elementos dinámicamente para ahorrar recursos */}

            </>
        );
    }
}

export default Solicitudes;