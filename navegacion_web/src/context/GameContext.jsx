import React, { createContext, useState, useContext } from 'react';

// Create the GameContext
const GameContext = createContext();

// Create a provider component
export const GameProvider = ({ children }) => {
    const [numPlayers, setNumPlayers] = useState(0);
    const [lobbyId, setLobbyId] = useState('');

    return (
        <GameContext.Provider value={{ numPlayers, setNumPlayers, lobbyId, setLobbyId }}>
            {children}
        </GameContext.Provider>
    );
};

// Custom hook to use the GameContext
export const useGameContext = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGameContext must be used within a GameProvider');
    }
    return context;
};