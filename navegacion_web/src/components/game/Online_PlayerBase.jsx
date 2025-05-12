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

    turnoLogic() {
        console.log("Turno de Jugador" + this.state.numPlayer);

        




        /*while (this.state.exito === false) {
            if (this.state.todasIntentadas) {
                console.log("IA" + this.state.numIA + " todas intentadas");
                this.state.input.carta = this.peorCartaIndex();
                this.state.exito = this.turno();
                return this.state.input.carta;
            }

            if (this.soyPrimero()) {
                if (this.state.gameManager.state.arrastre && !this.state.gameManager.state.segundaBaraja) this.state.input.carta = this.primeraCartaArrastreIndex();
                else if (!this.state.gameManager.state.arrastre && !this.state.gameManager.state.segundaBaraja) { 
                    this.state.input.carta = this.peorCartaIndex();
                }
                else if (this.state.gameManager.state.arrastre) {
                    this.state.input.carta = this.primeraCartaArrastreIndex();
                }
                else this.state.input.carta = this.primeraCartaSegundaBarajaIndex();
            }
            else { //No soy primero (si 2 this.state.gameManager.state.cartasJugadas ultimo)
                if (this.state.gameManager.state.numPlayers == 2) {
                    this.state.input.carta = this.seleccion2Jugadores();
                }
                else this.state.input.carta = this.seleccion4Jugadores();
            }
            this.state.cartasIntentadas[this.state.input.carta] = true;

            this.state.exito = this.turno();
        }*/

        // Verificar si la carta seleccionada es válida
        if (this.state.input.carta < 0 || this.state.input.carta >= this.state.mano.length || this.state.mano[this.state.input.carta] === null) {
            console.error("Carta seleccionada no válida:", this.state.input.carta);
            this.state.input.carta = this.peorCartaIndex();
        }
        
        return this.state.input.carta; 
    }

    // ! No hace falta
    /*seleccion2Jugadores() {
        let jugada = this.state.gameManager.state.cartasJugadas[0];
        let paloTriunfo = this.state.gameManager.state.triunfo.palo;
        let index = 0;
        if (!this.state.gameManager.state.arrastre && !this.state.gameManager.state.segundaBaraja) {
            if (jugada && jugada.puntos >= 10 && jugada.palo != paloTriunfo) {
                return this.puedoMatar(index, jugada) ? index : this.peorCartaIndex();
            }
            else return this.peorCartaIndex();
        }
        else if (this.state.gameManager.state.arrastre && !this.state.gameManager.state.segundaBaraja) {
            return this.peorCartaIndex();
        }
        else //segunda baraja o segunda baraja y arrastre
        {
            let puntosEnMesa = (this.state.gameManager.state.cartasJugadas[this.state.gameManager.state.orden[0]] == null) ? 0 : this.state.gameManager.state.cartasJugadas[this.state.gameManager.state.orden[0]].puntos;
            return this.cartaSegundaBarajaIndex(puntosEnMesa, this.state.gameManager.state.players[0].puntos, this.state.gameManager.state.players[1].puntos);
        }
    }*/

    /*// ! No hace falta
    seleccion4Jugadores() {
        let palo;
        let jugada = this.getCartaJugada(palo);
        let paloTriunfo = this.state.gameManager.state.triunfo.palo;
        let puntosTotales = 0;
        let index = 0;
        for (let i = 0; i < 4; i++) {
            if (this.state.gameManager.state.cartasJugadas[this.state.gameManager.state.orden[i]] == null) break;
            puntosTotales += this.state.gameManager.state.cartasJugadas[this.state.gameManager.state.orden[i]].puntos;
        }

        if (this.state.gameManager.state.cartasJugadas[this.state.gameManager.state.orden[1]] == null) //Voy segundo
        {
            if (this.state.gameManager.state.arrastre) return this.peorCartaIndex();
            else return (this.puedoMatar(index, jugada) && puntosTotales >= 10) ? index : this.peorCartaIndex();
        }
        else if (this.state.gameManager.state.cartasJugadas[this.state.gameManager.state.orden[2]] == null) //Voy tercero
        {
            let cartaEquipo = this.state.gameManager.state.cartasJugadas[this.state.gameManager.state.orden[0]];
            if (cartaEquipo.palo == paloTriunfo && cartaEquipo.puntos == 11) return this.cargarPuntosIndex(); //Baza nuestra, cargar puntos
            else if (this.state.gameManager.state.arrastre) return this.peorCartaIndex();
            else return (this.puedoMatar(index, jugada) && puntosTotales >= 10) ? index : this.peorCartaIndex();
        }
        else //Voy ultimo
        {
            if (!this.state.gameManager.state.arrastre && !this.state.gameManager.state.segundaBaraja) {
                if (jugada == null) return this.cargarPuntosIndex(); //Baza de mi equipo, cargar puntos
                if (puntosTotales >= 10 && jugada.palo != paloTriunfo) {
                    return this.puedoMatar(index, jugada) ? index : this.peorCartaIndex();
                }
                else return this.peorCartaIndex();
            }
            else if (this.state.gameManager.state.arrastre && !this.state.gameManager.state.segundaBaraja) {
                return this.peorCartaIndex();
            }
            else //segunda baraja o segunda baraja y arrastre
            {
                let puntosEquipo1 = 0, puntosEquipo2 = 0;
                let equipo1 = false;
                
                equipo1 = (this.state.numIA === 2);
                puntosEquipo1 = this.state.gameManager.state.players[0].puntos + this.state.gameManager.state.players[2].puntos;
                puntosEquipo2 = this.state.gameManager.state.players[1].puntos + this.state.gameManager.state.players[3].puntos;

                let puntosRival = equipo1 ? puntosEquipo2 : puntosEquipo1;
                let misPuntos = equipo1 ? puntosEquipo1 : puntosEquipo2;
                return this.cartaSegundaBarajaIndex(puntosTotales, puntosRival, misPuntos);
            }
        }
    }*/

    soyPrimero() {
        return this.state.gameManager.state.orden[0] === (this.state.numPlayer);
    }

    //Devuelve el índice en la mano de la carta a jugar cuando la partida va por la segunda baraja
    /*// !  cartaSegundaBarajaIndex(puntosJugados, puntosRival, misPuntos) {
        let paloCantar;
        let palo;
        let index = 0;
        let paloTriunfo = this.state.gameManager.state.triunfo.palo;

        if (this.puedoMatar(index, this.getCartaJugada(palo))) {
            if (puntosJugados >= 10) return index;
            else if (puntosRival + puntosJugados >= 101) {
                index = this.peorCartaIndex();

                if (puntosRival + puntosJugados + this.state.mano[index].puntos < 101) return index;
                else {
                    for (let i = 0; i < 6; i++) {
                        if (this.state.mano[i] == null) continue;
                        if (puntosRival + puntosJugados + this.state.mano[i].puntos < 101) return i;
                    }
                }
                return index;
            }
            else if (misPuntos + puntosJugados + mano[index].Puntos >= 101) return index;
            else if (this.puedoCantarIA(paloCantar)) {
                if (((paloCantar == paloTriunfo && misPuntos + 40 + this.state.mano[index].puntos + puntosJugados >= 101) ||
                    (paloCantar != paloTriunfo && misPuntos + 20 + this.state.mano[index].puntos + puntosJugados >= 101)) &&
                    !(this.state.mano[index].palo == paloCantar && (this.state.mano[index].numero == 10 || this.state.mano[index].numero == 12))) {
                    return index;
                }
                else return this.peorCartaIndex();
            }
            else return this.peorCartaIndex();
        }
        else return this.peorCartaIndex();
    }*/

    //Devuelve el indice de la carta menos valiosa en la mano de la IA
    /*// ! No hace falta
    peorCartaIndex() {
        let index = 0;
        while (this.state.mano[index] == null) {
            index++;
        }
        let menorValor = 10000; //Valor maximo de carta
        let paloTriunfo = this.state.gameManager.state.triunfo.palo;
        let reyes = [false, false, false, false];
        let sotas = [false, false, false, false];
        let cantables = [false, false, false, false];

        for (let i = 0; i < 6; i++) //Guardar reyes y sotas de la mano
        {
            if (this.state.mano[i] == null) continue;
            if (this.state.mano[i].numero == 10) sotas[this.state.mano[i].palo] = true;
            if (this.state.mano[i].numero == 12) reyes[this.state.mano[i].palo] = true;
        }
        for (let i = 0; i < 4; i++) //Guardar los palos que se podríamos cantar
        {
            if (sotas[i] && reyes[i] && !palosCantados[i]) cantables[i] = true;
        }

        for (let i = 0; i < 6; i++) {
            if (this.state.mano[i] == null || (this.state.cartasIntentadas[i] && !this.state.todasIntentadas)) continue;

            let valor = (this.state.mano[i].palo == paloTriunfo) ? this.state.mano[i].puntos + 11 : this.state.mano[i].puntos;
            if (cantables[this.state.mano[i].palo] && (this.state.mano[i].numero == 10 || this.state.mano[i].numero == 12)) valor += 20;

            if (valor < menorValor) {
                menorValor = valor;
                index = i;
            }
            else if (valor == menorValor) {
                if ((this.state.mano[index].palo == paloTriunfo && //Había elegido triunfo
                    ((this.state.mano[i].palo == paloTriunfo && this.state.mano[i].numero < this.state.mano[index].numero) || //Tengo otro triunfo peor
                        (this.state.mano[i].palo != paloTriunfo))) ||  //Tengo otro no triunfo
                    (this.state.mano[index].palo != paloTriunfo && this.state.mano[i].palo != paloTriunfo && this.state.mano[i].numero < this.state.mano[index].numero)) //Había elegido un no triunfo pero tengo otro peor
                {
                    index = i;
                }
            }
        }
        return index;
    }*/

    /*
     * Devuelve el índice de la carta con mayor puntuacion que no es triunfo
     * de la mano, o la carta con mayor puntuación que no sea el as de triunfo
     * si solo hay triunfos en la mano. Evita elegir cartas con las que se
     * pueda cantar si es posible.
     */
    /*// ! No hace falta
    cargarPuntosIndex() {
        let index = 0;
        const paloTriunfo = this.state.gameManager.state.triunfo.palo;
        while (this.state.mano[index] === null) index++;
        let soloTriunfos = true;
        const reyes = [false, false, false, false];
        const sotas = [false, false, false, false];
        const cantables = [false, false, false, false];

        for (let i = 0; i < 6; i++) {
            if (this.state.mano[i] === null) continue;

            if (this.state.mano[i].palo !== paloTriunfo && !(this.state.cartasIntentadas[i] && !this.state.todasIntentadas)) soloTriunfos = false;
            if (this.state.mano[i].numero === 10) sotas[this.state.mano[i].palo] = true;
            if (this.state.mano[i].numero === 12) reyes[this.state.mano[i].palo] = true;
        }

        for (let i = 0; i < 4; i++) {
            if (sotas[i] && reyes[i] && !this.state.palosCantados[i]) cantables[i] = true;
        }

        for (let i = index + 1; i < 6; i++) {
            if (this.state.mano[i] === null || (this.state.cartasIntentadas[i] && !this.state.todasIntentadas)) continue;

            if (!soloTriunfos) {
                if ((this.state.mano[index].puntos <= this.state.mano[i].puntos && this.state.mano[i].palo !== paloTriunfo) &&
                    !((this.state.mano[i].numero === 12 || this.state.mano[i].numero === 10) && cantables[this.state.mano[i].palo])) {
                    index = i;
                }
            } else {
                if (this.state.mano[i].numero === 1) continue;

                if (this.state.mano[i].puntos > this.state.mano[index].puntos &&
                    ((this.state.mano[i].numero === 12 || this.state.mano[i].numero === 10) && cantables[this.state.mano[i].palo])) {
                    index = i;
                }
            }
        }
        return index;
    }*/

    /*
     * Devuelve el índice de la carta con mayor puntuación que no es triunfo
     * de la mano, o la carta con la menor puntuación que obligaría a gastar
     * el mayor triunfo posible (a no ser que esa carta sea el as o el 3 de
     * triunfo) si solo hay triunfos en la mano. Evita elegir cartas con las
     * que se pueda cantar si es posible.
     */

    /*// ! No hace falta
    primeraCartaArrastreIndex() {
        let index = 0;
        const paloTriunfo = this.state.gameManager.state.triunfo.palo;
        while (this.state.mano[index] === null) index++;
        let soloTriunfos = true;
        const reyes = [false, false, false, false];
        const sotas = [false, false, false, false];
        const cantables = [false, false, false, false];

        for (let i = 0; i < 6; i++) {
            if (this.state.mano[i] === null) continue;

            if (this.state.mano[i].palo !== paloTriunfo) soloTriunfos = false;
            if (this.state.mano[i].numero === 10) sotas[this.state.mano[i].palo] = true;
            if (this.state.mano[i].numero === 12) reyes[this.state.mano[i].palo] = true;
        }

        for (let i = 0; i < 4; i++) {
            if (sotas[i] && reyes[i] && !this.state.palosCantados[i]) cantables[i] = true;
        }

        for (let i = index + 1; i < 6; i++) {
            if (this.state.mano[i] === null) continue;

            if (!soloTriunfos) {
                if ((this.state.mano[index].puntos <= this.state.mano[i].puntos && this.state.mano[i].palo !== paloTriunfo) &&
                    !((this.state.mano[i].numero === 12 || this.state.mano[i].numero === 10) && cantables[this.state.mano[i].palo])) {
                    index = i;
                }
            } else {
                if (this.state.mano[i].numero === 1 || this.state.mano[i].numero === 3) continue;

                if (this.state.mano[index].puntos === 0) {
                    if ((this.state.mano[i].puntos === 0 && this.state.mano[i].numero !== 7 && this.state.mano[i].numero > this.state.mano[index].numero + 1) ||
                        (this.state.mano[i].numero === 7 && this.state.mano[i].puntos >= 3) && !cantables[this.state.mano[i].palo]) {
                        index = i;
                    }
                } else if (this.state.mano[index].puntos === 2 && this.state.mano[i].puntos === 4 && !cantables[this.state.mano[i].palo]) index = i;
            }
        }
        return index;
    }*/

    //Devuelve la carta que se usará si la CPU sale primera durante la segunda baraja
    /*// ! No hace falta
    primeraCartaSegundaBarajaIndex() {
        let index = 0;
        const paloTriunfo = this.state.gameManager.state.triunfo.palo;
        while (this.state.mano[index] === null) index++;
        const reyes = [false, false, false, false];
        const sotas = [false, false, false, false];
        const cantables = [false, false, false, false];

        for (let i = 0; i < 6; i++) {
            if (this.state.mano[i] === null) continue;

            if (this.state.mano[i].numero === 10) sotas[this.state.mano[i].palo] = true;
            if (this.state.mano[i].numero === 12) reyes[this.state.mano[i].palo] = true;
        }

        for (let i = 0; i < 4; i++) {
            if (sotas[i] && reyes[i] && !this.state.palosCantados[i]) cantables[i] = true;
        }

        for (let i = 0; i < 6; i++) {
            if (this.state.mano[i] === null) continue;

            if (this.state.mano[i].palo === paloTriunfo && this.state.mano[i].numero === 1) return i;
        }

        return this.peorCartaIndex();
    }*/

    /* 
         * "jugada" es la carta que va ganando la baza, null si es de mi compañero.
         * Devuelve el índice en la mano de la carta que se considera mejor para
         * ganar la baza si "jugada" no es null y hay alguna carta que pueda ganarla.
         * Si jugada es null o no hay ninguna carta que pueda ganar la baza, devuelve
         * false.
         */
    
    /*// ! No hace falta
    puedoMatar(index, jugada) {
        if (jugada === null) return false;

        let puntosASuperar = jugada.puntos;
        let esPosible = false;
        if (jugada.palo !== this.state.gameManager.state.triunfo.palo) {
            for (let i = 0; i < this.state.mano.length; i++) {
                if (this.state.mano[i] === null || this.state.mano[i].palo === this.state.gameManager.state.triunfo.palo) continue;

                if (!this.state.cartasIntentadas[i]) {
                    if (this.state.mano[i].puntos > puntosASuperar && this.state.mano[i].palo === jugada.palo) {
                        index = i;
                        puntosASuperar = this.state.mano[i].puntos;
                        esPosible = true;
                    }
                }
            }
            if (esPosible) return true;
        }

        for (let i = 0; i < this.state.mano.length; i++) {
            if (this.state.mano[i] === null || this.state.mano[i].palo !== this.state.gameManager.state.triunfo.palo) continue;

            if (!this.state.cartasIntentadas[i]) {
                if (jugada.palo === this.state.gameManager.state.triunfo.palo && this.state.mano[i].puntos > puntosASuperar) {
                    index = i;
                    puntosASuperar = this.state.mano[i].puntos;
                    return true;
                } else if (jugada.palo !== this.state.gameManager.state.triunfo.palo && this.state.mano[i].puntos <= puntosASuperar) {
                    index = i;
                    puntosASuperar = this.state.mano[i].puntos;
                    esPosible = true;
                }
            }
        }

        return esPosible;
    }*/

    /*
     * Devuelve true si es posible cantar, y false en caso
     * contrario. Además, si ha sido posible cantar realiza
     * las acciones del turno (definidas en "turno()" de la 
     * clase Player).
     */
    /*// ! No hace falta
    intentarCantar() {
        for(let i = 0; i < 4; i++) {
            if (this.state.sePuedeCantar[i]) {
                console.log("IA PUEDE CANTAR");
                this.cantar(i);
                this.state.paloCantadoEsteTurno = i;
                return;
            }
        }
    }*/

    /*
     * Devuelve true si es posible cambiar el 7 de triunfo por
     * la carta de triunfo de la baraja, y false en caso
     * contrario. Además, si ha sido posible cambiarlo realiza
     * las acciones del turno (definidas en "turno()" de la 
     * clase Player).
     */
    /*// ! No hace falta
    intentarCambiarSiete() {
        if (!this.state.ganador || this.state.gameManager.state.triunfo.puntos === 0 || this.state.gameManager.state.arrastre) return false;

        for (let c of this.state.mano) {
            if (c === null) continue;
            console.log(c.numero);
            if (c.numero === 6 && c.palo === this.state.gameManager.state.triunfo.palo) {
                this.state.sieteCambiado = true;
                return;
            }
        }
    }*/
}
export default Online_PlayerBase;