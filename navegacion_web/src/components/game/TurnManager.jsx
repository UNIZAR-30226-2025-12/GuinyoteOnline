class TurnManager {
    constructor(numPlayers, callBackEvaluar, callBackTurnChange, _players) {
        this.state = {
            playerTurn: -1,
            playerCount: numPlayers,
            players: _players,
            evaluar: callBackEvaluar,
            turnChange: callBackTurnChange,
        };

        this.tick = this.tick.bind(this);
        this.reset = this.reset.bind(this);
    }

    tick() {
        
        let newTurn = this.state.playerTurn + 1;

        

        if (newTurn >= this.state.playerCount) {
            this.reset()
            console.log("TurnManager reset");
            this.state.evaluar();
        }
        else{
            this.state.playerTurn = newTurn;
            console.log("TurnManager turnChange");
            this.state.turnChange();
        }
    }

    reset() {
        this.state.playerTurn = -1;
    }
}

export default TurnManager;