using System.Collections;
using System.Collections.Generic;
using System;
using UnityEngine;
using UnityEngine.Networking;
using System.Reflection;
using UnityEngine.InputSystem.Interactions;
using System.Threading.Tasks;

namespace ConsultasBD
{
    [Serializable]
    public class Lobby
    {
        public string id;
        public int maxPlayers;
        public string idCreador;
        public string tipo;
        public string codigoAcceso;
        public string[] jugadores;
        public string estado;
    }

    public static class JsonHelper
    {

        /// <summary>
        /// Deserializa un string JSON en un array de objetos del tipo T.
        /// </summary>
        /// <typeparam name="T">El tipo de los objetos en el array.</typeparam>
        /// <param name="json">El string JSON a deserializar.</param>
        /// <returns>Un array de objetos del tipo T.</returns>
        public static T[] FromJson<T>(string json)
        {
            // Envolvemos el array en un objeto, ya que JsonUtility solo puede deserializar objetos, no arrays.
            string wrappedJson = "{\"items\":" + json + "}";

            // Ahora deserializamos el objeto que contiene el array.
            Wrapper<T> wrapper = JsonUtility.FromJson<Wrapper<T>>(wrappedJson);
            return wrapper.items;
        }

        // Clase envolvente para contener el array.
        [System.Serializable]
        private class Wrapper<T>
        {
            public T[] items; // El array real que contiene los objetos.
        }
    }

    [System.Serializable]
    public class Usuario
    {
        // Representa un usuario.
        public string idUsuario, nombre, correo, foto_perfil, tapete, imagen_carta; 
        public int nVictorias;
    }

    [System.Serializable]
    public class UserInfo
    {
        public string nombre;
        public string contrasena;
        public string foto_perfil;
    }

    [System.Serializable]
    public class Jugador : Usuario
    {
        public int equipo, puntuacion;
    }

    [System.Serializable]
    public class Partida
    {
        // Representa una partida del juego.
        public string idPartida, fecha_inicio, estado;
        public Jugador[] jugadores;
    }

    public static class Consultas
    {
        // URL base para las solicitudes API.
        private static string address = "https://guinyoteonline-hkio.onrender.com";

        /// <summary>
        /// Evento que se activa al consultar el historial de partidas.
        /// </summary>
        public static event Action<Partida[]> OnHistorialConsultado;

        /// <summary>
        /// Evento que se activa al consultar la lista de amigos.
        /// </summary>
        public static event Action<Usuario[]> OnAmigosConsultados;

        /// <summary>
        /// Evento que se activa al consultar la lista de solicitudes de amistad.
        /// </summary>
        public static event Action<Usuario[]> OnSolicitudesAmigosConsultadas;


        /// <summary>
        /// Evento que se activa al  enviar una solicitud de amistad.
        /// </summary>
        public static event Action OnEnviarSolicitudAmistad;

        /// <summary>
        /// Evento que se activa al eliminar una amistad.
        /// </summary>
        public static event Action OnEliminarAmistad;


        /// <summary>
        /// Evento que se activa al ocurrir una error al enviar una solicitud de amistad.
        /// </summary>
        public static event Action OnErrorEnviarSolicitudAmistad;

        /// <summary>
        /// Evento que se activa al aceptar una solicitud de amistad.
        /// </summary>
        public static event Action OnAceptarSolicitudAmistad;

        /// <summary>
        /// Evento que se activa al ocurrir un error al  aceptar una solicitud de amistad.
        /// </summary>
        public static event Action OnErrorAceptarSolicitudAmistad;

        /// <summary>
        /// Evento que se activa al rechazar una solicitud de amistad..
        /// </summary>
        public static event Action OnRechazarSolicitudAmistad;

        /// <summary>
        /// Evento que se activa al ocurrir un error rechazar una solicitud de amistad..
        /// </summary>
        public static event Action OnErrorRechazarSolicitudAmistad;

        /// <summary>
        /// Evento que se activa al obtener una lista de rankings.
        /// </summary>
        public static event Action<Usuario[]> OnRankingConsultado;

        /// <summary>
        /// Evento que se activa al ocurrir un error al obtener una lista de rankings.
        /// </summary>
        public static event Action OnErrorRankingConsultado;


        /// <summary>
        /// Evento que se activa al iniciar sesión correctamente.
        /// </summary>
        public static event Action<string, string, string, string, string> OnInicioSesion;

