const mongoose = require('mongoose');

const JugadorSchema = new mongoose.Schema({
    idUsuario: { type: String, required: true },
    equipo: { type: Number, required: true },
    puntuacion: { type: Number, default: 0 },
    estado_conexion: { type: Boolean, default: true },
    timestamp_ult_act: { type: Number, required: true }
})

const PartidaSchema = new mongoose.Schema({
    idPartida: { type: String, required: true, unique: true },
    fecha_inicio: { type: Date, required: true },
    estado: { type: String, required: true },
    jugadores: [JugadorSchema]
});

module.exports = mongoose.model('Partida', PartidaSchema);
