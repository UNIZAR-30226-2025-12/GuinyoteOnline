import React, { useEffect, useState } from 'react';
import '/src/styles/RankingModal.css';
import RankingRow from './RankingRow';
import useFetch from '../customHooks/useFetch';

function RankingModal({ show, handleClose, username }) {

    const { data, loading, error } = useFetch('https://guinyoteonline-hkio.onrender.com/rankings');

    const [usrRanking, setUsrRanking] = useState({ ranking: '-', victorias: '-', foto_perfil: '-',usuario: '-' });

    useEffect(() => {
        if (show) {
            if (username !== '') {
                const userRanking = data.find(user => user.nombre === username);
                if (userRanking) {
                    setUsrRanking({ ranking: userRanking.ranking, victorias: userRanking.nVictorias, foto_perfil: userRanking.foto_perfil, usuario: username });
                }
                else {
                    setUsrRanking({ ranking: '-', victorias: '-', foto_perfil: '-', usuario: username });
                }
            }
        }
    }, [username, show]);

    if (!show) {
        return null;
    }

    return (
        <div className={`ranking-overlay ${show ? 'show' : 'hide'}`}>
            <div className={`ranking-modal ${show ? 'show' : 'hide'}`}>
                <button className='modal-exit-button' onClick={handleClose}>
                    <img src="https://img.icons8.com/material-rounded/24/000000/close-window.png" alt="Cerrar" />
                </button>
                <h1>Ranking</h1>
                {loading && <p>Cargando ...</p>}
                {error && <p>Error al cargar los datos</p>}
                {data && data.length > 0 && (
                <> 
                    <div className="ranking-table-container">
                        <table className="ranking-table">
                        <thead>
                            <tr className="sticky-header" key={0}>
                                <th>Posición</th>
                                <th>Usuario</th>
                                <th>Victorias</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((data, index) => (
                            <RankingRow 
                                keyValue={index + 1} 
                                ranking={index + 1} 
                                usuario={data.nombre} 
                                img={data.foto_perfil} 
                                victorias={data.nVictorias} 
                            />
                            ))}
                        </tbody>
                        </table>
                    </div>
                    <table className='ranking-table usr-ranking'>
                        <tbody>
                        <RankingRow 
                                keyValue={99999} 
                                ranking={usrRanking.ranking} 
                                usuario={usrRanking.usuario} 
                                img={usrRanking.foto_perfil} 
                                victorias={usrRanking.victorias} 
                            />
                        </tbody>
                    </table>
                  </>
                )
                }
            </div>
        </div>
    );
}

export default RankingModal;