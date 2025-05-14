/**
 * GameManager class
 * - Manages the game state and logic for a IA game.
 * 
 */

import TurnManager from "./TurnManager";
import PlayerBase from "./PlayerBase";
import Online_PlayerBase from "./Online_PlayerBase";
import IA_PlayerBase from "./IA_PlayerBase";
import BarajaClass from "./BarajaBase";

class GameManager {
    constructor(_numPlayers, esOnline) {
        this.state = {
            turnManager: null,
            players: Array(_numPlayers).fill(null),
            orden: Array(_numPlayers).fill(null),
            puntosJugadores: Array(_numPlayers).fill(0),
            numPlayers: _numPlayers,
            esOnline: esOnline,
            baraja: null,
            cartasJugadas: Array(_numPlayers).fill(null),
            triunfo: null,
            ganador: null,
            segundaBaraja: false,
            arrastre: false,
            finRonda: false,
            finJuego: false,
            myIndex: null,
            enviarFinPartida: null,
            enviarFinRonda: null
        };

        this.Evaluar = this.Evaluar.bind(this);
        this.TurnChange = this.TurnChange.bind(this);
    }

    Init(arrayDeCartas, primero, index, enviarFinRonda, enviarFinPartida) {

        this.state.enviarFinPartida = enviarFinPartida;
        this.state.enviarFinRonda = enviarFinRonda;

        this.state.arrastre = false;
        this.state.segundaBaraja = false;
        this.state.finRonda = false;
        this.state.finJuego = false;

        // * -------------------------- INICIAR BARAJA ----------------------------
        console.log("------------------------- INICIALIZACIÓN BARAJA ------------------------")
        if (this.state.esOnline) {
            this.state.baraja = new BarajaClass(arrayDeCartas) ;
        } else {
            this.state.baraja = new BarajaClass() ;
            this.state.baraja.barajar();
        }
        console.log("------------------- FINALIZADA INICIALIZACIÓN BARAJA -------------------")
        // * ----------------------------------------------------------------------


        // * -------------------------- INICIAR ORDEN ----------------------------
        console.log("------------------------- INICIALIZACIÓN ORDEN ------------------------")
        for (let i = 0; i < this.state.numPlayers; i++) {
            this.state.orden[i] = (primero + i - index + this.state.numPlayers) % this.state.numPlayers;
        }
        console.log("------------------- FINALIZADA INICIALIZACIÓN ORDEN -------------------")

        console.log(this.state.orden);
        // * ----------------------------------------------------------------------

        // * ----------- Calcular el triunfo antes de iniciar la partida ----------
        this.state.triunfo = this.state.baraja.cartas[this.state.numPlayers * 6];
        // * ----------------------------------------------------------------------

        this.InitJugadores(index);
        
        this.state.triunfo = this.state.baraja.darCarta();
        this.state.baraja.anyadirAlFinal(this.state.triunfo);
            
        this.state.turnManager = new TurnManager(this.state.numPlayers, this.Evaluar, this.TurnChange, this.state.players);
        this.state.turnManager.reset();

        this.state.turnManager.tick(); 

    }

