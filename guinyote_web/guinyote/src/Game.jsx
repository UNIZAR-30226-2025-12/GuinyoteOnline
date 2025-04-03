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

    const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms)); // Espera

    const handleCartaClick = async (index) => {
        let playerIndex = gameManager.state.orden[gameManager.state.turnManager.state.playerTurn];
        let player = gameManager.state.players[playerIndex];
        if (!player.turno()) {
            console.log("Carta no válida");
            return;
        }
        let carta = player.state.mano[index];

        await esperar(50);

        const nuevasCartasJugadas = [...gameManager.state.cartasJugadas];
        nuevasCartasJugadas[playerIndex] = carta;
        gameManager.state.cartasJugadas = nuevasCartasJugadas;
        player.state.mano[index] = null;
        player.state.esMiTurno = false;


        setPlayers([...gameManager.state.players]);

        gameManager.state.turnManager.tick();
    };

    const handleCantarPlayer = () => {
        
    }

    return (
        <div className="juego">
            {!iniciado ? (
                <button className="botonInit" onClick={handleInit}>Init</button>
            ) : (
                !gameManager.state.finJuego ? (
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
                        {gameManager.state.segundaBaraja && (
                            <div>
                                <h1 className="MTeam_1">Equipo 1: {
                                    gameManager.state.numPlayers === 2
                                        ? gameManager.state.players[0].state.puntos
                                        :
                                        gameManager.state.numPlayers === 4
                                            ? gameManager.state.players[0].state.puntos + gameManager.state.players[2].state.puntos
                                            : "Error"
                                }</h1>
                                <h1 className="MTeam_2">Equipo 2: {
                                    gameManager.state.numPlayers === 2
                                        ? gameManager.state.players[1].state.puntos
                                        :
                                        gameManager.state.numPlayers === 4
                                            ? gameManager.state.players[1].state.puntos + gameManager.state.players[3].state.puntos
                                            : "Error"
                                }</h1>
                            </div>
                        )}
                    </>
                ) : (
                    <div>
                        <h1 className="GanadorLabel">Ganador: Equipo {gameManager.state.ganador}</h1>
                        <button className="botonInit" onClick={handleInit}>Reiniciar</button>
                    </div>
                )
            )}
        </div>
    );
}

export default Game;