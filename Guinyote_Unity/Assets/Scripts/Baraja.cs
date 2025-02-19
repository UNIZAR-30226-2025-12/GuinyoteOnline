using UnityEngine;
using System.Collections.Generic;

public class Baraja : MonoBehaviour
{
    public Carta cartaPrefab;
    private List<(int, int)> cartas;

    public Baraja()
    {
        cartas = new List<(int, int)>();
        for (int i = 0; i < 40; i++)
        {
            cartas.Add((i % 4, i / 4));
        }
    }

    public void RecogerCartas()
    {
        cartas.Clear();
        GetComponent<SpriteRenderer>().color = new Color(1, 1, 1, 1f);
        for (int i = 0; i < 40; i++)
        {
            cartas.Add((i % 4, i / 4));
        }
    }
    public void Barajar()
    {
        for (int i = 0; i < cartas.Count; i++)
        {
            int index = Random.Range(0, cartas.Count);
            (int, int) temp = cartas[i];
            cartas[i] = cartas[index];
            cartas[index] = temp;
        }
    }

    public Carta DarCarta()
    {
        if (cartas.Count != 0)
        {
            int palo = cartas[0].Item1;
            int num = cartas[0].Item2;
            cartas.RemoveAt(0);
            Carta carta = Instantiate(cartaPrefab, transform.position, Quaternion.identity);
            carta.setCarta(palo, num);
            if (cartas.Count == 0)
            {
                GameManager.Instance.arrastre = true;
                GetComponent<SpriteRenderer>().color = new Color(1, 1, 1, 0.0f);
                GameManager.Instance.triunfo.GetComponent<SpriteRenderer>().color = new Color(1, 1, 1, 0.0f);
            }
            return carta;
        }
        else
        {
            Debug.Log("No quedan cartas en la baraja");
            return null;
        }
    }

    public void AnyadirAlFinal(Carta carta)
    {
        int numero = (carta.Numero <= 7) ? carta.Numero - 1 : carta.Numero - 3;
        cartas.Add((carta.Palo, numero));
    }

    public void EliminarUltima()
    {
        cartas.RemoveAt(cartas.Count -1);
    }
}
