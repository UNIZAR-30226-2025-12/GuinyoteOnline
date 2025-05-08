import React, { useEffect, useState } from 'react';
import backButton from '/src/assets/back_button.png';
import '/src/styles/FriendsModal.css';
import '/src/styles/Amigos.css';
import useFetch from '../../customHooks/useFetch';
import SearchBar from './SearchBar';
import AddFriendButton from './buttons/AddFriendButton';
import FriendsRow from './FriendsRow';
import AddFriendModal from './AddFriendModal';

const Amigos = ({ show, handleBack, mail }) => {

    const { data, loading, error, fetchData } = useFetch('https://guinyoteonline-hkio.onrender.com/amigos/' + mail);

    const [showAddFriendModal, setShowAddFriendModal] = useState(false);
    const [dataShown, setDataShown] = useState(null);

    useEffect(() => {
        if (show) {
            fetchData();
        }
    }, [show]);

    useEffect(() => {
        if (data) {
            setDataShown(data);
        }
    }, [data]);

    function handleOnChange(inputValue) {

        if (data && inputValue !== '') {
            const filteredData = data.filter((friend) => friend.correo.toLowerCase().startsWith(inputValue.toLowerCase()));
            setDataShown(filteredData);
        } else {
            setDataShown(data);
        }
    }

    function handleAddFriendClose() {
        setShowAddFriendModal(false);
    }

    function handleAddFriend() {
        setShowAddFriendModal(true);
    }

    function handleDeleteFriend(mailToDelete) {
        console.log("Amigo eliminado: " + mailToDelete);
        console.log("Lista de amigos antes de eliminar: ", dataShown);
        setDataShown((prevData) => prevData.filter((friend) => friend.correo !== mailToDelete));
        console.log("Lista de amigos después de eliminar: ", dataShown);
    }

    return ( !show ? null : 
        <>
            <button className='friend-list-back-button' onClick={handleBack} >
                <img src={backButton} alt="Volver atrás" />
            </button>
            <h2 className='friend-list-title'>Lista de amigos</h2>

            <SearchBar handleOnChange={handleOnChange}/>

            <AddFriendButton onClick={handleAddFriend}/>

            { showAddFriendModal && <AddFriendModal mail={mail} handleClose={handleAddFriendClose}/> }

            <> 
                <div className="friends-table-container">
                    {loading && <p>Cargando ...</p>}
                    {error && <p>Error al cargar los datos</p>}
                    { ( !dataShown || dataShown.length === 0)  && !loading && (
                            <p>Todavía no tienes amigos</p>
                    )}
                    {dataShown && (
                    <table className="friends-table">
                        <tbody> 
                            {dataShown.map((data, index) => (
                            <FriendsRow 
                                key={index}
                                img={data.foto_perfil}
                                username={data.nombre}
                                mail={data.correo}
                                usrMail={mail}
                                onDelete={handleDeleteFriend}
                            />
                            ))}
                        </tbody>
                    </table>
                )}
                </div>
                </>
        </>
    );
};

export default Amigos;