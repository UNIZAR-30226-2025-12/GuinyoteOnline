const mongoose = require('mongoose');

const AmigoSchema = new mongoose.Schema({
    idUsuario: { type: String, required: true },
    pendiente: { type: Boolean, required: true }
})

const UsuarioSchema = new mongoose.Schema({
    correo: { type: String, required: true, unique: true },
    nombre: { type: String, required: true },
    contrasena: { type: String, required: true },
    foto_perfil: { type: String, default: 'default.png' },
    nVictorias: { type: Number, default: 0 },
    tapete: { type: String, default: 'default.png' },
    imagen_carta : { type: String, default: 'default.png' },
    amigos: [AmigoSchema]
});

module.exports = mongoose.model('Usuario', UsuarioSchema);
