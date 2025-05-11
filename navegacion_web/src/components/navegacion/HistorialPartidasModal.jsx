import React, { useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import useFetch from '../../customHooks/useFetch';
import '/src/styles/HistorialPartidasModal.css'

function HistorialPartidasModal() {
  const { mail } = useUser(); // Usuario actual
  const encodedMail = encodeURIComponent(mail);
  const { data, loading, error, fetchData } = useFetch(`https://guinyoteonline-hkio.onrender.com/partidas/historial/${encodedMail}`);

  useEffect(() => {
    fetchData(); // Solo una vez al montar
  }, []);

  if (loading) return <p>Cargando historial...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data) return null;

  const determinarResultado = (jugadores) => {
    const equipo1 = jugadores.filter(j => j.equipo === 1).reduce((acc, j) => acc + j.puntuacion, 0);
    const equipo2 = jugadores.filter(j => j.equipo === 2).reduce((acc, j) => acc + j.puntuacion, 0);
    const usuario = jugadores.find(j => j.idUsuario === mail);
    const equipoUsuario = usuario?.equipo;
    const gano = (equipoUsuario === 1 && equipo1 > equipo2) || (equipoUsuario === 2 && equipo2 > equipo1);
    return gano ? 'Ganó' : 'Perdió';
  };
  console.log("Datos del historial:", JSON.stringify(data, null, 2));
  return (
    <div className="historial-partidas-modal">
      <h3>Historial de Partidas</h3>
      <div className="partidas-list">
        {data.length === 0 ? (
          <p>No has jugado ninguna partida aún.</p>
        ) : (
          data.map((partida, index) => (
            <div key={index} className="partida-card">
              {/* Equipo 1 */}
              <div className="equipo equipo-1">
                {partida.jugadores.filter(j => j.equipo === 1).map((jugador, idx) => (
                  <div key={idx} className="jugador">
                    <img
                      src={jugador.foto_perfil}
                      alt={`Foto de ${jugador.nombre}`}
                      className="foto-perfil"
                    />
                    <div>
                      <span>{jugador.nombre}</span><br />
                      <span>Puntos: {jugador.puntuacion}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Resultado */}
              <div className="resultado">
                <span>{determinarResultado(partida.jugadores)}</span>
              </div>

              {/* Equipo 2 */}
              <div className="equipo equipo-2">
                {partida.jugadores.filter(j => j.equipo === 2).map((jugador, idx) => (
                  <div key={idx} className="jugador">
                    <img
                      src={jugador.fotoPerfil}
                      alt={`Foto de ${jugador.nombre}`}
                      className="foto-perfil"
                    />
                    <div>
                      <span>{jugador.nombre}</span><br />
                      <span>Puntos: {jugador.puntuacion}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default HistorialPartidasModal;
