class PlayerBase {
    constructor() {
        this.state = {
            mano: Array(6).fill(null),
            jugada: null,
            puntos: 0,
            ganador: false,
            cantadoEsteTurno: false,
            esMiTurno: false,
            input: { carta: -1, cantar: -1, cambiarSiete: false },
            palosCantados: [false, false, false, false],
        };
    }

    anyadirCarta(carta) {
        if (!carta) return;
        const index = this.state.mano.findIndex((c) => c === null);
        if (index !== -1) {
            this.state.mano[index] = carta;
        }
    }

    cambiarSieteTriunfo(triunfo) {
        const index = this.state.mano.findIndex(
            (c) => c && c.Numero === 7 && c.Palo === triunfo.Palo
        );
        if (index === -1) return;

        this.state.mano[index] = triunfo;
    }

    cantar(palo, triunfo) {
        this.state.puntos += (palo === triunfo.Palo ? 40 : 20);
    }

    reset() {
        this.state.jugada = null;
        this.state.ganador = false;
        this.state.cantadoEsteTurno = false;
        this.state.input = { carta: -1, cantar: -1, cambiarSiete: false };
        this.state.palosCantados = [false, false, false, false];
    }
}

export default PlayerBase;