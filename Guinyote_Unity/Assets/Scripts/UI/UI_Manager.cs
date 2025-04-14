using UnityEngine;
using UnityEngine.UIElements;
using UnityEngine.SceneManagement;
using System.Collections.Generic;
using System;
using ConsultasBD;
//using UnityEngine.UI;

public class UIManager : MonoBehaviour
{
    public static UIManager Instance { get; private set; }

    private bool isLogged = false;
    private String username;

    private Tab tab_login;
    private Tab tab_register;
    private Button register_button_close;
    private Button login_button_close;
    public static Stack<string> lastScene = new Stack<string>();
    private Button boton_IA;
    private Button boton_reglas;
    private Button boton_atras;
    private Button boton_1vs1;
    private Button boton_2vs2;
    private Button boton_start;
    private Button boton_login;
    private Button login_button_register;
    private Button register_button_accept;
    private Button login_button_accept;
    private TextField register_field_mail;
    private TextField register_field_username;
    private TextField register_field_password;
    private TextField register_field_password2;
    private TextField login_field_username;
    private TextField login_field_password;
    private Tab tab_amigos;
    private Tab tab_amigos_list;
    private Tab tab_solicitudes_amigos;
    private Button boton_amigos;
    private Button boton_perfil;
    private Button boton_historial;
    private ScrollView scroll_historial;
    private Button boton_logOut;

    void Awake()
    {
        if (Instance == null)
        {
            DontDestroyOnLoad(gameObject);
            Instance = this;
        }
        else
        {
            Destroy(gameObject);
        }      
    }
   
    void Start()
    {   
        SceneManager.sceneLoaded += updateReference;
        updateReference(SceneManager.GetActiveScene(), LoadSceneMode.Single);
        
        Consultas.OnHistorialConsultado += UpdateHistorial;
        Consultas.OnInicioSesion += Login;
        Consultas.OnErrorInicioSesion += LoginFail;
        Consultas.OnRegistroUsuario += RegistroUsuario;
        Consultas.OnErrorRegistroUsuario += RegistroUsuarioFail;
        Consultas.OnAmigosConsultados += UpdateAmigos;
        Consultas.OnSolicitudesAmigosConsultadas += UpdateSolicitudesAmigos;
        Consultas.OnAceptarSolicitudAmistad += () => {
            StartCoroutine(Consultas.GetSolicitudesAmistadUsuario(username));
            StartCoroutine(Consultas.GetAmigosUsuario(username));
        };
        Consultas.OnRechazarSolicitudAmistad += () => StartCoroutine(Consultas.GetSolicitudesAmistadUsuario(username)); 
    }

