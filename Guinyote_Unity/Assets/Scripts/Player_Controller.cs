using UnityEngine;
using UnityEngine.InputSystem;
using WebSocketClient;

public class Player_Controller : Player
{
    private wsClient ws;
    public Player_Controller() : base()
    {
    }
    public new void Start()
    {
        if (GameManager.esOnline) ws = UIManager.Instance.webSocketClient;
        base.Start();
    }

    public void Update()
    {
        ActualizarColliders();

        if (m_esMiTurno)
        {
            for (int i = 0; i < mano.Length; i++)
            {
                if (mano[i] != null && mano[i].jugada)
                {
                    input.carta = i;
                    break;
                }
            }

            if (turno())
            {
                if (GameManager.esOnline) ws.enviarJugada(input);
                resetInput();
            }
        }
        base.Update();
    }

    public void ActualizarColliders()
    {
        foreach (Carta carta in mano)
        {
            if (carta != null)
            {
                Collider2D col = carta.GetComponent<Collider2D>();
                if (col != null)
                {
                    col.enabled = m_esMiTurno; // Activa el collider solo si es el turno
                }
            }
        }
    }
}
