using UnityEngine;

public class Carta : MonoBehaviour
{
    public int Palo;
    public int Numero;
    public int Puntos; // Puntos que vale la carta
    public bool enMano = false;
    public bool jugada = false;
    public string[] traduccion = { "B", "C", "E", "O" };
    public SpriteRenderer sr;
    private bool mouseEncima = false; //Evita errores al desactivar el collider cuando no es nuestro turno

    public string ToString()
    {
        return Numero.ToString() + "," + Palo.ToString();
    }
    public void setCarta(int palo, int numero)
    {
        enMano = false;
        jugada = false;
        Palo = palo;
        if (numero < 7)
        {
            Numero = numero + 1;
        }
        else
        {
            Numero = numero + 3;
        }
        switch (Numero)
        {
            case 1:
                Puntos = 11;
                break;
            case 3:
                Puntos = 10;
                break;
            case 12:
                Puntos = 4;
                break;
            case 10:
                Puntos = 3;
                break;
            case 11:
                Puntos = 2;
                break;
            default:
                Puntos = 0;
                break;
        }
        sr = GetComponent<SpriteRenderer>();
        sr.sprite = Resources.Load<Sprite>("Sprites/tipos_carta/" + UIManager.carta_picture);
    }

    private void OnMouseEnter()
    {
        if (enMano)
        {
            mouseEncima = true; 
            transform.position = new Vector3(transform.position.x, transform.position.y + 0.5f, transform.position.z);
        }
    }

    public void OnMouseExit()
    {
        if (enMano && mouseEncima)
        {
            mouseEncima = false;
            transform.position = new Vector3(transform.position.x, transform.position.y - 0.5f, transform.position.z);
        }
    }

    private void OnMouseDown()
    {
        if(enMano)
        {
            jugada = true;
            enMano = false;
        }
    }
}
