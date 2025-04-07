import React, { useState } from 'react';
import '../styles/SolicitudesRow.css';

import usePost from '../customHooks/usePost';
const assetsUrl = '/src/assets/';


const SolicitudesRow = ({ foto_perfil, nombre, mail, myMail }) => {

    const { postData: postDataAccept } = usePost('https://guinyoteonline-hkio.onrender.com/amigos/aceptarSolicitud/');
    const { postData: postDataDecline } = usePost('https://guinyoteonline-hkio.onrender.com/amigos/rechazarSolicitud/');

    const [isAccepted, setIsAccepted] = useState(false);
    const [isDeclined, setIsDeclined] = useState(false);

    const handleOnClickAccept = () => {
        // Handle accept action
        console.log('Solicitud aceptada');

        postDataAccept({ idUsuario: mail, idSolicitante: myMail }, '');
        setIsAccepted(true);
    }
    const handleOnClickDecline = () => {
        // Handle decline action
        console.log('Solicitud rechazada');
        postDataDecline({ idUsuario: mail, idSolicitante: myMail }, '');
        setIsDeclined(true);
    }

    return (
        <div className="solicitudes-row">
            <img src={assetsUrl + foto_perfil} alt="Solicitud" className="solicitud-img" />
            <label className="solicitud-label">{nombre}</label>
            {!isAccepted && !isDeclined && (
                <div className="solicitud-buttons">
                    <button className="btn-accept" onClick={handleOnClickAccept}>Accept</button>
                    <button className="btn-decline" onClick={handleOnClickDecline}>Decline</button>
                </div>
            )}
            {isAccepted && (
                <div className="solicitud-response">
                    <p>Solicitud aceptada</p>
                </div>
            )}
            {isDeclined && (
                <div className="solicitud-response">
                    <p>Solicitud rechazada</p>
                </div>
            )}
        </div>
    );
};

export default SolicitudesRow;