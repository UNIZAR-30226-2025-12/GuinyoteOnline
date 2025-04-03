using UnityEngine;
using UnityEngine.InputSystem;
using UnityEngine.UIElements;
using UnityEngine.SceneManagement;
using System.IO;
using System;

public class GameManager : MonoBehaviour
{
    public static GameManager Instance { get; private set; }
    public TurnManager TurnManager { get; private set; }
    public Player_Controller playerPrefab;
    public IA_Player iAPrefab;
    public Player[] jugadores;
    public int[] orden;
    public static int numJugadores = 4; 
    public Baraja Baraja;
    public Carta[] cartasJugadas;
    public Carta triunfo;
    public bool cartasMoviendo, segundaBaraja, arrastre, finRonda;
    public Vector3 ubicacionGanador;
    public UIDocument UIDoc; 
    private Label m_P_TeamA;
    private Label m_P_TeamB;
    private Label m_FinPartida;
    private Button m_FinPartidaButton;
    private int indexGanador;
    public int ganador;
    public bool mostrandoCantar;

    public string test_state = "";


    private void Awake()
    {
        if (Instance == null)
        {
            //DontDestroyOnLoad(gameObject);
            Instance = this;
        }
        else
        {
            Destroy(gameObject);
        }
    }

    void Start()
    {
        arrastre = false;
        segundaBaraja = false;
        finRonda = false;

        UIDoc = UnityEngine.Object.FindFirstObjectByType<UIDocument>();
        m_P_TeamA = UIDoc.rootVisualElement.Q<Label>("PointsTeamA");
        m_P_TeamB = UIDoc.rootVisualElement.Q<Label>("PointsTeamB");
        m_FinPartida = UIDoc.rootVisualElement.Q<Label>("FinPartida_Label");
        m_FinPartidaButton = UIDoc.rootVisualElement.Q<Button>("atras");
        m_FinPartidaButton.RegisterCallback<ClickEvent>(ev => UIManager.goBack());

        m_FinPartida.style.visibility = Visibility.Hidden;

        m_P_TeamA.text = ""; 
        m_P_TeamB.text = ""; 

        Baraja = (Instantiate(Baraja, new Vector3(20, 0, 0), Quaternion.identity));
        Baraja.GetComponent<SpriteRenderer>().sortingOrder = 15;
        int[] puntosJugadores = {0, 0, 0, 0};
        if (test_state == "") Baraja.Barajar();
        else puntosJugadores = loadTest(ref Baraja);

        InitJugadores(puntosJugadores);

        if (test_state != "") ActualizarMarcadores();
        triunfo = Baraja.DarCarta();
        if (triunfo != null) Baraja.AnyadirAlFinal(triunfo);
        triunfo.transform.position = new Vector3(Baraja.transform.position.x - 2, Baraja.transform.position.y, 0);
        triunfo.transform.rotation = Quaternion.Euler(0,0,90);
        
        TurnManager = new TurnManager(jugadores.Length);
        TurnManager.TurnChange += TurnChange;
        TurnManager.Evaluation += Evaluar;
        TurnManager.FinRonda += TerminarRonda;
        TurnManager.Reset();

        orden = new int[jugadores.Length];
        for (int i = 0; i < jugadores.Length; i++)
        {
            orden[i] = i;
        }

        TurnManager.Tick();
        
    }

    /*
     * Carga el estado de test del fichero "test_state".
     * Devuelve un array de enteros con los puntos de 
     * cada uno de los jugadores en orden (0 a 3).
     */
    private int[] loadTest(ref Baraja baraja)
    {
        string line;
        string test_path = Path.Combine(Application.streamingAssetsPath, test_state);
        StreamReader sr = new StreamReader(test_path);
        line = sr.ReadLine();
        baraja.Barajar(line);
        
        int[] puntosJugadores = new int[4];
        line = sr.ReadLine();
        puntosJugadores[0] = int.Parse(line);
        line = sr.ReadLine();
        puntosJugadores[1] = int.Parse(line);
        line = sr.ReadLine();
        puntosJugadores[2] = int.Parse(line);
        line = sr.ReadLine();
        puntosJugadores[3] = int.Parse(line);
        line = sr.ReadLine();
        segundaBaraja = (line == "True");

        sr.Close();

        return puntosJugadores;
    }

