class Carta{
    constructor(_palo, _numero){
        this.palo = _palo;
        this.numero = _numero;
    }
}

class BarajaClass {
    constructor() {
        this.cartas = [];
        this.inicializarBaraja();
        this.barajar();
    }

    inicializarBaraja() {
        this.cartas = [];
        for (let i = 0; i < 40; i++) {
            this.cartas.push(new Carta(i % 4, Math.floor(i / 4)));
        }
    }

    barajar() {
        for (let i = this.cartas.length - 1; i > 0; i--) {
            const index = Math.floor(Math.random() * (i + 1));
            [this.cartas[i], this.cartas[index]] = [this.cartas[index], this.cartas[i]];
        }
    }

    recogerCartas() {
        this.inicializarBaraja();
    }

    darCarta() {
        if (this.cartas.length > 0) {
            return this.cartas.shift(); // Remueve y devuelve la primera carta
        } else {
            console.log("No quedan cartas en la baraja");
            return null;
        }
    }

    anyadirAlFinal(carta) {
        let numero = carta.numero <= 7 ? carta.numero - 1 : carta.numero - 3;
        this.cartas.push({ palo: carta.palo, numero });
    }

    eliminarUltima() {
        if (this.cartas.length > 0) {
            this.cartas.pop();
        }
    }
}

export default BarajaClass;