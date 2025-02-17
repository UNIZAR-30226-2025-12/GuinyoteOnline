using UnityEngine;

public class TurnManager
{
    public event System.Action<int> TurnChange;
    public event System.Action Evaluation;
    private int m_PlayerTurn;
    private int m_PlayerCount;

    public TurnManager(int numPlayers)
    {
        m_PlayerCount = numPlayers;
    }

    public void Tick()
    {
        m_PlayerTurn++;
        if(m_PlayerTurn < m_PlayerCount)
        {
            TurnChange?.Invoke(m_PlayerTurn);
            Debug.Log("Turno del jugador " + m_PlayerTurn);
        }
        else
        {
            m_PlayerTurn = -1;
            Evaluation?.Invoke();
        }
    }

    public void Reset()
    {
        m_PlayerTurn = -1;
    }
}
