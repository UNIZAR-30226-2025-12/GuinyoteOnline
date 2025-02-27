const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
    idUsuario: { type: String, required: true, unique: true },
    nombre: { type: String, required: true },
    correo: { type: String, required: true, unique: true },
    contrasena: { type: String, required: true },
    foto_perfil: { type: String }
});

module.exports = mongoose.model('Usuario', UsuarioSchema);
