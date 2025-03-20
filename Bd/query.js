const mongoose = require('mongoose');
require('dotenv').config();
const { faker } = require('@faker-js/faker');

const Usuario = require('./models/Usuario');
const Partida = require('./models/Partida');

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB conectado para poblar datos..."))
    .catch(err => console.error("❌ Error al conectar:", err));

const seedDB = async () => {
    try {
        console.log("Borrando datos antiguos...");
        await Usuario.deleteMany({});
        await Partida.deleteMany({});

        console.log("Insertando Usuarios...");
        let usuarios = [];  // Creamos array vacío

        usuarios.push({
            nombre: "Juan Gomez",
            correo: "juan.gomez@gmail.com",
            contrasena: "juan12345",
            foto_perfil: "",
            fechaNacimiento: "1990-05-15",
            direccion: "Calle Falsa 123, Ciudad, País",
            nVictorias: 10
        });
        
        usuarios.push({
            nombre: "Maria Lopez",
            correo: "maria.lopez@hotmail.com",
            contrasena: "maria12345",
            foto_perfil: "",
            fechaNacimiento: "1985-03-22",
            direccion: "Avenida Principal 456, Ciudad, País",
            nVictorias: 5
        });
        
        usuarios.push({
            nombre: "Pedro Martinez",
            correo: "pedro.martinez@yahoo.com",
            contrasena: "pedro12345",
            foto_perfil: "",
            fechaNacimiento: "1982-11-10",
            direccion: "Calle Luna 789, Ciudad, País",
            nVictorias: 30
        });
        
        usuarios.push({
            nombre: "Laura Rodriguez",
            correo: "laura.rodriguez@outlook.com",
            contrasena: "laura12345",
            foto_perfil: "",
            fechaNacimiento: "1995-07-30",
            direccion: "Calle Sol 101, Ciudad, País",
            nVictorias: 20
        });

        const usuariosCreados = await Usuario.insertMany(usuarios);
        const usuarioIds = usuariosCreados.map(u => u.correo);

        console.log("Insertando Partidas...");
        let partidas = [];

        // Partida 1
        partidas.push({
            idPartida: "1",
            fecha_inicio: new Date("2023-01-15T14:30:00"),  // Fecha de inicio: 15 de enero de 2023
            estado: "terminada",
            jugadores: [{
                idUsuario: usuarioIds[0],
                equipo: 1,
                puntuacion: 60,
                timestamp_ult_act: 8
            },
            {
                idUsuario: usuarioIds[1],
                equipo: 1,
                puntuacion: 50,
                timestamp_ult_act: 10
            },
            {
                idUsuario: usuarioIds[2],
                equipo: 2,
                puntuacion: 65,
                timestamp_ult_act: 12
            },
            {
                idUsuario: usuarioIds[3],
                equipo: 2,
                puntuacion: 85,
                timestamp_ult_act: 9
            }]
        });

        // Partida 2
        partidas.push({
            idPartida: "2",
            fecha_inicio: new Date("2024-02-01T10:00:00"),  // Fecha de inicio: 1 de febrero de 2024
            estado: "terminada",
            jugadores: [{
                idUsuario: usuarioIds[0],
                equipo: 1,
                puntuacion: 105,
                timestamp_ult_act: 20
            },
            {
                idUsuario: usuarioIds[1],
                equipo: 2,
                puntuacion: 70,
                timestamp_ult_act: 19
            }]
        });

        // Partida 3
        partidas.push({
            idPartida: "3",
            fecha_inicio: new Date("2024-03-20T18:00:00"),  // Fecha de inicio: 20 de marzo de 2024
            estado: "en curso",
            jugadores: [{
                idUsuario: usuarioIds[2],
                equipo: 1,
                puntuacion: 100,
                timestamp_ult_act: 18
            },
            {
                idUsuario: usuarioIds[1],
                equipo: 2,
                puntuacion: 30,
                timestamp_ult_act: 17,
                estado_conexion: false
            }]
        });

        await Partida.insertMany(partidas);

        console.log("Insertando Amigos...");
        
        await Usuario.findOneAndUpdate(
            { correo: usuarioIds[0] },
            { $push: { amigos: usuarioIds[1] } },
          );
        await Usuario.findOneAndUpdate(
            { correo: usuarioIds[0] },
            { $push: { amigos: usuarioIds[2] } }
          );
        await Usuario.findOneAndUpdate(
            { correo: usuarioIds[0] },
            { $push: { amigos: usuarioIds[3] } }
          );

        await Usuario.findOneAndUpdate(
            { correo: usuarioIds[1] },
            { $push: { amigos: usuarioIds[2] } }
          );
        await Usuario.findOneAndUpdate(
            { correo: usuarioIds[1] },
            { $push: { amigos: usuarioIds[3] } }
          );


        console.log("✅ Base de datos poblada con éxito.");
        mongoose.connection.close();
    } catch (error) {
        console.error("❌ Error al poblar la base de datos:", error);
        mongoose.connection.close();
    }
};

const getUsuarioById = async (idUsuario) => {
    try {
        const usuario = await Usuario.findOne({ correo: idUsuario }, { _id: 0});  // Busca un usuario por idUsuario
        console.log(usuario);
    } catch (error) {
        console.error("Error al obtener el usuario:", error);
    }
};

const getJugadoresByPartida = async (idPartida) => {
    try {
        const jugadores = await Partida.find({ idPartida: idPartida }, {jugadores: 1, _id: 0});  // Busca jugadores por idPartida
        console.log(jugadores);
    } catch (error) {
        console.error("Error al obtener jugadores de la partida:", error);
    }
};

const getAmigosByUsuario = async (idUsuario) => {
    try {
        const amigos = await Usuario.find({ correo: idUsuario }, {amigos: 1, _id: 0})
        console.log(amigos);
    } catch (error) {
        console.error("Error al obtener amigos del usuario:", error);
    }
};

const getRankingOrdenado = async () => {
    try {
        const rankingOrdenado = await Usuario.find({}, {correo: 1, nVictorias: 1, _id: 0}).sort({ nVictorias: -1 });  // Ordena por 'nVictorias' de mayor a menor
        console.log(rankingOrdenado);
    } catch (error) {
        console.error("Error al obtener el ranking ordenado:", error);
    }
};

// Ejecutar el script
seedDB();

getUsuarioById("juan.gomez@gmail.com")

getJugadoresByPartida("3")

getJugadoresByPartida("2")

getJugadoresByPartida("1")

getAmigosByUsuario("maria.lopez@hotmail.com")

getRankingOrdenado()