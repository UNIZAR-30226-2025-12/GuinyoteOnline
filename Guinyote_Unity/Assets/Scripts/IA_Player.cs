using UnityEngine;
using UnityEngine.InputSystem;

public class IA_Player : Player
{
    bool[] cartasIntentadas = new bool[6];
    bool exito = false, todasIntentadas;
    public IA_Player() : base()
    {
        for (int i = 0; i < 6; i++)
        {
            cartasIntentadas[i] = false;
        }
    }

    public void Update()
    {
        if (GameManager.Instance.mostrandoCantar) return;
        
        if (exito)
        {
            for (int i = 0; i < 6; i++)
            {
                if (mano[i] == null)  cartasIntentadas[i] = true;
                else cartasIntentadas[i] = false;
            }
        }

        resetInput();

        todasIntentadas = true;
        for (int i = 0; i < 6; i++)
        {
            if (!cartasIntentadas[i] && mano[i] != null)
            {
                todasIntentadas = false;
                break;
            }
        }
        
        if (m_esMiTurno && !m_CartaDesplazandose) {
            //Debug.Log("Turno de la IA");
            if (todasIntentadas)
            {
                Debug.Log("todas intentadas");
                input.carta = peorCartaIndex();
                exito = turno();
                return;
            }

            //CANTAR SI ES POSIBLE
            if(intentarCantar()) return;

            //CAMBIAR 7 DE TRIUNFO SI ES POSIBLE Y SE OBTENDRÁ MEJOR CARTA
            if(intentarCambiarSiete()) return;


            if (soyPrimero())
            {
                Debug.Log("IA primera");
                if (GameManager.Instance.arrastre && !GameManager.Instance.segundaBaraja) input.carta = primeraCartaArrastreIndex();
                else if (!GameManager.Instance.arrastre && !GameManager.Instance.segundaBaraja) input.carta = peorCartaIndex();
                else if (GameManager.Instance.arrastre) input.carta = primeraCartaArrastreIndex();
                else input.carta = primeraCartaSegundaBarajaIndex();
            }
            else
            { //No soy primero (si 2 jugadores ultimo)
                //Debug.Log("IA no primera");
                if (GameManager.Instance.jugadores.Length == 2)
                {
                    input.carta = seleccion2Jugadores();
                }
                else input.carta = seleccion4Jugadores();
            }
            cartasIntentadas[input.carta] = true;
        }

        exito = turno();
        base.Update();
    }

    //Devuelve el índice de la carta que se usará en una partida de 2 jugadores si la CPU va segunda
    int seleccion2Jugadores()
    {
        int palo;
        var jugada = GameManager.Instance.getCartaJugada(out palo);
        Debug.Log(jugada.Puntos);
        Debug.Log(jugada.Palo);
        int paloTriunfo = GameManager.Instance.triunfo.Palo;
        int index = 0;
        if (!GameManager.Instance.arrastre && !GameManager.Instance.segundaBaraja)
        {
            if (jugada.Puntos >= 10 && jugada.Palo != paloTriunfo)
            {
                return puedoMatar(ref index, jugada) ? index : peorCartaIndex();
            }
            else return peorCartaIndex();
        }
        else if (GameManager.Instance.arrastre && !GameManager.Instance.segundaBaraja)
        {
            return peorCartaIndex();
        }
        else //segunda baraja o segunda baraja y arrastre
        {
            return cartaSegundaBarajaIndex(jugada.Puntos, GameManager.Instance.jugadores[GameManager.Instance.orden[0]].puntos, puntos);
        }
    }

