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
            gameManager: GManager,
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

    cartaValidaEnArrastre()
    {
        let paloJugado;
        let pri = this.getCartaJugada(paloJugado);
        if (pri == null && paloJugado == -1) return true; //NO HAY CARTA, SOY EL PRIMERO
        if (this.state.mano[this.state.input.carta] == null) return false; //INTENTO DE JUGAR CARTA QUE NO EXISTE

        let cartaValida = true;
        if (this.state.mano[this.state.input.carta].palo == paloJugado)
        {
            if (pri != null) //COMPROBAR PUNTOS, SI ES NULL LA CARTA ES DE MI COMPAÑERO Y NO HAY QUE MATAR
            {
                if (this.state.mano[this.state.input.carta].puntos < pri.puntos || (this.state.mano[this.state.input.carta].puntos == pri.puntos && this.state.mano[this.state.input.carta].numero < pri.numero))
                {
                    for (let i = 0; i < this.state.mano.length; i++) {
                        const c = this.state.mano[i];
                        if (c != null && c.palo == paloJugado && (c.puntos > pri.puntos || (c.puntos == pri.puntos && c.numero > pri.numero))) {
                            cartaValida = false;
                            break;
                        }
                    }
                }
            }
        }
        else if (this.state.mano[this.state.input.carta].palo != paloJugado && this.state.mano[this.state.input.carta].palo == this.state.gameManager.state.triunfo.palo)
        {
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
        else if (this.state.mano[this.state.input.carta].palo != paloJugado && this.state.mano[this.state.input.carta].palo != this.state.gameManager.state.triunfo.palo)
        {
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

    turno()
    {
        if (this.state.esMiTurno)
        {
            let index = 0;
            let cartaSeleccionada = false;
            if (this.state.input.carta > -1 && this.state.input.carta < 6 && !this.state.gameManager.state.arrastre)
            {
                index = this.state.input.carta;
                cartaSeleccionada = true;
            }
            else if (this.state.input.carta > -1 && this.state.input.carta < 6 && this.state.gameManager.state.arrastre)
            {   
                if (this.cartaValidaEnArrastre())
                {
                    index = this.state.input.carta;
                }
                else return false;
            }
            else if (this.state.input.cambiarSiete)
            {
                if(this.state.ganador && !this.state.gameManager.state.arrastre) cambiarSieteTriunfo();
            }
            else if (this.state.input.cantar > -1 && this.state.input.cantar < 4)
            {
                if (this.state.ganador && !this.state.cantadoEsteTurno && !this.state.palosCantados[this.state.input.cantar])
                {
                    let hayRey = false;
                    let haySota = false;
                    for (let i = 0; i < this.state.mano.length; i++) {
                        const c = this.state.mano[i];
                        if (c == null) continue;

                        if (c.numero == 10 && c.palo == this.state.input.cantar) haySota = true;
                        if (c.numero == 12 && c.palo == this.state.input.cantar) hayRey = true;
                    }
                    if (hayRey && haySota)
                    {
                        this.cantar(this.state.input.cantar);
                        this.state.palosCantados[this.state.input.cantar] = true;
                        this.state.cantadoEsteTurno = true;
                        //Actualizar Marcadores
                    }
                }
            }
        }
        return true;
    }

    getCartaJugada(paloJugado)
    {
        if (this.state.gameManager.state.cartasJugadas[this.state.gameManager.state.orden[0]] === null) //NADIE HA JUGADO, SOY PRIMERO
        {
            console.log("Soy primero");
            return null;
        }
        else if (this.state.gameManager.state.cartasJugadas[this.state.gameManager.state.orden[1]] === null) //PRIMERO HA JUGADO, SOY SEGUNDO
        {
            console.log("Soy segundo");
            //DEVUELVE UNICA CARTA JUGADA, ES DEL OTRO EQUIPO Y SE DEBE MATAR SI ES POSIBLE
            paloJugado = this.state.gameManager.state.cartasJugadas[this.state.gameManager.state.orden[0]].palo;
            return this.state.gameManager.state.cartasJugadas[this.state.gameManager.state.orden[0]];
        }
        else if (this.state.gameManager.state.cartasJugadas[this.state.gameManager.state.orden[2]] === null) //SEGUNDO HA JUGADO, SOY TERCERO
        {
            console.log("Soy tercero");
            paloJugado = this.state.gameManager.state.cartasJugadas[this.state.gameManager.state.orden[0]].palo;
            //SE DEVUELVE LA CARTA DEL SEGUNDO SI HA MATADO, SI NO NULL
            //(EL PRIMERO ES DE TU EQUIPO Y NO HACE FALTA MATAR AL DE TU EQUIPO)
            if ((this.state.gameManager.state.cartasJugadas[this.state.gameManager.state.orden[1]].palo === this.state.gameManager.state.cartasJugadas[this.state.gameManager.state.orden[0]].palo &&
               (this.state.gameManager.state.cartasJugadas[this.state.gameManager.state.orden[1]].puntos > this.state.gameManager.state.cartasJugadas[this.state.gameManager.state.orden[0]].puntos ||
               (this.state.gameManager.state.cartasJugadas[this.state.gameManager.state.orden[1]].puntos === this.state.gameManager.state.cartasJugadas[this.state.gameManager.state.orden[0]].puntos &&
                this.state.gameManager.state.cartasJugadas[this.state.gameManager.state.orden[1]].numero > this.state.gameManager.state.cartasJugadas[this.state.gameManager.state.orden[0]].numero))) ||
               (this.state.gameManager.state.cartasJugadas[this.state.gameManager.state.orden[1]].palo != this.state.gameManager.state.cartasJugadas[this.state.gameManager.state.orden[0]].palo &&
                this.state.gameManager.state.cartasJugadas[this.state.gameManager.state.orden[1]].palo === this.state.gameManager.state.triunfo.palo))
            {
                return this.state.gameManager.state.cartasJugadas[this.state.gameManager.state.orden[1]];
            }
            else return null;
        }
        else if (this.state.gameManager.state.cartasJugadas[this.state.gameManager.state.orden[3]] === null) //TERCERO HA JUGADO, SOY ULTIMO
        {
            console.log("Soy cuarto");
            paloJugado = this.state.gameManager.state.cartasJugadas[this.state.gameManager.state.orden[0]].palo;
            //SE DEVUELVE LA CARTA MAXIMA DE LA PARTIDA SI ES DEL OTRO EQUIPO,
            //EN CASO CONTRARIO SE DEVUELVE NULL (MI COMPAÑERO HA MATADO)

            //JUGADOR DE MI EQUIPO (SEGUNDO) HA MATADO AL PRIMERO (OTRO EQUIPO)
            if ((this.state.gameManager.state.cartasJugadas[this.state.gameManager.state.orden[1]].palo === this.state.gameManager.state.cartasJugadas[this.state.gameManager.state.orden[0]].palo &&
               (this.state.gameManager.state.cartasJugadas[this.state.gameManager.state.orden[1]].puntos > this.state.gameManager.state.cartasJugadas[this.state.gameManager.state.orden[0]].puntos ||
               (this.state.gameManager.state.cartasJugadas[this.state.gameManager.state.orden[1]].puntos === this.state.gameManager.state.cartasJugadas[this.state.gameManager.state.orden[0]].puntos &&
                this.state.gameManager.state.cartasJugadas[this.state.gameManager.state.orden[1]].numero > this.state.gameManager.state.cartasJugadas[this.state.gameManager.state.orden[0]].numero))) ||
               (this.state.gameManager.state.cartasJugadas[this.state.gameManager.state.orden[1]].palo != this.state.gameManager.state.cartasJugadas[this.state.gameManager.state.orden[0]].palo &&
                this.state.gameManager.state.cartasJugadas[this.state.gameManager.state.orden[1]].palo === this.state.gameManager.state.triunfo.palo))
            {
                //JUGADOR DEL OTRO EQUIPO (TERCERO) HA MATADO AL DE MI EQUIPO (SEGUNDO)
                if ((this.state.gameManager.state.cartasJugadas[this.state.gameManager.state.orden[2]].palo === this.state.gameManager.state.cartasJugadas[this.state.gameManager.state.orden[1]].palo &&
                   (this.state.gameManager.state.cartasJugadas[this.state.gameManager.state.orden[2]].puntos > this.state.gameManager.state.cartasJugadas[this.state.gameManager.state.orden[1]].puntos ||
                   (this.state.gameManager.state.cartasJugadas[this.state.gameManager.state.orden[2]].puntos === this.state.gameManager.state.cartasJugadas[this.state.gameManager.state.orden[1]].puntos &&
                    this.state.gameManager.state.cartasJugadas[this.state.gameManager.state.orden[2]].numero > this.state.gameManager.state.cartasJugadas[this.state.gameManager.state.orden[1]].numero))) ||
                   (this.state.gameManager.state.cartasJugadas[this.state.gameManager.state.orden[2]].palo != this.state.gameManager.state.cartasJugadas[this.state.gameManager.state.orden[1]].palo &&
                    this.state.gameManager.state.cartasJugadas[this.state.gameManager.state.orden[2]].palo === this.state.gameManager.state.triunfo.palo))
                {
                    return this.state.gameManager.state.cartasJugadas[this.state.gameManager.state.orden[2]].jugada; //MAXIMA ES LA DEL TERCERO
                }
                else return null; //MAXIMA ES LA DE MI EQUIPO
            }
            else if ((this.state.gameManager.state.cartasJugadas[this.state.gameManager.state.orden[2]].palo === this.state.gameManager.state.cartasJugadas[this.state.gameManager.state.orden[0]].palo &&
                    (this.state.gameManager.state.cartasJugadas[this.state.gameManager.state.orden[2]].puntos > this.state.gameManager.state.cartasJugadas[this.state.gameManager.state.orden[0]].puntos ||
                    (this.state.gameManager.state.cartasJugadas[this.state.gameManager.state.orden[2]].puntos === this.state.gameManager.state.cartasJugadas[this.state.gameManager.state.orden[0]].puntos &&
                     this.state.gameManager.state.cartasJugadas[this.state.gameManager.state.orden[2]].numero > this.state.gameManager.state.cartasJugadas[this.state.gameManager.state.orden[0]].numero))) ||
                    (this.state.gameManager.state.cartasJugadas[this.state.gameManager.state.orden[2]].palo != this.state.gameManager.state.cartasJugadas[this.state.gameManager.state.orden[0]].palo &&
                     this.state.gameManager.state.cartasJugadas[this.state.gameManager.state.orden[2]].palo === this.state.gameManager.state.triunfo.palo))
            { //JUGADOR DE MI EQUIPO NO HA MATADO, PERO EL TERCERO SI HA MATADO AL PRIMERO
                return this.state.gameManager.state.cartasJugadas[this.state.gameManager.state.orden[2]]; //MAXIMA ES LA DEL TERCERO
            }
            else return this.state.gameManager.state.cartasJugadas[this.state.gameManager.state.orden[0]]; //MAXIMA ES LA DEL PRIMERO
        }
        else return null; //CASO IMPOSIBLE, TODOS HABRIAN JUGADO
    }
}

export default PlayerBase;