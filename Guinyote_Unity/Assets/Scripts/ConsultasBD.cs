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
        // Deserializa el JSON como un array de T.
        public static T[] FromJson<T>(string json)
        {
            // Envolvemos el array en un objeto, ya que JsonUtility solo puede deserializar objetos, no arrays
            string wrappedJson = "{\"items\":" + json + "}";

            // Ahora deserializamos el objeto que contiene el array
            Wrapper<T> wrapper = JsonUtility.FromJson<Wrapper<T>>(wrappedJson);
            //Partida p = (Partida) wrapper.items[0];
            return wrapper.items;
        }

        // Clase envolvente para contener el array.
        [System.Serializable]
        private class Wrapper<T>
        {
            public T[] items; // El array real que contiene los objetos
        }
    }

    [System.Serializable]
    public class Jugador
    {
        public string idUsuario, nombre;
        public int equipo,
                puntuacion;
    }

    [System.Serializable]
    public class Partida
    {
        public string idPartida,
                    fecha_inicio,
                    estado;
        public Jugador[] jugadores;
    }

    //CLASE CON LAS FUNCIONES NECESARIAS PARA LAS CONSULTAS
    public static class Consultas
    {
        private static string address = "https://guinyoteonline-hkio.onrender.com";

        //EVENTO PARA OBTENER EL HISTORIAL
        public static event Action<Partida[]> OnHistorialConsultado;

        //Obtiene el historial del usuario con correo "id"
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

        //FUNCIONES PARA LA VISUALIZACIÓN DE LOS OBJETOS OBTENIDOS EN DEBUG.LOG
        public static void MostrarCamposArray<T>(T[] array)
        {
            foreach (var obj in array)
            {
                MostrarCamposObjeto(obj);
            }
        }

        public static void MostrarCamposObjeto(object obj)
        {
            Type tipo = obj.GetType();

            FieldInfo[] campos = tipo.GetFields(BindingFlags.Public | BindingFlags.Instance);

            // Iterar sobre los campos y mostrar sus nombres y valores
            foreach (var campo in campos)
            {
                var valor = campo.GetValue(obj);

                // Si el valor es un array, recorrer los elementos
                if (valor is Array arrayValor)
                {
                    Debug.Log($"{campo.Name} (Array):");
                    foreach (var elemento in arrayValor)
                    {
                        MostrarCamposObjeto(elemento);
                    }
                }
                // Si el valor es un objeto, llamar recursivamente para mostrar sus campos
                else if (valor != null && !valor.GetType().IsPrimitive && !(valor is string))
                {
                    Debug.Log($"{campo.Name} (Objeto):");
                    MostrarCamposObjeto(valor);
                }
                else
                {
                    // Si no es un array ni un objeto, mostrar el valor
                    Debug.Log($"{campo.Name}: {valor}");
                }
            }
        }
    } 
}
