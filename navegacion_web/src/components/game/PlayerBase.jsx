class PlayerBase {
    constructor(GManager) {
        this.state = {
            mano: Array(6).fill(null),
            jugada: null,
            puntos: 0,
            ganador: false,
            cantadoEsteTurno: false,
            esMiTurno: false,
            input: { carta: -1, cantar: -1, cambiarSiete: false },
            palosCantados: [false, false, false, false],
            sePuedeCantar: [false, false, false, false],
            sePuedeCambiarSiete: false,
            sieteCambiado: false,
            gameManager: GManager,
        };
    }

    anyadirCarta(carta) {
        if (!carta) return;
        const index = this.state.mano.findIndex((c) => c === null);
        if (index !== -1) {
            this.state.mano[index] = carta;
        }
        this.comprobarCantar(carta);
    }

    comprobarCantar(carta) {
        let hayRey;
        let haySota;
        for (let i = 0; i < 4; i++) {
            if(this.state.sePuedeCantar[i] || this.state.palosCantados[i]) {
                continue; 
            }
            hayRey = false;
            haySota = false;
            for (var c of this.state.mano) {
                if (c === null) continue;
                if (c.numero === 7 && c.palo === i) haySota = true;
                if (c.numero === 9 && c.palo === i) hayRey = true;
            }
            if (hayRey && haySota) {
                this.state.sePuedeCantar[i] = true; //CANTABLE
            }
        }

        if(this.state.sePuedeCambiarSiete || this.state.sieteCambiado) return;
        if (carta.numero === 6 && carta.palo === this.state.gameManager.state.triunfo.palo) this.state.sePuedeCambiarSiete = true;
    }

    cambiarSieteTriunfo() {
        const index = this.state.mano.findIndex(
            (c) => c && c.numero === 6 && c.palo === this.state.gameManager.state.triunfo.palo
        );
        if (index === -1) {console.log("Error cambiar siete invocado cuando no se puede cambiar"); return;}

        const triunfoAux = this.state.gameManager.state.triunfo;

        this.state.gameManager.setTriunfo(this.state.mano[index]);
        this.state.mano[index] = triunfoAux;
        this.state.sePuedeCambiarSiete = false;
        this.state.sieteCambiado = true;
    }

    cantar(palo) {
        this.state.puntos += (palo === this.state.gameManager.state.triunfo.Palo ? 40 : 20);
        this.state.palosCantados[palo] = true;
        this.state.sePuedeCantar[palo] = false;
    }

    reset() {
        this.state.jugada = null;
        this.state.ganador = false;
        this.state.cantadoEsteTurno = false;
        this.state.input = { carta: -1, cantar: -1, cambiarSiete: false };
        this.state.palosCantados = [false, false, false, false];
    }

    cartaValidaEnArrastre() {
        let paloJugado = -1;
        let pri = this.getCartaJugada(paloJugado);
        if (pri == null && paloJugado == -1) {
            console.log("Soy el primero, puedo jugar cualquier carta");
            return true;
        } //NO HAY CARTA, SOY EL PRIMERO
        if (this.state.mano[this.state.input.carta] == null) {
            console.log("Carta no válida, no hay carta");
            return false;
        }//INTENTO DE JUGAR CARTA QUE NO EXISTE

        let cartaValida = true;
        if (this.state.mano[this.state.input.carta].palo == paloJugado) {
            if (pri != null) //SI ES NULL LA CARTA ES DE MI COMPAÑERO Y NO HAY QUE MATAR
            {
                if (this.state.mano[this.state.input.carta].puntos < pri.puntos || (this.state.mano[this.state.input.carta].puntos == pri.puntos && this.state.mano[this.state.input.carta].numero < pri.numero)) {
                    //MI CARTA NO MATA, BUSCAR CARTA QUE MATE
                    for (let i = 0; i < this.state.mano.length; i++) {
                        const c = this.state.mano[i];
                        if (c != null && c.palo == paloJugado && (c.puntos > pri.puntos || (c.puntos == pri.puntos && c.numero > pri.numero))) {
                            cartaValida = false; //HAY UNA CARTA QUE MATA, NO PUEDO JUGAR ESTA
                            break;
                        }
                    }
                }
            }
        }
        else if (this.state.mano[this.state.input.carta].palo != paloJugado && this.state.mano[this.state.input.carta].palo == this.state.gameManager.state.triunfo.palo) {
            if (pri == null) //NO HACE FALTA MATAR
            {
                //BUSCAR UNA CARTA DEL MISMO PALO QUE EL JUGADO
                for (let i = 0; i < this.state.mano.length; i++) {
                    const c = this.state.mano[i];
                    if (c != null && c.palo == paloJugado) {
                        cartaValida = false;
                        break;
                    }
                }
            }
            else //HAY QUE MATAR SI SE PUEDE
            {
                //BUSCAR CARTA DE MISMO PALO QUE EL JUGADO, O UNA CARTA DE TRIUNFO QUE MATARIA CUANDO LA QUE HE ELEGIDO NO MATA
                for (let i = 0; i < this.state.mano.length; i++) {
                    const c = this.state.mano[i];
                    if (c == null) {
                        continue; //SI COMPRUEBO != NULL EN EL IF DE ABAJO NO SE EJECUTA ANTES DE SEGUIR CON LAS COMPROBACIONES
                    }

                    if (c.palo == paloJugado || //HAY OTRA CARTA DEL MISMO PALO
                        (c.palo != paloJugado && pri.palo == this.state.gameManager.state.triunfo.palo && c.palo == this.state.gameManager.state.triunfo.palo && //HAN JUGADO TRIUNFO Y LA CARTA ENCONTRADA ES TRIUNFO
                            (this.state.mano[this.state.input.carta].puntos < pri.puntos || (this.state.mano[this.state.input.carta].puntos == pri.puntos && this.state.mano[this.state.input.carta].numero < pri.numero)) && //TRIUNFO ELEGIDO NO MATA
                            (c.puntos > pri.puntos || (c.puntos == pri.puntos && c.numero > pri.numero)))) //TRIUNFO ENCONTRADO MATARIA
                    {
                        cartaValida = false;
                        break;
                    }
                }
            }
        }
        else if (this.state.mano[this.state.input.carta].palo != paloJugado && this.state.mano[this.state.input.carta].palo != this.state.gameManager.state.triunfo.palo) {
            if (pri == null) //NO HACE FALTA MATAR, PUEDO TIRAR CUALQUIER COSA SI NO TIENE MISMO PALO
            {
                for (let i = 0; i < this.state.mano.length; i++) {
                    const c = this.state.mano[i];
                    if (c != null && c.palo == paloJugado) {
                        cartaValida = false;
                        break;
                    }
                }
            }
            else //HACE FALTA MATAR SI ES POSIBLE
            {
                for (let i = 0; i < this.state.mano.length; i++) {
                    const c = this.state.mano[i];
                    if (c != null && (c.palo == paloJugado || c.palo == this.state.gameManager.state.triunfo.palo)) {
                        cartaValida = false;
                        break;
                    }
                }
            }
        }
        return cartaValida;
    }

    turno() {
        if (this.state.input.carta > -1 && this.state.input.carta < 6 && this.state.gameManager.state.arrastre) {
            if (!this.cartaValidaEnArrastre()) {
                return false;
            }
        }
        /*else if (this.state.input.cambiarSiete) {
            if (this.state.ganador && !this.state.gameManager.state.arrastre){

            }
        }
        else if (this.state.input.cantar > -1 && this.state.input.cantar < 4) {
            if (this.state.ganador && !this.state.cantadoEsteTurno && !this.state.palosCantados[this.state.input.cantar]) {
                let hayRey = false;
                let haySota = false;
                for (let i = 0; i < this.state.mano.length; i++) {
                    const c = this.state.mano[i];
                    if (c == null) continue;

                    if (c.numero == 10 && c.palo == this.state.input.cantar) haySota = true;
                    if (c.numero == 12 && c.palo == this.state.input.cantar) hayRey = true;
                }
                if (hayRey && haySota) {
                    this.cantar(this.state.input.cantar);
                    this.state.palosCantados[this.state.input.cantar] = true;
                    this.state.cantadoEsteTurno = true;
                }
            }
        }*/
        return true;
    }

    getCartaJugada(paloJugado) {
        let arrayOrden = this.state.gameManager.state.orden;
        let jugadasArray = this.state.gameManager.state.cartasJugadas;
        if (jugadasArray[arrayOrden[0]] === null) //NADIE HA JUGADO, SOY PRIMERO
        {
            return null;
        }
        else if (jugadasArray[arrayOrden[1]] === null) //SOY SEGUNDO
        {
            //DEVUELVE UNICA CARTA JUGADA, ES DEL OTRO EQUIPO Y SE DEBE MATAR SI ES POSIBLE
            paloJugado = jugadasArray[arrayOrden[0]].palo;
            return jugadasArray[arrayOrden[0]];
        }
        else if (jugadasArray[arrayOrden[2]] === null) //SOY TERCERO
        {
            paloJugado = jugadasArray[arrayOrden[0]].palo;
            //SE DEVUELVE LA CARTA DEL SEGUNDO SI HA MATADO A COMPAÑERO, SI NO NULL
            //(EL PRIMERO ES DE TU EQUIPO Y NO HACE FALTA MATAR AL DE TU EQUIPO)
            if ((jugadasArray[arrayOrden[1]].palo === jugadasArray[arrayOrden[0]].palo &&
                (jugadasArray[arrayOrden[1]].puntos > jugadasArray[arrayOrden[0]].puntos 
                //Han matado con más puntos
                ||
                (jugadasArray[arrayOrden[1]].puntos === jugadasArray[arrayOrden[0]].puntos &&
                jugadasArray[arrayOrden[1]].numero > jugadasArray[arrayOrden[0]].numero))) 
                //Han matado con mismos puntos pero más alto
                ||
                (jugadasArray[arrayOrden[1]].palo != jugadasArray[arrayOrden[0]].palo &&
                jugadasArray[arrayOrden[1]].palo === this.state.gameManager.state.triunfo.palo)) 
                //Han matado con triunfo
                {
                return jugadasArray[arrayOrden[1]];
            }
            else return null;
        }
        else if (jugadasArray[arrayOrden[3]] === null) //SOY ULTIMO
        {
            paloJugado = jugadasArray[arrayOrden[0]].palo;
            //SE DEVUELVE LA CARTA MAXIMA DE LA PARTIDA SI ES DEL OTRO EQUIPO,
            //EN CASO CONTRARIO SE DEVUELVE NULL (MI COMPAÑERO HA MATADO)

            //SI JUGADOR DE MI EQUIPO (SEGUNDO) HA MATADO AL PRIMERO (OTRO EQUIPO)
            if ((jugadasArray[arrayOrden[1]].palo === jugadasArray[arrayOrden[0]].palo &&
                (jugadasArray[arrayOrden[1]].puntos > jugadasArray[arrayOrden[0]].puntos 
                ||
                (jugadasArray[arrayOrden[1]].puntos === jugadasArray[arrayOrden[0]].puntos &&
                jugadasArray[arrayOrden[1]].numero > jugadasArray[arrayOrden[0]].numero))) 
                ||
                (jugadasArray[arrayOrden[1]].palo != jugadasArray[arrayOrden[0]].palo &&
                jugadasArray[arrayOrden[1]].palo === this.state.gameManager.state.triunfo.palo)) 
            {
                //SI JUGADOR DEL OTRO EQUIPO (TERCERO) HA MATADO AL DE MI EQUIPO (SEGUNDO)
                if ((jugadasArray[arrayOrden[2]].palo === jugadasArray[arrayOrden[1]].palo &&
                    (jugadasArray[arrayOrden[2]].puntos > jugadasArray[arrayOrden[1]].puntos 
                    ||
                    (jugadasArray[arrayOrden[2]].puntos === jugadasArray[arrayOrden[1]].puntos &&
                    jugadasArray[arrayOrden[2]].numero > jugadasArray[arrayOrden[1]].numero))) 
                    ||
                    (jugadasArray[arrayOrden[2]].palo != jugadasArray[arrayOrden[1]].palo &&
                    jugadasArray[arrayOrden[2]].palo === this.state.gameManager.state.triunfo.palo)) 
                {
                    return jugadasArray[arrayOrden[2]].jugada; //MAXIMA ES LA DEL TERCERO
                }
                else return null; //MAXIMA ES LA DE MI EQUIPO
            }
            else if (
                (jugadasArray[arrayOrden[2]].palo === jugadasArray[arrayOrden[0]].palo &&
                (jugadasArray[arrayOrden[2]].puntos > jugadasArray[arrayOrden[0]].puntos 
                ||
                (jugadasArray[arrayOrden[2]].puntos === jugadasArray[arrayOrden[0]].puntos &&
                jugadasArray[arrayOrden[2]].numero > jugadasArray[arrayOrden[0]].numero))) 
                ||
                (jugadasArray[arrayOrden[2]].palo != jugadasArray[arrayOrden[0]].palo &&
                jugadasArray[arrayOrden[2]].palo === this.state.gameManager.state.triunfo.palo)) 
            { //JUGADOR DE MI EQUIPO NO HA MATADO, PERO EL TERCERO HA MATADO AL PRIMERO
                return jugadasArray[arrayOrden[2]]; //MAXIMA ES LA DEL TERCERO
            }
            else return jugadasArray[arrayOrden[0]]; //MAXIMA ES LA DEL PRIMERO
        }
        else return null; //CASO IMPOSIBLE, TODOS HABRIAN JUGADO
    }
}

export default PlayerBase;