const mongoose = require('mongoose');

const AmigosSchema = new mongoose.Schema({
    idUsuario1: { type: String, required: true, ref: 'Usuario' },
    idUsuario2: { type: String, required: true, ref: 'Usuario' }
});

module.exports = mongoose.model('Amigos', AmigosSchema);