    /* 
     * Devuelve la carta que va ganando la baza actual si es del
     * otro equipo (si es del compañero devuelve null), y el palo
     * de la primera carta jugada durante la misma en paloJugado.
     * Si no hay ninguna carta jugada, devuelve null y paloJugado = -1.
     */
    public Carta getCartaJugada(out int paloJugado)
    {
        paloJugado = -1;
        //2 JUGADORES
        if (jugadores.Length == 2)
        {
            if (jugadores[orden[0]].jugada != null) paloJugado = jugadores[orden[0]].jugada.Palo;
            return jugadores[orden[0]].jugada;
        }

        //4 JUGADORES
        if (jugadores[orden[0]].jugada == null) //NADIE HA JUGADO, SOY PRIMERO
        {
            return null;
        }
        else if (jugadores[orden[1]].jugada == null) //PRIMERO HA JUGADO, SOY SEGUNDO
        {
            //DEVUELVE UNICA CARTA JUGADA, ES DEL OTRO EQUIPO Y SE DEBE MATAR SI ES POSIBLE
            paloJugado = jugadores[orden[0]].jugada.Palo;
            return jugadores[orden[0]].jugada;
        }
        else if (jugadores[orden[2]].jugada == null) //SEGUNDO HA JUGADO, SOY TERCERO
        {
            paloJugado = jugadores[orden[0]].jugada.Palo;
            //SE DEVUELVE LA CARTA DEL SEGUNDO SI HA MATADO, SI NO NULL
            //(EL PRIMERO ES DE TU EQUIPO Y NO HACE FALTA MATAR AL DE TU EQUIPO)
            if ((jugadores[orden[1]].jugada.Palo == jugadores[orden[0]].jugada.Palo &&
               (jugadores[orden[1]].jugada.Puntos > jugadores[orden[0]].jugada.Puntos ||
               (jugadores[orden[1]].jugada.Puntos == jugadores[orden[0]].jugada.Puntos &&
                jugadores[orden[1]].jugada.Numero > jugadores[orden[0]].jugada.Numero))) ||
               (jugadores[orden[1]].jugada.Palo != jugadores[orden[0]].jugada.Palo &&
                jugadores[orden[1]].jugada.Palo == triunfo.Palo))
            {
                return jugadores[orden[1]].jugada;
            }
            else return null;
        }
        else if (jugadores[orden[3]].jugada == null) //TERCERO HA JUGADO, SOY ULTIMO
        {
            paloJugado = jugadores[orden[0]].jugada.Palo;
            //SE DEVUELVE LA CARTA MAXIMA DE LA PARTIDA SI ES DEL OTRO EQUIPO,
            //EN CASO CONTRARIO SE DEVUELVE NULL (MI COMPAÑERO HA MATADO)

            //JUGADOR DE MI EQUIPO (SEGUNDO) HA MATADO AL PRIMERO (OTRO EQUIPO)
            if ((jugadores[orden[1]].jugada.Palo == jugadores[orden[0]].jugada.Palo &&
               (jugadores[orden[1]].jugada.Puntos > jugadores[orden[0]].jugada.Puntos ||
               (jugadores[orden[1]].jugada.Puntos == jugadores[orden[0]].jugada.Puntos &&
                jugadores[orden[1]].jugada.Numero > jugadores[orden[0]].jugada.Numero))) ||
               (jugadores[orden[1]].jugada.Palo != jugadores[orden[0]].jugada.Palo &&
                jugadores[orden[1]].jugada.Palo == triunfo.Palo))
            {
                //JUGADOR DEL OTRO EQUIPO (TERCERO) HA MATADO AL DE MI EQUIPO (SEGUNDO)
                if ((jugadores[orden[2]].jugada.Palo == jugadores[orden[1]].jugada.Palo &&
                   (jugadores[orden[2]].jugada.Puntos > jugadores[orden[1]].jugada.Puntos ||
                   (jugadores[orden[2]].jugada.Puntos == jugadores[orden[1]].jugada.Puntos &&
                    jugadores[orden[2]].jugada.Numero > jugadores[orden[1]].jugada.Numero))) ||
                   (jugadores[orden[2]].jugada.Palo != jugadores[orden[1]].jugada.Palo &&
                    jugadores[orden[2]].jugada.Palo == triunfo.Palo))
                {
                    return jugadores[orden[2]].jugada; //MAXIMA ES LA DEL TERCERO
                }
                else return null; //MAXIMA ES LA DE MI EQUIPO
            }
            else if ((jugadores[orden[2]].jugada.Palo == jugadores[orden[0]].jugada.Palo &&
                    (jugadores[orden[2]].jugada.Puntos > jugadores[orden[0]].jugada.Puntos ||
                    (jugadores[orden[2]].jugada.Puntos == jugadores[orden[0]].jugada.Puntos &&
                     jugadores[orden[2]].jugada.Numero > jugadores[orden[0]].jugada.Numero))) ||
                    (jugadores[orden[2]].jugada.Palo != jugadores[orden[0]].jugada.Palo &&
                     jugadores[orden[2]].jugada.Palo == triunfo.Palo))
            { //JUGADOR DE MI EQUIPO NO HA MATADO, PERO EL TERCERO SI HA MATADO AL PRIMERO
                return jugadores[orden[2]].jugada; //MAXIMA ES LA DEL TERCERO
            }
            else return jugadores[orden[0]].jugada; //MAXIMA ES LA DEL PRIMERO
        }
        else return null; //CASO IMPOSIBLE, TODOS HABRIAN JUGADO
    }

