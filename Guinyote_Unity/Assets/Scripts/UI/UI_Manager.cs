using UnityEngine;
using UnityEngine.UIElements;
using UnityEngine.SceneManagement;
using System.Collections.Generic;
using System;
using ConsultasBD;
using Unity.VisualScripting;
using UnityEditor;
using WebSocketClient;
using System.Threading.Tasks;
//using UnityEngine.UI;

public class UIManager : MonoBehaviour
{
    public static UIManager Instance { get; private set; }
    public wsClient webSocketClient; //Cliente WebSocket para la comunicación en tiempo real

    private bool isLogged = false; //Indica si el usuario está logueado o no

    public static Stack<string> lastScene = new Stack<string>(); //Pila para almacenar las escenas anteriores

    private String username; //Nombre del usuario logueado
    public String id; //Correo del usuario logueado

    private String psw; //Contraseña del usuario logueado
    private String new_pwd; //Nueva contraseña elegida por usuario logueado
    private String profile_picture; //Foto de perfil del usuario logueado
    static public String carta_picture; //Dorso de la carta del usuario logueado
    static public String tapete_picture; //Tapete del usuario logueado
    private String temp_profile_picture; //Foto de perfil temporal del usuario logueado
    private String temp_tapete_picture; //Tapete temporal del usuario logueado

    private String temp_carta_picture; //Dorso de carta temporal del usuario logueado
    private VisualElement imagenes_perfil_tab; 
    private VisualElement tapetes_tab;
    private VisualElement cartas_tab;
    private ScrollView imagenes_perfil_scroll;
    private ScrollView cartas_scroll;
    private ScrollView tapetes_scroll;
    private Tab tab_login;
    private Tab tab_register;
    private Button register_button_close;
    private Button login_button_close;
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
    private Tab Tab_ranking;
    private Button boton_ranking;
    private VisualElement perfil_configuracion;
    private Button boton_cambiar_foto;
    private Button boton_cambiar_tapete;
    private Button boton_cambiar_cartas;
    private Button boton_online;
    private VisualElement VisualProfilePicture;

    /// <summary>
    /// Singleton pattern para asegurar que solo haya una instancia de UIManager en la escena.
    /// </summary>>
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
   
