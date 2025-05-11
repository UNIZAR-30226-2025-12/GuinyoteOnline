const express = require("express");
const { createLobby, joinLobby, joinPrivateLobby, autoJoinOrCreate, findAvailableCode, lobbies } = require('../lobbies');
import crypto from 'crypto';

const router = express.Router();

/*
 * Busca una sala pública libre para unirse. Si no
 * hay ninguna, crea una sala pública y se une a ella.
 */
router.post("/matchmake", async (req, res) => {
  try {
    const { playerId, maxPlayers } = req.body;
    const lobby = autoJoinOrCreate(playerId, maxPlayers);
    res.json(lobby);
  } catch (error) {
    res.status(400).json({ message: "Error uniendose a la sala", error: error.message });
  }
});

/**
 * Crea una sala privada con un código de invitación.
 */
router.post("/crearPrivada", async (req, res) => {
  const { idCreador, maxPlayers } = req.body ;
  try {
    // Generar código único de 20 dígitos
    const codigoAcceso = crypto.randomBytes(10).toString('hex').toUpperCase();
    let sala = createLobby(maxPlayers, idCreador, 'privada', codigoAcceso);
    res.status(201).json(sala);
  } catch (error) {
    res.status(400).json({ message: "Error creando sala", error: error.message });
  }
});

/**
 * Unirse a una sala privada mediante un código de invitación.
 */
router.post("/unirsePrivada", (req, res) => {
    const { codigoAcceso, idUsuario, maxPlayers } = req.body;
    try {
      let sala = findAvailableCode((maxPlayers === '1v1') ? 2 : 4, codigoAcceso);
      joinPrivateLobby(sala.id, idUsuario, codigoAcceso);
      res.status(200).json(sala);
    } catch (error) {
      res.status(400).json({ message: "Error uniendose a la sala", error: error.message });
    }
});

module.exports = router;
