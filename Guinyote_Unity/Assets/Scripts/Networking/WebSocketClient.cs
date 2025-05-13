using System;
using SocketIOClient;
using System.Collections.Generic;
using UnityEngine;
using System.Threading.Tasks;
using System.Text;
using System.Collections;

namespace WebSocketClient {

    [System.Serializable]
    public class JugadaWrapper
    {
        public string input;
        public string lobby;
        public string miId;
    }
    public class wsClient
    {
        private SocketIOUnity ws;
        private TaskCompletionSource<bool> connectionTCS;
        public event Action<string> OnPlayerJoined;
        public event Action<string> OnGameStarted;
        public event Action<input> OnInputReceived;
        public string miLobby;
        public int miId;
        public string socketId = "";
        public bool ackFinRonda = false;
        
        public async Task Connect(string url)
        {
            if (ws != null && ws.Connected) return;
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

            ws.On("socket-id", (response) =>
            {
                socketId = response.GetValue<string>().ToString();
                Debug.Log("Mi socket ID es: " + socketId);
            });

            ws.On("iniciarPartida", (response) => {
                Debug.Log("iniciando partida");
                UIManager.ChangeScene("Juego");
            });

            ws.On("baraja", (response) => {
                Debug.Log("baraja recibida");
                string baraja = response.GetValue<string>(0).ToString();
                Debug.Log(baraja);
                //SIRVE PARA QUE LA FUNCION SE EJECUTE EN EL HILO PRINCIPAL Y PUEDA CARGAR RECURSOS
                MainThreadDispatcher.Enqueue(() =>
                {
                    GameManager.Instance.iniciarBaraja(baraja);
                });
            });

            ws.On("finRonda", async (response) => {
                Debug.Log("fin ronda recibido");
                while (!ackFinRonda)
                {
                    await Task.Delay(100);
                }
                Debug.Log("¡La variable 'ackFinRonda' ahora es true!");
                enviarACK("ackFinRonda");
                ackFinRonda = false;
            });

            ws.On("barajaSegundaRonda", (response) => {
                Debug.Log("baraja recibida");
                string baraja = response.GetValue<string>(0).ToString();
                Debug.Log(baraja);
                MainThreadDispatcher.Enqueue(() =>
                {
                    GameManager.Instance.BarajarYRepartir(baraja);
                });
            });

            ws.On("primero", (response) => {
                int primero = response.GetValue<int>(0);
                miId = response.GetValue<int>(1);
                Debug.Log("el primero es " + primero + ", soy " + miId);
                MainThreadDispatcher.Enqueue(() =>
                {
                    GameManager.Instance.iniciarJugadores(primero, miId);
                });
            });

            ws.On("jugada", (response) => {
                Debug.Log("Raw data: " + response.ToString());
                input jugada;
                jugada.carta = response.GetValue<int>(0);
                jugada.cantar = response.GetValue<int>(1);
                jugada.cambiarSiete = response.GetValue<bool>(2);
                Debug.Log(jugada.carta);
                Debug.Log(jugada.cambiarSiete);
                Debug.Log(jugada.cantar);
                MainThreadDispatcher.Enqueue(() =>
                {
                    OnInputReceived?.Invoke(jugada);
                }); 
            });

            ws.On("partidaAbandonada", (response) => {
                Debug.Log("partida abandonada");
                MainThreadDispatcher.Enqueue(() =>
                {
                    GameManager.Instance.FinalizarPorDesconexion();
                });
            });

            ws.On("desconexion", (response) => {
                Debug.Log("Esperando a que todos los jugadores se conecten");
                //MOSTRAR MENSAJE EN PANTALLA
            });

            ws.On("datosPartida", (response) => {
                Debug.Log("datos de partida recibidos");
                GameManager.numJugadores = response.GetValue<int>(0);
                GameManager.esOnline = true;
                miId = response.GetValue<int>(1);
                miLobby = response.GetValue<string>(2);
                enviarACK();
            });

            ws.On("pedirBaraja", async (response) => {
                Debug.Log("enviando baraja al servidor");
                string baraja = GameManager.Instance.Baraja.ObtenerBaraja();
                await ws.EmitAsync("barajaReconexion", baraja);
                Debug.Log("baraja enviada");
            });

            ws.On("pedirSegundaBaraja", async (response) => {
                Debug.Log("enviando segunda baraja al servidor");
                string msg = GameManager.Instance.segundaBaraja ? "true" : "false";
                await ws.EmitAsync("segundaBarajaReconexion", msg);
                Debug.Log("segunda baraja enviado");
            });

            ws.On("pedirPuntos", async (response) => {
                Debug.Log("enviando puntos al servidor");
                var data = new Dictionary<string, object>
                {
                    { "puntos0", GameManager.Instance.jugadores[0].puntos },
                    { "puntos1", GameManager.Instance.jugadores[1].puntos },
                    { "puntos2", GameManager.Instance.jugadores.Length == 4 ? GameManager.Instance.jugadores[2].puntos : 0 },
                    { "puntos3", GameManager.Instance.jugadores.Length == 4 ? GameManager.Instance.jugadores[3].puntos : 0 }
                };
                await ws.EmitAsync("puntosReconexion", data);
                Debug.Log("puntos enviados");
            });

            ws.On("pedirManos", async (response) => {
                Debug.Log("enviando manos al servidor");
                var data = new Dictionary<string, object>
                {
                    { "mano0", GameManager.Instance.jugadores[0].GetMano() },
                    { "mano1", GameManager.Instance.jugadores[1].GetMano() },
                    { "mano2", GameManager.Instance.jugadores.Length == 4 ? GameManager.Instance.jugadores[2].GetMano() : "0" },
                    { "mano3", GameManager.Instance.jugadores.Length == 4 ? GameManager.Instance.jugadores[3].GetMano() : "0" }
                };
                await ws.EmitAsync("manosReconexion", data);
                Debug.Log("manos enviadas");
            });

            ws.On("pedirJugadas", async (response) => {
                Debug.Log("enviando jugadas al servidor");
                var data = new Dictionary<string, object>
                {
                    { "jugada0", GameManager.Instance.cartasJugadas[0] != null ? GameManager.Instance.cartasJugadas[0].ToString() : "0" },
                    { "jugada1", GameManager.Instance.cartasJugadas[1] != null ? GameManager.Instance.cartasJugadas[1].ToString() : "0" },
                    { "jugada2", (GameManager.Instance.cartasJugadas.Length == 4 && GameManager.Instance.cartasJugadas[2] != null) ? GameManager.Instance.cartasJugadas[2].ToString() : "0" },
                    { "jugada3", (GameManager.Instance.cartasJugadas.Length == 4 && GameManager.Instance.cartasJugadas[3] != null) ? GameManager.Instance.cartasJugadas[3].ToString() : "0" }
                };
                await ws.EmitAsync("jugadasReconexion", data);
                Debug.Log("jugadas enviadas");
            });

            ws.On("pedirOrden", async (response) => {
                Debug.Log("enviando orden de jugadores");
                int[] orden = GameManager.Instance.orden;
                string ordenTexto = orden[0].ToString() + orden[1].ToString();
                if (GameManager.Instance.orden.Length == 4) ordenTexto += orden[2].ToString() + orden[3].ToString();
                var data = new Dictionary<string, object>
                {
                    { "miId", miId },
                    { "orden", ordenTexto },
                    { "turno", GameManager.Instance.TurnManager.m_PlayerTurn }
                };
                await ws.EmitAsync("ordenReconexion", data);
                Debug.Log("orden enviado");
            });

            ws.On("reestablecer", (response) => {
                Debug.Log("reestableciendo estado");

                var datos = response.GetValue<Dictionary<string, object>>();

                MainThreadDispatcher.Enqueue(() =>
                {
                    GameManager.Instance.ReestablecerEstado(datos);
                });
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

        public async void enviarACK(string nombreAck = "ack")
        {
            Debug.Log("enviando confirmacion");
            await ws.EmitAsync(nombreAck, "Confirmacion enviada");
        }

        public async void enviarFinRonda()
        {
            if (miId != 0) return;
            Debug.Log("enviando fin ronda");
            var data = new Dictionary<string, object>
            {
                { "lobby", miLobby }
            };
            await ws.EmitAsync("fin-ronda", data);
        }

        public async void enviarFinPartida(List<Dictionary<string, object>> msg)
        {
            if (miId != 0) return;
            Debug.Log("enviando fin partida");
            await ws.EmitAsync("fin-partida", msg);
        }

        public async Task JoinRoom(string lobbyId, string playerId)
        {
            if (ws != null && ws.Connected)
            {
                var data = new Dictionary<string, object>
                {
                    { "lobbyId", lobbyId },
                    { "playerId", playerId }
                };
                await ws.EmitAsync("join-lobby", data);
            }
            miLobby = lobbyId;
        }

        public async Task JoinPrivateRoom(string lobbyId, string roomCode, string playerId)
        {
            if (ws != null && ws.Connected)
            {
                Debug.Log("Enviando join-private-lobby");
                var data = new Dictionary<string, object>
                {
                    { "lobbyId", lobbyId },
                    { "userId", playerId },
                    { "codigoAcceso", roomCode }
                };
                await ws.EmitAsync("join-private-lobby", data);
                Debug.Log("Enviado");
            }
            miLobby = lobbyId;
        }

        public async void enviarJugada(input jugada)
        {
            string inputJson = JsonUtility.ToJson(jugada);
            JugadaWrapper wrapper = new JugadaWrapper();
            wrapper.input = inputJson;
            wrapper.lobby = miLobby;
            wrapper.miId = socketId;

            string wrapperJson = JsonUtility.ToJson(wrapper);
            await ws.EmitAsync("realizarJugada", wrapperJson);
        }

        public async void buscarPartidasActivas(string correo)
        {
            Debug.Log("buscando partidas anteriores");
            Debug.Log(correo);
            Debug.Log(ws);
            Debug.Log(socketId);
            while (socketId == "")
            {
                await Task.Delay(100);
            }
            var data = new Dictionary<string, object>
                {
                    { "playerId", correo },
                    { "socketId", socketId }
                };
            await ws.EmitAsync("buscarPartidasActivas", data);
        }

        public bool isConnected()
        {
            return (ws == null) ? false : ws.Connected;
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
            /*else if (message.Contains("input"))
            {
                OnInputReceived?.Invoke(message);
            }*/
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