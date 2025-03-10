using UnityEngine;
using UnityEngine.InputSystem;

public class Player_Controller : Player
{
    public Player_Controller() : base()
    {
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

            if (Keyboard.current.digit8Key.wasPressedThisFrame) input.cantar = 0;
            if (Keyboard.current.digit9Key.wasPressedThisFrame) input.cantar = 1;
            if (Keyboard.current.digit0Key.wasPressedThisFrame) input.cantar = 2;
            if (Keyboard.current.eKey.wasPressedThisFrame) input.cantar = 3;
        }


        turno();
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