        /// <summary>
        /// Evento que se activa al ocurrir un error en el inicio de sesión.
        /// </summary>
        public static event Action OnErrorInicioSesion;

        /// <summary>
        /// Evento que se activa al registrar un usuario correctamente.
        /// </summary>
        public static event Action OnRegistroUsuario;

        /// <summary>
        /// Evento que se activa al ocurrir un error en el registro de usuario.
        /// </summary>
        public static event Action OnErrorRegistroUsuario;

        /// <summary>
        /// Evento que se activa al cambiar los datos un usuario correctamente.
        /// </summary>
        public static event Action<String> OnCambiarInfoUsuario;

        /// <summary>
        /// Evento que se activa al encontrar una partida publica online.
        /// </summary>
        public static event Action<Lobby, String> OnPartidaEncontrada;
        
        /// <summary>
        /// Evento que se activa al encontrar una partida privada online.
        /// </summary>
        public static event Action<Lobby, String, String> OnPartidaPrivadaEncontrada;


        /// <summary>
        /// Consulta el historial de partidas de un usuario por su ID.
        /// </summary>
        /// <param name="id">El ID del usuario.</param>
        /// <returns>Un IEnumerator para la ejecución de la corrutina.</returns>
        public static IEnumerator GetHistorialUsuario(string id)
        {
            Debug.Log("Consultando historial...");
            UnityWebRequest www = UnityWebRequest.Get(address + "/partidas/historial/" + id);
            yield return www.SendWebRequest();

            if (www.result != UnityWebRequest.Result.Success)
            {
                Debug.Log("error: " + www.error);
            }
            else
            {
                Partida[] historial = JsonHelper.FromJson<Partida>(www.downloadHandler.text);
                OnHistorialConsultado?.Invoke(historial);
            }
        }

        /// <summary>
        /// Consulta el ranking de partidas.
        /// </summary>
        /// <returns>Un IEnumerator para la ejecución de la corrutina.</returns>
        public static IEnumerator GetRanking()
        {
            Debug.Log("Consultando ranking...");
            UnityWebRequest www = UnityWebRequest.Get(address + "/rankings/");
            yield return www.SendWebRequest();

            if (www.result != UnityWebRequest.Result.Success)
            {
                Debug.Log("error: " + www.error);
                OnErrorRankingConsultado?.Invoke();
            }
            else
            {
                Usuario[] ranking = JsonHelper.FromJson<Usuario>(www.downloadHandler.text);
                OnRankingConsultado?.Invoke(ranking);
            }
        }

        /// <summary>
        /// Consulta la lista de amigos de un usuario por su ID.
        /// </summary>
        /// <param name="id">El ID del usuario.</param>
        /// <returns>Un IEnumerator para la ejecución de la corrutina.</returns>
        public static IEnumerator GetAmigosUsuario(string id)
        {
            Debug.Log("Consultando Amigos...");
            UnityWebRequest www = UnityWebRequest.Get(address + "/amigos/" + id);
            yield return www.SendWebRequest();

            if (www.result != UnityWebRequest.Result.Success)
            {
                Debug.Log("error: " + www.error);
            }
            else
            {
                Debug.Log("Respuesta del servidor: " + www.downloadHandler.text);
                Usuario[] amigos = JsonHelper.FromJson<Usuario>(www.downloadHandler.text);
                Debug.Log("Amigos deserializados: " + amigos.Length);
                foreach (var amigo in amigos)
                {
                    Debug.Log("Amigo: " + amigo.nombre);
                }
                OnAmigosConsultados?.Invoke(amigos);
            }
        }

        /// <summary>
        /// Consulta la lista de solicitudes de amistad de un usuario por su ID.
        /// </summary>
        /// <param name="id">El ID del usuario.</param>
        /// <returns>Un IEnumerator para la ejecución de la corrutina.</returns>
        public static IEnumerator GetSolicitudesAmistadUsuario(string id)
        {
            Debug.Log("Consultando Solicitudes de amistad...");
            Debug.Log("ID: " + id);
            UnityWebRequest www = UnityWebRequest.Get(address + "/solicitudes/" + id);
            yield return www.SendWebRequest();

            if (www.result != UnityWebRequest.Result.Success)
            {
                Debug.Log("error: " + www.error);
            }
            else
            {
                Debug.Log("Respuesta del servidor: " + www.downloadHandler.text);
                Usuario[] solicitudes = JsonHelper.FromJson<Usuario>(www.downloadHandler.text);
                Debug.Log("Solicitudes deserializadas: " + solicitudes.Length);
                foreach (var solicitud in solicitudes)
                {
                    Debug.Log("Solicitud: " + solicitud.nombre);
                }
                OnSolicitudesAmigosConsultadas?.Invoke(solicitudes);
            }
        }

