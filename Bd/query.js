const mongoose = require('mongoose');
require('dotenv').config();
const { faker } = require('@faker-js/faker');

const Usuario = require('./models/Usuario');
const Partida = require('./models/Partida');
const Ranking = require('./models/Ranking');
const Amigos = require('./models/Amigos');
const JugadorPartida = require('./models/JugadorPartida');

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB conectado para poblar datos..."))
    .catch(err => console.error("❌ Error al conectar:", err));

const seedDB = async () => {
    try {
        console.log("Borrando datos antiguos...");
        await Usuario.deleteMany({});
        await Partida.deleteMany({});
        await Ranking.deleteMany({});
        await Amigos.deleteMany({});
        await JugadorPartida.deleteMany({});

        console.log("Insertando Usuarios...");
        let usuarios = [];  // Creamos array vacío

        usuarios.push({
            idUsuario: "1",
            nombre: "Juan Gomez",
            correo: "juan.gomez@gmail.com",
            contrasena: "juan12345",
            foto_perfil: "",
            fechaNacimiento: "1990-05-15",
            direccion: "Calle Falsa 123, Ciudad, País"
        });
        
        usuarios.push({
            idUsuario: "2",
            nombre: "Maria Lopez",
            correo: "maria.lopez@hotmail.com",
            contrasena: "maria12345",
            foto_perfil: "",
            fechaNacimiento: "1985-03-22",
            direccion: "Avenida Principal 456, Ciudad, País"
        });
        
        usuarios.push({
            idUsuario: "3",
            nombre: "Pedro Martinez",
            correo: "pedro.martinez@yahoo.com",
            contrasena: "pedro12345",
            foto_perfil: "",
            fechaNacimiento: "1982-11-10",
            direccion: "Calle Luna 789, Ciudad, País"
        });
        
        usuarios.push({
            idUsuario: "4",
            nombre: "Laura Rodriguez",
            correo: "laura.rodriguez@outlook.com",
            contrasena: "laura12345",
            foto_perfil: "",
            fechaNacimiento: "1995-07-30",
            direccion: "Calle Sol 101, Ciudad, País"
        });

        const usuariosCreados = await Usuario.insertMany(usuarios);
        const usuarioIds = usuariosCreados.map(u => u.idUsuario);

        console.log("Insertando Partidas...");
        let partidas = [];

        // Partida 1
        partidas.push({
            idPartida: "1",
            fecha_inicio: new Date("2023-01-15T14:30:00"),  // Fecha de inicio: 15 de enero de 2023
            fecha_fin: new Date("2023-01-15T16:00:00"),    // Fecha de fin: 15 de enero de 2023
            estado: "terminada",
            idLider: usuarioIds[0]  // Lider: user1
        });

        // Partida 2
        partidas.push({
            idPartida: "2",
            fecha_inicio: new Date("2024-02-01T10:00:00"),  // Fecha de inicio: 1 de febrero de 2024
            fecha_fin: new Date("2024-02-01T12:00:00"),    // Fecha de fin: 1 de febrero de 2024
            estado: "terminada",
            idLider: usuarioIds[1]  // Lider: user2
        });

        // Partida 3
        partidas.push({
            idPartida: "3",
            fecha_inicio: new Date("2024-03-20T18:00:00"),  // Fecha de inicio: 20 de marzo de 2024
            fecha_fin: null,  // No tiene fecha de fin porque está en curso
            estado: "en curso",
            idLider: usuarioIds[2]  // Lider: user3
        });

        const partidasCreadas = await Partida.insertMany(partidas);
        const partidaIds = partidasCreadas.map(p => p.idPartida);

        console.log("Insertando Ranking...");
        let rankings = [];

        // Ranking 1
        rankings.push({
            idUsuario: usuarioIds[0],  // Usuario: user1
            nVictorias: 30  // Número de victorias: 30
        });

        // Ranking 2
        rankings.push({
            idUsuario: usuarioIds[1],  // Usuario: user2
            nVictorias: 12  // Número de victorias: 12
        });

        // Ranking 3
        rankings.push({
            idUsuario: usuarioIds[2],  // Usuario: user3
            nVictorias: 45  // Número de victorias: 45
        });

        // Ranking 4
        rankings.push({
            idUsuario: usuarioIds[3],  // Usuario: user4
            nVictorias: 5  // Número de victorias: 5
        });
        // Ordenar de mayor a menor los usuario

        await Ranking.insertMany(rankings);

        console.log("Insertando Amigos...");
        let amigos = new Set();

        // Relación de amistad entre los usuarios
        amigos.add(JSON.stringify({ idUsuario1: "1", idUsuario2: "2" }));
        amigos.add(JSON.stringify({ idUsuario1: "1", idUsuario2: "3" }));
        amigos.add(JSON.stringify({ idUsuario1: "1", idUsuario2: "4" }));
        amigos.add(JSON.stringify({ idUsuario1: "2", idUsuario2: "3" }));
        amigos.add(JSON.stringify({ idUsuario1: "2", idUsuario2: "4" }));
        // Consultar amigos de usuario 3: 1 y 2

        await Amigos.insertMany([...amigos].map(a => JSON.parse(a)));

        console.log("Insertando JugadorPartida...");
        let jugadoresPartida = [];

        // Jugador 1
        jugadoresPartida.push({
            idUsuario: "1",  // Usuario 1
            idPartida: partidaIds[2],  // Partida 1
            equipo: 1,  // Equipo 1
            puntuacion: 300,  // Puntuación
            estado_conexion: true,  // Conectado
            timestamp_ult_act: Date.now()  // Marca de tiempo actual
        });

        // Jugador 2
        jugadoresPartida.push({
            idUsuario: "2",  // Usuario 2
            idPartida: partidaIds[2],  // Partida 1
            equipo: 2,  // Equipo 2
            puntuacion: 150,  // Puntuación
            estado_conexion: false,  // Desconectado
            timestamp_ult_act: Date.now()  // Marca de tiempo actual
        });

        // Jugador 3
        jugadoresPartida.push({
            idUsuario: "3",  // Usuario 3
            idPartida: partidaIds[2],  // Partida 2
            equipo: 1,  // Equipo 1
            puntuacion: 400,  // Puntuación
            estado_conexion: true,  // Conectado
            timestamp_ult_act: Date.now()  // Marca de tiempo actual
        });

        // Jugador 4
        jugadoresPartida.push({
            idUsuario: "4",  // Usuario 4
            idPartida: partidaIds[2],  // Partida 2
            equipo: 2,  // Equipo 2
            puntuacion: 250,  // Puntuación
            estado_conexion: true,  // Conectado
            timestamp_ult_act: Date.now()  // Marca de tiempo actual
        });

        // Jugador 5
        jugadoresPartida.push({
            idUsuario: "1",  // Usuario 1
            idPartida: partidaIds[1],  // Partida 3
            equipo: 1,  // Equipo 1
            puntuacion: 500,  // Puntuación
            estado_conexion: true,  // Conectado
            timestamp_ult_act: Date.now()  // Marca de tiempo actual
        });

        // Jugador 6
        jugadoresPartida.push({
            idUsuario: "2",  // Usuario 2
            idPartida: partidaIds[1],  // Partida 4
            equipo: 2,  // Equipo 2
            puntuacion: 100,  // Puntuación
            estado_conexion: false,  // Desconectado
            timestamp_ult_act: Date.now()  // Marca de tiempo actual
        });

        await JugadorPartida.insertMany(jugadoresPartida);

        console.log("✅ Base de datos poblada con éxito.");
        mongoose.connection.close();
    } catch (error) {
        console.error("❌ Error al poblar la base de datos:", error);
        mongoose.connection.close();
    }
};

