import { use, useState, useEffect } from "react";
import { useUser } from '/src/context/UserContext';
import React from 'react';
import Player from "../components/game/Player_Controller";
import IA_Player from "../components/game/IA_Player";
import Tapete from "../components/game/Tapete";
import Baraja from "../components/game/Baraja";
import Triunfo from "../components/game/Triunfo";
import GameManager from "../components/game/GameManager";

function Game() {
    const numJugadores = 4; // Número de jugadores
    const [gameManager] = useState(new GameManager(numJugadores)); // Componente GameManager con las funciones
    const [iniciado, setIniciado] = useState(false); // Esta iniciado
    const [players, setPlayers] = useState(gameManager.state.players); // Jugadores
    const [triunfo, setTriunfo] = useState(gameManager.state.triunfo); // Triunfo
    const [informadorTexto, setInformadorTexto] = useState(""); // Estado para el texto del informador
    const [cargando, setCargando] = useState(true); // Estado para carga inicial

    const { username } = useUser();

    const handleInit = () => {
        gameManager.Init();
        setPlayers([...gameManager.state.players]);
        setTriunfo(gameManager.state.triunfo);
        setIniciado(true);
        setInformadorTexto("Turno de: " + `${username}`);
        setCargando(false);
    };

    const handleCartaClick = async (index) => {
        let playerIndex = gameManager.state.orden[gameManager.state.turnManager.state.playerTurn];
        let player = gameManager.state.players[playerIndex];
        if (!player.turno()) {
            console.log("Carta no válida");
            return;
        }
        let carta = player.state.mano[index];

        const nuevasCartasJugadas = [...gameManager.state.cartasJugadas];
        nuevasCartasJugadas[playerIndex] = carta;
        gameManager.state.cartasJugadas = nuevasCartasJugadas;
        player.state.mano[index] = null;
        player.state.esMiTurno = false;

        setPlayers([...gameManager.state.players]);
        setInformadorTexto("Turno de: " + `${username}`);

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
        setInformadorTexto("Cambian siete");

    }

    const handleCantar = async (palo) => {
        let playerIndex = gameManager.state.orden[gameManager.state.turnManager.state.playerTurn];
        let player = gameManager.state.players[playerIndex];
        let traduccion = ["Bastos", "Copas", "Espadas", "Oros"];

        setInformadorTexto("Cantan " + traduccion[palo]);
    }

    useEffect(() => {
        handleInit();
    }, []);

    if (cargando) {
        return <div className="cargando">Cargando partida...</div>;
    }

    return (
        <div className="juego">
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
                            handleCantar={handleCantar}
                        />
                        {numJugadores === 2 && (
                            <IA_Player
                                controller={gameManager.state.players[1]}
                                numIA={2}
                                handleCartaClick={handleCartaClick}
                                cartaJugada={gameManager.state.cartasJugadas[1]}
                                handleCambiarSiete={handleCambiarSiete}
                                handleCantar={handleCantar}
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
                                    handleCantar={handleCantar}
                                />
                                <IA_Player
                                    controller={gameManager.state.players[2]}
                                    numIA={2} handleCartaClick={handleCartaClick}
                                    cartaJugada={gameManager.state.cartasJugadas[2]}
                                    handleCambiarSiete={handleCambiarSiete}
                                    handleCantar={handleCantar}
                                />
                                <IA_Player
                                    controller={gameManager.state.players[3]}
                                    numIA={3} handleCartaClick={handleCartaClick}
                                    cartaJugada={gameManager.state.cartasJugadas[3]}
                                    handleCambiarSiete={handleCambiarSiete}
                                    handleCantar={handleCantar}
                                />
                            </div>
                        )}
                        <h3 className="informador"> {informadorTexto}</h3>
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
                )}
        </div>
    );
}

export default Game;