        /// <summary>
        /// Intenta iniciar sesión con las credenciales proporcionadas.
        /// </summary>
        /// <param name="id">El ID del usuario.</param>
        /// <param name="pwd">La contraseña del usuario.</param>
        /// <returns>Un IEnumerator para la ejecución de la corrutina.</returns>
        public static IEnumerator InicioDeSesion(string id, string pwd)
        {
            Debug.Log("Iniciando sesión...");
            WWWForm form = new WWWForm();
            form.AddField("correo", id);
            form.AddField("contrasena", pwd);
            UnityWebRequest www = UnityWebRequest.Post(address + "/usuarios/inicioSesion/", form);
            yield return www.SendWebRequest();

            if (www.result != UnityWebRequest.Result.Success)
            {
                Debug.Log("error: " + www.error);
                OnErrorInicioSesion?.Invoke();
            }
            else
            {
                Debug.Log("Respuesta del servidor: " + www.downloadHandler.text);
                Usuario usuario = JsonUtility.FromJson<Usuario>(www.downloadHandler.text);
                string nombre = usuario.nombre;
                string profile_picture = usuario.foto_perfil;
                string tapete = usuario.tapete;
                string carta = usuario.imagen_carta;

                Debug.Log("ID: " + id);
                Debug.Log("Nombre: " + nombre);
                Debug.Log("Foto de perfil: " + profile_picture);
                Debug.Log("Tapete: " + tapete);
                Debug.Log("Carta: " + carta);

                OnInicioSesion?.Invoke(id, nombre, profile_picture, tapete, carta);
            }
        }

        /// <summary>
        /// Registra un nuevo usuario con los datos proporcionados.
        /// </summary>
        /// <param name="nombre">El nombre del usuario.</param>
        /// <param name="id">El ID del usuario.</param>
        /// <param name="pwd">La contraseña del usuario.</param>
        /// <returns>Un IEnumerator para la ejecución de la corrutina.</returns>
        public static IEnumerator RegistroUsuario(string nombre, string id, string pwd)
        {
            Debug.Log("Registrando usuario...");
            WWWForm form = new WWWForm();
            form.AddField("nombre", nombre);
            form.AddField("correo", id);
            form.AddField("contrasena", pwd);
            UnityWebRequest www = UnityWebRequest.Post(address + "/usuarios/registro/", form);
            yield return www.SendWebRequest();

            if (www.result != UnityWebRequest.Result.Success)
            {
                Debug.Log("error: " + www.error);
                OnErrorRegistroUsuario?.Invoke();
            }
            else
            {
                OnRegistroUsuario?.Invoke();
            }
        }

        /// <summary>
        /// Cambia la información del usuario con los datos proporcionados.
        /// </summary>
        /// <param name="nombre">El nuevo nombre del usuario.</param>
        /// <param name="id">El ID del usuario.</param>
        /// <param name="pwd">La nueva contraseña del usuario.</param>
        /// <param name="tapete">El nuevo diseño del tapete del usuario.</param>
        /// <param name="carta">El nuevo estilo de carta del usuario.</param>
        public static IEnumerator CambiarInfoUsuario(string id, string nombre = null, string pwd_antiguo = null, string pwd_nuevo=null, string foto_perfil = null, string tapete = null, string carta = null)
        {
            if (!string.IsNullOrEmpty(nombre))
            {
            yield return CambiarNombreUsuario(id, nombre);
            }

            if (!string.IsNullOrEmpty(pwd_nuevo))
            {
            yield return CambiarContrasenaUsuario(id, pwd_antiguo, pwd_nuevo);
            }

            if (!string.IsNullOrEmpty(foto_perfil))
            {
            yield return CambiarFotoPerfilUsuario(id, foto_perfil);
            }

            if (!string.IsNullOrEmpty(tapete))
            {
            yield return CambiarTapeteUsuario(id, tapete);
            }

            if (!string.IsNullOrEmpty(carta))
            {
            yield return CambiarCartaUsuario(id, carta);
            }
        }