const getUsuarioById = async (idUsuario) => {
    try {
        const usuario = await Usuario.findOne({ idUsuario: idUsuario });  // Busca un usuario por idUsuario
        console.log(usuario);
    } catch (error) {
        console.error("Error al obtener el usuario:", error);
    }
};

const getJugadoresByPartida = async (idPartida) => {
    try {
        const jugadores = await JugadorPartida.find({ idPartida: idPartida });  // Busca jugadores por idPartida
        console.log(jugadores);
    } catch (error) {
        console.error("Error al obtener jugadores de la partida:", error);
    }
};

const getAmigosByUsuario = async (idUsuario) => {
    try {
        const amigos = await Amigos.find({
            $or: [
                { idUsuario1: idUsuario },  // Amigos de idUsuario1
                { idUsuario2: idUsuario }   // Amigos de idUsuario2
            ]
        });
        console.log(amigos);
    } catch (error) {
        console.error("Error al obtener amigos del usuario:", error);
    }
};

const getRankingOrdenado = async () => {
    try {
        const rankingOrdenado = await Ranking.find().sort({ nVictorias: -1 });  // Ordena por 'nVictorias' de mayor a menor
        console.log(rankingOrdenado);
    } catch (error) {
        console.error("Error al obtener el ranking ordenado:", error);
    }
};

// Ejecutar el script
seedDB();

getUsuarioById("1")

getJugadoresByPartida("3")

getJugadoresByPartida("2")

getJugadoresByPartida("1")

getAmigosByUsuario("3")

getRankingOrdenado()