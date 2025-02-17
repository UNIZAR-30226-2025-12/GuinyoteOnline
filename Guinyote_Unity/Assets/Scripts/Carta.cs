using UnityEngine;

public class Carta : MonoBehaviour
{
    public int Palo;
    public int Numero;
    public int Puntos; // Puntos que vale la carta

    public void setCarta(int palo, int numero)
    {
        Palo = palo;
        if(numero < 7){
            Numero = numero + 1;
        } else {
            Numero = numero + 3;
        }
        switch(Numero){
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
        string[] traduccion = {"B", "C", "E", "O"};
        SpriteRenderer sr = GetComponent<SpriteRenderer>();
        sr.sprite = Resources.Load<Sprite>("Sprites/Cartas/" + traduccion[Palo] + "_" + Numero.ToString());
    }
}