        private static IEnumerator CambiarNombreUsuario(string id, string nombre)
        {
            Debug.Log("Cambiando nombre de usuario...");
            WWWForm form = new WWWForm();
            form.AddField("nombre", nombre);
            byte[] formData = form.data;
            UnityWebRequest www = UnityWebRequest.Put(address + "/usuarios/perfil/cambiarUsername/" + id, formData);
            www.SetRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            yield return www.SendWebRequest();

            if (www.result != UnityWebRequest.Result.Success)
            {
            Debug.Log("Error al cambiar nombre: " + www.error);
            }
            else
            {
            OnCambiarInfoUsuario?.Invoke(nombre);
            Debug.Log("Nombre cambiado correctamente." + nombre);
            }
        }

        private static IEnumerator CambiarContrasenaUsuario(string id, string pwd_antiguo, string pwd_nuevo)
        {
            Debug.Log("Cambiando contraseña de usuario...");
            WWWForm form = new WWWForm();
            form.AddField("contrasena_antigua", pwd_antiguo);
            form.AddField("contrasena_nueva", pwd_nuevo);

            byte[] formData = form.data;
            UnityWebRequest www = UnityWebRequest.Put(address + "/usuarios/perfil/cambiarContrasena/" + id, formData);
            www.SetRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            yield return www.SendWebRequest();

            if (www.result != UnityWebRequest.Result.Success)
            {
            Debug.Log("Error al cambiar contraseña: " + www.error);
            }
            else
            {
            Debug.Log("Contraseña cambiada correctamente." + pwd_nuevo);
            }
        }

        private static IEnumerator CambiarFotoPerfilUsuario(string id, string foto_perfil)
        {
            Debug.Log("Cambiando foto de perfil de usuario...");
            WWWForm form = new WWWForm();
            form.AddField("foto_perfil", foto_perfil);
            byte[] formData = form.data;
            UnityWebRequest www = UnityWebRequest.Put(address + "/usuarios/perfil/cambiarFoto/" + id, formData);
            www.SetRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            yield return www.SendWebRequest();

            if (www.result != UnityWebRequest.Result.Success)
            {
            Debug.Log("Error al cambiar foto de perfil: " + www.error);
            }
            else
            {
            Debug.Log("Foto de perfil cambiada correctamente."+ foto_perfil);
            }
        }

        private static IEnumerator CambiarTapeteUsuario(string id, string tapete)
        {
            Debug.Log("Cambiando tapete de usuario...");
            WWWForm form = new WWWForm();
            form.AddField("tapete", tapete);
            byte[] formData = form.data;
            UnityWebRequest www = UnityWebRequest.Put(address + "/usuarios/perfil/cambiarTapete/" + id, formData);
            www.SetRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            yield return www.SendWebRequest();

            if (www.result != UnityWebRequest.Result.Success)
            {
            Debug.Log("Error al cambiar tapete: " + www.error);
            }
            else
            {
            Debug.Log("Tapete cambiado correctamente." + tapete);
            }
        }

        private static IEnumerator CambiarCartaUsuario(string id, string carta)
        {
            Debug.Log("Cambiando carta de usuario...");
            WWWForm form = new WWWForm();
            form.AddField("imagen_carta", carta);
            byte[] formData = form.data;
            UnityWebRequest www = UnityWebRequest.Put(address + "/usuarios/perfil/cambiarCartas/" + id, formData);
            www.SetRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            yield return www.SendWebRequest();

            if (www.result != UnityWebRequest.Result.Success)
            {
            Debug.Log("Error al cambiar carta: " + www.error);
            }
            else
            {
            Debug.Log("Carta cambiada correctamente." + carta);
            }
        }

         /// <summary>
        /// Envía una solicitud de amistad con los datos proporcionados.
        /// </summary>
        /// <param name="idAceptante">El ID del usuario que solicitó la amistad.</param>
        /// <param name="idSolicitante">El ID del usuario que aceptó la solicitud de amistad.</param>
        /// <returns>Un IEnumerator para la ejecución de la corrutina.</returns>
        public static IEnumerator EnviarSolicitudAmistad(string idAceptante, string idSolicitante)
        {
            Debug.Log("Enviando solicitud de amistad...");
            Debug.Log("idAceptante: " + idAceptante);
            Debug.Log("idSolicitante: " + idSolicitante);
            WWWForm form = new WWWForm();
            form.AddField("idSolicitado", idAceptante);
            form.AddField("idSolicitante", idSolicitante);
            UnityWebRequest www = UnityWebRequest.Post(address + "/amigos/enviarSolicitud/", form);
            yield return www.SendWebRequest();

            if (www.result != UnityWebRequest.Result.Success)
            {
                Debug.Log("error: " + www.error);
                OnErrorEnviarSolicitudAmistad?.Invoke();
            }
            else
            {
                Debug.Log("Mensaje: " + www.downloadHandler.text);
                OnEnviarSolicitudAmistad?.Invoke();
            }
        }

