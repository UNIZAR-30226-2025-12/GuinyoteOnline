import { useEffect } from 'react';
import backButton from '/src/assets/back_button.png';

const Solicitudes = ({ showSolicitudes, handleBack, mail }) => {

    const { data, loading, error, fetchData } = useFetch('https://guinyoteonline-hkio.onrender.com/solicitudes/' + mail);

    useEffect(() => {
        if (showSolicitudes) {
            console.log(mail);
            fetchData();
        }
    }, [showSolicitudes]);

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