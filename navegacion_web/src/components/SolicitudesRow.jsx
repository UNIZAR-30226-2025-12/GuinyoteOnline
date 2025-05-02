import React, { useState } from 'react';
import '../styles/SolicitudesRow.css';

import usePost from '../customHooks/usePost';
const avataresUrl = '/src/assets/avatares/';

const SolicitudesRow = ({ foto_perfil, nombre, mail, myMail }) => {

    const { postData: postDataAccept } = usePost('https://guinyoteonline-hkio.onrender.com/amigos/aceptarSolicitud/');
    const { postData: postDataDecline } = usePost('https://guinyoteonline-hkio.onrender.com/amigos/rechazarSolicitud/');

    const [isAccepted, setIsAccepted] = useState(false);
    const [isDeclined, setIsDeclined] = useState(false);

    const handleOnClickAccept = () => {
        postDataAccept({ idAceptante: myMail, idSolicitante:  mail }, '');
        setIsAccepted(true);
    }
    const handleOnClickDecline = () => {
        postDataDecline({ idRechazante: myMail, idSolicitante: mail }, '');
        setIsDeclined(true);
    }

    return (
        <tr className="solicitudes-row">
            <td><img src={avataresUrl + foto_perfil} alt="Solicitud" className="solicitud-img" /></td>
            <td><p className="solicitud-label">{nombre}</p></td>
            <td>
                {!isAccepted && !isDeclined && (
                    <div className="solicitud-buttons">
                        <button className="btn-accept" onClick={handleOnClickAccept}>Accept</button>
                        <button className="btn-decline" onClick={handleOnClickDecline}>Decline</button>
                    </div>
                )}
                {isAccepted && <p className="solicitud-response">Solicitud aceptada</p>}
                {isDeclined && <p className="solicitud-response">Solicitud rechazada</p>}
            </td>
        </tr>
    );
};

export default SolicitudesRow;