using UnityEngine;
using UnityEngine.UIElements;
using UnityEngine.SceneManagement;
using System.Collections.Generic;
using System;

public class Script_UI : MonoBehaviour
{
    public static Script_UI Instance { get; private set; }

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
    private TextField register_field_username;
    private TextField register_field_password;
    private TextField register_field_password2;
    private TextField login_field_username;
    private TextField login_field_password;

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
    }

    void updateReference(Scene scene, LoadSceneMode mode)
    {
        Scene currentScene = SceneManager.GetActiveScene();
        var   root = (UIDocument)FindObjectOfType(typeof(UIDocument));

        if(currentScene.name == "Partida_IA" || currentScene.name == "Partida_IA_1vs1" || currentScene.name == "Partida_IA_2vs2"){   
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
            register_button_accept.RegisterCallback<ClickEvent>(ev => Registrar(register_field_username.value, register_field_password.value, register_field_password2.value));

            boton_login = root.rootVisualElement.Q<Button>("Login_Button");
            boton_login.RegisterCallback<ClickEvent>(ev => tab_login.style.display = DisplayStyle.Flex);

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
            boton_login.RegisterCallback<ClickEvent>(ev => tab_login.style.display = DisplayStyle.Flex);
             
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
    }

    void Registrar(String email, String password, String password2)
    {

        Debug.Log("Username: " + email);
        Debug.Log("Password: " + password);
        Debug.Log("Password2: " + password2);
         //IMPLEMENTAR REGISTRO
        tab_register.style.display = DisplayStyle.None;


    }

    void Login(String email, String password)
    {
        Debug.Log("Username: " + email);
        Debug.Log("Password: " + password);
        //IMPLEMENTAR LOGIN
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
