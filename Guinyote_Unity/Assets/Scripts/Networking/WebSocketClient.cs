using System;
using SocketIOClient;
using System.Collections.Generic;
using UnityEngine;
using System.Threading.Tasks;
using System.Text;
using System.Collections;

namespace WebSocketClient {
    public class wsClient
    {
        private SocketIOUnity ws;
        private TaskCompletionSource<bool> connectionTCS;
        public event Action<string> OnPlayerJoined;
        public event Action<string> OnGameStarted;
        public event Action<string> OnInputReceived;
        public event Action<string> OnBarajaRecibida;

        public async Task Connect(string url)
        {
            connectionTCS = new TaskCompletionSource<bool>();

            Debug.Log("conectando...");
            ws = new SocketIOUnity(url, new SocketIOOptions
            {
                Query = new Dictionary<string, string>
                {
                    { "token", "UNITY" }
                },
                Transport = SocketIOClient.Transport.TransportProtocol.WebSocket
            });

            ws.On("hello", (response) =>
            {
                Debug.Log("Mensaje del servidor: " + response.GetValue<string>());
            });

            ws.On("iniciarPartida", (response) => {
                Debug.Log("iniciando partida");
                UIManager.ChangeScene("Juego");
            });

            ws.On("baraja", async (response) => {
                Debug.Log("baraja recibida");
                string baraja = response.GetValue<string>().ToString();
                Debug.Log(baraja);
                OnBarajaRecibida?.Invoke(baraja);
            });

            ws.OnConnected += async (sender, e) =>
            {
                Debug.Log("Conectado al servidor");
                await ws.EmitAsync("hello", "¡Hola desde Unity!");
                connectionTCS.TrySetResult(true);
            };

            ws.OnError += (sender, e) =>
            {
                Console.WriteLine("Error en la conexión: " + e);
                connectionTCS.TrySetResult(false);
            };
            ws.OnDisconnected += (sender, e) =>
            {
                Console.WriteLine("Conexión cerrada.");
            };
            ws.Connect();
            await connectionTCS.Task;
        }

        public async Task JoinRoom(string lobbyId, string playerId)
        {
            Debug.Log(ws.Connected);
            if (ws != null && ws.Connected)
            {
                var data = new Dictionary<string, object>
                {
                    { "lobbyId", lobbyId },
                    { "playerId", playerId }
                };
                await ws.EmitAsync("join-lobby", data);
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
            else if (message.Contains("input"))
            {
                OnInputReceived?.Invoke(message);
            }
        }

        public async void SendMessage(string message)
        {
            if (ws != null && ws.Connected)
            {
                await ws.EmitAsync(message);
            }
        }

        public void Close()
        {
            if (ws != null)
            {
                ws.Disconnect();
            }
        }
    }
}