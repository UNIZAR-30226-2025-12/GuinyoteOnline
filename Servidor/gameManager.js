const { 
    crearBaraja, 
    mezclarBaraja, 
    repartirCartas,
    validarJugada,
    calcularGanadorBaza,
    calcularPuntosBaza,
    verificarCante
} = require('./gameLogic');

const Partida = require('../Bd/models/Partida');

async function iniciarPartida(sala) {
    const baraja = mezclarBaraja(crearBaraja());
    const { manos, triunfo, mazo } = repartirCartas(baraja, sala.jugadores.length);
    
    const partida = {
        id: `${sala.id}-partida`,
        jugadores: sala.jugadores,
        tipo: sala.tipo,
        estado: 'en_curso',
        turnoActual: sala.jugadores[0],
        ronda: 1,
        manos,
        triunfo,
        mazo,
        mesa: [],
        puntos: sala.jugadores.map(j => ({ jugador: j, puntos: 0 })),
        ultimaActividad: Date.now(),
        cantes: [],
        bazas: []
    };

    // Guardar en BD
    const nuevaPartida = new Partida({
        idPartida: partida.id,
        tipo: partida.tipo,
        jugadores: partida.jugadores,
        estado: partida.estado,
        fecha: new Date()
    });
    await nuevaPartida.save();

    return partida;
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
    iniciarPartida,
    procesarJugada,
    guardarEstadoPartida
}; 