    void updateReference(Scene scene, LoadSceneMode mode)
    {
        Scene currentScene = SceneManager.GetActiveScene();
        var   root = (UIDocument)FindObjectOfType(typeof(UIDocument));

        if(currentScene.name == "Partida_IA" || currentScene.name == "Partida_IA_1vs1" || currentScene.name == "Partida_IA_2vs2" || currentScene.name == "Perfil"){   
            boton_atras = root.rootVisualElement.Q<Button>("atras");
            boton_atras.RegisterCallback<ClickEvent>(ev => goBack());
        }

        if(currentScene.name == "Inicio"){
            if(isLogged){
                StartCoroutine(Consultas.GetAmigosUsuario(username));
                StartCoroutine(Consultas.GetSolicitudesAmistadUsuario(username));
            }
            //INICIO
            boton_IA = root.rootVisualElement.Q<Button>("IA_Button");
            boton_IA.RegisterCallback<ClickEvent>(ev => ChangeScene("Partida_IA"));

            //REGISTRO
            tab_register = root.rootVisualElement.Q<Tab>("Register_Tab");
            register_button_close = tab_register.Q<Button>("exit_Button");
            register_button_close.RegisterCallback<ClickEvent>(ev => tab_register.style.display = DisplayStyle.None);

            register_button_accept = tab_register.Q<Button>("accept_Button");
            register_button_accept.RegisterCallback<ClickEvent>(ev => { 
                tab_register.Q<Label>("error_Label").style.display = DisplayStyle.Flex;
                tab_register.Q<Label>("error_Label").text = "Cargando"; 
                Registrar(register_field_mail.value, register_field_username.value, register_field_password.value, register_field_password2.value);
            });

            register_field_mail = tab_register.Q<TextField>("mail_Field");
            register_field_username = tab_register.Q<TextField>("user_Field");
            register_field_password = tab_register.Q<TextField>("Password_Field");
            register_field_password2 = tab_register.Q<TextField>("Password2_Field");




            //LOGIN
            tab_login = root.rootVisualElement.Q<Tab>("Login_Tab");
            login_button_close = tab_login.Q<Button>("exit_Button");
            login_button_close.RegisterCallback<ClickEvent>(ev => tab_login.style.display = DisplayStyle.None);

            login_button_register = tab_login.Q<Button>("register_Button");
            login_button_register.RegisterCallback<ClickEvent>(ev => tab_register.style.display = DisplayStyle.Flex);

            login_button_accept = tab_login.Q<Button>("accept_Button");
            login_button_accept.RegisterCallback<ClickEvent>(ev => { 
                tab_login.Q<Label>("error_Label").style.display = DisplayStyle.Flex;
                tab_login.Q<Label>("error_Label").text = "Cargando"; 
                StartCoroutine(Consultas.InicioDeSesion(login_field_username.value, login_field_password.value)); 
            });

            boton_login = root.rootVisualElement.Q<Button>("Login_Button");
            if(isLogged){
                boton_login.Q<Label>("Login_Label").text = username;
                boton_login.UnregisterCallback<ClickEvent>(mostrarLogin);
                boton_login.RegisterCallback<ClickEvent>(ev => ChangeScene("Perfil"));

            }else{
                boton_login.RegisterCallback<ClickEvent>(mostrarLogin);
            }
             
            boton_reglas = root.rootVisualElement.Q<Button>("reglas_Button");
            boton_reglas.RegisterCallback<ClickEvent>(ev => Application.OpenURL("https://es.wikipedia.org/wiki/Guiñote"));

            login_field_username = tab_login.Q<TextField>("user_Field");
            login_field_password = tab_login.Q<TextField>("Password_Field");

            //AMIGOS
            tab_amigos = root.rootVisualElement.Q<Tab>("Friends_tab");
            tab_amigos_list = root.rootVisualElement.Q<Tab>("Friends_list_tab");
            tab_solicitudes_amigos = root.rootVisualElement.Q<Tab>("Solicitudes_list_tab");

            boton_amigos = root.rootVisualElement.Q<Button>("Friends_Button");
            boton_amigos.RegisterCallback<ClickEvent>(ev => {
                Debug.Log("Amigos pulsado"); 
                root.rootVisualElement.Q<TabView>("Friends_tabview").style.display = DisplayStyle.Flex; 
                tab_amigos.style.display = DisplayStyle.Flex; 
                tab_amigos_list.style.display = DisplayStyle.None; 
            });
            tab_amigos.Q<Button>("Friends_List_Button").RegisterCallback<ClickEvent>(ev => {
                tab_amigos.style.display = DisplayStyle.None; 
                tab_amigos_list.style.display = DisplayStyle.Flex; 
            });
            tab_amigos.Q<Button>("Solicitudes_Button").RegisterCallback<ClickEvent>(ev => {
                tab_amigos.style.display = DisplayStyle.None; 
                tab_solicitudes_amigos.style.display = DisplayStyle.Flex; 
            });
            tab_amigos.Q<Button>("close_Button").RegisterCallback<ClickEvent>(ev => { 
                root.rootVisualElement.Q<TabView>("Friends_tabview").style.display = DisplayStyle.None; 
                tab_amigos.style.display = DisplayStyle.None; 
            });
            tab_amigos_list.Q<Button>("atras_Button").RegisterCallback<ClickEvent>(ev => { 
                tab_amigos.style.display = DisplayStyle.Flex; 
                tab_amigos_list.style.display = DisplayStyle.None; 
            });
            tab_amigos_list.Q<Button>("addFriend_Button").RegisterCallback<ClickEvent>(ev => { 
                String nombre = tab_amigos_list.Q<TextField>("friend_Field").value;
                StartCoroutine(Consultas.EnviarSolicitudAmistad(nombre, username));
            });
            tab_solicitudes_amigos.Q<Button>("atras_Button").RegisterCallback<ClickEvent>(ev => { 
                tab_amigos.style.display = DisplayStyle.Flex; 
                tab_solicitudes_amigos.style.display = DisplayStyle.None; 
            });
        } else if(currentScene.name == "Partida_IA"){
            //PARTIDA IA
            boton_1vs1 = root.rootVisualElement.Q<Button>("1vs1");
            boton_1vs1.RegisterCallback<ClickEvent>(ev => ChangeScene("Partida_IA_1vs1"));

            boton_2vs2 = root.rootVisualElement.Q<Button>("2vs2");
            boton_2vs2.RegisterCallback<ClickEvent>(ev => ChangeScene("Partida_IA_2vs2"));
        }
        else if (currentScene.name == "Partida_IA_1vs1" || currentScene.name == "Partida_IA_2vs2")
        {
            boton_start = root.rootVisualElement.Q<Button>("Start");
            boton_start.RegisterCallback<ClickEvent>(ev => beginGame(currentScene.name));
        }
        else if (currentScene.name == "Perfil")
        {
            //PERFIL
            boton_logOut = root.rootVisualElement.Q<Button>("LogOut_Button");
            boton_logOut.RegisterCallback<ClickEvent>(ev => {
                isLogged = false;
                ChangeScene("Inicio");
            });

            boton_perfil = root.rootVisualElement.Q<Button>("Profile_Button");
            boton_perfil.RegisterCallback<ClickEvent>(ev => MostrarPerfil());
            boton_historial = root.rootVisualElement.Q<Button>("History_Button");
            boton_historial.RegisterCallback<ClickEvent>(ev => MostrarHistorial());

            
            scroll_historial = root.rootVisualElement.Q<ScrollView>("History_Scroll");
            scroll_historial.style.display = DisplayStyle.None;
            
            //consultar el historial a la BD
            StartCoroutine(Consultas.GetHistorialUsuario(username));
        }
    }

