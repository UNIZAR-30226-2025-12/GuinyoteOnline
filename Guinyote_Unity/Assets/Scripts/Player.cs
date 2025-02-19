using UnityEngine;

public struct input
    {
        public int carta,
                     cantar;
        public bool cambiarSiete;
    }
public class Player : MonoBehaviour
{
    public Vector3 m_MoveTarget;
    public Carta[] mano;
    public Carta jugada;
    protected bool m_esMiTurno = false;
    protected bool m_CartaDesplazandose = false;
    public int puntos;
    public bool ganador = false, cantadoEsteTurno = false;
    private float[] posiciones = { -8.65f, -5.15f, -1.75f, 1.75f, 5.15f, 8.65f };
    protected input input;
    protected bool[] palosCantados = new bool[4] {false, false, false, false};
    public Player()
    {
        mano = new Carta[6];
        jugada = null;
        puntos = 0;
        input.carta = -1;
        input.cantar = -1;
    }

    void Start(){
        m_MoveTarget = transform.position + transform.up * 6.35f;
    }

    public void AnyadirCarta(Carta carta)
    {
        if (carta == null)
        {
            //Debug.Log("Jugador no recibe carta");
            return;
        }
        for (int i = 0; i < mano.Length; i++)
        {
            if (mano[i] == null)
            {
                mano[i] = carta;
                carta.transform.rotation = this.transform.rotation;
                carta.transform.position = this.transform.position + this.transform.right * posiciones[i];
                break;
            }
        }
    }

    public bool UsarCarta(int index)
    {
        if (mano[index] != null)
        {
            Carta carta = mano[index];
            mano[index] = null;
            jugada = carta;
            return true;
        }
        else
        {
            return false;
        }
    }

    public void cambiarSieteTriunfo()
    {
        for (int i = 0; i < 6; i++) {
            if (mano[i].Numero == 7 && mano[i].Palo == GameManager.Instance.triunfo.Palo)
            {
                //INTERCAMBIO DE CARTAS
                Carta aux = mano[i]; 
                mano[i] = GameManager.Instance.triunfo;
                GameManager.Instance.triunfo = aux;

                //CAMBIO POSICION 7
                GameManager.Instance.triunfo.transform.rotation = mano[i].transform.rotation;
                GameManager.Instance.triunfo.transform.position = mano[i].transform.position;

                //CAMBIO POSICION TRIUNFO
                mano[i].transform.rotation = this.transform.rotation;
                mano[i].transform.position = this.transform.position + this.transform.right * posiciones[i];

                //CAMBIAR VALOR ULTIMA CARTA BARAJA
                GameManager.Instance.Baraja.EliminarUltima();
                GameManager.Instance.Baraja.AnyadirAlFinal(GameManager.Instance.triunfo);
                break;
            }
        }
    }

    public void cantar(int palo)
    {
        if (palo == GameManager.Instance.triunfo.Palo) puntos += 40;
        else puntos += 20;
    }
    public void meToca()
    {
        m_esMiTurno = true;
        cantadoEsteTurno = false;
    }

    protected void resetInput()
    {
        input.carta = -1;
        input.cantar = -1;
        input.cambiarSiete = false;
    }

