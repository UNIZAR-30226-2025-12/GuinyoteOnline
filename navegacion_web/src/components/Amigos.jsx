import React, { useEffect, useState } from 'react';
import backButton from '/src/assets/back_button.png';
import '/src/styles/FriendsModal.css';
//import '/src/styles/Amigos.css';
import useFetch from '../customHooks/useFetch';
import SearchBar from './SearchBar';
import AddFriendButton from './buttons/AddFriendButton';
import FriendsRow from './FriendsRow';

const Amigos = ({ show, handleBack, mail }) => {

    const { data, loading, error, fetchData } = useFetch('https://guinyoteonline-hkio.onrender.com/amigos/' + mail);

    const [filter, setFilter] = useState('');

    useEffect(() => {
        if (show) {
            console.log(mail);
            fetchData();
        }
    }, [show]);

    useEffect(() => {
        if (filter != '') {
            console.log('Filter changed:', filter);
            console.log('Mail:', mail);
            //update_list(filter);
        }
    }, [filter]);

    function handleOnChange(inputValue) {
        console.log('Input value:', inputValue);
        setFilter(inputValue);
    }

    return ( !show ? null : 
        <>
            <button className='friend-list-back-button' onClick={handleBack} >
                <img src={backButton} alt="Volver atrás" />
            </button>
            <h2 className='friend-list-title'>Lista de amigos</h2>

            <SearchBar handleOnChange={handleOnChange}/>

            <AddFriendButton />

            {data && !data.amigos && <p>No tienes amigos</p>}
            {loading && <p>Cargando ...</p>}
            {error && <p>Error al cargar los datos</p>}
            {data && data.amigos && (
            <> 
                <div className="friends-table-container">
                    <table className="friends-table">
                    
                        <tbody>
                            {data.amigos.map((data, index) => (
                            <FriendsRow 
                                key={index+1} // Use a unique id if available
                                img={data.foto_perfil}
                                username={data.nombre}
                                mail={data.correo}
                            />
                            ))}
                        </tbody>
                    </table>
                </div>
                </>
            )}
            {/* Hay que incluir el muestreo de la lista de amigos, un componente para cada amigo, el búscador por username, si puede ser que cargue elementos dinámicamente para ahorrar recursos */}

        </>
    );
};

export default Amigos;