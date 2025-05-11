import { useState, useEffect } from "react";
import React from 'react';
import '/src/styles/Game.css';
import Player from "../components/game/Player_Controller";
import IA_Player from "../components/game/IA_Player";
import Tapete from "../components/game/Tapete";
import Baraja from "../components/game/Baraja";
import Triunfo from "../components/game/Triunfo";
import GameManager from "../components/game/GameManager";
import { useSocket } from "../context/SocketContext";
import { useUser } from "../context/UserContext";

function OnlineGame() {
    const numJugadores = 4; // Número de jugadores
    const [gameManager] = useState(new GameManager(numJugadores)); // Componente GameManager con las funciones
    const [players, setPlayers] = useState(gameManager.state.players); // Jugadores
    const [triunfo, setTriunfo] = useState(gameManager.state.triunfo); // Triunfo
    const {tapete} = useUser();
    const socket = useSocket(); // Socket para la comunicación con el servidor

    const handleInit = () => {
        gameManager.Init();
        setPlayers([...gameManager.state.players]);
        setTriunfo(gameManager.state.triunfo);
        setIniciado(true);
    };

    /**
     * Función que asigna la baraja a los jugadores y reparte las cartas
     * @param {*} barajaString 
     */
    const handleRecibirBaraja = (barajaString) => {
        console.log("Baraja recibida:", barajaString);

        const baraja = barajaFromString(barajaString);

        gameManager.state.baraja = baraja;
        gameManager.repartirCartas(); // si tienes esta función
        setPlayers([...gameManager.state.players]);
        setTriunfo(gameManager.state.triunfo);
    };


    /**
     * Hay que gestionar las conexiones para recibir la baraja y todo lo demás
     * 
     */

    useEffect(() => {
        if (!socket) return;

        socket.off("baraja", handleRecibirBaraja);
        socket.on("baraja", handleRecibirBaraja);

        return () => {
            socket.off("baraja", handleRecibirBaraja);
        };
    }, [socket]);


    /*const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms)); // Espera

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
    };*/


    // Si es posible cantar, se canta, para eso, si has ganado la última baza y tienes rey y sota del mismo palo
    // Si no, no se permite cantar
    const handleCantarClick = async () => {
        // Comprobar si se puede cantar

        // Si no se puede cantar, no se hace nada

        // Si se puede cantar, se canta (se modifica una variable para mandarla al servidor)
    }

    /*const handleCambiarSiete = async () => {

        // Verificar que se cuenta con el siete y que es del mismo palo que el triunfo
        // Tienes que haber ganado la última baza (?????????????)

        // Si se puede cambiar, se cambia (se modifica una variable para mandarla al servidor)

        // Si no se puede cambiar, no se hace nada

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

    }*/

    return (
        <div className="juego">
            <div
                className="fondo-dinamico"
                style={{
                backgroundImage: `url(/src/assets/tapetes/${tapete}.jpg)`,
                }}
            />
            {!gameManager.state.finJuego ? (
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
            }
        </div>
    );
}


export default OnlineGame;

/*
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

export default Game;*/