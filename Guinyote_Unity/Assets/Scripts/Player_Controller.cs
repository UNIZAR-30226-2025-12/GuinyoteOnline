using UnityEngine;
using UnityEngine.InputSystem;

public class Player_Controller : Player{
    public Player_Controller() : base()
    {
    }

    public void Update()
    {
        if (m_CartaDesplazandose)
        {
            jugada.transform.position = Vector3.MoveTowards(jugada.transform.position, m_MoveTarget, 7.5f * Time.deltaTime);

            if (jugada.transform.position == m_MoveTarget)
            {
                m_esMiTurno = false;
                GameManager.Instance.TurnManager.Tick();
                m_CartaDesplazandose = false;
            }
            return;
        }
        else if (m_esMiTurno)
        {
            int index = 0;
            bool cartaSeleccionada = false;
            if (Keyboard.current.digit1Key.wasPressedThisFrame)
            {
                index = 0;
                cartaSeleccionada = true;
            }
            else if (Keyboard.current.digit2Key.wasPressedThisFrame)
            {
                index = 1;
                cartaSeleccionada = true;
            }
            else if (Keyboard.current.digit3Key.wasPressedThisFrame)
            {
                index = 2;
                cartaSeleccionada = true;
            }
            else if (Keyboard.current.digit4Key.wasPressedThisFrame)
            {
                index = 3;
                cartaSeleccionada = true;
            }
            else if (Keyboard.current.digit5Key.wasPressedThisFrame)
            {
                index = 4;
                cartaSeleccionada = true;
            }
            else if (Keyboard.current.digit6Key.wasPressedThisFrame)
            {
                index = 5;
                cartaSeleccionada = true;
            }
            if (cartaSeleccionada)
            {
                if (UsarCarta(index))
                {
                    cartaSeleccionada = false;
                    m_CartaDesplazandose = true;
                }
            }
        }
    }
}
