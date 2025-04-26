using System;
using WebSocketSharp;

public class WebSocketClient
{
    private WebSocket ws;

    public event Action<string> OnPlayerJoined;
    public event Action<string> OnGameStarted;

    public void Connect(string url)
    {
        ws = new WebSocket(url);
        ws.OnMessage += (sender, e) =>
        {
            Console.WriteLine("Mensaje recibido: " + e.Data);
            HandleServerMessage(e.Data);
        };
        ws.OnOpen += (sender, e) =>
        {
            Console.WriteLine("Conexión establecida con el servidor.");
        };
        ws.OnError += (sender, e) =>
        {
            Console.WriteLine("Error en la conexión: " + e.Message);
        };
        ws.OnClose += (sender, e) =>
        {
            Console.WriteLine("Conexión cerrada.");
        };
        ws.Connect();
    }

    public void JoinRoom(string roomType)
    {
        if (ws != null && ws.IsAlive)
        {
            var message = $"{{\"action\":\"buscarPartida\",\"tipo\":\"{roomType}\"}}";
            ws.Send(message);
        }
    }

    private void HandleServerMessage(string message)
    {
        // Procesar mensajes del servidor
        if (message.Contains("playerJoined"))
        {
            OnPlayerJoined?.Invoke(message);
        }
        else if (message.Contains("gameStarted"))
        {
            OnGameStarted?.Invoke(message);
        }
    }

    public void SendMessage(string message)
    {
        if (ws != null && ws.IsAlive)
        {
            ws.Send(message);
        }
    }

    public void Close()
    {
        if (ws != null)
        {
            ws.Close();
        }
    }
}