    private void InitJugadores(int[] puntosJugadores)
    {
        jugadores = new Player[numJugadores];
        jugadores[0] = Instantiate(playerPrefab, new Vector3(0, -12, 0),Quaternion.Euler(0, 0, 0));
        for (int j = 0; j < 6; j++)
        {
            jugadores[0].AnyadirCarta(Baraja.DarCarta());
        }
        jugadores[0].puntos = puntosJugadores[0];
        if(numJugadores == 2)
        {
            if (test_state == "" || test_state == "testIA") jugadores[1] = Instantiate(iAPrefab, new Vector3(0, 12, 0),Quaternion.Euler(0, 0, 180));
            else jugadores[1] = Instantiate(playerPrefab, new Vector3(0, 12, 0),Quaternion.Euler(0, 0, 180));
            for (int j = 0; j < 6; j++)
            {
                jugadores[1].AnyadirCarta(Baraja.DarCarta());
            }
            jugadores[1].puntos = puntosJugadores[1];
        }
        else if(numJugadores == 4)
        {
            if (test_state == "" || test_state == "testIA") jugadores[1] = Instantiate(iAPrefab, new Vector3(12, 0, 0), Quaternion.Euler(0, 0, 90));
            else jugadores[1] = Instantiate(playerPrefab, new Vector3(12, 0, 0),Quaternion.Euler(0, 0, 90));
            for (int j = 0; j < 6; j++)
            {
                jugadores[1].AnyadirCarta(Baraja.DarCarta());
            }
            jugadores[1].puntos = puntosJugadores[1];
            if (test_state == "" || test_state == "testIA") jugadores[2] = Instantiate(iAPrefab, new Vector3(0, 12, 0), Quaternion.Euler(0, 0, 180));
            else jugadores[2] = Instantiate(playerPrefab, new Vector3(0, 12, 0),Quaternion.Euler(0, 0, 180));
            for (int j = 0; j < 6; j++)
            {
                jugadores[2].AnyadirCarta(Baraja.DarCarta());
            }
            jugadores[2].puntos = puntosJugadores[2];
            if (test_state == "" || test_state == "testIA") jugadores[3] = Instantiate(iAPrefab, new Vector3(-12, 0, 0), Quaternion.Euler(0, 0, -90));
            else jugadores[3] = Instantiate(playerPrefab, new Vector3(-12, 0, 0),Quaternion.Euler(0, 0, -90));
            for (int j = 0; j < 6; j++)
            {
                jugadores[3].AnyadirCarta(Baraja.DarCarta());
            }
            jugadores[3].puntos = puntosJugadores[3];
        }
        else Debug.Log("Error numero de jugadores es incorrecto");

        cartasJugadas = new Carta[jugadores.Length];
        cartasMoviendo = false;
    }

