using UnityEngine;
using UnityEngine.InputSystem;
using WebSocketClient;
public class Online_Player : Player
{
    private wsClient ws;
    public Online_Player() : base()
    {
    }

    void Start()
    {
        ws = UIManager.Instance.webSocketClient;
        ws.OnInputReceived += changeInput;
        base.Start();
    }

    public void changeInput(string message)
    {
        if (m_esMiTurno)
        {
            input = JsonUtility.FromJson<input>(message);
            turno();
            resetInput();
        }
    }
    public void Update()
    {
    }
}
