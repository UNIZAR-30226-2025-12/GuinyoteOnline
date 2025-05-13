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
    public Carta cartaPrefab;
    public Carta[] mano;
    public Carta jugada;
    public bool m_esMiTurno = false;
    protected bool m_CartaDesplazandose = false;
    public int puntos;
    public bool ganador = false, cantadoEsteTurno = false;
    private float[] posiciones = { -8.65f, -5.15f, -1.75f, 1.75f, 5.15f, 8.65f };
    public input input;
    protected bool[] palosCantados = new bool[4] {false, false, false, false};
    public Player()
    {
        mano = new Carta[6];
        jugada = null;
        puntos = 0;
        input.carta = -1;
        input.cantar = -1;
    }

    protected void Start()
    {
        m_MoveTarget = transform.position + transform.up * 6.35f;
    }

    protected void Update()
    {
        if (m_CartaDesplazandose)
        {
            try
            {
            jugada.transform.position = Vector3.MoveTowards(jugada.transform.position, m_MoveTarget, 15f * Time.deltaTime);

            if (jugada.transform.position == m_MoveTarget)
            {
                m_esMiTurno = false;
                m_CartaDesplazandose = false;
                GameManager.Instance.TurnManager.Tick();
            }
            }
            catch
            {
                Debug.Log(jugada);
            }
        }
    }

    public string GetMano()
    {
        string manoTexto = "";
        foreach(Carta carta in mano)
        {
            if (carta != null) manoTexto += carta.ToString() + ";";
            else manoTexto += "null;";
        }
        manoTexto = manoTexto.Remove(manoTexto.Length - 1);
        return manoTexto;
    }

    public void SetMano(string manoStr)
    {
        string[] cartasTexto = manoStr.Split(';');
        for (int i = 0; i < mano.Length; i++)
        {
            if (cartasTexto[i] == "null")
            {
                mano[i] = null;
                continue;
            }

            string[] numeroPalo = cartasTexto[i].Split(',');
            Carta carta = Instantiate(cartaPrefab, transform.position, Quaternion.identity);
            int numero = int.Parse(numeroPalo[0]);
            if (numero > 7) numero -= 3;
            else numero -= 1;
            carta.setCarta(int.Parse(numeroPalo[1]), numero);
            mano[i] = carta;
            if (this is Player_Controller)
            {
                carta.enMano = true; 
            }
            carta.transform.rotation = this.transform.rotation;
            carta.transform.position = this.transform.position + this.transform.right * posiciones[i];
        }
    }

    public void SetJugada(string jugadaStr)
    {
        if (jugadaStr == "0") return;

        string[] numeroPalo = jugadaStr.Split(',');
        Carta carta = Instantiate(cartaPrefab, transform.position, Quaternion.identity);
        int numero = int.Parse(numeroPalo[0]);
        if (numero > 7) numero -= 3;
        else numero -= 1;
        carta.setCarta(int.Parse(numeroPalo[1]), numero);
        jugada = carta;
        carta.transform.rotation = this.transform.rotation;
        carta.transform.position = transform.position + transform.up * 6.35f;
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
                if (this is Player_Controller)
                {
                   carta.enMano = true; 
                }
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
            if (this is Player_Controller)
            {
                carta.enMano = false; 
            }
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
                if (this is Player_Controller)
                {
                   GameManager.Instance.triunfo.enMano = false; 
                }

                //CAMBIO POSICION TRIUNFO
                mano[i].transform.rotation = this.transform.rotation;
                mano[i].transform.position = this.transform.position + this.transform.right * posiciones[i];
                if (this is Player_Controller)
                {
                   mano[i].enMano = true; 
                }

                //CAMBIAR VALOR ULTIMA CARTA BARAJA
                GameManager.Instance.Baraja.EliminarUltima();
                GameManager.Instance.Baraja.AnyadirAlFinal(GameManager.Instance.triunfo);
                GameManager.Instance.mostrarCambiarSiete();
                break;
            }
        }
    }

    public void cantar(int palo)
    {
        Debug.Log("CANTO " + palo);
        if (palo == GameManager.Instance.triunfo.Palo) puntos += 40;
        else puntos += 20;
        GameManager.Instance.mostrarCantar(palo);
    }
    public void meToca()
    {
        m_esMiTurno = true;
        cantadoEsteTurno = false;
    }

    public void resetInput()
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
        if(this is Player_Controller){
            if(!cartaValida) {
                mano[input.carta].enMano = true;
                mano[input.carta].jugada = false;
                mano[input.carta].OnMouseExit();
            }
        }
        return cartaValida;
    }

    protected bool turno()
    {
        if (GameManager.Instance.mostrandoCantar) return false;
        else if (m_esMiTurno)
        {
            if (this is Online_Player) Debug.Log("mi turno");
            int index = 0;
            bool cartaSeleccionada = false;
            if (input.carta > -1 && input.carta < 6 && !GameManager.Instance.arrastre)
            {
                index = input.carta;
                cartaSeleccionada = true;
                Debug.Log(index);
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
                if(ganador && !GameManager.Instance.arrastre) 
                {
                    cambiarSieteTriunfo();
                    return true;
                }
            }
            else if (input.cantar > -1 && input.cantar < 4)
            {
                if (ganador && !cantadoEsteTurno && !palosCantados[input.cantar])
                {
                    bool hayRey = false;
                    bool haySota = false;
                    foreach (var c in mano)
                    {
                        if (c == null) continue;

                        if (c.Numero == 10 && c.Palo == input.cantar) haySota = true;
                        if (c.Numero == 12 && c.Palo == input.cantar) hayRey = true;
                    }
                    if (hayRey && haySota)
                    {
                        cantar(input.cantar);
                        palosCantados[input.cantar] = true;
                        cantadoEsteTurno = true;
                        GameManager.Instance.ActualizarMarcadores();
                        return true;
                    }
                }
            }

            if (cartaSeleccionada)
            {
                //Debug.Log("carta elegida");
                Debug.Log(index);
                if (UsarCarta(index))
                {
                    Debug.Log("carta usada");
                    cartaSeleccionada = false;
                    m_CartaDesplazandose = true;
                    return true;
                }
            }
        }
        return false;
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
