import React, { useState, useEffect, useRef } from 'react';
import LobbySlots from './LobbySlots';
import { useUser } from '../../context/UserContext';
import usePost from '../../customHooks/usePost';
import { io } from 'socket.io-client';

const Lobby = ({ pairs }) => {

    const { postData } = usePost('https://guinyoteonline-hkio.onrender.com') ;
    
    const socket = io('wss://guinyoteonline-hkio.onrender.com');

    /*useEffect(() => {
        // Mensaje de bienvenida
        socket.on('hello', (mensaje) => {
          console.log('Servidor dice:', mensaje);
        });
    
        // Otro jugador se unió al lobby
        socket.on('player-joined', (playerId) => {
          console.log('Jugador se unió:', playerId);
        });
    
        // La partida ha comenzado
        socket.on('inicioPartida', (partida) => {
          console.log('¡La partida comenzó!', partida);
        });
    
        return () => {
          socket.off('hello');
          socket.off('player-joined');
          socket.off('inicioPartida');
        };
      }, []);*/

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

    const unirseAlLobby = (lobbyId, playerId) => {
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

        unirseAlLobby(response.id, mail) ;
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

        //send change data to server
        // postData('/api/lobby', { user: users[index] })

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