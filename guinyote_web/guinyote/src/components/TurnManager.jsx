class TurnManager {
    constructor(numPlayers, callBackEvaluar) {
        this.state = {
            playerTurn: -1,
            playerCount: numPlayers,
            evaluar: callBackEvaluar,
        };
    }

    tick() {
        let newTurn = this.state.playerTurn + 1;
        if (newTurn >= this.state.playerCount) {
            this.state.evaluar();
        }
        else{
            this.state.playerTurn = newTurn;
        }
    }

    reset() {
        this.state.playerTurn = -1;
    }
}

export default TurnManager;