        /// <summary>
        /// Elimina una amistad con los datos proporcionados.
        /// </summary>
        /// <param name="idEliminador">El ID del usuario que solicitó la eliminación.</param>
        /// <param name="idEliminado">El ID del usuario que se elimina.</param>
        /// <returns>Un IEnumerator para la ejecución de la corrutina.</returns>
        public static IEnumerator EliminarAmigo(string idEliminador, string idEliminado)
        {
            Debug.Log("Aceptando solicitud de amistad...");
            WWWForm form = new WWWForm();
            form.AddField("idEliminador", idEliminador);
            form.AddField("idEliminado", idEliminado);
            UnityWebRequest www = UnityWebRequest.Post(address + "/amigos/eliminarAmigo/", form);
            yield return www.SendWebRequest();

            if (www.result != UnityWebRequest.Result.Success)
            {
                Debug.Log("error: " + www.error);
            }
            else
            {
                OnEliminarAmistad?.Invoke();
            }
        }

        /// <summary>
        /// Acepta una solicitud de amistad con los datos proporcionados.
        /// </summary>
        /// <param name="idAceptante">El ID del usuario que solicitó la amistad.</param>
        /// <param name="idSolicitante">El ID del usuario que aceptó la solicitud de amistad.</param>
        /// <returns>Un IEnumerator para la ejecución de la corrutina.</returns>
        public static IEnumerator AceptarSolicitudAmistad(string idAceptante, string idSolicitante)
        {
            Debug.Log("Aceptando solicitud de amistad...");
            WWWForm form = new WWWForm();
            form.AddField("idAceptante", idAceptante);
            form.AddField("idSolicitante", idSolicitante);
            UnityWebRequest www = UnityWebRequest.Post(address + "/amigos/aceptarSolicitud/", form);
            yield return www.SendWebRequest();

            if (www.result != UnityWebRequest.Result.Success)
            {
                Debug.Log("error: " + www.error);
                OnErrorAceptarSolicitudAmistad?.Invoke();
            }
            else
            {
                OnAceptarSolicitudAmistad?.Invoke();
            }
        }

        /// <summary>
        /// Acepta una solicitud de amistad con los datos proporcionados.
        /// </summary>
        /// <param name="idAceptante">El ID del usuario que solicitó la amistad.</param>
        /// <param name="idSolicitante">El ID del usuario que aceptó la solicitud de amistad.</param>
        /// <returns>Un IEnumerator para la ejecución de la corrutina.</returns>
        public static IEnumerator RechazarSolicitudAmistad(string idRechazante, string idSolicitante)
        {
            Debug.Log("Aceptando solicitud de amistad...");
            WWWForm form = new WWWForm();
            form.AddField("idRechazante", idRechazante);
            form.AddField("idSolicitante", idSolicitante);
            UnityWebRequest www = UnityWebRequest.Post(address + "/amigos/rechazarSolicitud/", form);
            yield return www.SendWebRequest();

            if (www.result != UnityWebRequest.Result.Success)
            {
                Debug.Log("error: " + www.error);
                OnErrorRechazarSolicitudAmistad?.Invoke();
            }
            else
            {
                OnRechazarSolicitudAmistad?.Invoke();
            }
        }


        /// <summary>
        /// Muestra los campos de un array de objetos en la consola.
        /// </summary>
        /// <typeparam name="T">El tipo de los objetos en el array.</typeparam>
        /// <param name="array">El array de objetos a mostrar.</param>
        public static void MostrarCamposArray<T>(T[] array)
        {
            foreach (var obj in array)
            {
                MostrarCamposObjeto(obj);
            }
        }