    InitJugadores(index) {

        this.state.myIndex = index ;
        console.log("------------------------- INICIALIZACIÓN JUGADORES ------------------------")

        let auxIndex = index;

        if (this.state.esOnline && index != null) {

            // * Si es online y recibimos el index del server inicializamos los jugadores
            // * El jugador 0 es el local y el resto son online
            this.state.players[0] = new PlayerBase(this);
            
            // * Estos usuarios se inicializan dependiendo del número de jugadores
            // * Cada jugador se inicializa a partir del index recibido
            for (let i = 1; i < this.state.numPlayers; i++) {
                auxIndex = (auxIndex + i) % this.state.numPlayers;
                this.state.players[i] = new Online_PlayerBase(this.state.numPlayers, this, auxIndex);

            }

            // * Aquí se inicializan las manos de los jugadores
            // * en función del orden
            for (let i = 0; i < this.state.numPlayers; i++) {
                for (let j = 0; j < 6; j++) {
                    this.state.players[this.state.orden[i]].anyadirCarta(this.state.baraja.darCarta());
                }
            }   

        }
        else {
            this.state.players[0] = new PlayerBase(this);
            for (let j = 0; j < 6; j++) {
                this.state.players[0].anyadirCarta(this.state.baraja.darCarta());
            }
            if (this.state.numPlayers === 2) {
                this.state.players[1] = new IA_PlayerBase(this.state.numPlayers, this, 1);
                for (let j = 0; j < 6; j++) {
                    this.state.players[1].anyadirCarta(this.state.baraja.darCarta());
                }
            } else if (this.state.numPlayers === 4) {
                this.state.players[1] = new IA_PlayerBase(this.state.numPlayers, this, 1);
                for (let j = 0; j < 6; j++) {
                    this.state.players[1].anyadirCarta(this.state.baraja.darCarta());
                }
                this.state.players[2] = new IA_PlayerBase(this.state.numPlayers, this, 2);
                for (let j = 0; j < 6; j++) {
                    this.state.players[2].anyadirCarta(this.state.baraja.darCarta());
                }
                this.state.players[3] = new IA_PlayerBase(this.state.numPlayers, this, 3);
                for (let j = 0; j < 6; j++) {
                    this.state.players[3].anyadirCarta(this.state.baraja.darCarta());
                }
            }
        }

        console.log("------------------- FINALIZADA INICIALIZACIÓN JUGADORES -------------------")
    }

    TurnChange() {
        this.state.players[this.state.orden[this.state.turnManager.state.playerTurn]].state.esMiTurno = true;
    }

    Evaluar() {

        this.evaluarLogic();
        // * Reseteo las cartas jugadas
        this.state.cartasJugadas = Array(this.state.numPlayers).fill(null);
        // * Paso al siguiente turno
        this.state.turnManager.tick();
        // * 
    }

    evaluarLogic() {
        let indexGanador = this.state.orden[0];
        let maxPuntos = this.state.cartasJugadas[this.state.orden[0]].puntos;

        let sumaPuntos = this.state.cartasJugadas[this.state.orden[0]].puntos;
        let boolTriunfo = (this.state.cartasJugadas[this.state.orden[0]].palo === this.state.triunfo.palo);
        let paloJugado = this.state.cartasJugadas[this.state.orden[0]].palo;

        for (let i = 1; i < this.state.numPlayers; i++) {
            let aux = this.state.cartasJugadas[this.state.orden[i]].puntos;
            sumaPuntos += aux;
            if (boolTriunfo) {
                if (this.state.cartasJugadas[this.state.orden[i]].palo === this.state.triunfo.palo) {
                    if (aux > maxPuntos) {
                        maxPuntos = aux;
                        indexGanador = this.state.orden[i];
                    } else if (aux === maxPuntos && this.state.cartasJugadas[this.state.orden[i]].numero > this.state.cartasJugadas[indexGanador].numero) {
                        indexGanador = this.state.orden[i];
                    }
                }
            } else {
                if (this.state.cartasJugadas[this.state.orden[i]].palo === this.state.triunfo.palo) {
                    boolTriunfo = true;
                    maxPuntos = aux;
                    indexGanador = this.state.orden[i];
                } else if (this.state.cartasJugadas[this.state.orden[i]].palo === paloJugado) {
                    if (aux > maxPuntos) {
                        maxPuntos = aux;
                        indexGanador = this.state.orden[i];
                    } else if (aux === maxPuntos && this.state.cartasJugadas[this.state.orden[i]].numero > this.state.cartasJugadas[indexGanador].numero) {
                        indexGanador = this.state.orden[i];
                    }
                }
            }
        }

        // FINALIZACION DE TURNO
        this.state.players[indexGanador].state.ganador = true;
        this.state.players[(indexGanador + 1) % this.state.numPlayers].state.ganador = false;

        if (this.state.numPlayers === 4) {
            this.state.players[(indexGanador + 3) % 4].state.ganador = false;
            this.state.players[(indexGanador + 2) % 4].state.ganador = true;
        }

        this.state.players[indexGanador].state.puntos += sumaPuntos;

        for (let i = 0; i < this.state.numPlayers; i++) {
            this.state.orden[i] = (i + indexGanador) % this.state.numPlayers;
        }

        this.state.indexGanador = indexGanador;

        for (let i = 0; i < this.state.numPlayers; i++) {
            this.state.players[this.state.orden[i]].anyadirCarta(this.state.baraja.darCarta());
        }

        // COMPROBAR SI HA ACABADO LA RONDA
        this.state.finRonda = true;
        for (let i of this.state.players[0].state.mano) {
            if (i != null) {
                this.state.finRonda = false;
                break;
            }
        }

        if (this.state.finRonda) {
            this.state.players[this.state.orden[0]].state.puntos += 10;
            // * Verificamos el fin de ronda o partida
            this.terminarRonda();
            
            if(this.state.segundaBaraja) {
                // * Si es fin de ronda
                if (!this.state.esOnline) {
                    // * Si es offline, barajamos y reportimos
                    this.barajarYRepartir(null);
                } else {
                    // * Si es online, 
                    // * Si el servidor me asigno miId 0, enviarFinRonda()
                    if (this.state.myIndex === 0) {

                        this.state.enviarFinRonda() ;
                    }
                }
            }
            return;
        } // 10 ultimas

        if (!this.state.segundaBaraja) return;
        if (this.state.numPlayers === 4) {
            if (this.state.players[0].state.puntos + this.state.players[2].state.puntos > 100) {
                this.state.ganador = 1;
                this.state.finJuego = true;
            }
            if (this.state.players[1].state.puntos + this.state.players[3].state.puntos > 100) {
                this.state.ganador = 2;
                this.state.finJuego = true;
            }
        } else {
            if (this.state.players[0].state.puntos > 100) {
                this.state.ganador = 1;
                this.state.finJuego = true;
            }
            if (this.state.players[1].state.puntos > 100) {
                this.state.ganador = 2;
                this.state.finJuego = true;
            }
        }
        if(this.state.finJuego && this.state.esOnline && this.state.myIndex === 0) {

            this.state.enviarFinPartida(this) ;

        }

    }

