const mongoose = require('mongoose');

const PartidaSchema = new mongoose.Schema({
    idPartida: { type: String, required: true, unique: true },
    fecha_inicio: { type: Date, required: true },
    fecha_fin: { type: Date },
    estado: { type: String, required: true },
    idLider: { type: String, required: true, ref: 'Usuario' }
});

module.exports = mongoose.model('Partida', PartidaSchema);