    private void mostrarLogin(ClickEvent evt)
    {
        tab_login.style.display = DisplayStyle.Flex;
    }

    void UpdateHistorial(Partida[] historial)
    {
        Consultas.MostrarCamposArray(historial);
        Debug.Log("historial actualizado");
        VisualTreeAsset resultadoAsset = Resources.Load<VisualTreeAsset>("Historial_elemento");

        foreach (Partida partida in historial)
        {
            VisualElement resultado = resultadoAsset.CloneTree();
            if (partida.estado != "terminada") continue;

            if (partida.jugadores.Length == 2)
            {
                bool win = ((partida.jugadores[0].idUsuario == username && partida.jugadores[0].puntuacion > partida.jugadores[1].puntuacion) ||
                            (partida.jugadores[1].idUsuario == username && partida.jugadores[1].puntuacion > partida.jugadores[0].puntuacion));
                SetHistoryElementInfo(resultado, partida.fecha_inicio, win,  "", partida.jugadores[0].nombre, partida.jugadores[1].nombre, "", partida.jugadores[0].puntuacion, partida.jugadores[1].puntuacion);
            }
            else if (partida.jugadores.Length == 4)
            {
                int equipo = -1, puntos1 = 0, puntos2 = 0;
                String equipo1_1 = null;
                String equipo1_2 = null;
                String equipo2_1 = null;
                String equipo2_2 = null;

                foreach (Jugador j in partida.jugadores)
                {
                    if (j.idUsuario == username) equipo = j.equipo;
                    if (j.equipo == 1) {
                        if(equipo1_1 == null) equipo1_1 = j.nombre;
                        else equipo1_2 = j.nombre;
                        puntos1 += j.puntuacion;
                    }
                    if (j.equipo == 2) {
                        if(equipo2_1 == null) equipo2_1 = j.nombre;
                        else equipo2_2 = j.nombre;
                        puntos2 += j.puntuacion;
                    }
                }
                bool win = ((equipo == 1 && puntos1 > puntos2) ||
                            (equipo == 2 && puntos2 > puntos1));

                SetHistoryElementInfo(resultado, partida.fecha_inicio, win, equipo1_1, equipo1_2, equipo2_1, equipo2_2, puntos1, puntos2);
            }
            else continue; //Caso erroneo
            scroll_historial.Add(resultado);
        }
    }

