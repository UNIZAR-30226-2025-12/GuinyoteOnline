import React, { useState, useEffect, useRef } from 'react';
import LobbySlots from './LobbySlots';
import { useUser } from '../../context/UserContext';
import usePost from '../../customHooks/usePost';
import { useSocket } from '../../context/SocketContext';

const Lobby = ({ pairs }) => {

    const { postData } = usePost('https://guinyoteonline-hkio.onrender.com') ;
    
    const socket = useSocket();

    const [matchmaking, setMatchmaking] = useState(false);
    const [counter, setCounter] = useState("0:00");
    const timerRef = useRef(null); // ← store timer ID
    const { username, mail, profilePic } = useUser();
    const [users, setUsers] = useState([{
        nombre: username, email: mail, foto_perfil: profilePic },
        { nombre: null, email: null, foto_perfil: null },
        { nombre: null, email: null, foto_perfil: null },
        { nombre: null, email: null, foto_perfil: null },
    ]);

    const maxPlayers = !pairs ? 2 : 4;

    useEffect(() => {
        if (!socket) return;

        const handleIniciarPartida = () => {
            console.log("Recibido 'iniciarPartida' del servidor");
            socket.emit("ack");
        };

        socket.on("iniciarPartida", handleIniciarPartida);

        return () => {
            socket.off("iniciarPartida", handleIniciarPartida);
        };
    }, [socket]);


    const unirseAlLobby = (lobbyId, playerId) => {
        if (!socket) {
            console.warn("Socket not connected");
            return;
        }

        socket.emit('join-lobby', {
            lobbyId,
            playerId,
        });
    };
        
    const startMatchmaking = async () => {
        if (timerRef.current) return; // avoid multiple intervals
        setMatchmaking(true);
        const startTime = Date.now();

        timerRef.current = setInterval(() => {
            const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
            const minutes = Math.floor(elapsedTime / 60);
            const seconds = elapsedTime % 60;
            setCounter(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
        }, 1000);

        const response  = await postData({ playerId: mail, maxPlayers: pairs ? '2v2' : '1v1' }, '/salas/matchmake');

        unirseAlLobby(response.responseData.id, mail) ;
    };

    const stopMatchmaking = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        setCounter("0:00");
        setMatchmaking(false);
    };

    const handleSlotClick = (index) => {

        const auxUsers = [...users];

        // find if the user is already in the list
        const userIndex = auxUsers.findIndex(user => user.email === mail);
        // if the user is already in the list, remove it
        if (userIndex !== -1) {
            auxUsers[userIndex] = { nombre: null, email: null, foto_perfil: null };
        }

        auxUsers[index] = { nombre: username, email: mail, foto_perfil: profilePic };
        // update the state
        setUsers(auxUsers);
    }

    return (
        <>
            <h1>{pairs ? "Sala de Partida 2 vs 2" : "Sala de Partida 1 vs 1"}</h1>

            <LobbySlots slotCount={maxPlayers} playerSlotArgs={users} handleSlotClick={handleSlotClick}/>

            {!matchmaking ? (
                <button onClick={startMatchmaking}>Empezar</button>
            ) : (
                <div className="waiting-matchmaking-counter">
                    <h2>{counter}</h2>
                    <button onClick={stopMatchmaking}>
                        Cancelar
                        <img />
                    </button>
                </div>
            )}
        </>
    );
};

export default Lobby;