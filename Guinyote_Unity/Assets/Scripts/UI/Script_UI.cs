using UnityEngine;
using UnityEngine.UIElements;
using UnityEngine.SceneManagement;
using System.Collections.Generic;

public class Script_UI : MonoBehaviour
{
    public static Script_UI Instance { get; private set; }
   
   Stack<string> lastScene = new Stack<string>();
   private Button boton_IA;
    private Button boton_atras;
    private Button boton_1vs1;
    private Button boton_2vs2;
    private Button boton_start;

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

    void goBack()
    {   
        Debug.Log("Button Clicked");
        SceneManager.LoadScene(lastScene.Pop());
    }

    void ChangeScene(string sceneName)
    {   
        Debug.Log("Button Clicked");
        lastScene.Push(SceneManager.GetActiveScene().name);
        SceneManager.LoadScene(sceneName);
        Debug.Log("updateReference");
    }



}
