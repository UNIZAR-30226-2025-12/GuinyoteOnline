import React, { useState } from 'react';
import usePost from '../customHooks/usePost';
import '/src/styles/LogRegModal.css';

const AddFriendModal = ({ handleClose, mail }) => {

    const [friendName, setFriendName] = useState('');

    const { postData } = usePost('https://guinyoteonline-hkio.onrender.com/amigos/enviarSolicitud');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const data = {
            idUsuario: mail,
            idAmigo: friendName
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
                <h1>Enviar solicitud</h1>
                <form onSubmit={handleSubmit}>
                    <label>
                        Friend's Name:
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