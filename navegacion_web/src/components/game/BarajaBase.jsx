class Carta{
    constructor(_palo, _numero){
        this.palo = _palo;
        this.numero = _numero;
        this.puntos = this.calcularPuntos(_numero);
    }

    calcularPuntos = (numero) => {
        let numeroReal = numero < 7 ? numero + 1 : numero + 3;
        switch (numeroReal) {
          case 1: return 11;
          case 3: return 10;
          case 12: return 4;
          case 10: return 3;
          case 11: return 2;
          default: return 0;
        }
      };
}


class BarajaBase {
    constructor() {
        this.cartas = [];
        this.inicializarBaraja();
        //this.barajar();
    }

    inicializarBaraja() {
        this.cartas = [];
        /*for (let i = 0; i < 40; i++) {
            this.cartas.push(new Carta(i % 4, Math.floor(i / 4)));

        }*/
       
       this.cartas = [
            new Carta(0, 7), new Carta(1, 7), new Carta(2, 7), new Carta(3, 7),
            new Carta(0, 9), new Carta(1, 9),new Carta(2, 9), new Carta(3, 9),
            new Carta(0, 7), new Carta(1, 7), new Carta(2, 7), new Carta(3, 7),
            new Carta(0, 9), new Carta(1, 9),new Carta(2, 9), new Carta(3, 9),
            new Carta(0, 7), new Carta(1, 7), new Carta(2, 7), new Carta(3, 7),
            new Carta(0, 9), new Carta(1, 9),new Carta(2, 9), new Carta(3, 9),
            new Carta(0, 7), new Carta(1, 7), new Carta(2, 7), new Carta(3, 7),
            new Carta(0, 9), new Carta(1, 9),new Carta(2, 9), new Carta(3, 9)
        ];
        
       /*this.cartas = [
        new Carta(0, 7), new Carta(0, 6), new Carta(2, 6), new Carta(3 ,6),
        new Carta(0, 6), new Carta(1, 6),new Carta(2, 6), new Carta(3, 6),
        new Carta(0, 6), new Carta(1, 6), new Carta(2, 6), new Carta(3 ,6),
        new Carta(0, 6), new Carta(1, 6),new Carta(2, 6), new Carta(3, 6),
        new Carta(0, 6), new Carta(1, 6), new Carta(2, 6), new Carta(3 ,6),
        new Carta(0, 6), new Carta(1, 6),new Carta(2, 6), new Carta(3, 6),
        new Carta(0, 7), new Carta(1, 7), new Carta(2, 7), new Carta(3, 7),
        new Carta(0, 9), new Carta(1, 9),new Carta(2, 9), new Carta(3, 9)
       ];*/
    }

    crearBaraja(arrayCartas) {
        this.cartas = [];
        for (let i = 0; i < arrayCartas.length; i++) {
            this.cartas.push(new Carta(arrayCartas[i].palo, arrayCartas[i].numero));
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
        carta.puntos = carta.calcularPuntos(carta.numero);
        this.cartas.push(carta);
    }

    eliminarUltima() {
        if (this.cartas.length > 0) {
            this.cartas.pop();
        }
    }
}

export default BarajaBase;