    protected bool cartaValidaEnArrastre()
    {
        int paloJugado;
        var jugada = GameManager.Instance.getCartaJugada(out paloJugado);

        if (jugada == null && paloJugado == -1) return true; //NO HAY CARTA, SOY EL PRIMERO
        if (mano[input.carta] == null) return false; //INTENTO DE JUGAR CARTA QUE NO EXISTE

        bool cartaValida = true;
        if (mano[input.carta].Palo == paloJugado)
        {
            if (jugada != null) //COMPROBAR PUNTOS, SI ES NULL LA CARTA ES DE MI COMPAÑERO Y NO HAY QUE MATAR
            {
                if (mano[input.carta].Puntos < jugada.Puntos || (mano[input.carta].Puntos == jugada.Puntos && mano[input.carta].Numero < jugada.Numero))
                {
                    foreach (var c in mano)
                    {
                        if (c != null && c.Palo == paloJugado && (c.Puntos > jugada.Puntos || (c.Puntos == jugada.Puntos && c.Numero > jugada.Numero)))
                        {
                            cartaValida = false;
                            break;
                        }
                    }
                }
            }
        }
        else if (mano[input.carta].Palo != paloJugado && mano[input.carta].Palo == GameManager.Instance.triunfo.Palo)
        {
            if (jugada == null) //NO HACE FALTA MATAR
            {
                //BUSCAR UNA CARTA DEL MISMO PALO QUE EL JUGADO
                foreach (var c in mano)
                {
                    if (c != null && c.Palo == paloJugado)
                    {
                        cartaValida = false;
                        break;
                    }
                }
            }
            else //HAY QUE MATAR SI SE PUEDE
            {
                //BUSCAR CARTA DE MISMO PALO QUE EL JUGADO, O UNA CARTA DE TRIUNFO QUE MATARIA CUANDO LA QUE HE ELEGIDO NO MATA
                foreach (var c in mano)
                {
                    if (c == null) continue; //SI COMPRUEBO != NULL EN EL IF DE ABAJO NO SE EJECUTA ANTES DE SEGUIR CON LAS COMPROBACIONES

                    if (c.Palo == paloJugado || //HAY OTRA CARTA DEL MISMO PALO
                    (c.Palo != paloJugado && jugada.Palo == GameManager.Instance.triunfo.Palo && c.Palo == GameManager.Instance.triunfo.Palo && //HAN JUGADO TRIUNFO Y LA CARTA ENCONTRADA ES TRIUNFO
                    (mano[input.carta].Puntos < jugada.Puntos || (mano[input.carta].Puntos == jugada.Puntos && mano[input.carta].Numero < jugada.Numero)) && //TRIUNFO ELEGIDO NO MATA
                    (c.Puntos > jugada.Puntos || (c.Puntos == jugada.Puntos && c.Numero > jugada.Numero)))) //TRIUNFO ENCONTRADO MATARIA
                    {
                        cartaValida = false;
                        break;
                    }
                }
            }
        }
        else if (mano[input.carta].Palo != paloJugado && mano[input.carta].Palo != GameManager.Instance.triunfo.Palo)
        {
            if (jugada == null) //NO HACE FALTA MATAR, PUEDO TIRAR CUALQUIER COSA SI NO TIENE MISMO PALO
            {
                foreach (var c in mano)
                {
                    if (c != null && c.Palo == paloJugado)
                    {
                        cartaValida = false;
                        break;
                    }
                }
            }
            else //HACE FALTA MATAR SI ES POSIBLE
            {
                foreach (var c in mano)
                {
                    if (c != null && (c.Palo == paloJugado || c.Palo == GameManager.Instance.triunfo.Palo))
                    {
                        cartaValida = false;
                        break;
                    }
                }
            }
        }
        return cartaValida;
    }

    protected bool turno()
    {
        if (m_CartaDesplazandose)
        {
            jugada.transform.position = Vector3.MoveTowards(jugada.transform.position, m_MoveTarget, 15f * Time.deltaTime);

            if (jugada.transform.position == m_MoveTarget)
            {
                m_esMiTurno = false;
                m_CartaDesplazandose = false;
                GameManager.Instance.TurnManager.Tick();
            }
        }
        else if (m_esMiTurno)
        {
            int index = 0;
            bool cartaSeleccionada = false;
            if (input.carta > -1 && input.carta < 6 && !GameManager.Instance.arrastre)
            {
                index = input.carta;
                cartaSeleccionada = true;
            }
            else if (input.carta > -1 && input.carta < 6 && GameManager.Instance.arrastre)
            {   
                if (cartaValidaEnArrastre())
                {
                    index = input.carta;
                    cartaSeleccionada = true;
                }
                else return false;
            }
            else if (input.cambiarSiete)
            {
                if(ganador) cambiarSieteTriunfo();
            }
            else if (input.cantar > -1 && input.cantar < 4)
            {
                if (ganador && !cantadoEsteTurno && !palosCantados[input.cantar])
                {
                    bool hayRey = false;
                    bool haySota = false;
                    foreach (var c in mano)
                    {
                        if (c.Numero == 10 && c.Palo == input.cantar) haySota = true;
                        if (c.Numero == 12 && c.Palo == input.cantar) hayRey = true;
                    }
                    if (hayRey && haySota) 
                    {
                        cantar(input.cantar);
                        palosCantados[input.cantar] = true;
                        cantadoEsteTurno = true;
                        GameManager.Instance.ActualizarMarcadores();
                    }
                }
            }

            if (cartaSeleccionada)
            {
                //Debug.Log("carta elegida");
                if (UsarCarta(index))
                {
                    //Debug.Log("carta usada");
                    cartaSeleccionada = false;
                    m_CartaDesplazandose = true;
                }
            }
        }
        return true;
    }

    public void reset()
    {
        jugada = null;
        ganador = false;
        cantadoEsteTurno = false;
        input.carta = -1;
        input.cantar = -1;
        for (int i = 0; i < 4; i++) palosCantados[i] = false;
    }
}
