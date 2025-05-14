using UnityEngine;
using UnityEngine.InputSystem;
using UnityEngine.UIElements;
using UnityEngine.SceneManagement;
using System.IO;
using System;
using WebSocketClient;
using System.Threading.Tasks;
using System.Collections.Generic;

/// <summary>
/// Clase principal que gestiona el estado del juego, los turnos y los jugadores.
/// </summary>
public class GameManager : MonoBehaviour
{
    public static GameManager Instance { get; private set; }
    public TurnManager TurnManager { get; private set; }
    public Player_Controller playerPrefab;
    public Online_Player onlinePlayerPrefab;
    public IA_Player iAPrefab;
    public Player[] jugadores;
    public int[] orden;
    private int[] puntosJugadores = new int[4];
    public static int numJugadores = 4;
    public static bool esOnline = false; 
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
    private Button m_B_Bastos;
    private Button m_B_Copas;
    private Button m_B_Espadas;
    private Button m_B_Oros;
    private Button m_B_Siete;
    private int indexGanador;
    public int ganador;
    public bool mostrandoCantar;
    public string test_state = "";

    public wsClient webSocketClient;

    [System.Serializable]
    public class Orden
    {
        public int miId;
        public string orden;
        public int turno;
    }

    [System.Serializable]
    public class Puntos
    {
        public int puntos0;
        public int puntos1;
        public int puntos2;
        public int puntos3;
    }

    [System.Serializable]
    public class Manos
    {
        public string mano0;
        public string mano1;
        public string mano2;
        public string mano3;
    }

    [System.Serializable]
    public class Jugadas
    {
        public string jugada0;
        public string jugada1;
        public string jugada2;
        public string jugada3;
    }

    /// <summary>
    /// Inicializa la instancia singleton del GameManager.
    /// </summary>
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

    /// <summary>
    /// Configura el estado inicial del juego y el entorno.
    /// </summary>
    void Start()
    {
        GameObject tapete = GameObject.Find("Tapete");
        SpriteRenderer spriteRenderer = tapete.GetComponent<SpriteRenderer>();
        spriteRenderer.sprite = Resources.Load<Sprite>("Sprites/Tapetes/" + UIManager.tapete_picture);
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

        m_B_Bastos = UIDoc.rootVisualElement.Q<Button>("B_Bastos");
        m_B_Bastos.RegisterCallback<ClickEvent>(ev => handleCantar(0));
        m_B_Copas = UIDoc.rootVisualElement.Q<Button>("B_Copas");
        m_B_Copas.RegisterCallback<ClickEvent>(ev => handleCantar(1));
        m_B_Espadas = UIDoc.rootVisualElement.Q<Button>("B_Espadas");
        m_B_Espadas.RegisterCallback<ClickEvent>(ev => handleCantar(2));
        m_B_Oros = UIDoc.rootVisualElement.Q<Button>("B_Oros");
        m_B_Oros.RegisterCallback<ClickEvent>(ev => handleCantar(3));
        m_B_Siete = UIDoc.rootVisualElement.Q<Button>("B_Siete");
        m_B_Siete.RegisterCallback<ClickEvent>(ev => handleCambiarSiete());
        

        if (esOnline)
        {
            webSocketClient = UIManager.Instance.webSocketClient;
            webSocketClient.enviarACK();
        }
        else
        {
            iniciarBaraja();
            iniciarJugadores();
        }
    }

    /// <summary>
    /// Inicia la baraja y ordena las cartas barajando aleatoriamente,
    /// a partir de un string o a partir de un documento de test.
    /// </summary>
    /// <param name="baraja">
    /// String que define el orden de la baraja. Debe tener el formato
    /// numero,valor;numero,valor;...numero,valor. Si es vacío (valor por 
    /// defecto) el orden de las cartas se definirá de otra forma.
    /// </param>
    public void iniciarBaraja(string baraja = "")
    {   
        Debug.Log("iniciando baraja");
        Baraja = (Instantiate(Baraja, new Vector3(20, 0, 0), Quaternion.identity));
        Baraja.GetComponent<SpriteRenderer>().sortingOrder = 15;
        for(int i = 0; i < 4; i++) puntosJugadores[i] = 0;
        
        if (esOnline) Baraja.Barajar(baraja); //ONLINE
        else if (test_state == "") Baraja.Barajar(); //OFFLINE
        else puntosJugadores = loadTest(ref Baraja); //TEST
        
        Debug.Log("Baraja iniciada");

        if (esOnline) webSocketClient.enviarACK();
    }

