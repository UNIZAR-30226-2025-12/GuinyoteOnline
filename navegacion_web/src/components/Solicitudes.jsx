import React, { Component } from 'react';
import backButton from '/src/assets/back_button.png';

class Solicitudes extends Component {
    render() {

        const { handleBack } = this.props;

        return (
            <>
                <button className='friend-list-back-button' onClick={handleBack} >
                    <img src={backButton} alt="Volver atrás" />
                </button>
                <h2 className='friend-list-title'>Solicitudes de amistad</h2>


                {/* Hay que incluir el muestreo de la lista de solicitudes, crear el componente para mostrarlas, si puede ser que cargue elementos dinámicamente para ahorrar recursos */}

            </>
        );
    }
}

export default Solicitudes;