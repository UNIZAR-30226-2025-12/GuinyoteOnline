import React, { useEffect } from 'react';
import '/src/styles/RankingModal.css';
import RankingRow from './RankingRow';
import useFetch from '../../customHooks/useFetch';

function RankingModal({ show, handleClose }) {

    const { data, loading, error, fetchData } = useFetch('https://guinyoteonline-hkio.onrender.com/rankings');

    useEffect(() => {
        if (show) {
            console.log(data);
            fetchData();
        }
    }, [show]);

    if (!show) {
        return null;
    }

    return (
        <div className={`ranking-overlay ${show ? 'show' : 'hide'}`}>
            <div className={`ranking-modal ${show ? 'show' : 'hide'}`}>
                <button className='ranking-modal-exit-button' onClick={handleClose}>
                    <img src="https://img.icons8.com/material-rounded/24/000000/close-window.png" alt="Cerrar" />
                </button>
                <h1>Ranking</h1>
                <div className="ranking-table-container">
                    <table className="ranking-table">
                        <thead>
                            <tr className="sticky-header" key={0}>
                                <th>Posición</th>
                                <th>Usuario</th>
                                <th>Victorias</th>
                            </tr>
                        </thead>
                    {data && data.length > 0 && (
                        <tbody>
                        {data.map((data, index) => (
                            <RankingRow 
                                key={index+1} // Use a unique id if available
                                keyValue={index + 1} 
                                ranking={index + 1} 
                                usuario={data.nombre} 
                                foto_perfil={data.foto_perfil} 
                                victorias={data.nVictorias} 
                            />
                        ))}
                        </tbody>
                    )}
                    </table>
                    {loading && <p>Cargando ...</p>}
                    {error && <p>Error al cargar los datos</p>}
                </div>
            </div>
        </div>
        
    );
}

export default RankingModal;