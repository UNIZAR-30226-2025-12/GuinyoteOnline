import React, { useEffect } from 'react';
import { useState } from 'react';
import { useUser } from '../../context/UserContext';
import useFetch from '../../customHooks/useFetch';
import '/src/styles/HistorialPartidasModal.css'

function HistorialPartidasModal({ myProfile, profileId }) {
  const { mail } = useUser(); // mail del usuario actual
  const correoAUsar = myProfile ? mail : profileId;
  const encodedMail = encodeURIComponent(correoAUsar);

  const { data, loading, error, fetchData } = useFetch(`https://guinyoteonline-hkio.onrender.com/partidas/historial/${encodedMail}`);
  const avatarUrl = "/src/assets/avatares/";

  const [stats,setStats] = useState({ victorias: 0, derrotas: 0 });

  useEffect(() => {
    if (!data) fetchData();
  }, []);

  useEffect(() => {
    if (!data || !setStats) return;

    let victorias = 0;
    let derrotas = 0;

    data.forEach(partida => {
      const resultado = determinarResultado(partida.jugadores);
      if (resultado === 'VICTORIA') victorias++;
      else derrotas++;
    });

    setStats({ victorias, derrotas });
    console.log(stats);
  }, [data, setStats]);

  if (loading) return <p>Cargando historial...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data) return null;

  const determinarResultado = (jugadores) => {
    const equipo1 = jugadores.filter(j => j.equipo === 1).reduce((acc, j) => acc + j.puntuacion, 0);
    const equipo2 = jugadores.filter(j => j.equipo === 2).reduce((acc, j) => acc + j.puntuacion, 0);
    const usuario = jugadores.find(j => j.idUsuario === correoAUsar);
    const equipoUsuario = usuario?.equipo;
    const gano = (equipoUsuario === 1 && equipo1 > equipo2) || (equipoUsuario === 2 && equipo2 > equipo1);
    return gano ? 'VICTORIA' : 'DERROTA';
  };

  return (
    <div className="historial-partidas-modal">
      <h3>Historial de Partidas</h3>

      <div className="estadisticas-header">
        <span>Victorias: {stats.victorias}</span>
        <span>Derrotas: {stats.derrotas}</span>
      </div>

      <div className="partidas-list">
        {data.length === 0 ? (
          <p>No has jugado ninguna partida aún.</p>
        ) : (
          data.map((partida, index) => {
            const resultado = determinarResultado(partida.jugadores);
            return (
              <div
                key={index}
                className={`partida-card ${resultado === 'VICTORIA' ? 'ganada' : 'perdida'}`}
              >
                {/* Equipo 1 */}
                <div className="equipo equipo-1">
                  {partida.jugadores
                    .filter(j => j.equipo === 1)
                    .map((jugador, idx) => (
                      <div key={idx} className="jugador">
                        <div className="jugador-info">
                          <span className="jugador-nombre">{jugador.nombre}</span>
                          <img
                            src={avatarUrl + jugador.foto_perfil}
                            alt={`Foto de ${jugador.nombre}`}
                            className="foto-perfil"
                          />
                          <span className="jugador-puntos">Puntos: {jugador.puntuacion}</span>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Resultado */}
                <div className="resultado">
                  <span>{resultado}</span>
                </div>

                {/* Equipo 2 */}
                <div className="equipo equipo-2">
                  {partida.jugadores
                    .filter(j => j.equipo === 2)
                    .map((jugador, idx) => (
                      <div key={idx} className="jugador">
                        <div className="jugador-info">
                          <span className="jugador-nombre">{jugador.nombre}</span>
                          <img
                            src={avatarUrl + jugador.foto_perfil}
                            alt={`Foto de ${jugador.nombre}`}
                            className="foto-perfil"
                          />
                          <span className="jugador-puntos">Puntos: {jugador.puntuacion}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default HistorialPartidasModal;
