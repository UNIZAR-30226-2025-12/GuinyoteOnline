import React, { useState, useEffect } from 'react';
import '/src/styles/FriendsModal.css';
import FriendRequestButton from './buttons/FriendRequestButton';
import FriendListButton from './buttons/FriendListButton';
import Amigos from './Amigos';
import Solicitudes from './Solicitudes';

const FriendsModal = ({ show, handleClose, mail, onClickFriendList, onClickFriendRequest }) => {

    const [showAmigos, setShowAmigos] = useState(false);
    const [showSolicitudes, setShowSolicitudes] = useState(false);

    if(!show) {
        return null;
    } 

    const handleBackAmigos = () => {
        setShowAmigos(false);
    }

    const handleBackSolicitudes = () => {
        setShowSolicitudes(false);
    }

    return (
        <div className={`friends-overlay ${show ? 'show' : 'hide'}`}>
            <div className={`friends-modal ${show ? 'show' : 'hide'}`}>

                {(!showSolicitudes && !showAmigos) ? (
                    <>
                        <button className='modal-exit-button' onClick={handleClose} >
                            <img src="https://img.icons8.com/material-rounded/24/000000/close-window.png" alt="Cerrar" />
                        </button>
                        <h2 className='modal-title'>Amigos</h2>
                        <FriendListButton onClick={() => { setShowAmigos(true); }} />
                        <FriendRequestButton onClick={() => { setShowSolicitudes(true); }} />
                    </>
                ) : null}

                {(showAmigos && !showSolicitudes) ? <Amigos mail={mail} handleBack={handleBackAmigos} /> : null}
                {(showSolicitudes && !showAmigos) ? <Solicitudes mail={mail} handleBack={handleBackSolicitudes} /> : null}
            </div>
        </div>
    );
}

export default FriendsModal;