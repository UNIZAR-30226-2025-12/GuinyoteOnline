import { useState } from "react";
import React from 'react';
import '/src/styles/Game.css';
import Player from "../components/game/Player_Controller";
import IA_Player from "../components/game/IA_Player";
import Tapete from "../components/game/Tapete";
import Baraja from "../components/game/Baraja";
import Triunfo from "../components/game/Triunfo";
import GameManager from "../components/game/GameManager";
import { useUser } from "../context/UserContext";

function Game() {
    const numJugadores = 4; // Número de jugadores
    const [gameManager] = useState(new GameManager(numJugadores)); // Componente GameManager con las funciones
    const [iniciado, setIniciado] = useState(false); // Esta iniciado
    const [players, setPlayers] = useState(gameManager.state.players); // Jugadores
    const [triunfo, setTriunfo] = useState(gameManager.state.triunfo); // Triunfo

    const {tapete} = useUser();

    const handleInit = () => {
        gameManager.Init();
        setPlayers([...gameManager.state.players]);
        setTriunfo(gameManager.state.triunfo);
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

    const handleCambiarSiete = async () => {
        let playerIndex = gameManager.state.orden[gameManager.state.turnManager.state.playerTurn];
        let player = gameManager.state.players[playerIndex];

        const index = player.state.mano.findIndex(
            (c) => c && c.numero === 6 && c.palo === gameManager.state.triunfo.palo
        );
        if (index === -1) {console.log("Error cambiar siete invocado cuando no se puede cambiar"); return;}

        const triunfoAux = gameManager.state.triunfo;

        setTriunfo(player.state.mano[index]);
        player.state.mano[index] = triunfoAux;
        player.state.sePuedeCambiarSiete = false;
        player.state.sieteCambiado = true;
        setPlayers([...gameManager.state.players]);

    }

    return (
        <div className="juego">
             <div
                className="fondo-dinamico"
                style={{
                backgroundImage: `url(/src/assets/tapetes/${tapete}.jpg)`,
                }}
            />
            {!iniciado ? (
                <button className="botonInit" onClick={handleInit}>Init</button>
            ) : (
                !gameManager.state.finJuego ? (
                    <>
                        <Tapete />
                        <Baraja controller={gameManager.state.baraja} />
                        <Triunfo triunfo={triunfo} />
                        <Player
                            controller={gameManager.state.players[0]}
                            cartaJugada={gameManager.state.cartasJugadas[0]}
                            handleCartaClick={handleCartaClick}
                            handleCambiarSiete={handleCambiarSiete}
                        />
                        {numJugadores === 2 && (
                            <IA_Player
                                controller={gameManager.state.players[1]}
                                numIA={2}
                                handleCartaClick={handleCartaClick}
                                cartaJugada={gameManager.state.cartasJugadas[1]}
                                handleCambiarSiete={handleCambiarSiete}
                            />
                        )}
                        {numJugadores === 4 && (
                            <div className="IAs">
                                <IA_Player
                                    controller={gameManager.state.players[1]}
                                    numIA={1}
                                    handleCartaClick={handleCartaClick}
                                    cartaJugada={gameManager.state.cartasJugadas[1]}
                                    handleCambiarSiete={handleCambiarSiete}
                                />
                                <IA_Player
                                    controller={gameManager.state.players[2]}
                                    numIA={2} handleCartaClick={handleCartaClick}
                                    cartaJugada={gameManager.state.cartasJugadas[2]}
                                    handleCambiarSiete={handleCambiarSiete}
                                />
                                <IA_Player
                                    controller={gameManager.state.players[3]}
                                    numIA={3} handleCartaClick={handleCartaClick}
                                    cartaJugada={gameManager.state.cartasJugadas[3]}
                                    handleCambiarSiete={handleCambiarSiete}
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