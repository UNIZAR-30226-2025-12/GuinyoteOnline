const mongoose = require('mongoose');

const JugadorPartidaSchema = new mongoose.Schema({
    idUsuario: { type: String, required: true, ref: 'Usuario' },
    idPartida: { type: String, required: true, ref: 'Partida' },
    equipo: { type: Number, required: true },
    puntuacion: { type: Number, default: 0 },
    estado_conexion: { type: Boolean, default: true },
    timestamp_ult_act: { type: Number, required: true }
});

module.exports = mongoose.model('JugadorPartida', JugadorPartidaSchema);
