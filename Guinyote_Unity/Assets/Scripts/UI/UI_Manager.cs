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
    private Button boton_perfil;
    private Button boton_historial;
    private ScrollView scroll_historial;

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
            //INICIO
            boton_IA = root.rootVisualElement.Q<Button>("IA_Button");
            boton_IA.RegisterCallback<ClickEvent>(ev => ChangeScene("Partida_IA"));

                //REGISTRO
            tab_register = root.rootVisualElement.Q<Tab>("Register_Tab");
            register_button_close = tab_register.Q<Button>("exit_Button");
            register_button_close.RegisterCallback<ClickEvent>(ev => tab_register.style.display = DisplayStyle.None);

            register_button_accept = tab_register.Q<Button>("accept_Button");
            register_button_accept.RegisterCallback<ClickEvent>(ev => Registrar(register_field_mail.value, register_field_username.value, register_field_password.value, register_field_password2.value));

            boton_login = root.rootVisualElement.Q<Button>("Login_Button");
            boton_login.RegisterCallback<ClickEvent>(ev => tab_login.style.display = DisplayStyle.Flex);

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
            login_button_accept.RegisterCallback<ClickEvent>(ev => Login(login_field_username.value, login_field_password.value));

            boton_login = root.rootVisualElement.Q<Button>("Login_Button");
            if(isLogged){
                boton_login.Q<Label>("Login_Label").text = username;
                //boton_login.UnregisterCallback<ClickEvent>(ev => tab_login.style.display = DisplayStyle.Flex);
                boton_login.RegisterCallback<ClickEvent>(ev => ChangeScene("Perfil"));

            }else{
                boton_login.RegisterCallback<ClickEvent>(ev => tab_login.style.display = DisplayStyle.Flex);
            }
             
            boton_reglas = root.rootVisualElement.Q<Button>("reglas_Button");
            boton_reglas.RegisterCallback<ClickEvent>(ev => Application.OpenURL("https://es.wikipedia.org/wiki/Guiñote"));

            login_field_username = tab_login.Q<TextField>("user_Field");
            login_field_password = tab_login.Q<TextField>("Password_Field");
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
            boton_perfil = root.rootVisualElement.Q<Button>("Profile_Button");
            boton_perfil.RegisterCallback<ClickEvent>(ev => MostrarPerfil());
            boton_historial = root.rootVisualElement.Q<Button>("History_Button");
            boton_historial.RegisterCallback<ClickEvent>(ev => MostrarHistorial());

            
            scroll_historial = root.rootVisualElement.Q<ScrollView>("History_Scroll");
            
            //consultar el historial a la BD
            StartCoroutine(Consultas.GetHistorialUsuario(username));
        }
    }

    void UpdateHistorial(Partida[] historial)
    {
        Consultas.MostrarCamposArray(historial);
        VisualTreeAsset resultadoAsset = Resources.Load<VisualTreeAsset>("Historial_elemento");

        foreach (Partida partida in historial)
        {
            VisualElement resultado = resultadoAsset.CloneTree();
            if (partida.estado != "terminada") continue;

            if (partida.jugadores.Length == 2)
            {
                bool win = ((partida.jugadores[0].idUsuario == username && partida.jugadores[0].puntuacion > partida.jugadores[1].puntuacion) ||
                            (partida.jugadores[1].idUsuario == username && partida.jugadores[1].puntuacion > partida.jugadores[0].puntuacion));
                SetHistoryElementInfo(resultado, partida.fecha_inicio, win, partida.jugadores[0].idUsuario, "", partida.jugadores[1].idUsuario, "");
            }
            else if (partida.jugadores.Length == 4)
            {
                int equipo = -1, puntos1 = 0, puntos2 = 0;
                foreach (Jugador j in partida.jugadores)
                {
                    if (j.idUsuario == username) equipo = j.equipo;
                    if (j.equipo == 1) puntos1 += j.puntuacion;
                    if (j.equipo == 2) puntos2 += j.puntuacion;
                }
                bool win = ((equipo == 1 && puntos1 > puntos2) ||
                            (equipo == 2 && puntos2 > puntos1));
                SetHistoryElementInfo(resultado, partida.fecha_inicio, win, partida.jugadores[0].idUsuario, partida.jugadores[1].idUsuario, partida.jugadores[2].idUsuario, partida.jugadores[3].idUsuario);
            }
            else continue; //Caso erroneo
            scroll_historial.Add(resultado);
        }
    }

    void SetHistoryElementInfo(VisualElement element, String fecha, bool ganada, String nombre1, String nombre2, String nombre3, String nombre4)
    {
        element.Q<Label>("Fecha").text = "Fecha: " + fecha;
        element.Q<Label>("WIN_LOOSE").text = ganada ? "WIN" : "LOOSE";
        element.Q<Label>("Name1").text = nombre1;
        element.Q<Label>("Name2").text = nombre2;
        element.Q<Label>("Name3").text = nombre3;
        element.Q<Label>("Name4").text = nombre4;
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
        tab_register.style.display = DisplayStyle.None;


    }

    void Login(String name, String password)
    {
        Debug.Log("Username: " + name);
        Debug.Log("Password: " + password);
        //IMPLEMENTAR LOGIN

        //LOGIN CORRECTO
        isLogged = true;
        username = name;
        updateReference(SceneManager.GetActiveScene(), LoadSceneMode.Single);


        tab_login.style.display = DisplayStyle.None;
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
