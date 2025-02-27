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
        let usuarios = [];
        for (let i = 0; i < 100; i++) {
            usuarios.push({
                idUsuario: faker.string.uuid(),
                nombre: faker.person.fullName(),
                correo: faker.internet.email(),
                contrasena: faker.internet.password(),
                foto_perfil: faker.image.avatar()
            });
        }
        const usuariosCreados = await Usuario.insertMany(usuarios);
        const usuarioIds = usuariosCreados.map(u => u.idUsuario);

        console.log("Insertando Partidas...");
        let partidas = [];
        for (let i = 0; i < 50; i++) {
            partidas.push({
                idPartida: faker.string.uuid(),
                fecha_inicio: faker.date.past(),
                fecha_fin: faker.helpers.maybe(() => faker.date.recent(), { probability: 0.5 }),
                estado: faker.helpers.arrayElement(["en curso", "terminada"]),
                idLider: faker.helpers.arrayElement(usuarioIds)
            });
        }
        const partidasCreadas = await Partida.insertMany(partidas);
        const partidaIds = partidasCreadas.map(p => p.idPartida);

        console.log("Insertando Ranking...");
        let rankings = [];
        for (let i = 0; i < 200; i++) {
            rankings.push({
                idUsuario: faker.helpers.arrayElement(usuarioIds),
                nVictorias: faker.number.int({ min: 0, max: 50 })
            });
        }
        await Ranking.insertMany(rankings);

        console.log("Insertando Amigos...");
        let amigos = new Set();
        while (amigos.size < 200) {
            let usuario1 = faker.helpers.arrayElement(usuarioIds);
            let usuario2 = faker.helpers.arrayElement(usuarioIds);
            if (usuario1 !== usuario2) {
                amigos.add(JSON.stringify({ idUsuario1: usuario1, idUsuario2: usuario2 }));
            }
        }
        await Amigos.insertMany([...amigos].map(a => JSON.parse(a)));

        console.log("Insertando JugadorPartida...");
        let jugadoresPartida = [];
        for (let i = 0; i < 500; i++) {
            jugadoresPartida.push({
                idUsuario: faker.helpers.arrayElement(usuarioIds),
                idPartida: faker.helpers.arrayElement(partidaIds),
                equipo: faker.number.int({ min: 1, max: 2 }),
                puntuacion: faker.number.int({ min: 0, max: 500 }),
                estado_conexion: faker.datatype.boolean(),
                timestamp_ult_act: Date.now()
            });
        }
        await JugadorPartida.insertMany(jugadoresPartida);

        console.log("✅ Base de datos poblada con éxito.");
        mongoose.connection.close();
    } catch (error) {
        console.error("❌ Error al poblar la base de datos:", error);
        mongoose.connection.close();
    }
};

// Ejecutar el script
seedDB();