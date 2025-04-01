import { useState } from "react";
import React from 'react';
import Player from "./components/Player_Controller";
import IA_Player from "./components/IA_Player";
import Tapete from "./components/Tapete";
import Baraja from "./components/Baraja";
import Triunfo from "./components/Triunfo";
import GameManager from "./components/GameManager";

function Game() {
    const numJugadores = 4; // Número de jugadores
    const [gameManager] = useState(new GameManager(numJugadores)); // Componente GameManager con las funciones
    const [iniciado, setIniciado] = useState(false); // Esta iniciado
    const [players, setPlayers] = useState(gameManager.state.players); // Jugadores

    const handleInit = () => {
        gameManager.Init();
        setPlayers([...gameManager.state.players]);
        setIniciado(true);
    };

    /*const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms)); // Espera*/

    const handleCartaClick = (index) => {
        let playerIndex = gameManager.state.orden[gameManager.state.turnManager.state.playerTurn];
        let player = gameManager.state.players[playerIndex];
        let carta = player.state.mano[index];

        //await esperar(250);

        const nuevasCartasJugadas = [...gameManager.state.cartasJugadas];
        nuevasCartasJugadas[playerIndex] = carta;
        gameManager.state.cartasJugadas = nuevasCartasJugadas;
        player.state.mano[index] = null;
        console.log("turno false " + playerIndex);
        player.state.esMiTurno = false;
        

        setPlayers([...gameManager.state.players]);

        gameManager.state.turnManager.tick();
    };

    return (
        <div className="juego">
            {!iniciado ? (
                <button onClick={handleInit}>Init</button>
            ) : (
                <>
                    <Tapete />
                    <Baraja controller={gameManager.state.baraja} />
                    <Triunfo triunfo={gameManager.state.triunfo} />
                    <Player 
                        controller={gameManager.state.players[0]} 
                        cartaJugada={gameManager.state.cartasJugadas[0]} 
                        handleCartaClick={handleCartaClick} 
                    />
                    {numJugadores === 2 && (
                        <IA_Player 
                            controller={gameManager.state.players[1]} 
                            numIA={2} 
                            handleCartaClick={handleCartaClick} 
                            cartaJugada={gameManager.state.cartasJugadas[1]} 
                        />
                    )}
                    {numJugadores === 4 && (
                        <div className="IAs">
                            <IA_Player 
                                controller={gameManager.state.players[1]} 
                                numIA={1} 
                                handleCartaClick={handleCartaClick} 
                                cartaJugada={gameManager.state.cartasJugadas[1]} 
                            />
                            <IA_Player 
                                controller={gameManager.state.players[2]} 
                                numIA={2} handleCartaClick={handleCartaClick} 
                                cartaJugada={gameManager.state.cartasJugadas[2]} 
                            />
                            <IA_Player 
                                controller={gameManager.state.players[3]} 
                                numIA={3} handleCartaClick={handleCartaClick} 
                                cartaJugada={gameManager.state.cartasJugadas[3]} 
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default Game;