    //Devuelve el índice de la carta que se usará en una partida de 4 jugadores si la CPU no va primera
    int seleccion4Jugadores()
    {
        int palo;
        var jugada = GameManager.Instance.getCartaJugada(out palo);
        int paloTriunfo = GameManager.Instance.triunfo.Palo;
        int puntosTotales = 0;
        int index = 0;
        for (int i = 0; i < 4; i++)
        {
            if (GameManager.Instance.jugadores[GameManager.Instance.orden[i]].jugada == null) break;
            puntosTotales += GameManager.Instance.jugadores[GameManager.Instance.orden[i]].jugada.Puntos;
        }

        if (GameManager.Instance.jugadores[GameManager.Instance.orden[1]].jugada == null) //Voy segundo
        {
            if (GameManager.Instance.arrastre) return peorCartaIndex();
            else return (puedoMatar(ref index, jugada) && puntosTotales >= 10) ? index : peorCartaIndex();
        }
        else if (GameManager.Instance.jugadores[GameManager.Instance.orden[2]].jugada == null) //Voy tercero
        {
            var cartaEquipo = GameManager.Instance.jugadores[GameManager.Instance.orden[0]].jugada;
            if (cartaEquipo.Palo == paloTriunfo && cartaEquipo.Puntos == 11) return cargarPuntosIndex(); //Baza nuestra, cargar puntos
            else if (GameManager.Instance.arrastre) return peorCartaIndex();
            else return (puedoMatar(ref index, jugada) && puntosTotales >= 10) ? index : peorCartaIndex();
        }
        else //Voy ultimo
        {
            if (!GameManager.Instance.arrastre && !GameManager.Instance.segundaBaraja)
            {
                if (jugada == null) return cargarPuntosIndex(); //Baza de mi equipo, cargar puntos
                if (puntosTotales >= 10 && jugada.Palo != paloTriunfo)
                {
                    return puedoMatar(ref index, jugada) ? index : peorCartaIndex();
                }
                else return peorCartaIndex();
            }
            else if (GameManager.Instance.arrastre && !GameManager.Instance.segundaBaraja)
            {
                return peorCartaIndex();
            }
            else //segunda baraja o segunda baraja y arrastre
            {
                int puntosEquipo1 = 0, puntosEquipo2 = 0;
                bool equipo1 = false;
                for (int i = 0; i < 4; i++)
                {
                    var j = GameManager.Instance.jugadores[i];
                    if (j == this) equipo1 = (i == 0 || i == 2); //busco mi equipo
                    if (i == 0 || i == 2) puntosEquipo1 += j.puntos;
                    else puntosEquipo2 += j.puntos;
                }
                int puntosRival = equipo1 ? puntosEquipo2 : puntosEquipo1;
                int misPuntos = equipo1 ? puntosEquipo1 : puntosEquipo2;
                return cartaSegundaBarajaIndex(puntosTotales, puntosRival, misPuntos);
            }
        }
    }

    bool soyPrimero()
    {
        return GameManager.Instance.jugadores[GameManager.Instance.orden[0]] == this;
    }

    //Devuelve el índice en la mano de la carta a jugar cuando la partida va por la segunda baraja
    int cartaSegundaBarajaIndex(int puntosJugados, int puntosRival, int misPuntos)
    {
        int paloCantar;
        int palo;
        int index = 0;
        int paloTriunfo = GameManager.Instance.triunfo.Palo;
        if (puedoMatar(ref index, GameManager.Instance.getCartaJugada(out palo)))
        {
            if (puntosJugados >= 10) return index;
            else if (puntosRival + puntosJugados >= 101)
            {
                index = peorCartaIndex();
                
                if (puntosRival + puntosJugados + mano[index].Puntos < 101) return index;
                else
                {
                    for (int i = 0; i < 6; i++)
                    {
                        if (mano[i] == null) continue;
                        if (puntosRival + puntosJugados + mano[i].Puntos < 101) return i;
                    }
                }
                return index;
            }
            else if (misPuntos + puntosJugados + mano[index].Puntos >= 101) return index;
            else if (puedoCantar(out paloCantar))
            {
                if (((paloCantar == paloTriunfo && misPuntos + 40 + mano[index].Puntos + puntosJugados >= 101) ||
                    (paloCantar != paloTriunfo && misPuntos + 20 + mano[index].Puntos + puntosJugados >= 101)) &&
                    !(mano[index].Palo == paloCantar && (mano[index].Numero == 10 || mano[index].Numero == 12)))
                {
                    return index;
                }
                else return peorCartaIndex();
            }
            else return peorCartaIndex();
        }
        else return peorCartaIndex();
    }

