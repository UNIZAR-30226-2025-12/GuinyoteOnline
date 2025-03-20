const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
    correo: { type: String, required: true, unique: true },
    nombre: { type: String, required: true },
    contrasena: { type: String, required: true },
    foto_perfil: { type: String },
    nVictorias: { type: Number, default: 0 },
    amigos: [{ type: String, ref: 'Usuario' }]
});

module.exports = mongoose.model('Usuario', UsuarioSchema);
