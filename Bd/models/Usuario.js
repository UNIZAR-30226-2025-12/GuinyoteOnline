const mongoose = require('mongoose');

const AmigoSchema = new mongoose.Schema({
    idUsuario: { type: String, required: true },
    pendiente: { type: Boolean, required: true }
})

const UsuarioSchema = new mongoose.Schema({
    correo: { type: String, required: true, unique: true },
    nombre: { type: String, required: true },
    contrasena: { type: String, required: true },
    foto_perfil: { type: String },
    nVictorias: { type: Number, default: 0 },
    amigos: [AmigoSchema]
});

module.exports = mongoose.model('Usuario', UsuarioSchema);
