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
            
        if (Keyboard.current.digit1Key.wasPressedThisFrame) input.carta = 0;
        if (Keyboard.current.digit2Key.wasPressedThisFrame) input.carta = 1;
        if (Keyboard.current.digit3Key.wasPressedThisFrame) input.carta = 2;
        if (Keyboard.current.digit4Key.wasPressedThisFrame) input.carta = 3;
        if (Keyboard.current.digit5Key.wasPressedThisFrame) input.carta = 4;
        if (Keyboard.current.digit6Key.wasPressedThisFrame) input.carta = 5;

        input.cambiarSiete = Keyboard.current.digit7Key.wasPressedThisFrame;

        if (Keyboard.current.digit8Key.wasPressedThisFrame) input.cantar = 0;
        if (Keyboard.current.digit9Key.wasPressedThisFrame) input.cantar = 1;
        if (Keyboard.current.digit0Key.wasPressedThisFrame) input.cantar = 2;
        if (Keyboard.current.eKey.wasPressedThisFrame) input.cantar = 3;

        turno();
    }
}
