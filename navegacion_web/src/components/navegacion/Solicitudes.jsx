import { useEffect } from 'react';
import backButton from '/src/assets/back_button.png';
import useFetch from '../../customHooks/useFetch';
import SolicitudesRow from './SolicitudesRow';

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
        
            <div className="friends-table-container">
                {loading && <p>Loading...</p>}
                {error && <p>Error: {error.message}</p>}
                {data && data.length === 0 && (
                    <p>No tienes solicitudes de amistad.</p>
                )}
                {data && data.length > 0 && (
                    <table className="friends-table">
                        <tbody>
                            {data.map((solicitud, index) => (
                                <SolicitudesRow 
                                    key={index+1}
                                    foto_perfil={solicitud.foto_perfil} 
                                    nombre={solicitud.nombre} 
                                    mail={solicitud.correo} 
                                    myMail={mail}
                                />
                            ))}
                        </tbody>
                    </table>
                )}
            </div>  
        </> : null
    );
}

export default Solicitudes;