    void SetHistoryElementInfo(VisualElement element, String fecha, bool ganada, String nombre1, String nombre2, String nombre3, String nombre4, int puntos1, int puntos2)
    {
        element.Q<Label>("Fecha").text = "Fecha: " + fecha;
        element.Q<Label>("WIN_LOSE").text = ganada ? "WIN" : "LOSE";
        element.Q<Label>("Name1").text = nombre1;
        element.Q<Label>("Name2").text = nombre2;
        element.Q<Label>("Name3").text = nombre3;
        element.Q<Label>("Name4").text = nombre4;
        element.Q<Label>("Puntos1").text = puntos1.ToString();
        element.Q<Label>("Puntos2").text = puntos2.ToString();
    }


    void MostrarPerfil()
    {
        Debug.Log("Button Clicked");
        boton_historial.SetEnabled(true);
        boton_perfil.SetEnabled(false);
        scroll_historial.style.display = DisplayStyle.None;
    }

    void MostrarHistorial()
    {
        Debug.Log("Button Clicked");
        boton_historial.SetEnabled(false);
        boton_perfil.SetEnabled(true);
        scroll_historial.style.display = DisplayStyle.Flex;
    }


    void Registrar(String email, String name, String password, String password2)
    {

        Debug.Log("email: " + email);
        Debug.Log("Username: " + name);
        Debug.Log("Password: " + password);
        Debug.Log("Password2: " + password2);
         //IMPLEMENTAR REGISTRO
        if (password != password2)
        {
            Debug.Log("Contraseñas no coinciden");
            tab_register.Q<Label>("error_Label").style.display = DisplayStyle.Flex;
            tab_register.Q<Label>("error_Label").text = "Error: Las contraseñas no coinciden";
            return;
        }

        StartCoroutine(Consultas.RegistroUsuario(name, email, password));
    }

    void RegistroUsuario()
    {
        Debug.Log("Usuario registrado");
        tab_register.Q<Label>("error_Label").style.display = DisplayStyle.None;
        tab_register.style.display = DisplayStyle.None;
    }

    void RegistroUsuarioFail()
    {
        Debug.Log("Error al registrar usuario");
        tab_register.Q<Label>("error_Label").style.display = DisplayStyle.Flex;
        tab_register.Q<Label>("error_Label").text = "Error: Error al registrar usuario";
    }

    void Login(String name)
    {
        Debug.Log("Username: " + name);

        tab_login.Q<Label>("error_Label").style.display = DisplayStyle.None;
        isLogged = true;
        username = name;
        updateReference(SceneManager.GetActiveScene(), LoadSceneMode.Single);


        tab_login.style.display = DisplayStyle.None;
    }

    void LoginFail()
    {
        Debug.Log("Login erroneo");
        tab_login.Q<Label>("error_Label").style.display = DisplayStyle.Flex;
        tab_login.Q<Label>("error_Label").text = "Error: Usuario o contraseña incorrectos";
    }

