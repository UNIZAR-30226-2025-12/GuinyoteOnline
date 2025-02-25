const mongoose = require('mongoose');

const RankingSchema = new mongoose.Schema({
    idUsuario: { type: String, required: true, ref: 'Usuario' },
    nVictorias: { type: Number, default: 0 }
});

module.exports = mongoose.model('Ranking', RankingSchema);