        /// <summary>
        /// Muestra los campos de un objeto en la consola.
        /// </summary>
        /// <param name="obj">El objeto a mostrar.</param>
        public static void MostrarCamposObjeto(object obj)
        {
            Type tipo = obj.GetType();

            FieldInfo[] campos = tipo.GetFields(BindingFlags.Public | BindingFlags.Instance);

            // Iterar sobre los campos y mostrar sus nombres y valores.
            foreach (var campo in campos)
            {
                var valor = campo.GetValue(obj);

                // Si el valor es un array, recorrer los elementos.
                if (valor is Array arrayValor)
                {
                    Debug.Log($"{campo.Name} (Array):");
                    foreach (var elemento in arrayValor)
                    {
                        MostrarCamposObjeto(elemento);
                    }
                }
                // Si el valor es un objeto, llamar recursivamente para mostrar sus campos.
                else if (valor != null && !valor.GetType().IsPrimitive && !(valor is string))
                {
                    Debug.Log($"{campo.Name} (Objeto):");
                    MostrarCamposObjeto(valor);
                }
                else
                {
                    // Si no es un array ni un objeto, mostrar el valor.
                    Debug.Log($"{campo.Name}: {valor}");
                }
            }
        }

        /// <summary>
        /// Crea una sala privada en el servidor.
        /// </summary>
        /// <param name="idUsuario">El ID del usuario que crea la sala.</param>
        /// <param name="maxPlayers">El número máximo de jugadores en la sala.</param>
        /// <returns>Un IEnumerator para la ejecución de la corrutina.</returns>
        public static IEnumerator CrearSalaPrivada(string idUsuario, string maxPlayers, Action<Lobby> onResult)
        {
            Debug.Log("Creando sala privada...");
            WWWForm form = new WWWForm();
            form.AddField("idUsuario", idUsuario);
            form.AddField("maxPlayers", maxPlayers);

            using (UnityWebRequest www = UnityWebRequest.Post(address + "/salas/crearPrivada", form))
            {
                yield return www.SendWebRequest();

                if (www.result == UnityWebRequest.Result.Success)
                {
                    Lobby lobby = JsonUtility.FromJson<Lobby>(www.downloadHandler.text);
                    onResult?.Invoke(lobby);
                }
                else
                {
                    Debug.LogError("Error al crear sala privada: " + www.error);
                    onResult?.Invoke(null);
                }
            }
        }

        /// <summary>
        /// Se une a una sala privada mediante un código.
        /// </summary>
        /// <param name="codigoSala">El código de la sala privada.</param>
        /// <param name="idUsuario">El ID del usuario que se une.</param>
        /// <returns>Un IEnumerator para la ejecución de la corrutina.</returns>
        public static IEnumerator UnirseSalaPrivada(string codigoSala, string idUsuario, string maxPlayers)
        {
            Debug.Log("Uniéndose a sala privada...");
            WWWForm form = new WWWForm();
            form.AddField("codigoAcceso", codigoSala);
            form.AddField("idUsuario", idUsuario);
            form.AddField("maxPlayers", maxPlayers);
            UnityWebRequest www = UnityWebRequest.Post(address + "/salas/unirsePrivada", form);
            yield return www.SendWebRequest();

            if (www.result != UnityWebRequest.Result.Success)
            {
                Debug.Log("Error al unirse a la sala privada: " + www.error);
            }
            else
            {
                Debug.Log("Unido a la sala privada: " + www.downloadHandler.text);
                Lobby lobby = JsonUtility.FromJson<Lobby>(www.downloadHandler.text);
                OnPartidaPrivadaEncontrada?.Invoke(lobby, codigoSala, idUsuario);
            }
        }

        /// <summary>
        /// Busca una partida pública.
        /// </summary>
        /// <param name="idUsuario">El ID del usuario que busca partida.</param>
        /// <returns>Un IEnumerator para la ejecución de la corrutina.</returns>
        public static IEnumerator BuscarPartidaPublica(string idUsuario, string roomType)
        {
            Debug.Log("Buscando partida pública...");
            WWWForm form = new WWWForm();
            form.AddField("playerId", idUsuario);
            form.AddField("maxPlayers", roomType);
            UnityWebRequest www = UnityWebRequest.Post(address + "/salas/matchmake", form);
            yield return www.SendWebRequest();

            if (www.result != UnityWebRequest.Result.Success)
            {
                Debug.Log("Error al buscar partida pública: " + www.error);
            }
            else
            {
                Debug.Log("Partida pública encontrada: " + www.downloadHandler.text);
                Lobby lobby = JsonUtility.FromJson<Lobby>(www.downloadHandler.text);
                OnPartidaEncontrada?.Invoke(lobby, idUsuario);
            }
        }
    } 
}