    /// <summary>
    /// Actualiza la lista de amigos en la interfaz de usuario.
    /// Obtiene un ScrollView, limpia su contenido y añade elementos visuales para cada amigo proporcionado.
    /// </summary>
    /// <param name="amigos">Array de objetos Usuario que representan a los amigos.</param>
    void UpdateAmigos(Usuario[] amigos)
    {
        // Obtener el ScrollView donde se mostrarán los amigos
        ScrollView friendsScroll = tab_amigos_list.Q<ScrollView>("Friends_Scroll");
        friendsScroll.Clear(); // Limpiar el contenido actual del ScrollView

        // Cargar el recurso visual para representar a un amigo
        VisualTreeAsset amigoAsset = Resources.Load<VisualTreeAsset>("Amigo_elemento");

        // Iterar sobre la lista de amigos y añadirlos al ScrollView
        foreach (Usuario amigo in amigos)
        {
            VisualElement amigoElement = amigoAsset.CloneTree();
            Label nombreAmigoLabel = amigoElement.Q<Label>("Nombre_Amigo");
            nombreAmigoLabel.text = amigo.nombre;
            friendsScroll.Add(amigoElement);
        }
    }

    void UpdateSolicitudesAmigos(Usuario[] solicitudes)
    {
        // Obtener el ScrollView donde se mostrarán las solicitudes de amistad
        ScrollView friendsScroll = tab_solicitudes_amigos.Q<ScrollView>("Friends_Scroll");
        friendsScroll.Clear(); // Limpiar el contenido actual del ScrollView

        // Cargar el recurso visual para representar a una solicitud de amistad
        VisualTreeAsset solicitudAsset = Resources.Load<VisualTreeAsset>("SolicitudAmigo_elemento");

        // Iterar sobre la lista de amigos y añadirlos al ScrollView
        foreach (Usuario solicitud in solicitudes)
        {

            VisualElement solicitudElement = solicitudAsset.CloneTree();
            Label nombreUsuarioLabel = solicitudElement.Q<Label>("Nombre_usuario");
            nombreUsuarioLabel.text = solicitud.nombre;
            Button aceptarButton = solicitudElement.Q<Button>("accept_Button");
            aceptarButton.RegisterCallback<ClickEvent>(ev => { 
                Debug.Log("Aceptar solicitud de amistad de: " + solicitud.nombre); 
                StartCoroutine(Consultas.AceptarSolicitudAmistad(username, solicitud.correo));
                //solicitudElement.RemoveFromHierarchy(); // Eliminar el elemento de la interfaz 
            });
            Button rechazarButton = solicitudElement.Q<Button>("reject_Button");
            rechazarButton.RegisterCallback<ClickEvent>(ev => { 
                Debug.Log("Rechazar solicitud de amistad de: " + solicitud.nombre); 
                StartCoroutine(Consultas.RechazarSolicitudAmistad(username, solicitud.correo));
                //solicitudElement.RemoveFromHierarchy(); // Eliminar el elemento de la interfaz 
            });
            friendsScroll.Add(solicitudElement);
        }
    }


    void beginGame(string tipo)
    {
        Debug.Log("Button Clicked");

        if(tipo == "Partida_IA_1vs1"){
            GameManager.numJugadores = 2;
        } else if(tipo == "Partida_IA_2vs2"){
            GameManager.numJugadores = 4;
        }
        ChangeScene("Juego");
    }

    public static void goBack()
    {   
        Debug.Log("Button Clicked");
        SceneManager.LoadScene(lastScene.Pop());
    }

    public static void ChangeScene(string sceneName)
    {   
        Debug.Log("Button Clicked");
        lastScene.Push(SceneManager.GetActiveScene().name);
        SceneManager.LoadScene(sceneName);
        Debug.Log("updateReference");
    }
}