    void Update()
    {
        if (!cartasMoviendo) return;
        for (int i = 0; i < jugadores.Length; i++)
        {
            if (cartasJugadas[i] != null)
            {
                cartasJugadas[i].transform.position = Vector3.MoveTowards(jugadores[i].jugada.transform.position, ubicacionGanador, 15f * Time.deltaTime);
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
            if (finRonda && segundaBaraja)
            {
                BarajarYRepartir();
                finRonda = false;
            }
            if (!finRonda) TurnManager.Tick();
        }
    }

    public void mostrarCantar(int palo)
    {
        int puntos = (palo == triunfo.Palo) ? 40 : 20;
        string paloString = "";
        if (palo == 0) paloString = "bastos";
        if (palo == 1) paloString = "copas";
        if (palo == 2) paloString = "espadas";
        if (palo == 3) paloString = "oros";
        mostrandoCantar = true;
        m_FinPartida.text = "Cantado " + (puntos).ToString() + " en " + paloString;
        m_FinPartida.style.visibility = Visibility.Visible;
        Invoke("finMostrarCantar", 1f);
    }

    public void finMostrarCantar()
    {
        mostrandoCantar = false;
        m_FinPartida.style.visibility = Visibility.Hidden;
    }
    public void TurnChange(int turno)
    {
        if(turno > 0){
            cartasJugadas[orden[turno-1]] = jugadores[orden[turno-1]].jugada;
        }
        jugadores[orden[turno]].meToca();
        //Debug.Log("Le toca al jugador " + orden[turno]);
    }

    public void Evaluar()
    {
        cartasJugadas[orden.Length-1] = jugadores[orden.Length-1].jugada;
        indexGanador = orden[0];
        int maxPuntos = jugadores[orden[0]].jugada.Puntos;
        int sumaPuntos = jugadores[orden[0]].jugada.Puntos;
        bool triunfo = (jugadores[orden[0]].jugada.Palo == this.triunfo.Palo);
        int paloJugado = jugadores[orden[0]].jugada.Palo;

        for (int i = 1; i < jugadores.Length; i++)
        {
            int aux = jugadores[orden[i]].jugada.Puntos;
            sumaPuntos += aux;
            cartasJugadas[orden[i]] = jugadores[orden[i]].jugada;
            if (triunfo)
            {
                if (cartasJugadas[orden[i]].Palo == this.triunfo.Palo)
                {
                    if (aux > maxPuntos)
                    {
                        maxPuntos = aux;
                        indexGanador = orden[i];
                    }
                    else if (aux == maxPuntos && cartasJugadas[orden[i]].Numero > jugadores[indexGanador].jugada.Numero)
                    {
                        indexGanador = orden[i];
                    }
                }
            }
            else
            {
                if (cartasJugadas[orden[i]].Palo == this.triunfo.Palo)
                {
                    triunfo = true;
                    maxPuntos = aux;
                    indexGanador = orden[i];
                }
                else if (cartasJugadas[orden[i]].Palo == paloJugado)
                {
                    if (aux > maxPuntos)
                    {
                        maxPuntos = aux;
                        indexGanador = orden[i];
                    }
                    else if (aux == maxPuntos && cartasJugadas[orden[i]].Numero > jugadores[indexGanador].jugada.Numero)
                    {
                        indexGanador = orden[i];
                    }
                }
            }
            //Destroy(cartasJugadas[i].gameObject);
        }

        //FINALIZACION DE TURNO
        ubicacionGanador = jugadores[indexGanador].transform.position;
        jugadores[indexGanador].ganador = true;
        jugadores[(indexGanador + 1) % jugadores.Length].ganador = false;
        if (jugadores.Length == 4)
        {
            jugadores[(indexGanador + 3) % 4].ganador = false;
            jugadores[(indexGanador + 2) % 4].ganador = true;
        }
        cartasMoviendo = true;
        jugadores[indexGanador].puntos += sumaPuntos;
        for (int i = 0; i < jugadores.Length; i++)
        {
            orden[i] = (i + indexGanador) % jugadores.Length;
        }
        TurnManager.Reset();
        for (int i = 0; i < jugadores.Length; i++)
        {
            jugadores[orden[i]].AnyadirCarta(Baraja.DarCarta());
        }

        //COMPROBAR SI HA ACABADO LA RONDA
        finRonda = true;
        foreach (var i in jugadores[0].mano)
        {
            if (i != null)
            {
                finRonda = false;
                break;
            }
        }

        if (finRonda) jugadores[orden[0]].puntos += 10; //10 ultimas

        ActualizarMarcadores();

        if (!segundaBaraja) return;
        if (jugadores.Length == 4)
        {
            if (jugadores[0].puntos + jugadores[2].puntos > 100)
            {
                ganador = 1;
                finRonda = true;
            }
            if (jugadores[1].puntos + jugadores[3].puntos > 100)
            {
                ganador = 2;
                finRonda = true;
            }
        }
        else
        {
            if (jugadores[0].puntos > 100)
            {
                ganador = 1;
                finRonda = true;
            }
            if (jugadores[1].puntos > 100)
            {
                ganador = 2;
                finRonda = true;
            }
        }
    }

    public void ActualizarMarcadores()
    {
        if (!segundaBaraja && test_state == "")
        {
            m_P_TeamA.text = "";
            m_P_TeamB.text = "";
            return;
        }

        int puntosA = jugadores[0].puntos;
        int puntosB = jugadores[1].puntos;
        if (jugadores.Length == 4)
        {
            puntosA += jugadores[2].puntos;
            puntosB += jugadores[3].puntos;
        }
        string buenasA = (puntosA >= 50) ? "Buenas" : "Malas";
        string buenasB = (puntosB >= 50) ? "Buenas" : "Malas";

        puntosA = (puntosA < 100) ? puntosA % 50 : puntosA - 50;
        puntosB = (puntosB < 100) ? puntosB % 50 : puntosB - 50;

        if (jugadores.Length == 4) m_P_TeamA.text = "Equipo 1\n" + (puntosA).ToString() + "\n" + buenasA;
        else m_P_TeamA.text = "Jugador 1\n" + (puntosA).ToString() + "\n" + buenasA;

        if (jugadores.Length == 4) m_P_TeamB.text = "Equipo 2\n" + (puntosB).ToString() + "\n" + buenasB;
        else m_P_TeamB.text = "Jugador 2\n" + (puntosB).ToString() + "\n" + buenasB;
    }

    public void TerminarRonda()
    {
        segundaBaraja = false;
        if (jugadores.Length == 4)
        {
            if (jugadores[0].puntos + jugadores[2].puntos > 100) ganador = 1;
            else if (jugadores[1].puntos + jugadores[3].puntos > 100) ganador = 2;
            else segundaBaraja = true;
        }
        else
        {
            if (jugadores[0].puntos > 100) ganador = 1;
            else if (jugadores[1].puntos > 100) ganador = 2;
            else segundaBaraja = true;
        }
        ActualizarMarcadores();

        if (!segundaBaraja) //PARTIDA TERMINADA
        {
            m_FinPartida.style.visibility = Visibility.Visible;
            if (jugadores.Length == 2) m_FinPartida.text = "Ganador: Jugador " + ganador.ToString();
            else m_FinPartida.text = "Ganador: Equipo " + ganador.ToString();

            m_FinPartidaButton.SetEnabled(true);
            m_FinPartidaButton.style.display = DisplayStyle.Flex;
        }
    }

    void BarajarYRepartir()
    {
        arrastre = false;
        Baraja.RecogerCartas();

        Baraja.Barajar();
        for (int i = 0; i < jugadores.Length; i++)
        {
            for (int j = 0; j < 6; j++)
            {
                jugadores[i].AnyadirCarta(Baraja.DarCarta());
            }
            jugadores[i].reset();
        }
        Destroy(triunfo.gameObject);
        triunfo = Baraja.DarCarta();
        Baraja.AnyadirAlFinal(triunfo);
        triunfo.transform.position = new Vector3(Baraja.transform.position.x - 2, Baraja.transform.position.y, 0);
        triunfo.transform.rotation = Quaternion.Euler(0,0,90);

        TurnManager.Reset();

        orden = new int[jugadores.Length];
        for (int i = 0; i < jugadores.Length; i++)
        {
            orden[i] = (i + indexGanador) % jugadores.Length;
        }
    }
}