    /// <summary>
    /// Inicia los jugadores de la partida con un orden específico.
    /// </summary>
    /// <param name="primero">Jugador que comienza la partida.</param>
    /// <param name="miId">Para el online, id que asigna el servidor a este cliente</param>
    public void iniciarJugadores(int primero = 0, int miId = 0)
    {
        jugadores = new Player[numJugadores];
        orden = new int[jugadores.Length];
        Debug.Log("asignando orden");
        Debug.Log("el primero es " + primero + ", soy " + miId);
        for (int i = 0; i < jugadores.Length; i++)
        {
            orden[i] = (primero + i - miId + jugadores.Length) % jugadores.Length;
            Debug.Log(orden[i]);
        }

        Debug.Log("Iniciando Jugadores");
        InitJugadores(puntosJugadores);

        if (test_state != "") ActualizarMarcadores();
        triunfo = Baraja.DarCarta();
        if (triunfo != null) Baraja.AnyadirAlFinal(triunfo);
        triunfo.transform.position = new Vector3(Baraja.transform.position.x - 2, Baraja.transform.position.y, 0);
        triunfo.transform.rotation = Quaternion.Euler(0,0,90);
        triunfo.sr.sprite = Resources.Load<Sprite>("Sprites/Cartas/" + triunfo.traduccion[triunfo.Palo] + "_" + triunfo.Numero.ToString());

        TurnManager = new TurnManager(jugadores.Length);
        TurnManager.TurnChange += TurnChange;
        TurnManager.Evaluation += Evaluar;
        TurnManager.FinRonda += TerminarRonda;
        TurnManager.Reset();

        TurnManager.Tick();
        Debug.Log("Fin");
        if (esOnline) webSocketClient.enviarACK();
    }

    /// <summary>
    /// Carga el estado de prueba desde un archivo y configura el juego.
    /// </summary>
    /// <param name="baraja">Referencia a la baraja de cartas.</param>
    /// <returns>Un array de enteros que representa los puntos de los jugadores.</returns>
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