    /// <summary>
    /// Inicia el UIManager y registra los eventos necesarios.
    /// </summary>
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
            StartCoroutine(Consultas.GetSolicitudesAmistadUsuario(id));
            StartCoroutine(Consultas.GetAmigosUsuario(id));
        };
        Consultas.OnRechazarSolicitudAmistad += () => StartCoroutine(Consultas.GetSolicitudesAmistadUsuario(id));
        Consultas.OnRankingConsultado += UpdateRanking;
        Consultas.OnCambiarInfoUsuario += updateInfoUsuario;
        Consultas.OnPartidaEncontrada += JoinRoom;

        if (webSocketClient == null)
        {
            webSocketClient = new wsClient();
        }
        
        tapete_picture = "default";
        carta_picture = "default";

    }

    /// <summary>
    /// Se llama cuando se carga una nueva escena. Actualiza las referencias de los elementos de la UI según la escena actual.
    /// </summary>
    /// <param name="scene">La escena que se ha cargado.</param>
    /// <param name="mode">El modo de carga de la escena.</param>
    void updateReference(Scene scene, LoadSceneMode mode)
    {
        Scene currentScene = SceneManager.GetActiveScene();
        var   root = (UIDocument)FindObjectOfType(typeof(UIDocument));

        if(currentScene.name == "Partida_IA" || currentScene.name == "Partida_IA_1vs1" || currentScene.name == "Partida_IA_2vs2" || currentScene.name == "Perfil" || 
            currentScene.name == "Partida_Online" || currentScene.name == "Partida_Online_1vs1" || currentScene.name == "Partida_Online_2vs2"){   
            updateReferencegoBack(root, currentScene, mode);
        }

        if(currentScene.name == "Inicio"){
            //INICIO
            updateReferenceInicio(root, scene, mode);
        } else if(currentScene.name == "Partida_IA"){
            //PARTIDA IA
            updateReferencePartidaIA(root, scene, mode);
        }
        else if(currentScene.name == "Partida_Online"){
            //PARTIDA IA
            updateReferencePartidaOnline(root, scene, mode);
        }
        else if (currentScene.name == "Partida_IA_1vs1" || currentScene.name == "Partida_IA_2vs2" || currentScene.name =="Partida_Online_1vs1" || currentScene.name == "Partida_Online_2vs2")
        {
            updateReferenceStart(root, scene, mode);
        }
        else if (currentScene.name == "Perfil")
        {
            //PERFIL
            updateReferencePerfil(root, scene, mode);
            
        }
    }

    /// <summary>
    /// Actualiza las referencias de los elementos de la UI para volver a la escena anterior.
    /// </summary>
    private void updateReferencegoBack(UIDocument root,Scene currentScene, LoadSceneMode mode)
    {
        boton_atras = root.rootVisualElement.Q<Button>("atras");
        boton_atras.RegisterCallback<ClickEvent>(ev => goBack());
    }

    /// <summary>
    /// Actualiza las referencias de los elementos de la UI para la escena de inicio.
    /// </summary>
    /// <param name="root">El UIDocument de la escena actual.</param>
    /// <param name="currentScene">La escena actual.</param>
    /// <param name="mode">El modo de carga de la escena.</param>
    private void updateReferenceInicio(UIDocument root,Scene currentScene, LoadSceneMode mode)
    {
        if(isLogged){
            StartCoroutine(Consultas.GetAmigosUsuario(id));
            StartCoroutine(Consultas.GetSolicitudesAmistadUsuario(id));
            StartCoroutine(Consultas.GetRanking());
        }
        
        boton_IA = root.rootVisualElement.Q<Button>("IA_Button");
        boton_IA.RegisterCallback<ClickEvent>(ev => ChangeScene("Partida_IA"));

        boton_online = root.rootVisualElement.Q<Button>("Online_Button");
        boton_online.UnregisterCallback<ClickEvent>(mostrarLogin);
        boton_online.UnregisterCallback<ClickEvent>(ev => ChangeScene("Partida_Online"));

        boton_online.RegisterCallback<ClickEvent>(ev => {
            if (isLogged)
            {
                ChangeScene("Partida_Online");
            }
            else
            {
                tab_login.style.display = DisplayStyle.Flex;
                login_button_accept.RegisterCallback<ClickEvent>(ev => {
                    tab_login.Q<Label>("error_Label").style.display = DisplayStyle.Flex;
                    tab_login.Q<Label>("error_Label").text = "Cargando";
                    StartCoroutine(Consultas.InicioDeSesion(login_field_username.value, login_field_password.value));
                });

                Consultas.OnInicioSesion += (id, name, profilePicture, tapete, carta) => {
                    isLogged = true;
                    tab_login.style.display = DisplayStyle.None;
                    ChangeScene("Partida_Online");
                };
            }
        });

        //REGISTRO
        updateReferenceRegister(root, currentScene, mode);
        //LOGIN
        updateReferenceLogin(root, currentScene, mode);
        //AMIGOS
        updateReferenceAmigos(root, currentScene, mode);
        //Ranking
        updateReferenceRanking(root, currentScene, mode);
    }

    /// <summary>
    /// Actualiza las referencias de los elementos de la UI para la ventana de registro.
    /// </summary>
    /// <param name="root">El UIDocument de la escena actual.</param>
    /// <param name="currentScene">La escena actual.</param>
    /// <param name="mode">El modo de carga de la escena.</param>
    private void updateReferenceRegister(UIDocument root,Scene currentScene, LoadSceneMode mode)
    {
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
    }

    /// <summary>
    /// Actualiza las referencias de los elementos de la UI para la ventana de inicio de sesión.
    /// </summary>
    /// <param name="root">El UIDocument de la escena actual.</param>
    /// <param name="currentScene">La escena actual.</param>
    /// <param name="mode">El modo de carga de la escena.</param>
    private void updateReferenceLogin(UIDocument root,Scene currentScene, LoadSceneMode mode)
    {
        tab_login = root.rootVisualElement.Q<Tab>("Login_Tab");
        login_button_close = tab_login.Q<Button>("exit_Button");
        login_button_close.RegisterCallback<ClickEvent>(ev => tab_login.style.display = DisplayStyle.None);

        login_button_register = tab_login.Q<Button>("register_Button");
        login_button_register.RegisterCallback<ClickEvent>(ev => tab_register.style.display = DisplayStyle.Flex);

        login_button_accept = tab_login.Q<Button>("accept_Button");
        login_button_accept.RegisterCallback<ClickEvent>(ev => { 
            tab_login.Q<Label>("error_Label").style.display = DisplayStyle.Flex;
            tab_login.Q<Label>("error_Label").text = "Cargando";
            psw = login_field_password.value; 
            StartCoroutine(Consultas.InicioDeSesion(login_field_username.value, login_field_password.value)); 
        });

        boton_login = root.rootVisualElement.Q<Button>("Login_Button");
        if(isLogged){
            boton_login.Q<Label>("Login_Label").text = username;
            Debug.Log("Profile picture: " + profile_picture);
            boton_login.Q<VisualElement>("Profile_picture").style.backgroundImage = Resources.Load<Texture2D>("Sprites/Profile_pictures/" + profile_picture);
            boton_login.UnregisterCallback<ClickEvent>(mostrarLogin);
            boton_login.RegisterCallback<ClickEvent>(ev => ChangeScene("Perfil"));

        }else{
            boton_login.RegisterCallback<ClickEvent>(mostrarLogin);
        }
            
        boton_reglas = root.rootVisualElement.Q<Button>("reglas_Button");
        boton_reglas.RegisterCallback<ClickEvent>(ev => Application.OpenURL("https://es.wikipedia.org/wiki/Guiñote"));

        login_field_username = tab_login.Q<TextField>("user_Field");
        login_field_password = tab_login.Q<TextField>("Password_Field");
    }

    /// <summary>
    /// Actualiza las referencias de los elementos de la UI para la ventana de amigos.
    /// </summary>
    /// <param name="root">El UIDocument de la escena actual.</param>
    /// <param name="currentScene">La escena actual.</param>
    /// <param "mode">El modo de carga de la escena.</param>
    private void updateReferenceAmigos( UIDocument root,Scene currentScene, LoadSceneMode mode)
    {
        tab_amigos = root.rootVisualElement.Q<Tab>("Friends_tab");
        tab_amigos_list = root.rootVisualElement.Q<Tab>("Friends_list_tab");
        tab_solicitudes_amigos = root.rootVisualElement.Q<Tab>("Solicitudes_list_tab");

        boton_amigos = root.rootVisualElement.Q<Button>("Friends_Button");
        if(isLogged){
            boton_amigos.UnregisterCallback<ClickEvent>(mostrarLogin);
            boton_amigos.RegisterCallback<ClickEvent>(ev => {
                Debug.Log("Amigos pulsado");
                root.rootVisualElement.Q<TabView>("Friends_tabview").style.display = DisplayStyle.Flex; 
                tab_amigos.style.display = DisplayStyle.Flex; 
                tab_amigos_list.style.display = DisplayStyle.None; 
            });
        }
        else {
            boton_amigos.RegisterCallback<ClickEvent>(mostrarLogin);
        }
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
            StartCoroutine(Consultas.EnviarSolicitudAmistad(nombre, id));
        });
        tab_solicitudes_amigos.Q<Button>("atras_Button").RegisterCallback<ClickEvent>(ev => { 
            tab_amigos.style.display = DisplayStyle.Flex; 
            tab_solicitudes_amigos.style.display = DisplayStyle.None; 
        });
    }

    /// <summary>
    /// Actualiza las referencias de los elementos de la UI para la ventana de ranking.
    /// </summary>
    /// <param name="root">El UIDocument de la escena actual.</param>
    /// <param name="currentScene">La escena actual.</param>
    /// <param name="mode">El modo de carga de la escena.</param>
    private void updateReferenceRanking(UIDocument root,Scene currentScene, LoadSceneMode mode)
    {
        Tab_ranking = root.rootVisualElement.Q<Tab>("Ranking_Tab");
        boton_ranking = root.rootVisualElement.Q<Button>("Ranking_Button");
        if(isLogged){
            boton_ranking.UnregisterCallback<ClickEvent>(mostrarLogin);
            boton_ranking.RegisterCallback<ClickEvent>(ev => {
                Debug.Log("Ranking pulsado"); 
                Tab_ranking.style.display = DisplayStyle.Flex;
            });
        }else{
            boton_ranking.RegisterCallback<ClickEvent>(mostrarLogin);
        }
        Tab_ranking.Q<Button>("atras_Button").RegisterCallback<ClickEvent>(ev => { 
            Tab_ranking.style.display = DisplayStyle.None; 
        });
    }

    /// <summary>
    /// Actualiza las referencias de los elementos de la UI para la escena de partida IA.
    /// </summary>
    /// <param name="root">El UIDocument de la escena actual.</param>
    /// <param name="currentScene">La escena actual.</param>
    /// <param name="mode">El modo de carga de la escena.</param>
    private void updateReferencePartidaIA(UIDocument root,Scene currentScene, LoadSceneMode mode)
    {
        boton_1vs1 = root.rootVisualElement.Q<Button>("1vs1");
        boton_1vs1.RegisterCallback<ClickEvent>(ev => ChangeScene("Partida_IA_1vs1"));

        boton_2vs2 = root.rootVisualElement.Q<Button>("2vs2");
        boton_2vs2.RegisterCallback<ClickEvent>(ev => ChangeScene("Partida_IA_2vs2"));
    }

    /// <summary>
    /// Inicia el juego con la configuración especificada.
    /// </summary>
    /// <param name="root">El UIDocument de la escena actual.</param>
    /// <param name="currentScene">La escena actual.</param>
    /// <param name="mode">El modo de carga de la escena.</param>
    private void updateReferenceStart(UIDocument root,Scene currentScene, LoadSceneMode mode)
    {
        boton_start = root.rootVisualElement.Q<Button>("Start");
        boton_start.RegisterCallback<ClickEvent>(ev => beginGame(currentScene.name));
    }

    /// <summary>
    /// Actualiza las referencias de los elementos de la UI para la escena de partida online.
    /// </summary>
    /// <param name="root">El UIDocument de la escena actual.</param>
    /// <param name="currentScene">La escena actual.</param>
    /// <param name="mode">El modo de carga de la escena.</param>
    private void updateReferencePartidaOnline(UIDocument root,Scene currentScene, LoadSceneMode mode)
    {
        boton_1vs1 = root.rootVisualElement.Q<Button>("1vs1_Button");
        boton_1vs1.RegisterCallback<ClickEvent>(ev => ChangeScene("Partida_Online_1vs1"));

        boton_2vs2 = root.rootVisualElement.Q<Button>("2vs2_Button");
        boton_2vs2.RegisterCallback<ClickEvent>(ev => ChangeScene("Partida_Online_2vs2"));
    }

    /// <summary>
    /// Actualiza las referencias de los elementos de la UI para la escena de perfil.
    /// </summary>
    /// <param name="root">El UIDocument de la escena actual.</param>
    /// <param name="currentScene">La escena actual.</param>
    /// <param name="mode">El modo de carga de la escena.</param>
    private void updateReferencePerfil(UIDocument root,Scene currentScene, LoadSceneMode mode)
    {
        boton_logOut = root.rootVisualElement.Q<Button>("LogOut_Button");
        boton_logOut.RegisterCallback<ClickEvent>(ev => {
            isLogged = false;
            ChangeScene("Inicio");
        });

        boton_perfil = root.rootVisualElement.Q<Button>("Profile_Button");
        boton_perfil.RegisterCallback<ClickEvent>(ev => MostrarPerfil());

        imagenes_perfil_tab=root.rootVisualElement.Q<VisualElement>("Elegir_Foto");
        tapetes_tab=root.rootVisualElement.Q<VisualElement>("Elegir_Tapete");
        cartas_tab=root.rootVisualElement.Q<VisualElement>("Elegir_Cartas");

        boton_cambiar_foto = root.rootVisualElement.Q<Button>("Photo_Button");
        boton_cambiar_foto.RegisterCallback<ClickEvent>(ev => { 
            Debug.Log("Cambiar foto pulsado"); 
            imagenes_perfil_tab.style.display = DisplayStyle.Flex;
        });

        boton_cambiar_tapete = root.rootVisualElement.Q<Button>("Tapete_Button");
        boton_cambiar_tapete.RegisterCallback<ClickEvent>(ev => { 
            Debug.Log("Cambiar tapete pulsado"); 
            tapetes_tab.style.display = DisplayStyle.Flex;
        });

        boton_cambiar_cartas = root.rootVisualElement.Q<Button>("Cards_Button");
        boton_cambiar_cartas.RegisterCallback<ClickEvent>(ev => { 
            Debug.Log("Cambiar cartas pulsado"); 
            cartas_tab.style.display = DisplayStyle.Flex;
        });

        VisualProfilePicture = root.rootVisualElement.Q<VisualElement>("Profile_picture");
        VisualProfilePicture.style.backgroundImage = Resources.Load<Texture2D>("Sprites/Profile_pictures/" + profile_picture);


        boton_historial = root.rootVisualElement.Q<Button>("History_Button");
        boton_historial.RegisterCallback<ClickEvent>(ev => MostrarHistorial());
        imagenes_perfil_scroll= root.rootVisualElement.Q<ScrollView>("Foto_Scroll");
        cartas_scroll= root.rootVisualElement.Q<ScrollView>("Carta_Scroll");
        tapetes_scroll= root.rootVisualElement.Q<ScrollView>("Tapete_Scroll");
        updateProfilePictures();
        updateCartas();
        updateTapetes();
        
        scroll_historial = root.rootVisualElement.Q<ScrollView>("History_Scroll");
        scroll_historial.style.display = DisplayStyle.None;

        perfil_configuracion = root.rootVisualElement.Q<VisualElement>("Profile_Config");
        perfil_configuracion.Q<Button>("SaveButton").RegisterCallback<ClickEvent>(ev => {
            if(temp_tapete_picture != null && temp_tapete_picture != ""){
                tapete_picture = temp_tapete_picture;
            }
            if(temp_carta_picture != null && temp_carta_picture != ""){
                carta_picture = temp_carta_picture;
            }
            if(temp_profile_picture != null && temp_profile_picture != ""){
                profile_picture = temp_profile_picture;
            }
            new_pwd = perfil_configuracion.Q<TextField>("Password_Field").value;
            StartCoroutine(Consultas.CambiarInfoUsuario(id, perfil_configuracion.Q<TextField>("Name_Field").value, psw, new_pwd, profile_picture +".png", tapete_picture+".png", carta_picture+".png"));
            
        });
        
        //consultar el historial a la BD
        StartCoroutine(Consultas.GetHistorialUsuario(id));
    }

    /// <summary>
    /// Cambia el nombre de usuario al especificado si no es nulo o vacío.
    /// </summary>
    /// <param name="name">El nuevo nombre de usuario.</param>
    private void updateInfoUsuario(String name)
    {
        if (name != null && name!=""){
            username = name; 
        }
        psw = new_pwd;     
    }

    /// <summary>
    /// Muestra la ventana de inicio de sesión.
    /// </summary>
    /// <param name="evt">El evento de clic.</param>
    private void mostrarLogin(ClickEvent evt)
    {
        tab_login.style.display = DisplayStyle.Flex;
    }

    /// <summary>
    /// Actualiza la lista de fotos de perfil disponibles en la interfaz de usuario.
    /// Carga un recurso visual y añade elementos visuales para cada foto de perfil encontrada en la carpeta especificada.
    /// </summary>
    void updateProfilePictures()
    {
        VisualTreeAsset fotoAsset = Resources.Load<VisualTreeAsset>("Imagen_elegir_elemento");
        foreach (String foto in System.IO.Directory.GetFiles("Assets/Resources/Sprites/Profile_pictures", "*.png"))
        {
            Debug.Log("Foto: " + foto);
            String fotoName = System.IO.Path.GetFileNameWithoutExtension(foto);
            VisualElement fotoElement = fotoAsset.CloneTree();
            Button imagen_boton = fotoElement.Q<Button>("Imagen_Button");
            string relativePath = "Sprites/Profile_pictures/" + fotoName;
            imagen_boton.style.backgroundImage = Resources.Load<Texture2D>(relativePath);
            fotoElement.Q<Label>("Name").text = fotoName;
            imagen_boton.RegisterCallback<ClickEvent>(ev => { 
                Debug.Log("Cambiar foto pulsado"); 
                temp_profile_picture= fotoName;
                VisualProfilePicture.style.backgroundImage = Resources.Load<Texture2D>("Sprites/Profile_pictures/" + fotoName);
                imagenes_perfil_tab.style.display = DisplayStyle.None;
            });
            imagenes_perfil_scroll.Add(fotoElement);
        }
    }

    /// <summary>
    /// Actualiza la lista de tapetes disponibles en la interfaz de usuario.
    /// Carga un recurso visual y añade elementos visuales para cada tapete encontrado en la carpeta especificada.
    /// </summary>
    void updateTapetes()
    {
        VisualTreeAsset tapeteAsset = Resources.Load<VisualTreeAsset>("Imagen_elegir_elemento");
        foreach (String tapete in System.IO.Directory.GetFiles("Assets/Resources/Sprites/Tapetes", "*.png"))
        {
            Debug.Log("Tapete: " + tapete);
            String tapeteName = System.IO.Path.GetFileNameWithoutExtension(tapete);
            VisualElement tapeteElement = tapeteAsset.CloneTree();
            Button imagen_boton = tapeteElement.Q<Button>("Imagen_Button");
            string relativePath = "Sprites/Tapetes/" + tapeteName;
            imagen_boton.style.backgroundImage = Resources.Load<Texture2D>(relativePath);
            tapeteElement.Q<Label>("Name").text = tapeteName;
            imagen_boton.RegisterCallback<ClickEvent>(ev => { 
                Debug.Log("Cambiar foto pulsado"); 
                temp_tapete_picture= tapeteName;
                tapetes_tab.style.display = DisplayStyle.None;
            });
            tapetes_scroll.Add(tapeteElement);
        }
    }

    /// <summary>
    /// Actualiza la lista de dorsales de cartas disponibles en la interfaz de usuario.
    /// Carga un recurso visual y añade elementos visuales para cada dorsal encontrado en la carpeta especificada.
    /// </summary>
    void updateCartas()
    {
        VisualTreeAsset cartaAsset = Resources.Load<VisualTreeAsset>("Imagen_elegir_elemento");
        foreach (String carta in System.IO.Directory.GetFiles("Assets/Resources/Sprites/Dorso_Carta", "*.png"))
        {
            Debug.Log("Carta: " + carta);
            String cartaName = System.IO.Path.GetFileNameWithoutExtension(carta);
            VisualElement cartaElement = cartaAsset.CloneTree();
            Button imagen_boton = cartaElement.Q<Button>("Imagen_Button");
            string relativePath = "Sprites/Dorso_Carta/" + cartaName;
            imagen_boton.style.backgroundImage = Resources.Load<Texture2D>(relativePath);
            cartaElement.Q<Label>("Name").text = cartaName;
            imagen_boton.RegisterCallback<ClickEvent>(ev => { 
                Debug.Log("Cambiar foto pulsado"); 
                temp_carta_picture= cartaName;
                cartas_tab.style.display = DisplayStyle.None;
            });
            cartas_scroll.Add(cartaElement);
        }
    }

    /// <summary>
    /// Actualiza el historial de partidas en la interfaz de usuario.
    /// Carga un recurso visual y añade elementos visuales para cada partida en el historial.
    /// </summary>
    /// <param name="historial">El historial de partidas.</param>
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
                bool win = ((partida.jugadores[0].idUsuario == id && partida.jugadores[0].puntuacion > partida.jugadores[1].puntuacion) ||
                            (partida.jugadores[1].idUsuario == id && partida.jugadores[1].puntuacion > partida.jugadores[0].puntuacion));
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
                    if (j.idUsuario == id) equipo = j.equipo;
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

    /// <summary>
    /// Actualiza el ranking de jugadores en la interfaz de usuario.
    /// Carga un recurso visual y añade elementos visuales para cada jugador en el ranking.
    /// </summary>
    void UpdateRanking(Usuario[] ranking)
    {
        Debug.Log("Ranking actualizado");
        VisualTreeAsset resultadoAsset = Resources.Load<VisualTreeAsset>("Ranking_elemento");

        int posicion = 1;
        foreach (Usuario r in ranking)
        {
            VisualElement resultado = resultadoAsset.CloneTree();
            SetRankingElementInfo(resultado, posicion, r.nombre, r.nVictorias, r.foto_perfil);
            Tab_ranking.Q<ScrollView>("Ranking_Scroll").Add(resultado);
            posicion++;
        }
    }

    /// <summary>
    /// Establece la información de un elemento de ranking en la interfaz de usuario.
    /// </summary>
    /// <param name="element">El elemento visual donde se mostrará la información.</param>
    /// <param name="posicion">La posición del jugador en el ranking.</param>
    /// <param name="nombre">El nombre del jugador.</param>
    /// <param name="victorias">El número de victorias del jugador.</param>
    /// <param name="foto_perfil">La foto de perfil del jugador.</param>
    void SetRankingElementInfo(VisualElement element, int posicion, String nombre, int victorias, String foto_perfil)
    {
        element.Q<VisualElement>("Profile_picture").style.backgroundImage = Resources.Load<Texture2D>("Sprites/Profile_pictures/" + System.IO.Path.GetFileNameWithoutExtension(foto_perfil));
        element.Q<Label>("Posicion_Label").text = posicion.ToString();
        element.Q<Label>("Nombre_Label").text = nombre;
        element.Q<Label>("Victorias_Label").text = victorias.ToString();
    }
    
    /// <summary>
    /// Establece la información de un elemento de historial en la interfaz de usuario.
    /// </summary>
    /// <param name="element">El elemento visual donde se mostrará la información.</param>
    /// <param name="fecha">La fecha de la partida.</param>
    /// <param name="ganada">Indica si la partida fue ganada o perdida.</param>
    /// <param name="nombre1">El nombre del jugador 1.</param>
    /// <param name="nombre2">El nombre del jugador 2.</param>
    /// <param name="nombre3">El nombre del jugador 3. si existe</param>
    /// <param name="nombre4">El nombre del jugador 4. si existe</param>
    /// <param name="puntos1">Los puntos del jugador/equipo 1.</param>
    /// <param name="puntos2">Los puntos del jugador/equipo 2.</param>
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


    /// <summary>
    /// Muestra la configuración del perfil y oculta el historial.
    /// </summary>
    void MostrarPerfil()
    {
        Debug.Log("Button Clicked");
        boton_historial.SetEnabled(true);
        boton_perfil.SetEnabled(false);
        perfil_configuracion.style.display = DisplayStyle.Flex;
        scroll_historial.style.display = DisplayStyle.None;
    }

    /// <summary>
    /// Muestra el historial de partidas y oculta la configuración del perfil.
    /// </summary>
    void MostrarHistorial()
    {
        Debug.Log("Button Clicked");
        boton_historial.SetEnabled(false);
        boton_perfil.SetEnabled(true);
        perfil_configuracion.style.display = DisplayStyle.None;
        scroll_historial.style.display = DisplayStyle.Flex;
    }


    /// <summary>
    /// Registra un nuevo usuario con la información proporcionada.
    /// Verifica que las contraseñas coincidan y llama a la función de registro correspondiente.
    /// Si las contraseñas no coinciden, muestra un mensaje de error en la interfaz de usuario.
    /// </summary>
    /// <param name="email">El correo electrónico del usuario.</param>
    /// <param name="name">El nombre de usuario.</param>
    /// <param name="password">La contraseña del usuario.</param>
    /// <param name="password2">La confirmación de la contraseña.</param>
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

    /// <summary>
    /// Muestra un mensaje de éxito al registrar un usuario.
    /// Oculta la pestaña de registro en la interfaz de usuario.
    /// </summary>
    void RegistroUsuario()
    {
        Debug.Log("Usuario registrado");
        tab_register.Q<Label>("error_Label").style.display = DisplayStyle.None;
        tab_register.style.display = DisplayStyle.None;
    }

    /// <summary>
    /// Muestra un mensaje de error en la interfaz de usuario al registrar un usuario.
    /// </summary>
    void RegistroUsuarioFail()
    {
        Debug.Log("Error al registrar usuario");
        tab_register.Q<Label>("error_Label").style.display = DisplayStyle.Flex;
        tab_register.Q<Label>("error_Label").text = "Error: Error al registrar usuario";
    }

    /// <summary>
    /// Inicia sesión con el usuario proporcionado.
    /// Si el inicio de sesión es exitoso, oculta la pestaña de inicio de sesión y actualiza las referencias de la escena.
    /// Si falla, muestra un mensaje de error en la interfaz de usuario.
    /// </summary>
    /// <param name="id">El correo del usuario.</param>
    /// <param name="name">El nombre del usuario.</param>
    /// <param name="foto_perfil">La foto de perfil del usuario.</param>
    /// <param name="tapete">El tapete del usuario.</param>
    /// <param name="carta">El dorsal de las cartas del usuario.</param>
    void Login(String id, String name, string foto_perfil, string tapete, string carta)
    {
        Debug.Log("Id: " + id);

        tab_login.Q<Label>("error_Label").style.display = DisplayStyle.None;
        isLogged = true;
        this.id = id;
        this.username = name; 
        this.profile_picture = System.IO.Path.GetFileNameWithoutExtension(foto_perfil);
        UIManager.tapete_picture = System.IO.Path.GetFileNameWithoutExtension(tapete);
        UIManager.carta_picture = System.IO.Path.GetFileNameWithoutExtension(carta);
        updateReference(SceneManager.GetActiveScene(), LoadSceneMode.Single);


        tab_login.style.display = DisplayStyle.None;
    }

    /// <summary>
    /// Muestra un mensaje de error en la interfaz de usuario al fallar el inicio de sesión.
    /// </summary>
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
            amigoElement.Q<VisualElement>("Profile_picture").style.backgroundImage = Resources.Load<Texture2D>("Sprites/Profile_pictures/" + System.IO.Path.GetFileNameWithoutExtension(amigo.foto_perfil));
            Label nombreAmigoLabel = amigoElement.Q<Label>("Nombre_Amigo");
            nombreAmigoLabel.text = amigo.nombre;
            friendsScroll.Add(amigoElement);
        }
    }

    /// <summary>
    /// Actualiza la lista de solicitudes de amistad en la interfaz de usuario.
    /// Obtiene un ScrollView, limpia su contenido y añade elementos visuales para cada solicitud proporcionada.
    /// </summary>
    /// <param name="solicitudes">Array de objetos Usuario que representan las solicitudes de amistad.</param>
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
            solicitudElement.Q<VisualElement>("Profile_picture").style.backgroundImage = Resources.Load<Texture2D>("Sprites/Profile_pictures/" + System.IO.Path.GetFileNameWithoutExtension(solicitud.foto_perfil));
            Label nombreUsuarioLabel = solicitudElement.Q<Label>("Nombre_usuario");
            nombreUsuarioLabel.text = solicitud.nombre;
            Button aceptarButton = solicitudElement.Q<Button>("accept_Button");
            aceptarButton.RegisterCallback<ClickEvent>(ev => { 
                Debug.Log("Aceptar solicitud de amistad de: " + solicitud.nombre); 
                StartCoroutine(Consultas.AceptarSolicitudAmistad(id, solicitud.correo));
            });
            Button rechazarButton = solicitudElement.Q<Button>("reject_Button");
            rechazarButton.RegisterCallback<ClickEvent>(ev => { 
                Debug.Log("Rechazar solicitud de amistad de: " + solicitud.nombre); 
                StartCoroutine(Consultas.RechazarSolicitudAmistad(id, solicitud.correo));
            });
            friendsScroll.Add(solicitudElement);
        }
    }

    async void JoinRoom(Lobby lobby, string idUsuario)
    {
        // Configurar WebSocket para partidas online
        await webSocketClient.Connect("wss://guinyoteonline-hkio.onrender.com");
        Debug.Log(lobby.id);
        await webSocketClient.JoinRoom(lobby.id, idUsuario);
    }

    /// <summary>
    /// Inicia el juego con la configuración especificada.
    /// Dependiendo del tipo de partida, se establece el número de jugadores y si es online o no.
    /// Luego, se cambia a la escena del juego.
    /// </summary>
    void beginGame(string tipo)
    {
        Debug.Log("Button Clicked");

        if (tipo == "Partida_IA_1vs1" || tipo == "Partida_IA_2vs2")
        {
            GameManager.numJugadores = (tipo == "Partida_IA_1vs1") ? 2 : 4;
            GameManager.esOnline = false;
            ChangeScene("Juego");
        }
        else if (tipo == "Partida_Online_1vs1" || tipo == "Partida_Online_2vs2")
        {
            GameManager.numJugadores = (tipo == "Partida_Online_1vs1") ? 2 : 4;
            GameManager.esOnline = true;

            string roomType = (tipo == "Partida_Online_1vs1") ? "1v1" : "2v2";
            StartCoroutine(Consultas.BuscarPartidaPublica(id, roomType));

            // Mostrar UI de PantallaEspera
            VisualTreeAsset pantallaEsperaAsset = Resources.Load<VisualTreeAsset>("PantallaEspera");
            VisualElement pantallaEspera = pantallaEsperaAsset.CloneTree();
            var root = (UIDocument)FindObjectOfType(typeof(UIDocument));
            root.rootVisualElement.Add(pantallaEspera);

            Button cancelButton = pantallaEspera.Q<Button>("CancelButton");
            cancelButton.RegisterCallback<ClickEvent>(ev => {
                pantallaEspera.RemoveFromHierarchy();
                webSocketClient.Close();
            });
        }
    }

    /// <summary>
    /// Regresa a la escena anterior almacenada en la pila de escenas.
    /// </summary>
    public static void goBack()
    {
        Debug.Log("Button Clicked");

        // Cerrar conexión WebSocket si está activa
        if (Instance.webSocketClient != null)
        {
            Instance.webSocketClient.Close();
        }

        SceneManager.LoadScene(lastScene.Pop());
    }

    /// <summary>
    /// Cambia a la escena especificada y almacena la escena actual en la pila de escenas.
    /// </summary>
    /// <param name="sceneName">El nombre de la escena a la que se desea cambiar.</param>
    public static void ChangeScene(string sceneName)
    {
        Debug.Log("Button Clicked");

        // Cerrar conexión WebSocket si se cambia a una escena no relacionada con partidas online
        if (Instance.webSocketClient != null && (sceneName != "Partida_Online_1vs1" && sceneName != "Partida_Online_2vs2"))
        {
            Instance.webSocketClient.Close();
        }

        lastScene.Push(SceneManager.GetActiveScene().name);
        SceneManager.LoadScene(sceneName);
        Debug.Log("updateReference");
    }
}
