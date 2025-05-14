import React, { Component, useState } from 'react';
import '/src/styles/PrivateRoomModal.css';
import usePost from '../../customHooks/usePost';
import { useUser } from '../../context/UserContext';

const PrivateRoomModal = ({ onClose, onJoin, pairs }) => {
    const [roomCode, setRoomCode] = useState('');
    const [generatedCode, setGeneratedCode] = useState(null);
    const [sendCodigoAcceso, setSendCodigoAcceso] = useState("") ;
    const { postData } = usePost('https://guinyoteonline-hkio.onrender.com');
    const { mail } = useUser();

    const handleJoin = async () => {

        try {
            const response = await postData({
                idUsuario: mail,
                maxPlayers: pairs ? '2v2' : '1v1',
                codigoAcceso: sendCodigoAcceso.trim()
            }, '/salas/unirsePrivada');

            onJoin(response.responseData.id, response.responseData.codigoAcceso); // navegar o unirse con ID recibido
        }
        catch (error) {
            alert("No se pudo unir a la sala. Verifica el código.");
        }
    };

    const handleGenerateCode = async () => {
        try {
            const response = await postData({
                idCreador: mail,
                maxPlayers: pairs ? '2v2' : '1v1'
            }, '/salas/crearPrivada');

            setGeneratedCode(response.responseData.codigoAcceso);
            setSendCodigoAcceso(response.responseData.codigoAcceso)
            setRoomCode(response.responseData.id);
        }
        catch (error) {
            alert("Error al crear la sala privada.");
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <button className='modal-exit-button' onClick={onClose} >
                    <img src="https://img.icons8.com/material-rounded/24/000000/close-window.png" alt="Cerrar" />
                </button>
                <h2>Sala privada</h2>
                {!generatedCode ? (
                    <button className="modal-buttons" onClick={handleGenerateCode}>
                        Crear código
                    </button>
                    ) : (
                    <div className="generated-code">
                        <p>Código generado:</p>
                        <h3>{generatedCode}</h3>
                    </div>
                )}

                <div className="modal-divider" />

                <p>Buscar sala por código:</p>
                <input
                    type="text"
                    placeholder="Código de sala"
                    value={sendCodigoAcceso}
                    onChange={(e) => setSendCodigoAcceso(e.target.value)}
                />
                <div className="modal-buttons">
                    <button onClick={handleJoin}>Buscar</button>
                </div>
            </div>
        </div>
    );
};

export default PrivateRoomModal;