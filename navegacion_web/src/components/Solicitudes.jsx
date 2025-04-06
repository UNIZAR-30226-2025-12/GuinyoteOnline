import { useEffect } from 'react';
import backButton from '/src/assets/back_button.png';
import useFetch from '../customHooks/useFetch';

const Solicitudes = ({ show, handleBack, mail }) => {

    const { data, loading, error, fetchData } = useFetch('https://guinyoteonline-hkio.onrender.com/solicitudes/' + mail);

    useEffect(() => {
        if (show) {
            fetchData();
        }
    }, [show]);

    return ( (show) ?
        <>
            <button className='friend-list-back-button' onClick={handleBack} >
                <img src={backButton} alt="Volver atrás" />
            </button>
            <h2 className='friend-list-title'>Solicitudes de amistad</h2>
        
            <div className='friend-list'>
                {loading && <p>Loading...</p>}
                {error && <p>Error: {error.message}</p>}
                {data && data.length > 0 && (
                    data.map((solicitud, index) => (
                        <div key={index} className='friend-item'>
                            {solicitud.idUsuario}
                        </div>
                    ))
                )}
            </div>  
        </> : null
    );
}

export default Solicitudes;