    /*
     * Si es posible cantar, devuelve true y el palo de más puntos
     * que se puede cantar en "palo". Si no se puede cantar, devuelve
     * false y -1 en "palo".
     */
    bool puedoCantar(out int palo)
    {
        bool hayRey;
        bool haySota;
        int cantable = -1;
        for (int i = 0; i < 4; i++)
        {
            hayRey = false;
            haySota = false;
            foreach (var c in mano)
            {
                if (c == null) continue;
                if (c.Numero == 10 && c.Palo == i) haySota = true;
                if (c.Numero == 12 && c.Palo == i) hayRey = true;
            }
            if (hayRey && haySota) 
            {
                if (i == GameManager.Instance.triunfo.Palo)
                {
                    palo = i;
                    return true;
                }
                else cantable = i;
            }
        }
        palo = cantable;
        return (cantable != -1);
    }

    //Devuelve el indice de la carta menos valiosa en la mano de la IA
    int peorCartaIndex()
    {
        int index = 0;
        while(mano[index] == null) {
            Debug.Log(index);
            Debug.Log(mano[index]);
            index++;
        }
        int menorValor = 10000; //Valor maximo de carta
        int paloTriunfo = GameManager.Instance.triunfo.Palo;
        bool[] reyes = {false, false, false, false};
        bool[] sotas = {false, false, false, false};
        bool[] cantables = {false, false, false, false};

        for (int i = 0; i < 6; i++) //Guardar reyes y sotas de la mano
        {
            if (mano[i] == null) continue;
            if (mano[i].Numero == 10) sotas[mano[i].Palo] = true;
            if (mano[i].Numero == 12) reyes[mano[i].Palo] = true;
        }
        for (int i = 0; i < 4; i++) //Guardar los palos que se podríamos cantar
        {
            if (sotas[i] && reyes[i] && !palosCantados[i]) cantables[i] = true;
        }

        for (int i = 0; i < mano.Length; i++)
        {
            if (mano[i] == null || (cartasIntentadas[i] && !todasIntentadas)) continue;

            int valor = (mano[i].Palo == paloTriunfo) ? mano[i].Puntos + 11 : mano[i].Puntos;
            if (cantables[mano[i].Palo] && (mano[i].Numero == 10 || mano[i].Numero == 12)) valor += 20;

            if (valor < menorValor)
            {
                menorValor = valor;
                index = i;
            }
            else if (valor == menorValor)
            {
                if ((mano[index].Palo == paloTriunfo && //Había elegido triunfo
                   ((mano[i].Palo == paloTriunfo && mano[i].Numero < mano[index].Numero) || //Tengo otro triunfo peor
                    (mano[i].Palo != paloTriunfo))) ||  //Tengo otro no triunfo
                    (mano[index].Palo != paloTriunfo && mano[i].Palo != paloTriunfo && mano[i].Numero < mano[index].Numero)) //Había elegido un no triunfo pero tengo otro peor
                {
                    index = i;
                }
            }
        }
        return index;
    }

    /*
     * Devuelve el índice de la carta con mayor puntuacion que no es triunfo
     * de la mano, o la carta con mayor puntuación que no sea el as de triunfo
     * si solo hay triunfos en la mano. Evita elegir cartas con las que se
     * pueda cantar si es posible.
     */
    int cargarPuntosIndex()
    {
        int index = 0;
        int paloTriunfo = GameManager.Instance.triunfo.Palo;
        while(mano[index] == null) index++;
        bool soloTriunfos = true;
        bool[] reyes = {false, false, false, false};
        bool[] sotas = {false, false, false, false};
        bool[] cantables = {false, false, false, false};
        for(int i = 0; i < 6; i++)
        {
            if (mano[i] == null) continue;

            if (mano[i].Palo != paloTriunfo && !(cartasIntentadas[i] && !todasIntentadas)) soloTriunfos = false;
            if (mano[i].Numero == 10) sotas[mano[i].Palo] = true;
            if (mano[i].Numero == 12) reyes[mano[i].Palo] = true;
        }
        for (int i = 0; i < 4; i++) //Guardar los palos que podríamos cantar
        {
            if (sotas[i] && reyes[i] && !palosCantados[i]) cantables[i] = true;
        }
        for (int i = index + 1; i < 6; i++)
        {
            if (mano[i] == null || (cartasIntentadas[i] && !todasIntentadas)) continue;
            
            if (!soloTriunfos)
            {
                if ((mano[index].Puntos <= mano[i].Puntos && mano[i].Palo != paloTriunfo) &&
                    !((mano[i].Numero == 12 || mano[i].Numero == 10) && cantables[mano[i].Palo]))
                {
                    index = i;
                }
            }
            else
            {
                if (mano[i].Numero == 1) continue;

                if (mano[i].Puntos > mano[index].Puntos &&
                    ((mano[i].Numero == 12 || mano[i].Numero == 10) && cantables[mano[i].Palo]))
                {
                    index = i;
                }
            }
        }
        return index;
    }