    /// <summary>
    /// Determina la carta ganadora de la ronda actual.
    /// </summary>
    /// <param name="paloJugado">Devuelve el palo de la primera carta jugada.</param>
    /// <returns>La carta ganadora o null si no se ha jugado ninguna carta.</returns>
    public Carta getCartaJugada(out int paloJugado)
    {
        paloJugado = -1;
        // 2 JUGADORES
        if (jugadores.Length == 2)
        {
            if (jugadores[orden[0]].jugada != null) paloJugado = jugadores[orden[0]].jugada.Palo;
            return jugadores[orden[0]].jugada;
        }

        // 4 JUGADORES
        if (jugadores[orden[0]].jugada == null) // NADIE HA JUGADO, SOY PRIMERO
        {
            return null;
        }
        else if (jugadores[orden[1]].jugada == null) // PRIMERO HA JUGADO, SOY SEGUNDO
        {
            // DEVUELVE ÚNICA CARTA JUGADA, ES DEL OTRO EQUIPO Y SE DEBE MATAR SI ES POSIBLE
            paloJugado = jugadores[orden[0]].jugada.Palo;
            return jugadores[orden[0]].jugada;
        }
        else if (jugadores[orden[2]].jugada == null) // SEGUNDO HA JUGADO, SOY TERCERO
        {
            paloJugado = jugadores[orden[0]].jugada.Palo;
            // SE DEVUELVE LA CARTA DEL SEGUNDO SI HA MATADO, SI NO NULL
            // (EL PRIMERO ES DE TU EQUIPO Y NO HACE FALTA MATAR AL DE TU EQUIPO)
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
        else if (jugadores[orden[3]].jugada == null) // TERCERO HA JUGADO, SOY ÚLTIMO
        {
            paloJugado = jugadores[orden[0]].jugada.Palo;
            // SE DEVUELVE LA CARTA MÁXIMA DE LA PARTIDA SI ES DEL OTRO EQUIPO,
            // EN CASO CONTRARIO SE DEVUELVE NULL (MI COMPAÑERO HA MATADO)

            // JUGADOR DE MI EQUIPO (SEGUNDO) HA MATADO AL PRIMERO (OTRO EQUIPO)
            if ((jugadores[orden[1]].jugada.Palo == jugadores[orden[0]].jugada.Palo &&
               (jugadores[orden[1]].jugada.Puntos > jugadores[orden[0]].jugada.Puntos ||
               (jugadores[orden[1]].jugada.Puntos == jugadores[orden[0]].jugada.Puntos &&
                jugadores[orden[1]].jugada.Numero > jugadores[orden[0]].jugada.Numero))) ||
               (jugadores[orden[1]].jugada.Palo != jugadores[orden[0]].jugada.Palo &&
                jugadores[orden[1]].jugada.Palo == triunfo.Palo))
            {
                // JUGADOR DEL OTRO EQUIPO (TERCERO) HA MATADO AL DE MI EQUIPO (SEGUNDO)
                if ((jugadores[orden[2]].jugada.Palo == jugadores[orden[1]].jugada.Palo &&
                   (jugadores[orden[2]].jugada.Puntos > jugadores[orden[1]].jugada.Puntos ||
                   (jugadores[orden[2]].jugada.Puntos == jugadores[orden[1]].jugada.Puntos &&
                    jugadores[orden[2]].jugada.Numero > jugadores[orden[1]].jugada.Numero))) ||
                   (jugadores[orden[2]].jugada.Palo != jugadores[orden[1]].jugada.Palo &&
                    jugadores[orden[2]].jugada.Palo == triunfo.Palo))
                {
                    return jugadores[orden[2]].jugada; // MÁXIMA ES LA DEL TERCERO
                }
                else return null; // MÁXIMA ES LA DE MI EQUIPO
            }
            else if ((jugadores[orden[2]].jugada.Palo == jugadores[orden[0]].jugada.Palo &&
                    (jugadores[orden[2]].jugada.Puntos > jugadores[orden[0]].jugada.Puntos ||
                    (jugadores[orden[2]].jugada.Puntos == jugadores[orden[0]].jugada.Puntos &&
                     jugadores[orden[2]].jugada.Numero > jugadores[orden[0]].jugada.Numero))) ||
                    (jugadores[orden[2]].jugada.Palo != jugadores[orden[0]].jugada.Palo &&
                     jugadores[orden[2]].jugada.Palo == triunfo.Palo))
            { // JUGADOR DE MI EQUIPO NO HA MATADO, PERO EL TERCERO SÍ HA MATADO AL PRIMERO
                return jugadores[orden[2]].jugada; // MÁXIMA ES LA DEL TERCERO
            }
            else return jugadores[orden[0]].jugada; // MÁXIMA ES LA DEL PRIMERO
        }
        else return null; // CASO IMPOSIBLE, TODOS HABRÍAN JUGADO
    }

    /// <summary>
    /// Inicializa los jugadores y reparte las cartas.
    /// </summary>
    /// <param name="puntosJugadores">Array de puntos de los jugadores para la inicialización.</param>
    private void InitJugadores(int[] puntosJugadores)
    {
        jugadores[0] = Instantiate(playerPrefab, new Vector3(0, -12, 0),Quaternion.Euler(0, 0, 0));
        jugadores[0].puntos = puntosJugadores[0];
        if(numJugadores == 2)
        {
            if (esOnline) jugadores[1] = Instantiate(onlinePlayerPrefab, new Vector3(0, 12, 0),Quaternion.Euler(0, 0, 180));
            else if (test_state == "" || test_state == "testIA") jugadores[1] = Instantiate(iAPrefab, new Vector3(0, 12, 0),Quaternion.Euler(0, 0, 180));
            else jugadores[1] = Instantiate(playerPrefab, new Vector3(0, 12, 0),Quaternion.Euler(0, 0, 180));
            jugadores[1].puntos = puntosJugadores[1];
        }
        else if(numJugadores == 4)
        {
            if (esOnline) jugadores[1] = Instantiate(onlinePlayerPrefab, new Vector3(12, 0, 0),Quaternion.Euler(0, 0, 90));
            else if (test_state == "" || test_state == "testIA") jugadores[1] = Instantiate(iAPrefab, new Vector3(12, 0, 0), Quaternion.Euler(0, 0, 90));
            else jugadores[1] = Instantiate(playerPrefab, new Vector3(12, 0, 0),Quaternion.Euler(0, 0, 90));
            jugadores[1].puntos = puntosJugadores[1];

            if (esOnline) jugadores[2] = Instantiate(onlinePlayerPrefab, new Vector3(0, 12, 0),Quaternion.Euler(0, 0, 180));
            else if (test_state == "" || test_state == "testIA") jugadores[2] = Instantiate(iAPrefab, new Vector3(0, 12, 0), Quaternion.Euler(0, 0, 180));
            else jugadores[2] = Instantiate(playerPrefab, new Vector3(0, 12, 0),Quaternion.Euler(0, 0, 180));
            jugadores[2].puntos = puntosJugadores[2];

            if (esOnline) jugadores[3] = Instantiate(onlinePlayerPrefab, new Vector3(-12, 0, 0),Quaternion.Euler(0, 0, -90));
            else if (test_state == "" || test_state == "testIA") jugadores[3] = Instantiate(iAPrefab, new Vector3(-12, 0, 0), Quaternion.Euler(0, 0, -90));
            else jugadores[3] = Instantiate(playerPrefab, new Vector3(-12, 0, 0),Quaternion.Euler(0, 0, -90));
            jugadores[3].puntos = puntosJugadores[3];
        }
        else Debug.Log("Error número de jugadores es incorrecto");

        for (int i = 0; i < numJugadores; i++)
        {
            for (int j = 0; j < 6; j++)
            {
                jugadores[orden[i]].AnyadirCarta(Baraja.DarCarta());
            }
        }

        cartasJugadas = new Carta[jugadores.Length];
        cartasMoviendo = false;
    }

    public void ReestablecerEstado(Dictionary<string, object> datos)
    {
        Debug.Log("cargando baraja");
        Baraja = (Instantiate(Baraja, new Vector3(20, 0, 0), Quaternion.identity));
        Baraja.GetComponent<SpriteRenderer>().sortingOrder = 15;
        
        
        Baraja.Barajar(datos["baraja"].ToString());
        segundaBaraja = (datos["segundaBaraja"].ToString() == "true");
        triunfo = Baraja.ObtenerUltima();
        if (triunfo != null)
        {
            triunfo.transform.position = new Vector3(Baraja.transform.position.x - 2, Baraja.transform.position.y, 0);
            triunfo.transform.rotation = Quaternion.Euler(0,0,90);
            triunfo.sr.sprite = Resources.Load<Sprite>("Sprites/Cartas/" + triunfo.traduccion[triunfo.Palo] + "_" + triunfo.Numero.ToString());
        }
        if (datos["baraja"].ToString() == "") arrastre = true;

        Debug.Log("Baraja iniciada");

        Debug.Log("cargando jugadores");
        jugadores = new Player[numJugadores];
        jugadores[0] = Instantiate(playerPrefab, new Vector3(0, -12, 0),Quaternion.Euler(0, 0, 0));
        if (numJugadores == 2) jugadores[1] = Instantiate(onlinePlayerPrefab, new Vector3(0, 12, 0),Quaternion.Euler(0, 0, 180));
        else
        {
            jugadores[1] = Instantiate(onlinePlayerPrefab, new Vector3(12, 0, 0),Quaternion.Euler(0, 0, 90));
            jugadores[2] = Instantiate(onlinePlayerPrefab, new Vector3(0, 12, 0),Quaternion.Euler(0, 0, 180));
            jugadores[3] = Instantiate(onlinePlayerPrefab, new Vector3(-12, 0, 0),Quaternion.Euler(0, 0, -90));
        }
        orden = new int[jugadores.Length];
        Debug.Log("asignando orden");
        var ordenJson = datos["orden"].ToString();
        Orden ordenDatos = JsonUtility.FromJson<Orden>(ordenJson);
        Debug.Log(ordenDatos);
        for (int i = 0; i < orden.Length; i++)
        {
            orden[i] = (ordenDatos.orden[i] - webSocketClient.miId + ordenDatos.miId + numJugadores) % numJugadores;
        }
        Debug.Log("orden asignado");
        Debug.Log("Iniciando Jugadores");
        var puntosJson = datos["puntos"].ToString();
        Puntos puntos = JsonUtility.FromJson<Puntos>(puntosJson);
        Debug.Log(puntos);
        int[] puntosJugadores = new int[4];
        puntosJugadores[0] = puntos.puntos0;
        puntosJugadores[1] = puntos.puntos1;
        puntosJugadores[2] = puntos.puntos2;
        puntosJugadores[3] = puntos.puntos3;

        var manosJson = datos["manos"].ToString();
        Manos manos = JsonUtility.FromJson<Manos>(manosJson);
        Debug.Log(manos);
        string[] manosJugadores = new string[4];
        manosJugadores[0] = manos.mano0;
        manosJugadores[1] = manos.mano1;
        manosJugadores[2] = manos.mano2;
        manosJugadores[3] = manos.mano3;

        var jugadasJson = datos["jugadas"].ToString();
        Jugadas jugadas = JsonUtility.FromJson<Jugadas>(jugadasJson);
        Debug.Log(jugadas);
        cartasJugadas = new Carta[jugadores.Length];
        cartasMoviendo = false;
        string[] jugadasJugadores = new string[4];
        jugadasJugadores[0] = jugadas.jugada0;
        jugadasJugadores[1] = jugadas.jugada1;
        jugadasJugadores[2] = jugadas.jugada2;
        jugadasJugadores[3] = jugadas.jugada3;

        for (int i = 0; i < jugadores.Length; i++)
        {
            jugadores[i].SetMano(manosJugadores[(i + webSocketClient.miId - ordenDatos.miId + numJugadores) % numJugadores]);
            jugadores[i].puntos = puntosJugadores[(i + webSocketClient.miId - ordenDatos.miId + numJugadores) % numJugadores];
            jugadores[i].SetJugada(jugadasJugadores[(i + webSocketClient.miId - ordenDatos.miId + numJugadores) % numJugadores]);
        }

        TurnManager = new TurnManager(jugadores.Length);
        TurnManager.TurnChange += TurnChange;
        TurnManager.Evaluation += Evaluar;
        TurnManager.FinRonda += TerminarRonda;
        TurnManager.Reset();

        TurnManager.m_PlayerTurn = ordenDatos.turno - 1;
        Debug.Log($"ordenDatos.turno - 1: {TurnManager.m_PlayerTurn}");

        TurnManager.Tick();
        Debug.Log("Estado reestablecido");
    }

    /// <summary>
    /// Actualiza el estado del juego en cada frame.
    /// </summary>
    void Update()
    {
        
        if (!cartasMoviendo) return;
        for (int i = 0; i < jugadores.Length; i++)
        {
            if (cartasJugadas[i] != null && jugadores[i] != null)
            {
                if (jugadores[i].jugada != null) cartasJugadas[i].transform.position = Vector3.MoveTowards(jugadores[i].jugada.transform.position, ubicacionGanador, 15f * Time.deltaTime);
                
                if (cartasJugadas[i].transform.position == ubicacionGanador || jugadores[i].jugada == null)
                {
                    Destroy(cartasJugadas[i].gameObject);
                    cartasJugadas[i] = null;
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
                if(!esOnline) BarajarYRepartir();
                else
                {
                    webSocketClient.enviarFinRonda();
                    webSocketClient.ackFinRonda = true;
                }
                finRonda = false;
            }
            if (!finRonda) TurnManager.Tick();
        }
    }

    void handleCantar(int palo)
    {
        if(jugadores[0].m_esMiTurno)
        {
            switch(palo){
                case 0:
                    Debug.Log("Boton Cantar Bastos");
                    jugadores[0].input.cantar = 0;
                    break;
                case 1:
                    Debug.Log("Boton Cantar Copas");
                    jugadores[0].input.cantar = 1;
                    break;
                case 2:
                    Debug.Log("Boton Cantar Espadas");
                    jugadores[0].input.cantar = 2;
                    break;
                case 3:
                    Debug.Log("Boton Cantar Oros");
                    jugadores[0].input.cantar = 3;
                    break;
            }
        }
    }

    void handleCambiarSiete()
    {
        if (jugadores[0].m_esMiTurno)
        {
            jugadores[0].input.cambiarSiete = true;
        }
    }

    /// <summary>
    /// Muestra un mensaje cuando un jugador canta (movimiento especial).
    /// </summary>
    /// <param name="palo">El palo del "cantar" anunciado.</param>
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

    /// <summary>
    /// Oculta el mensaje de "cantar" después de un tiempo.
    /// </summary>
    public void finMostrarCantar()
    {
        mostrandoCantar = false;
        m_FinPartida.style.visibility = Visibility.Hidden;
    }

    public void mostrarCambiarSiete()
    {
        mostrandoCantar = true;
        m_FinPartida.text = "Cambiado 7 de triunfo";
        m_FinPartida.style.visibility = Visibility.Visible;
        Invoke("finMostrarCambiarSiete", 1f);
    }
    public void finMostrarCambiarSiete()
    {
        mostrandoCantar = false;
        m_FinPartida.style.visibility = Visibility.Hidden;
    }

    /// <summary>
    /// Cambia el turno entre los jugadores.
    /// </summary>
    /// <param name="turno">El índice del turno actual.</param>
    public void TurnChange(int turno)
    {
        if(turno > 0)
        {
            cartasJugadas[orden[turno-1]] = jugadores[orden[turno-1]].jugada;
        }
        Debug.Log($"turno de {orden[turno]}");
        jugadores[orden[turno]].resetInput();
        jugadores[orden[turno]].meToca();
    }

    /// <summary>
    /// Evalúa al ganador de la ronda actual y actualiza el estado del juego.
    /// </summary>
    public void Evaluar()
    {

        cartasJugadas[orden.Length-1] = jugadores[orden.Length-1].jugada;
        indexGanador = orden[0];
        int maxPuntos = jugadores[orden[0]].jugada.Puntos;
        int sumaPuntos = jugadores[orden[0]].jugada.Puntos;
        bool triunfo = (jugadores[orden[0]].jugada.Palo == this.triunfo.Palo);
        int paloJugado = jugadores[orden[0]].jugada.Palo;

        int aux = 0;
        
        for (int i = 1; i < jugadores.Length; i++)
        {
            try
            {
                aux = jugadores[orden[i]].jugada.Puntos;
                sumaPuntos += aux;
                cartasJugadas[orden[i]] = jugadores[orden[i]].jugada;
            }
            catch (NullReferenceException ex)
            {
                Debug.LogError("Referencia nula detectada 2: " + ex.Message);
            }
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
        }
        // FINALIZACIÓN DE TURNO

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
        // COMPROBAR SI HA ACABADO LA RONDA
        finRonda = true;
        foreach (var i in jugadores[0].mano)
        {
            if (i != null)
            {
                finRonda = false;
                break;
            }
        }
        if (finRonda) jugadores[orden[0]].puntos += 10; // 10 últimas

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

    /// <summary>
    /// Actualiza los marcadores de los jugadores o equipos.
    /// </summary>
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

    /// <summary>
    /// Termina la ronda actual y verifica si el juego ha terminado.
    /// </summary>
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

        if (!segundaBaraja) // PARTIDA TERMINADA
        {
            if (esOnline) //ENVIAR PUNTOS
            {
                var puntos = new List<Dictionary<string, object>>
                {
                    new Dictionary<string, object>
                    {
                        { "puntos0", jugadores[0].puntos },
                        { "puntos1", jugadores[1].puntos },
                        { "puntos2", jugadores.Length == 4 ? jugadores[2].puntos : 0 },
                        { "puntos3", jugadores.Length == 4 ? jugadores[3].puntos : 0 },
                        { "lobby", webSocketClient.miLobby }
                    },
                };
                webSocketClient.enviarFinPartida(puntos);
            }

            m_FinPartida.style.visibility = Visibility.Visible;
            if (jugadores.Length == 2) m_FinPartida.text = "Ganador: Jugador " + ganador.ToString();
            else m_FinPartida.text = "Ganador: Equipo " + ganador.ToString();

            m_FinPartidaButton.SetEnabled(true);
            m_FinPartidaButton.style.display = DisplayStyle.Flex;
        }
    }

    /// <summary>
    /// Baraja las cartas y las reparte nuevamente a los jugadores.
    /// </summary>
    /// <param name="baraja">
    /// Baraja que se repatirá a los jugadores. Si es un string
    /// vacío, se repartirá una baraja aleatoria.
    /// </param>
    public void BarajarYRepartir(string baraja = "")
    {
        arrastre = false;
        Baraja.RecogerCartas();

        if (baraja == "") Baraja.Barajar();
        else Baraja.Barajar(baraja);

        orden = new int[jugadores.Length];

        for (int i = 0; i < jugadores.Length; i++)
        {
            orden[i] = (i + indexGanador) % jugadores.Length;
        }

        for (int i = 0; i < jugadores.Length; i++)
        {
            for (int j = 0; j < 6; j++)
            {
                jugadores[orden[i]].AnyadirCarta(Baraja.DarCarta());
            }
            jugadores[i].reset();
        }
        Destroy(triunfo.gameObject);
        triunfo = Baraja.DarCarta();
        Baraja.AnyadirAlFinal(triunfo);
        triunfo.transform.position = new Vector3(Baraja.transform.position.x - 2, Baraja.transform.position.y, 0);
        triunfo.transform.rotation = Quaternion.Euler(0,0,90);
        TurnManager.Reset();
        if (esOnline) TurnManager.Tick();
    }

    public void FinalizarPorDesconexion()
    {
        //MOSTRAR MENSAJE Y BOTON PARA SALIR AL MENU
        SceneManager.LoadScene("Inicio");
    }

    private void OnDestroy()
    {
        if (webSocketClient != null)
        {
            webSocketClient.Close();
        }
    }
}
