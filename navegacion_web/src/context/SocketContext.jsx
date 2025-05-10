import { createContext, useContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = io('wss://guinyoteonline-hkio.onrender.com');

        return () => {
            socketRef.current.disconnect(); // Cerrar conexión al desmontar
        };
    }, []);

    return (
        <SocketContext.Provider value={socketRef}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
  const socketRef = useContext(SocketContext);
  return socketRef?.current ?? null;  // null si aún no está disponible
};
