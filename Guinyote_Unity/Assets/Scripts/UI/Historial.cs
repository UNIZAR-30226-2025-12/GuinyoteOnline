using UnityEngine;
using ConsultasBD;

namespace Historial
{
    public class Historial : MonoBehaviour
    {
        public Partida[] historial;
        void Start()
        {
            Consultas.OnHistorialConsultado += MostrarHistorial;
        }

        void Update()
        {
            if (Input.GetKeyDown(KeyCode.Space))
            {
                StartCoroutine(Consultas.GetHistorialUsuario("juan.gomez@gmail.com"));
            }
            
        }

        private void MostrarHistorial(Partida[] historial)
        {
            Consultas.MostrarCamposArray(historial);
        }
    }
}