    /*
     * Devuelve el índice de la carta con mayor puntuación que no es triunfo
     * de la mano, o la carta con la menor puntuación que obligaría a gastar
     * el mayor triunfo posible (a no ser que esa carta sea el as o el 3 de
     * triunfo) si solo hay triunfos en la mano. Evita elegir cartas con las
     * que se pueda cantar si es posible.
     */
    int primeraCartaArrastreIndex()
    {
        int index = 0;
        int paloTriunfo = GameManager.Instance.triunfo.Palo;
        while(mano[index] == null) index++;
        bool soloTriunfos = true;
        bool[] reyes = {false, false, false, false};
        bool[] sotas = {false, false, false, false};
        bool[] cantables = {false, false, false, false};
        foreach(var c in mano)
        {
            if (c == null) continue;

            if (c.Palo != paloTriunfo) soloTriunfos = false;
            if (c.Numero == 10) sotas[c.Palo] = true;
            if (c.Numero == 12) reyes[c.Palo] = true;
        }
        for (int i = 0; i < 4; i++) //Guardar los palos que podríamos cantar
        {
            if (sotas[i] && reyes[i] && !palosCantados[i]) cantables[i] = true;
        }
        for (int i = index + 1; i < 6; i++)
        {
            if (mano[i] == null) continue;
            
            if (!soloTriunfos)
            {
                if ((mano[index].Puntos <= mano[i].Puntos && mano[i].Palo != paloTriunfo) &&
                    !((mano[i].Numero == 12 || mano[i].Numero == 10) && cantables[mano[i].Palo]))
                {
                    index = i;
                }
            }
            else
            {
                if (mano[i].Numero == 1 || mano[i].Numero == 3) continue;

                if (mano[index].Puntos == 0)
                {
                    if ((mano[i].Puntos == 0 && mano[i].Numero != 7 && mano[i].Numero > mano[index].Numero + 1) ||
                        (mano[i].Numero == 7 && mano[i].Puntos >= 3) && !cantables[mano[i].Puntos])
                    {
                        index = i;
                    }
                }
                else if (mano[index].Puntos == 2 && mano[i].Puntos == 4 && !cantables[mano[i].Palo]) index = i;
            }
        }
        return index;
    }

    //Devuelve la carta que se usará si la CPU sale primera durante la segunda baraja
    int primeraCartaSegundaBarajaIndex()
    {
        int index = 0;
        int paloTriunfo = GameManager.Instance.triunfo.Palo;
        while(mano[index] == null) index++;
        bool[] reyes = {false, false, false, false};
        bool[] sotas = {false, false, false, false};
        bool[] cantables = {false, false, false, false};
        foreach(var c in mano)
        {
            if (c == null) continue;

            if (c.Numero == 10) sotas[c.Palo] = true;
            if (c.Numero == 12) reyes[c.Palo] = true;
        }
        for (int i = 0; i < 4; i++) //Guardar los palos que podríamos cantar
        {
            if (sotas[i] && reyes[i] && !palosCantados[i]) cantables[i] = true;
        }
        for (int i = 0; i < 6; i++)
        {
            if (mano[i] == null) continue;

            if (mano[i].Palo == paloTriunfo && mano[i].Numero == 1) return i;
        }

        return peorCartaIndex();
    }

