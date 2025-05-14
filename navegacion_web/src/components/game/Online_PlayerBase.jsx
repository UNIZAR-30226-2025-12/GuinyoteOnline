import PlayerBase from "./PlayerBase";


class Online_PlayerBase extends PlayerBase {
    constructor(_numPlayers, gameManager, _numPlayer) {
        super(gameManager);
        this.state = {
            ...this.state, // Heredar el estado de PlayerBase
            numPlayers: _numPlayers,                // * Necesario
            numPlayer: _numPlayer,                  // * Necesario
            cartasIntentadas: Array(6).fill(false), // ! es necesario ????
            exito: false,                           // ! es necesario ????
            todasIntentadas: false,                 // ! es necesario ????
        };
    }

}
export default Online_PlayerBase;