using System.Collections;
using System.Collections.Generic;
using System;
using UnityEngine;
using UnityEngine.Networking;
using System.Reflection;

namespace ConsultasBD
{
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
    public class Jugador
    {
        // Representa un jugador en el juego.
        public string idUsuario, nombre;
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
        public static event Action OnAmigosConsultados;

        /// <summary>
        /// Evento que se activa al iniciar sesión correctamente.
        /// </summary>
        public static event Action<string> OnInicioSesion;

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
                Debug.Log("Amigos: " + www.downloadHandler.text);
                //POR TERMINAR
                //Amigos[] amigos = JsonHelper.FromJson<Partida>(www.downloadHandler.text);
                //OnAmigosConsultados?.Invoke(historial);             
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
                OnInicioSesion?.Invoke(id);
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
        /// <returns>Un IEnumerator para la ejecución de la corrutina.</returns>
        public static IEnumerator CrearSalaPrivada(string idUsuario)
        {
            Debug.Log("Creando sala privada...");
            WWWForm form = new WWWForm();
            form.AddField("idUsuario", idUsuario);
            UnityWebRequest www = UnityWebRequest.Post(address + "/salas/crearPrivada", form);
            yield return www.SendWebRequest();

            if (www.result != UnityWebRequest.Result.Success)
            {
                Debug.Log("Error al crear sala privada: " + www.error);
            }
            else
            {
                Debug.Log("Sala privada creada: " + www.downloadHandler.text);
                // Manejar el código de la sala recibido del servidor.
            }
        }

        /// <summary>
        /// Se une a una sala privada mediante un código.
        /// </summary>
        /// <param name="codigoSala">El código de la sala privada.</param>
        /// <param name="idUsuario">El ID del usuario que se une.</param>
        /// <returns>Un IEnumerator para la ejecución de la corrutina.</returns>
        public static IEnumerator UnirseSalaPrivada(string codigoSala, string idUsuario)
        {
            Debug.Log("Uniéndose a sala privada...");
            WWWForm form = new WWWForm();
            form.AddField("codigoSala", codigoSala);
            form.AddField("idUsuario", idUsuario);
            UnityWebRequest www = UnityWebRequest.Post(address + "/salas/unirsePrivada", form);
            yield return www.SendWebRequest();

            if (www.result != UnityWebRequest.Result.Success)
            {
                Debug.Log("Error al unirse a la sala privada: " + www.error);
            }
            else
            {
                Debug.Log("Unido a la sala privada: " + www.downloadHandler.text);
                // Manejar la respuesta del servidor.
            }
        }

        /// <summary>
        /// Busca una partida pública.
        /// </summary>
        /// <param name="idUsuario">El ID del usuario que busca partida.</param>
        /// <returns>Un IEnumerator para la ejecución de la corrutina.</returns>
        public static IEnumerator BuscarPartidaPublica(string idUsuario)
        {
            Debug.Log("Buscando partida pública...");
            WWWForm form = new WWWForm();
            form.AddField("idUsuario", idUsuario);
            UnityWebRequest www = UnityWebRequest.Post(address + "/salas/buscarPublica", form);
            yield return www.SendWebRequest();

            if (www.result != UnityWebRequest.Result.Success)
            {
                Debug.Log("Error al buscar partida pública: " + www.error);
            }
            else
            {
                Debug.Log("Partida pública encontrada: " + www.downloadHandler.text);
                // Manejar la respuesta del servidor.
            }
        }
    } 
}