    /* 
     * "jugada" es la carta que va ganando la baza, null si es de mi compañero.
     * Devuelve el índice en la mano de la carta que se considera mejor para
     * ganar la baza si "jugada" no es null y hay alguna carta que pueda ganarla.
     * Si jugada es null o no hay ninguna carta que pueda ganar la baza, devuelve
     * false.
     */
    bool puedoMatar(ref int index, Carta jugada)
    {
        if (jugada == null) return false; //Carta de mi compañero, da igual matar

        int puntosASuperar = jugada.Puntos;
        bool esPosible = false;
        if (jugada.Palo != GameManager.Instance.triunfo.Palo)
        {
            for (int i = 0; i < mano.Length; i++)
            {
                if (mano[i] == null || mano[i].Palo == GameManager.Instance.triunfo.Palo) continue;

                if (!cartasIntentadas[i])
                {
                    if (mano[i].Puntos > puntosASuperar && mano[i].Palo == jugada.Palo)
                    {
                        index = i;
                        puntosASuperar = mano[i].Puntos;
                        esPosible = true;
                    }
                }
            }
            if (esPosible) return true;
        }

        for (int i = 0; i < mano.Length; i++)
        {
            if (mano[i] == null || mano[i].Palo != GameManager.Instance.triunfo.Palo) continue;

            if (!cartasIntentadas[i])
            {
                if (jugada.Palo == GameManager.Instance.triunfo.Palo && mano[i].Puntos > puntosASuperar)
                {
                    index = i;
                    puntosASuperar = mano[i].Puntos;
                    return true;
                }
                else if (jugada.Palo != GameManager.Instance.triunfo.Palo && mano[i].Puntos <= puntosASuperar) //Como voy a matar sin importar los puntos, uso pocos puntos
                {
                    index = i;
                    puntosASuperar = mano[i].Puntos;
                    esPosible = true;
                }
            }
        }

        return esPosible;
    }

    /*
     * Devuelve true si es posible cantar, y false en caso
     * contrario. Además, si ha sido posible cantar realiza
     * las acciones del turno (definidas en "turno()" de la 
     * clase Player).
     */
    private bool intentarCantar()
    {
        if (ganador && !cantadoEsteTurno)
        {
            bool hayRey = false;
            bool haySota = false;
            //TRIUNFO PARA PRIORIZAR
            if (!palosCantados[GameManager.Instance.triunfo.Palo])
            {
                foreach (var c in mano)
                {
                    if (c == null) continue;
                    if (c.Numero == 10 && c.Palo == GameManager.Instance.triunfo.Palo) haySota = true;
                    if (c.Numero == 12 && c.Palo == GameManager.Instance.triunfo.Palo) hayRey = true;
                }
                if (hayRey && haySota) 
                {
                    input.cantar = GameManager.Instance.triunfo.Palo;
                    exito = turno();
                    return true;
                }
            }
            //OTROS PALOS
            for (int i = 0; i < 4; i++)
            {
                if (i == GameManager.Instance.triunfo.Palo || palosCantados[i]) continue;

                hayRey = false;
                haySota = false;
                foreach (var c in mano)
                {
                    if (c == null) continue;
                    if (c.Numero == 10 && c.Palo == i) haySota = true;
                    if (c.Numero == 12 && c.Palo == i) hayRey = true;
                }
                if (hayRey && haySota) 
                {
                    input.cantar = i;
                    exito = turno();
                    return true;
                }
            }
        }
        return false;
    }

    /*
     * Devuelve true si es posible cambiar el 7 de triunfo por
     * la carta de triunfo de la baraja, y false en caso
     * contrario. Además, si ha sido posible cambiarlo realiza
     * las acciones del turno (definidas en "turno()" de la 
     * clase Player).
     */
    private bool intentarCambiarSiete()
    {
        if (!ganador || GameManager.Instance.triunfo.Puntos == 0 || GameManager.Instance.arrastre) return false;

        foreach (var c in mano)
        {
            if (c == null) continue;
            if(c.Numero == 7 && c.Palo == GameManager.Instance.triunfo.Palo)
            {
                input.cambiarSiete = true;
                exito = turno();
                return true;
            }
        }

        return false;
    }
}