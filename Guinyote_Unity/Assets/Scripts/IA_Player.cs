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
            if (todasIntentadas) input.carta = peorCartaIndex();
            else if (m_esMiTurno && !m_CartaDesplazandose) {
                //Debug.Log("Turno de la IA");
                if (soyPrimero())
                {
                    //Debug.Log("IA primera");
                    input.carta = peorCartaIndex();
                }
                else
                { //No soy primero
                    //Debug.Log("IA no primera");
                    int index = 0;
                    bool hayPuntos = false;
                    ganadoraEnMesa(hayPuntos, index);
                    //Debug.Log("Carta ganadora es " + GameManager.Instance.cartasJugadas[index].Numero.ToString() + " hay puntos ?" + hayPuntos);
                    if (tengoMejorCarta(index) && hayPuntos)
                    {
                        //Debug.Log("Uso carta buena");
                        input.carta = index;
                    }
                    else
                    {
                        input.carta = peorCartaIndex();
                        //Debug.Log("Uso carta mala " + input.carta.ToString());
                    }
                }
                cartasIntentadas[input.carta] = true;
            }
        exito = turno();
    }

    bool soyPrimero()
    {
        return GameManager.Instance.jugadores[GameManager.Instance.orden[0]] == this;
    }
    int peorCartaIndex()
    {
        int index = 0;
        int menorValor = 12; //Valor maximo de carta
        for (int i = 0; i < mano.Length; i++)
        {
            if (mano[i] != null && (!cartasIntentadas[i] || todasIntentadas))
            {
                int valor = mano[i].Puntos;
                if (valor < menorValor)
                { //Elijo la carta de menor valor en puntos
                    menorValor = valor;
                    index = i;
                }
                else if (valor == menorValor)
                {
                    if (mano[index].Palo == GameManager.Instance.triunfo.Palo && mano[i].Palo != GameManager.Instance.triunfo.Palo)
                    { // Elijo mejor una carta no triunfo
                        index = i;
                    }
                    else if (mano[index].Numero < mano[i].Numero)
                    { // Elijo la carta si tiene menor número
                        index = i;
                    }
                }
            }
        }
        return index;
    }
    void ganadoraEnMesa(bool hayPuntos, int indexGanadora)
    {
        int valorASuperar = -1;
        int numeroASuperar = -1;
        int paloATirar = GameManager.Instance.cartasJugadas[GameManager.Instance.orden[0]].Palo;
        bool triunfo = (paloATirar == GameManager.Instance.triunfo.Palo);
        for (int i = 0; i < GameManager.Instance.cartasJugadas.Length; i++)
        {
            if (GameManager.Instance.cartasJugadas[i] != null)
            {
                if (!hayPuntos)
                { //Chekea que haya puntos en la mesa
                    hayPuntos = (GameManager.Instance.cartasJugadas[i].Puntos > 0);
                }
                if (!triunfo)
                {
                    if (GameManager.Instance.cartasJugadas[i].Palo == paloATirar)
                    {
                        if (GameManager.Instance.cartasJugadas[i].Puntos > valorASuperar)
                        {
                            valorASuperar = GameManager.Instance.cartasJugadas[i].Puntos;
                            numeroASuperar = GameManager.Instance.cartasJugadas[i].Numero;
                            indexGanadora = i;
                        }
                    }
                }
                if (GameManager.Instance.cartasJugadas[i].Palo == GameManager.Instance.triunfo.Palo)
                {
                    if (!triunfo)
                    {
                        //Si es el primer triunfo toca sacar triunfos para ganar la ronda
                        valorASuperar = -1;
                        triunfo = true;
                    }
                    if (GameManager.Instance.cartasJugadas[i].Puntos > valorASuperar)
                    {
                        numeroASuperar = valorASuperar = GameManager.Instance.cartasJugadas[i].Numero;
                        valorASuperar = GameManager.Instance.cartasJugadas[i].Puntos;
                        indexGanadora = i;
                    }
                    else if (valorASuperar == 0 && GameManager.Instance.cartasJugadas[i].Numero > numeroASuperar)
                    {
                        numeroASuperar = valorASuperar = GameManager.Instance.cartasJugadas[i].Numero;
                        valorASuperar = GameManager.Instance.cartasJugadas[i].Puntos;
                        indexGanadora = i;
                    }
                }
            }
        }
    }
    bool tengoMejorCarta(int index)
    {
        if (GameManager.Instance.cartasJugadas[index].Puntos == 0)
        {
            return false;
        }
        else
        {
            int puntosASuperar = GameManager.Instance.cartasJugadas[index].Puntos;
            for (int i = 0; i < mano.Length; i++)
            {
                if (mano[i] != null && !cartasIntentadas[i])
                {
                    int valor = mano[i].Puntos;
                    if (valor > puntosASuperar)
                    {
                        index = i;
                        return true;
                    }
                }
            }
            return false; 
        }
    }
}
