const { 
    crearBaraja, 
    mezclarBaraja, 
    repartirCartas,
    validarJugada,
    calcularGanadorBaza,
    calcularPuntosBaza,
    verificarCante,
    barajaToString
} = require('./gameLogic');

function init(ioInstance) {
    io = ioInstance;
}
let io = null;
const Partida = require('../Bd/models/Partida');
const Usuario = require('../Bd/models/Usuario');

async function esperarMensajesDeTodos(io, sala, eventoEsperado) {
    const socketsEnSala = await io.in(sala.id).fetchSockets();
    const totalClientes = sala.jugadores.length
    console.log(`${totalClientes} jugadores`);
  
    return new Promise((resolve, reject) => {
      const respuestas = new Map(); // Guardamos las respuestas por socket.id
  
      const manejadores = [];
  
      socketsEnSala.forEach((socket) => {
        const handler = (data) => {
          if (!respuestas.has(socket.id)) {
            respuestas.set(socket.id, data);
          }
  
          // Si ya tenemos todas las respuestas
          if (respuestas.size === totalClientes) {
            // Quitamos todos los listeners
            manejadores.forEach(({ socket, evento, fn }) => {
              socket.off(evento, fn);
            });
  
            resolve(respuestas); // Resolvemos con todas las respuestas
          }
        };
  
        socket.on(eventoEsperado, handler);
        manejadores.push({ socket, evento: eventoEsperado, fn: handler });
      });
  
      // Timeout por seguridad
      setTimeout(() => {
        manejadores.forEach(({ socket, evento, fn }) => {
          socket.off(evento, fn);
        });
        reject(new Error("Timeout: no todos los clientes respondieron a tiempo"));
      }, 30000); // 30 segundos
    });
  }

async function iniciarPartida(sala) {
    console.log(`emitiendo iniciar partida a ${sala.id}`);
    io.to(sala.id).emit("iniciarPartida", 'iniciarPartida');
    
    const baraja = mezclarBaraja(crearBaraja());
    let barajaString = barajaToString(baraja);
    console.log("esperando confirmaciones");
    esperarMensajesDeTodos(io, sala, "ack")
    .then((respuestas) => {
        console.log('Todos respondieron:', respuestas);
        console.log(`emitiendo baraja a ${sala.id}`);
        io.to(sala.id).emit("baraja", barajaString);
    })
    .catch((err) => {
        console.error('Error esperando respuestas:', err);
    });

    let indexJugadores = []
    esperarMensajesDeTodos(io, sala, "ack")
    .then(async (respuestas) => {
        console.log('Todos respondieron', respuestas);
        const primero = Math.floor(Math.random() * sala.jugadores.length);
        const sockets = await io.in(sala.id).fetchSockets();
        console.log(`empieza el jugador ${primero}`);
        sockets.forEach((socket, index) => {
            const correoJugador = sala.jugadores[index];
            indexJugadores.push({
                correo: correoJugador,
                index: index
            });
            socket.emit("primero", primero, index);
        })
        sala.jugadores = indexJugadores; //PARA GESTIONAR ORDEN DE JUGADORES EN RECONEXIONES (NO SE SI ES NECESARIO)
    })
    .catch((err) => {
        console.error('Error esperando respuestas:', err);
    });

    const jugadoresPartida = sala.jugadores.map((nombre, index) => ({
        idUsuario: nombre,
        equipo: index % 2 === 0 ? 1 : 2,
        timestamp_ult_act: 0,
    }));
    sala.estado = 'en curso';
    // Guardar en BD
    const nuevaPartida = new Partida({
        idPartida: sala.id,
        jugadores: jugadoresPartida,
        estado: sala.estado,
        fecha_inicio: new Date()
    });
    await nuevaPartida.save();
}


function procesarJugada(partida, jugada) {
    const { carta, jugadorId, cante } = jugada;
    const indiceJugador = partida.jugadores.indexOf(jugadorId);

    // Validar turno y jugada
    if (partida.turnoActual !== jugadorId || 
        !validarJugada(carta, partida.manos[indiceJugador], partida.mesa, partida.triunfo, partida.mesa.length === 0)) {
        return partida;
    }

    // Procesar cante si existe
    if (cante) {
        const cantesValidos = verificarCante(partida.manos[indiceJugador], partida.triunfo);
        const canteValido = cantesValidos.find(c => c.palo === cante.palo);
        if (canteValido) {
            partida.cantes.push({ ...canteValido, jugador: jugadorId });
            partida.puntos[indiceJugador].puntos += canteValido.puntos;
        }
    }

    // Jugar carta
    partida.mesa.push(carta);
    partida.manos[indiceJugador] = partida.manos[indiceJugador]
        .filter(c => c.palo !== carta.palo || c.valor !== carta.valor);

    // Si todos han jugado, resolver baza
    if (partida.mesa.length === partida.jugadores.length) {
        const ganadorIndex = calcularGanadorBaza(partida.mesa, partida.triunfo);
        const puntosBaza = calcularPuntosBaza(partida.mesa);
        
        partida.puntos[ganadorIndex].puntos += puntosBaza;
        partida.bazas.push({
            cartas: [...partida.mesa],
            ganador: partida.jugadores[ganadorIndex],
            puntos: puntosBaza
        });
        
        // Repartir nuevas cartas si quedan en el mazo
        if (partida.mazo.length > 0) {
            for (let i = 0; i < partida.jugadores.length; i++) {
                if (partida.mazo.length > 0) {
                    partida.manos[i].push(partida.mazo.pop());
                }
            }
        }

        partida.mesa = [];
        partida.turnoActual = partida.jugadores[ganadorIndex];

        // Verificar fin de la partida
        if (partida.mazo.length === 0 && partida.manos[0].length === 0) {
            partida.estado = 'finalizada';
            guardarEstadoPartida(partida);
        }
    } else {
        // Siguiente turno
        const siguienteIndice = (indiceJugador + 1) % partida.jugadores.length;
        partida.turnoActual = partida.jugadores[siguienteIndice];
    }

    partida.ultimaActividad = Date.now();
    return partida;
}

async function guardarEstadoPartida(partida) {
    try {
        await Partida.findOneAndUpdate(
            { idPartida: partida.id },
            { 
                estado: partida.estado,
                puntuacion: partida.puntos
            }
        );

        // Si la partida está finalizada, actualizar estadísticas de jugadores
        if (partida.estado === 'finalizada') {
            for (const jugador of partida.jugadores) {
                await JugadorPartida.create({
                    idJugador: jugador,
                    idPartida: partida.id,
                    puntuacion: partida.puntos.find(p => p.jugador === jugador).puntos
                });
            }
        }
    } catch (error) {
        console.error('Error guardando estado de partida:', error);
    }
}

module.exports = {
    init,
    iniciarPartida,
    procesarJugada,
    guardarEstadoPartida
}; 