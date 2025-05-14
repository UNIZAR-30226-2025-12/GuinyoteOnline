import { use, useState, useEffect } from "react";
import { useUser } from '/src/context/UserContext';
import Player from "../components/game/Player_Controller";
import Tapete from "../components/game/Tapete";
import Baraja from "../components/game/Baraja";
import Triunfo from "../components/game/Triunfo";
import GameManager from "../components/game/GameManager";
import { useSocket } from "/src/context/SocketContext";
import { useGameContext } from "../context/GameContext";
import Online_Player from "../components/game/Online_Player";
import { useNavigate } from "react-router-dom";

function OnlineGame() {

    // * Id del lobby y numJugadores
    const game = useGameContext() ;
    const numJugadores = game.numPlayers ; // Número de jugadores
    const lobbyId = game.lobbyId ; // lobbyId

    // * Socket de la partida
    const socket = useSocket();

    const navigate = useNavigate() ; 

    // * Debería funcionar
    const enviarFinRonda = () => {
        console.log("Enviado fin de partida") ;
        socket.emit("fin-partida", game.lobbyId);
    }

    // * Recibe numJugadores, partida online true, enviarFinRonda para manejar el fin de ronda
    const [gameManager] = useState(new GameManager(numJugadores, true, enviarFinRonda));

    // ! Ns si es necesario
    const [iniciado, setIniciado] = useState(false); // Esta iniciado
    // ! Ns si es necesario
    const [triunfo, setTriunfo] = useState(gameManager.state.triunfo); // Triunfo
    
    // * Informa de lo que ocurre en la partida
    const [informadorTexto, setInformadorTexto] = useState(""); // Estado para el texto del informador

    // * Para mostrar una pantalla de carga
    const [cargando, setCargando] = useState(true); // Estado para carga inicial
    
    // * Para gestionar la inicialización del juego
    const [arrayDeCartas, setArrayDeCartas] = useState(null); // Estado para la baraja
    const [ordenRecibido, setOrdenRecibido] = useState(null) ;
    const [players, setPlayers] = useState(gameManager.state.players) ; // Jugadores


    /**
     * * Pasa de una baraja en formato numero,palo;numero,palo
     * * A un array de js con { {numero, palo} , {numero, palo} ... }
     */
    const descifrarBaraja = (baraja) => {

        const barajaDescifrada = baraja.split(";").map((carta) => {
            const [numero, palo] = carta.split(",");
            return {
                numero: parseInt(numero),
                palo: parseInt(palo),
            };
        })

        return barajaDescifrada;

    }

    // * --------------------- EVENTOS DE MENSAJES DEL JUEGO RECIBIDOS ---------------------

    /**
     * * Gestiona el mensaje de baraja recibido, emite ack
     * * - Decodifica la baraja y establece el arrayDeCartas
     */
    const onBarajaRecibida = (baraja) => {

        // Envio ACK al servidor para confirmar la recepción de la baraja
        socket.emit("ack") ;
        // Reconocer la baraja recibida y establecerla en el GameManager
        console.log("Primera baraja recibida");
        // Establecer el arrayDeCartas
        setArrayDeCartas(descifrarBaraja(baraja));

    }

    /**
     * * Gestiona el mensaje de Primero recibido
     * * - Establece el indice del que empieza y el indice del jugador local
     */
    const onPrimeroRecibida = (primero, index) => {

        console.log("Recibido orden para inicialización") ;        

        setOrdenRecibido({primero, index}) ;

    }

    // ! ---------- INICIAR EL GAMEMANAGER CON LA BARAJA Y ORDEN ----------

    useEffect(() => {
        if (arrayDeCartas && ordenRecibido) {

            console.log("Iniciando el juego") ;
            // Inciar el juego
            gameManager.Init(arrayDeCartas, ordenRecibido.primero, ordenRecibido.index);
            setTriunfo(gameManager.state.triunfo);
            setPlayers([...gameManager.state.players]);
            setIniciado(true);
            setInformadorTexto("Turno de: " + `${gameManager.state.orden[0]}`);
            setCargando(false);
        }
    }, [ordenRecibido, arrayDeCartas])

    // ! ------------------------------------------------------------------

    /**
     * * Gestiona el mensaje de jugada recibido
     * * - Hace que se ejecute el turno de un oponente 
     */
    const onJugadaRecibida = (carta, cantar, cambiarSiete) => {
        
        socket.emit('ack');

        console.log("Jugada recibida: carta: " + carta + ", cantar: " + cantar + ", cambiarSiete : " + cambiarSiete) ;

        if (carta !== -1) {
            handleJugadaRecibidaCarta(carta) ;
        } else if (cantar !== -1) {
            handleJugadaRecibidaCantar(cantar) ;
        } else if (cambiarSiete) {
            handleJugadaRecibidaCambiarSiete() ;
        }
        
    }

    /**
     * * Gestiona el mensaje de fin de ronda recibido
     * * - Envía un ack
     */
    const onFinRonda = () => {

        console.log("Finalizar ronda recibido");

        socket.emit('ackFinRonda');
    }


    /**
     * * Gestiona el mensaje de segunda baraja recibida
     * * - Inicia la segunda ronda
     */
    const onSegundaBarajaRecibida = (baraja) => {

        console.log("Segunda baraja recibida"); 

        const arrayCartasSegundaBaraja = descifrarBaraja(baraja) ;
    
        gameManager.barajarYRepartir(arrayCartasSegundaBaraja) ;
    }

    // * -----------------------------------------------------------------------------------


    // * ---------------- MANEJO DE LOS MENSAJES RECIBIDOS ----------------

    useEffect(() => {

        // Borra cualquier suscripción de las funciones
        socket.off('baraja');
        socket.off('primero');
        socket.off('jugada');
        socket.off('finRonda');
        socket.off('barajaSegundaRonda');

        // Suscribe las acciones a los mensajes recibidos
        socket.on('baraja', onBarajaRecibida);
        socket.on('primero', onPrimeroRecibida);
        socket.on('jugada', onJugadaRecibida);
        socket.on('finRonda', onFinRonda);
        socket.on('barajaSegundaRonda', onSegundaBarajaRecibida);

        return () => {
            // Cuando se desmonta el componente, se borra la suscripción
            socket.off('baraja', onBarajaRecibida);
            socket.off('primero', onPrimeroRecibida);
            socket.off('jugada', onJugadaRecibida);
            socket.off('finRonda', onFinRonda);
            socket.off('barajaSegundaRonda', onSegundaBarajaRecibida);
        };

    }, []);

    // * ------------------------------------------------------------------------


    // * ----------------------- FUNCIONES JUGADOR LOCAL ------------------------

    // * Función que envía la jugada del jugador local 
    function sendPlay () {
        let wrapper = {
            input: JSON.stringify(gameManager.state.players[0].state.input),
            lobby: game.lobbyId,
            miId: socket.id
        };

        console.log("Enviada jugada: ", wrapper)

        // * Se envía la jugada al servidor
        socket.emit('realizarJugada', wrapper);

        // * Resetear el estado del input del usuario
        gameManager.state.players[0].state.input = { carta: -1, cantar: -1, cambiarSiete: false };
    }

    // * Función que gestiona el jugar una carta
    function handleCartaClick(indexJugado) {

        handleCardPlayed(indexJugado) ;
        
        sendPlay () ;

        console.log("Cambiando turno");

        // * Cambias el turno
        gameManager.state.turnManager.tick();

        setInformadorTexto("Turno de: " + `${gameManager.state.orden[gameManager.state.turnManager.state.playerTurn]}`);

    }

    // * Función que gestiona el cambiar el siete
    function handleCambiarSiete() {
        
        handleSevenChanged() ;

        sendPlay () ;
    
    }

    // * Función que gestiona el cantar un palo
    function handleCantar(palo) {

        handleCantarReceived(palo) ;

        sendPlay () ;

    }

    // * ------------------------------------------------------------------------

    // * ---------------------- FUNCIONES JUGADORES ONLINE ----------------------

    function handleJugadaRecibidaCarta(indexJugado) {

        handleCardPlayed(indexJugado) ;


        console.log("Cambiando turno");

        // * Cambias el turno
        gameManager.state.turnManager.tick();

        setInformadorTexto("Turno de: " + `${gameManager.state.orden[gameManager.state.turnManager.state.playerTurn]}`);

    }

    // * Función que gestiona el cambiar el siete
    function handleJugadaRecibidaCambiarSiete() {
        
        handleSevenChanged() ;

    }

    // * Función que gestiona el cantar un palo
    function handleJugadaRecibidaCantar(palo) {

        handleCantarReceived(palo) ;

    }

    // * ------------------------------------------------------------------------

    // * ------------------------ FUNCIONES JUEGO ONLINE ------------------------
    /**
     * * Esta función maneja la selección de una jugada
     * @param index: índice de la carta seleccionada en la mano del jugador
     */
    function handleCardPlayed(indexJugado) {

        // * Obtener el jugador al que le toca tirar
        let playerIndex = gameManager.state.orden[gameManager.state.turnManager.state.playerTurn];
        let player = gameManager.state.players[playerIndex];

        // * Obtener la carta que ha tirado
        let carta = player.state.mano[indexJugado];

        console.log(".................CARTA JUGADA.....................");
        console.log("Gestionando carta jugada");
        console.log("Carta jugada: ", carta) ;
        console.log("..................................................");

        // * Se modifican las cartas jugadas
        const nuevasCartasJugadas = [...gameManager.state.cartasJugadas];
        nuevasCartasJugadas[playerIndex] = carta;
        gameManager.state.cartasJugadas = nuevasCartasJugadas;

        // * Se elimina la carta de la mano del jugador y se le quita el turno 
        player.state.mano[indexJugado] = null;
        player.state.esMiTurno = false;

        // * Establecer la carta jugada
        player.state.input = { carta: indexJugado, cantar: -1, cambiarSiete: false };

        setPlayers([...gameManager.state.players]);

        // * Informamos por pantalla
        setInformadorTexto("Turno de: " + `${gameManager.state.orden[gameManager.state.turnManager.state.playerTurn]}`);

    };

    function handleSevenChanged() {
        
        // * Obtener el jugador al que le toca tirar
        let playerIndex = gameManager.state.orden[gameManager.state.turnManager.state.playerTurn];
        let player = gameManager.state.players[playerIndex];

        // * Encontrar el índice del 7 del palo del triunfo
        const index = player.state.mano.findIndex(
            (c) => c && c.numero === 6 && c.palo === gameManager.state.triunfo.palo
        );

        // * Cambiar el triunfo por el siete y el siete por el triunfo
        const triunfoAux = gameManager.state.triunfo;
        setTriunfo(player.state.mano[index]);
        player.state.mano[index] = triunfoAux;
        player.state.sePuedeCambiarSiete = false;
        player.state.sieteCambiado = true;

        // * Informamos por pantalla
        setInformadorTexto("Cambian siete");
        setPlayers([...gameManager.state.players]);

        // * Establecer la jugada
        player.state.input = { carta: -1, cantar: -1, cambiarSiete: true };

    }

    function handleCantarReceived(palo) {

        // * Obtener el jugador al que le toca tirar
        let playerIndex = gameManager.state.orden[gameManager.state.turnManager.state.playerTurn];
        let player = gameManager.state.players[playerIndex];

        // * Informamos por pantalla
        let traduccion = ["Bastos", "Copas", "Espadas", "Oros"];
        setInformadorTexto("Cantan " + traduccion[palo]);

        // * El jugador canta del palo correspondiente
        player.cantar(palo) ;

        // * Establecer la jugada
        player.state.input = { carta: -1, cantar: palo, cambiarSiete: false };

    }

    // * ------------------------------------------------------------------------

    function handleInit() {
        navigate("/") ;
    }

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
                            <Online_Player
                                controller={gameManager.state.players[1]}
                                numPlayer={2}
                                cartaJugada={gameManager.state.cartasJugadas[1]}
                            />
                        )}
                        {numJugadores === 4 && (
                            <div className="IAs">
                                <Online_Player
                                    controller={gameManager.state.players[1]}
                                    numPlayer={1}
                                    cartaJugada={gameManager.state.cartasJugadas[1]}
                                />
                                <Online_Player
                                    controller={gameManager.state.players[2]}
                                    numPlayer={2}
                                    cartaJugada={gameManager.state.cartasJugadas[2]}
                                />
                                <Online_Player
                                    controller={gameManager.state.players[3]}
                                    numPlayer={3}
                                    cartaJugada={gameManager.state.cartasJugadas[3]}
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
                        <button className="botonInit" onClick={handleInit}>Volver al inicio</button>
                    </div>
                )}
        </div>
    );
}

export default OnlineGame;