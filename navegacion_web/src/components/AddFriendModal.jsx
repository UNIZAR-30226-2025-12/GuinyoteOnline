import React, { useState } from 'react';
import usePost from '../customHooks/usePost';
import '/src/styles/AddFriendModal.css';

const AddFriendModal = ({ handleClose, mail }) => {

    const [friendName, setFriendName] = useState('');

    const { postData } = usePost('https://guinyoteonline-hkio.onrender.com/amigos/enviarSolicitud');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const data = {
            idSolicitante: mail,
            idSolicitado: friendName
        };

        const response = await postData(data, '');

        if (response.error != null) {
            console.error('Error al enviar la solicitud:', response.error);
        }else{
            handleClose();
        }
    };


    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className='modal-exit-button' onClick={handleClose} >
                    <img src="https://img.icons8.com/material-rounded/24/000000/close-window.png" alt="Cerrar" />
                </button>
                <h3>Enviar solicitud</h3>
                <form onSubmit={handleSubmit}>
                    <label>
                        Id de amigo:
                        <input
                            type="text"
                            value={friendName}
                            onChange={(e) => setFriendName(e.target.value)}
                            required
                        />
                    </label>
                    <button type="submit" className='modal-button-submit'>
                        Enviar solicitud
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddFriendModal;