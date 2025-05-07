using UnityEngine;
using UnityEngine.InputSystem;
using WebSocketClient;

public class Online_Player : Player
{
    private wsClient ws;

    public Online_Player() : base()
    {
    }

    public new void Start()
    {
        ws = UIManager.Instance.webSocketClient;
        ws.OnInputReceived += changeInput;
        base.Start();
    }

    public void changeInput(input message)
    {
        Debug.Log("changeInputRecibido");
        if (m_esMiTurno)
        {
            input = message;
            Debug.Log("antes de turno");
            turno();
            resetInput();
        }
    }

    public void Update()
    {
        base.Update();
    }
}
