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
const { findLobby } = require('./lobbies');

async function esperarMensajesDeTodos(io, sala, eventoEsperado, timeout) {
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
      }, timeout);
    });
  }

async function iniciarPartida(sala) {
    console.log(`emitiendo iniciar partida a ${sala.id}`);
    io.to(sala.id).emit("iniciarPartida", 'iniciarPartida');
    
    const baraja = mezclarBaraja(crearBaraja());
    let barajaString = barajaToString(baraja);
    console.log("esperando confirmaciones");
    esperarMensajesDeTodos(io, sala, "ack", 15000)
    .then((respuestas) => {
        console.log('Todos respondieron:', respuestas);
        console.log(`emitiendo baraja a ${sala.id}`);
        io.to(sala.id).emit("baraja", barajaString);
    })
    .catch((err) => {
        console.error('Error esperando respuestas:', err);
    });

    let indexJugadores = []
    esperarMensajesDeTodos(io, sala, "ack", 15000)
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
    try {
        await nuevaPartida.save();
    }
    catch (error) {
        console.error('Error al guardar la partida:', error);
    }
}

async function iniciarSegundaRonda(lobby) {
    io.to(lobby).emit("finRonda");
    esperarMensajesDeTodos(io, sala, "ack", 15000)
    .then(async (respuestas) => {
        console.log('Todos respondieron', respuestas);
        const baraja = mezclarBaraja(crearBaraja());
        let barajaString = barajaToString(baraja);
        console.log(`emitiendo baraja a ${lobby}`);
        io.to(lobby).emit("barajaSegundaRonda", barajaString);
    })
    .catch((err) => {
        console.error('Error esperando respuestas:', err);
    });
}

async function guardarEstadoPartida(lobby, puntos0, puntos1, puntos2, puntos3) {
    try {
        sala = findLobby(lobby);
        console.log(lobby);
        console.log(sala);
        const partida = await Partida.findOne({ idPartida: lobby });

        if (!partida) {
            throw new Error('Partida no encontrada');
        }
        
        console.log(partida);
        let puntos = [puntos0, puntos1, puntos2, puntos3];
        let puntuacionesPorUsuario = {};

        sala.jugadores.forEach(j => {
            console.log(`puntuacion de ${j.correo} -> ${puntos[j.index]}`)
            puntuacionesPorUsuario[j.correo] = puntos[j.index];
        });

        console.log(puntuacionesPorUsuario);

        // Recorremos los jugadores y actualizamos su puntuación si están en el objeto recibido
        partida.jugadores.forEach(jugador => {
            if (puntuacionesPorUsuario.hasOwnProperty(jugador.idUsuario)) {
                jugador.puntuacion = puntuacionesPorUsuario[jugador.idUsuario];
            }
        });
        partida.estado = "terminada";

        console.log(partida);

        partida.save()
        .then(doc => {
            console.log('Guardado OK:', doc);
        })
        .catch(err => {
            console.error('Error al guardar:', err);
        });
    } catch (error) {
        console.error('Error guardando estado de partida:', error);
    }
}

async function enviarJugada(io, sala, idJugador, timeout, carta, cantar, cambiarSiete) {
    const socketsEnSala = await io.in(sala).fetchSockets();
    const socketIds = socketsEnSala.map(s => s.id);
  
    const acks = new Set();

    let pending = new Set(socketIds);
    pending.delete(idJugador);
    console.log(socketIds);
    console.log(pending);

    const sendToSockets = (targetSocketIds) => {
        targetSocketIds.forEach(id => {
            io.to(id).emit('jugada', carta, cantar, cambiarSiete);
        });
    };

    sendToSockets(Array.from(pending));

    socketsEnSala.forEach(socket => {
        const ackHandler = () => {
            if (pending.has(socket.id)) {
                console.log(`ack de ${socket.id} recibido`);
                acks.add(socket.id);
                pending.delete(socket.id);
                if (pending.size === 0) {
                    socketsEnSala.forEach(s => s.off('ack', ackHandler));
                    console.log('todos confirmados');
                    io.to(sala).emit('inputsConfirmados');
                }
            }
        };
        if (socket.id != idJugador) socket.on('ack', ackHandler);
    });

    const retry = () => {
        if (pending.size > 0) {
            sendToSockets(Array.from(pending));
            setTimeout(retry, timeout);
        }
    };

    setTimeout(retry, timeout);
    sendToSockets(Array.from(pending));
}

async function enviarInput(idJugador, sala, carta, cantar, cambiarSiete) {
    enviarJugada(io, sala, idJugador, 500, carta, cantar, cambiarSiete);
}

module.exports = {
    init,
    iniciarPartida,
    iniciarSegundaRonda,
    enviarInput,
    guardarEstadoPartida
}; 