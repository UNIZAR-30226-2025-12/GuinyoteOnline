using UnityEngine;

public class Player : MonoBehaviour
{
    public Vector3 m_MoveTarget;
    public Carta[] mano;
    public Carta jugada;
    protected bool m_esMiTurno = false;
    protected bool m_CartaDesplazandose = false;
    protected bool m_Cantado = false;
    public int puntos;

    public Player()
    {
        mano = new Carta[6];
        jugada = null;
        puntos = 0;
    }

    void Start(){
        m_MoveTarget = transform.position + transform.up * 6.35f;
    }

    public void AnyadirCarta(Carta carta)
    {
        if (carta == null)
        {
            Debug.Log("Jugador no recibe carta");
            return;
        }
        float[] posiciones = { -8.65f, -5.15f, -1.75f, 1.75f, 5.15f, 8.65f };
        for (int i = 0; i < mano.Length; i++)
        {
            if (mano[i] == null)
            {
                mano[i] = carta;
                carta.transform.rotation = this.transform.rotation;
                carta.transform.position = this.transform.position + this.transform.right * posiciones[i];
                break;
            }
        }
    }

    public bool UsarCarta(int index)
    {
        if (mano[index] != null)
        {
            Carta carta = mano[index];
            mano[index] = null;
            jugada = carta;
            return true;
        }
        else
        {
            return false;
        }
    }

    public void meToca()
    {
        m_esMiTurno = true;
    }
}