    terminarRonda() {
        console.log("==============================");
        console.log("Pasamos a segunda baraja");
        console.log("==============================");
        this.state.segundaBaraja = false;
        if (this.state.numPlayers == 4) {
            if (this.state.players[0].state.puntos + this.state.players[2].state.puntos > 100) this.state.ganador = 1;
            else if (this.state.players[1].state.puntos + this.state.players[3].state.puntos > 100) this.state.ganador = 2;
            else this.state.segundaBaraja = true;
        }
        else {
            if (this.state.players[0].state.puntos > 100) this.state.ganador = 1;
            else if (this.state.players[1].state.puntos > 100) this.state.ganador = 2;
            else {this.state.segundaBaraja = true; console.log("Segunda baraja");}
        }
        this.state.finRonda = false ;
        this.state.finJuego = !this.state.segundaBaraja ;

        if(this.state.finJuego && this.state.esOnline && this.state.myIndex === 0) {

            this.state.enviarFinPartida(this) ;

        }
    }

    barajarYRepartir(arrayDeCartas) {
        console.log("==============================");
        console.log("Reparto segunda baraja");
        console.log("==============================");
        this.state.arrastre = false;

        if (arrayDeCartas === null) {        
            this.state.baraja.recogerCartas();
            this.state.baraja.barajar();
        } else {
            this.state.baraja.crearBaraja(arrayDeCartas);
        }

        // * -------------------------- INICIAR ORDEN ----------------------------
        
        for (let i = 0; i < this.state.numPlayers; i++) {
            this.state.orden[i] = ( i + this.state.indexGanador) % this.state.numPlayers;
        }

        // * ----------------------------------------------------------------------

        console.log("numPlayers", this.state.numPlayers) ;

        console.log(this.state.orden);

        console.log(this.state.players);

        for (let i = 0; i < this.state.numPlayers; i++)
        {
            for (let j = 0; j < 6; j++)
            {
                console.log("Añadiendo carta ", j) ;
                this.state.players[this.state.orden[i]].anyadirCarta(this.state.baraja.darCarta());
            }
            this.state.players[this.state.orden[i]].reset();
        }

        this.state.triunfo = this.state.baraja.darCarta();
        this.state.baraja.anyadirAlFinal(this.state.triunfo);

        this.state.turnManager.reset();


        this.state.orden = Array(this.state.numPlayers).fill(null);
        for (let i = 0; i < this.state.numPlayers; i++)
        {
            this.state.orden[i] = i;
        }
    }

    setTriunfo(newTriunfo) {
        this.state.triunfo = newTriunfo;
    }
}

export default GameManager;