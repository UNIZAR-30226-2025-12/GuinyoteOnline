const express = require("express");
const { iniciarPartida } = require("../gameManager");

const router = express.Router();

// Estado en memoria para salas y partidas
const salasEspera = new Map();
const partidasActivas = new Map();

/**
 * Crea una sala privada con un código de invitación.
 */
router.post("/crearPrivada", (req, res) => {
    const { idCreador, tipo } = req.body;
    const codigoAcceso = Math.random().toString(36).substring(2, 8).toUpperCase();

    const sala = {
        id: Date.now().toString(),
        idCreador,
        tipo,
        codigoAcceso,
        jugadores: [idCreador],
        estado: "esperando"
    };

    salasEspera.set(sala.id, sala);
    res.status(201).json(sala);
});

/**
 * Unirse a una sala privada mediante un código de invitación.
 */
router.post("/unirsePrivada", (req, res) => {
    const { codigoAcceso, idUsuario } = req.body;

    const sala = Array.from(salasEspera.values()).find(s => s.codigoAcceso === codigoAcceso);

    if (!sala) {
        return res.status(404).json({ message: "Sala no encontrada" });
    }

    if (sala.jugadores.length >= (sala.tipo === "1v1" ? 2 : 4)) {
        return res.status(400).json({ message: "La sala ya está llena" });
    }

    if (!sala.jugadores.includes(idUsuario)) {
        sala.jugadores.push(idUsuario);
    }

    // Si la sala está llena, iniciar la partida
    if (sala.jugadores.length === (sala.tipo === "1v1" ? 2 : 4)) {
        const nuevaPartida = iniciarPartida(sala);
        partidasActivas.set(nuevaPartida.id, nuevaPartida);
        salasEspera.delete(sala.id);
        return res.status(200).json({ message: "Partida iniciada", partida: nuevaPartida });
    }

    res.status(200).json(sala);
});

/**
 * Buscar una sala pública y unirse automáticamente.
 */
router.post("/buscarPublica", (req, res) => {
    const { idUsuario } = req.body;

    let sala = Array.from(salasEspera.values()).find(s => s.tipo === "publica" && s.jugadores.length < 4);

    if (!sala) {
        // Crear una nueva sala pública si no hay disponibles
        sala = {
            id: Date.now().toString(),
            idCreador: idUsuario,
            tipo: "publica",
            codigoAcceso: null,
            jugadores: [idUsuario],
            estado: "esperando"
        };
        salasEspera.set(sala.id, sala);
    } else {
        if (!sala.jugadores.includes(idUsuario)) {
            sala.jugadores.push(idUsuario);
        }
    }

    // Si la sala está llena, iniciar la partida
    if (sala.jugadores.length === 4) {
        const nuevaPartida = iniciarPartida(sala);
        partidasActivas.set(nuevaPartida.id, nuevaPartida);
        salasEspera.delete(sala.id);
        return res.status(200).json({ message: "Partida iniciada", partida: nuevaPartida });
    }

    res.status(200).json(sala);
});

module.exports = router;
