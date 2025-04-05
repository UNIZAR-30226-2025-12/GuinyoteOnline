import backButton from '/src/assets/back_button.png';

const Solicitudes = ({ showSolicitudes, handleBack }) => {

    return ( showSolicitudes ?
        <>
            <button className='friend-list-back-button' onClick={handleBack} >
                <img src={backButton} alt="Volver atrás" />
            </button>
            <h2 className='friend-list-title'>Solicitudes de amistad</h2>
        
            <div className='friend-list'></div>  
        </> : null
    );
}

export default Solicitudes;