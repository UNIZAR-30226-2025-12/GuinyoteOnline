using UnityEngine;
using UnityEngine.InputSystem;

public class GameManager : MonoBehaviour
{
    public static GameManager Instance { get; private set; }
    public TurnManager TurnManager { get; private set; }
    public Player_Controller playerPrefab;
    public IA_Player iAPrefab;
    public Player[] jugadores;
    public int[] orden;
    public int numJugadores = 2; 
    public Baraja Baraja;
    public Carta[] cartasJugadas;
    public Carta triunfo;
    public bool cartasMoviendo;
    public Vector3 ubicacionGanador;

    private void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
        }
        else
        {
            Destroy(gameObject);
        }
    }

    // Start is called once before the first execution of Update after the MonoBehaviour is created
    void Start()
    {
        Baraja = (Instantiate(Baraja, new Vector3(20, 0, 0), Quaternion.identity));
        Baraja.GetComponent<SpriteRenderer>().sortingOrder = 15;
        Baraja.Barajar();

        InitJugadores();

        triunfo = Baraja.DarCarta();
        triunfo.transform.position = new Vector3(Baraja.transform.position.x - 2, Baraja.transform.position.y, 0);
        triunfo.transform.rotation = Quaternion.Euler(0,0,90);
        
        TurnManager = new TurnManager(jugadores.Length);
        TurnManager.TurnChange += TurnChange;
        TurnManager.Evaluation += Evaluar;
        TurnManager.Reset();

        orden = new int[jugadores.Length];
        for (int i = 0; i < jugadores.Length; i++)
        {
            orden[i] = i;
        }

        TurnManager.Tick();
        
    }

    private void InitJugadores(){
        jugadores = new Player[numJugadores];
        jugadores[0] = Instantiate(playerPrefab, new Vector3(0, -12, 0),Quaternion.Euler(0, 0, 0));
        for (int j = 0; j < 6; j++)
        {
            jugadores[0].AnyadirCarta(Baraja.DarCarta());
        }
        if(numJugadores == 2){
            jugadores[1] = Instantiate(iAPrefab, new Vector3(0, 12, 0),Quaternion.Euler(0, 0, 180));
            for (int j = 0; j < 6; j++)
            {
                jugadores[1].AnyadirCarta(Baraja.DarCarta());
            }
        }
        else if(numJugadores == 4){
            jugadores[1] = Instantiate(iAPrefab, new Vector3(12, 0, 0), Quaternion.Euler(0, 0, 90));
            for (int j = 0; j < 6; j++)
            {
                jugadores[1].AnyadirCarta(Baraja.DarCarta());
            }
            jugadores[2] = Instantiate(iAPrefab, new Vector3(0, 12, 0), Quaternion.Euler(0, 0, 180));
            for (int j = 0; j < 6; j++)
            {
                jugadores[2].AnyadirCarta(Baraja.DarCarta());
            }
            jugadores[3] = Instantiate(iAPrefab, new Vector3(-12, 0, 0), Quaternion.Euler(0, 0, -90));
            for (int j = 0; j < 6; j++)
            {
                jugadores[3].AnyadirCarta(Baraja.DarCarta());
            }
        }
        else{
            Debug.Log("Error numero de jugadores es incorrecto");
        }
        cartasJugadas = new Carta[jugadores.Length];
        cartasMoviendo = false;
    }

    void Update()
    {
        if (cartasMoviendo)
        {
            for (int i = 0; i < jugadores.Length; i++)
            {
                if (cartasJugadas[i] != null)
                {
                    cartasJugadas[i].transform.position = Vector3.MoveTowards(jugadores[i].jugada.transform.position, ubicacionGanador, 7.5f * Time.deltaTime);
                    if (cartasJugadas[i].transform.position == ubicacionGanador)
                    {
                        Destroy(cartasJugadas[i].gameObject);
                        jugadores[i].jugada = null;
                    }
                }
            }
            bool moviendo = false;
            for (int i = 0; i < jugadores.Length; i++)
            {
                if (jugadores[i].jugada != null)
                {
                    moviendo = true;
                    break;
                }
            }
            if (!moviendo)
            {
                cartasMoviendo = false;
                TurnManager.Tick();
            }
        }
    }

    public void TurnChange(int turno)
    {
        if(turno > 0){
            cartasJugadas[orden[turno-1]] = jugadores[orden[turno-1]].jugada;
        }
        jugadores[orden[turno]].meToca();
        Debug.Log("Le toca al jugador " + orden[turno]);
    }

    public void Evaluar()
    {
        cartasJugadas[orden.Length-1] = jugadores[orden.Length-1].jugada;
        int indexGanador = -1;
        int maxPuntos = -1;
        int sumaPuntos = 0;
        bool triunfo = false;

        for (int i = 0; i < jugadores.Length; i++)
        {
            int aux = jugadores[i].jugada.Puntos;
            sumaPuntos += aux;
            cartasJugadas[i] = jugadores[i].jugada;
            if (triunfo)
            {
                if (cartasJugadas[i].Palo == this.triunfo.Palo)
                {
                    if (aux > maxPuntos)
                    {
                        maxPuntos = aux;
                        indexGanador = i;
                    }
                }
            }
            else
            {
                if (cartasJugadas[i].Palo == this.triunfo.Palo)
                {
                    triunfo = true;
                    maxPuntos = aux;
                    indexGanador = i;
                }
                else
                {
                    if (aux > maxPuntos)
                    {
                        maxPuntos = aux;
                        indexGanador = i;
                    }
                    else if (aux == maxPuntos)
                    {
                        if (cartasJugadas[i].Numero > jugadores[indexGanador].jugada.Numero)
                        {
                            indexGanador = i;
                        }
                    }
                }
            }
            //Destroy(cartasJugadas[i].gameObject);
        }
        ubicacionGanador = jugadores[indexGanador].transform.position;
        cartasMoviendo = true;
        jugadores[indexGanador].puntos += sumaPuntos;
        for (int i = 0; i < jugadores.Length; i++)
        {
            orden[i] = (i + indexGanador) % jugadores.Length;
        }
        TurnManager.Reset();
        for (int i = 0; i < jugadores.Length; i++)
        {
            jugadores[i].AnyadirCarta(Baraja.DarCarta());
        }
    }
}
