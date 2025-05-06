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
        resetInput();

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

            input.cambiarSiete = Keyboard.current.digit7Key.wasPressedThisFrame;

            if (Keyboard.current.digit1Key.wasPressedThisFrame) input.cantar = 0;
            if (Keyboard.current.digit2Key.wasPressedThisFrame) input.cantar = 1;
            if (Keyboard.current.digit3Key.wasPressedThisFrame) input.cantar = 2;
            if (Keyboard.current.digit4Key.wasPressedThisFrame) input.cantar = 3;
        }


        if (turno() && GameManager.esOnline)
        {
            //SI LOS INPUTS SON CORRECTOS ENVIAR INPUTS AL SERVIDOR
        }
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
