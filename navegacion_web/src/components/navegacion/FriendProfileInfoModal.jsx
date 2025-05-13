import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import '/src/styles/ProfileModal.css';
import { useUser } from '../../context/UserContext';
import useFetch from '../../customHooks/useFetch';

const avataresUrl = '/src/assets/avatares/';
const tapetesUrl = '/src/assets/tapetes/';
const cartasUrl = '/src/assets/tipos_carta/';

function FriendProfileInfoModal() {

    const {
    profileId
    } = useUser();

    const [friendData, setFriendData] = useState(null);
    

    const encodedMail = encodeURIComponent(profileId);
    const { data, loading, error, fetchData } = useFetch(`https://guinyoteonline-hkio.onrender.com/usuarios/perfil/${encodedMail}`);

    const navigate = useNavigate();

    useEffect(() => {
        if (!data) fetchData();
    }, []);

    useEffect(() => {
    if (data) {
        setFriendData(data); // Asignamos los datos del amigo
    }
    }, [data]);

    console.log(friendData);
    const profilePic = data?.foto_perfil || 'default.png'; // Asigna la foto de perfil o una cadena vacía si no existe
    const username = data?.nombre || 'Usuario'; // Asigna el nombre de usuario o 'Usuario' si no existe
    const tapete = data?.tapete || 'default.png'; 
    const cartas = data?.imagen_carta || 'default.png';

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error al cargar los datos</div>;
    }

    return (
    <div className="profile-modal">
        <div className="profile-top-section">
            <div className="profile-left">
                <div
                className="profile-pic"
                style={{ backgroundImage: `url(${avataresUrl + profilePic})` }}
                />
            </div>

            <div className="profile-center">
            <h3 className="username">{username}</h3>
            </div>
        </div>

        <div className="divider" />

        <div className="customization-section">
            <div className="tapete-container">
                <h4>Tapete del amigo:</h4>
                <img
                src={`${tapetesUrl}${tapete}`}
                alt="Tapete del amigo"
                className="tapete-img"
                />
            </div>
            <div className="cartas-container">
                <h4>Cartas del amigo:</h4>
                <img
                src={`${cartasUrl}${cartas}`}
                alt="Cartas del amigo"
                className="cartas-img"
                />
            </div>
        </div>

    </div>
  );
}

export default FriendProfileInfoModal;