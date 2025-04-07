const express = require("express");
const cors = require("cors");
const http = require('http');
const socketIo = require('socket.io');
const { iniciarPartida, procesarJugada, guardarEstadoPartida } = require('./gameManager');
const { connectDB } = require('../Bd/db');
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importar modelos
const Usuario = require("../Bd/models/Usuario");
const Partida = require("../Bd/models/Partida");
const salasRoutes = require("./routes/salas");

// Estado en memoria
const partidasActivas = new Map();
const salasEspera = new Map();
const timeoutsReconexion = new Map();

// Puerto para Render
const PORT = process.env.PORT || 10000;

// Conectar a MongoDB y arrancar servidor
connectDB()
  .then(() => {
    console.log('Base de datos conectada correctamente');
    server.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error al iniciar la aplicación:', err);
    process.exit(1);
  });

// Middleware de error
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Error en el servidor" });
});

// Rutas básicas
app.get("/", (req, res) => {
  res.json({ message: "API de Guiñote funcionando" });
});

// Rutas de Usuario
app.get("/usuarios", async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo usuarios", error: error.message });
  }
});

// Autenticación y perfil
app.post("/usuarios/registro", async (req, res) => {
  try {
    const { nombre, correo, contrasena } = req.body;
    const usuario = new Usuario({ nombre, correo, contrasena, foto_perfil: "default.png" });
    await usuario.save();
    res.status(201).json(usuario);
  } catch (error) {
    res.status(400).json({ message: "Error en el registro", error: error.message });
  }
});

app.post("/usuarios/inicioSesion", async (req, res) => {
  try {
    const { correo, contrasena } = req.body;
    const resultado = await Usuario.find({correo: correo, contrasena: contrasena}, { nombre: 1, correo: 1 });
    if (resultado.length > 0) {
      res.status(202).json(resultado);
    }
    else {
      res.status(401).json({ message: "Correo o contraseña incorrectos"});
    }
  } catch (error) {
    res.status(401).json({ message: "Error en el inicio de sesión", error: error.message });
  }
})

app.put("/usuarios/actualizacionPerfil/:id", async (req, res) => {
  try {
    const { nombre, foto_perfil } = req.body;
    const usuario = await Usuario.findOneAndUpdate(
      { correo: req.params.id },
      { $set: { nombre: nombre, foto_perfil: foto_perfil }}
    );
    res.json(usuario);
  } catch (error) {
    res.status(400).json({ message: "Error actualizando perfil", error: error.message });
  }
});

app.get("/usuarios/perfil/:id", async (req, res) => {
  try {
    const usuario = await Usuario.find({correo: req.params.id}, {amigos: 0});
    res.json(usuario);
  } catch (error) {
    res.status(400).json({ message: "Error obteniendo el perfil", error: error.message});
  }
});

// Rutas de Ranking
app.get("/rankings", async (req, res) => {
  try {
    const rankings = await Usuario.find({}, {foto_perfil: 1, nombre: 1, nVictorias: 1}).sort({ nVictorias: -1 }).limit(100);
    res.json(rankings);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo rankings", error: error.message });
  }
});

// Rutas de Amigos
app.post("/amigos/enviarSolicitud", async (req, res) => {
  try {
    const { idUsuario, idAmigo } = req.body;
    await Usuario.findOneAndUpdate(
      { correo: idUsuario },
      { $push: { amigos: {idUsuario: idAmigo, pendiente: true} } }
    );
    
    res.status(201).json({ message: "Solicitud enviada con éxito"});
  } catch (error) {
    res.status(400).json({ message: "Error enviando solicitud", error: error.message });
  }
});

app.post("/amigos/aceptarSolicitud", async (req, res) => {
  try {
    const { idUsuario, idSolicitante } = req.body;
    await Usuario.findOneAndUpdate(
      { correo: idSolicitante, "amigos.idUsuario": idUsuario },
      { $set: { "amigos.$.pendiente": false} }
    );

    await Usuario.findOneAndUpdate(
      { correo: idUsuario },
      { $push: { amigos: {idUsuario: idSolicitante, pendiente: false} } }
    )
    
    res.status(202).json({ message: "Solicitud aceptada con éxito"});
  } catch (error) {
    res.status(400).json({ message: "Error enviando solicitud", error: error.message });
  }
});

app.post("/amigos/rechazarSolicitud", async (req, res) => {
  try {
    const { idUsuario, idSolicitante } = req.body;
    await Usuario.findOneAndUpdate(
      { correo: idSolicitante },
      { $pull: { amigos: {idUsuario: idUsuario, pendiente: true} } }
    );
    
    res.status(203).json({ message: "Solicitud rechazada con éxito"});
  } catch (error) {
    res.status(400).json({ message: "Error enviando solicitud", error: error.message });
  }
});

/*app.get("/amigos/:userId", async (req, res) => {
  try {
    const amigos = await Usuario.find({ correo: req.params.userId }, { correo: 1, amigos: 1 });
    res.json(amigos);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo amigos", error: error.message });
  }
});*/

app.get("/amigos/:userId", async (req, res) => {
  try {
    const usuario = await Usuario.find(
      { correo: req.params.userId },
      { amigos: 1 } // Filtrar solo amigos con pendiente: false
    );

    if (usuario) {
      const amigos = usuario[0].amigos.filter(amigo => amigo.pendiente === false);
      res.json(amigos);
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo amigos", error: error.message });
  }
});

app.get("/solicitudes/:userId", async (req, res) => {
  try {
    const usuario = await Usuario.findOne(
      { correo: req.params.userId },
      { amigos: 1 }
    );

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const solicitudesPendientes = usuario.amigos.filter(amigo => amigo.pendiente === true);

    // Suponiendo que 'correo' es el identificador del amigo
    const correosSolicitantes = solicitudesPendientes.map(amigo => amigo.idUsuario);

    // Buscar todos los usuarios relacionados con esas solicitudes
    const usuariosSolicitantes = await Usuario.find(
      { correo: { $in: correosSolicitantes } },
      { nombre: 1, correo: 1, foto_perfil: 1 } // Selecciona los campos que necesitas
    );

    res.json(usuariosSolicitantes);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo solicitudes", error: error.message });
  }
});


// Rutas de Partida y Sala
app.post("/salas/crear", async (req, res) => {
  try {
    const { idCreador, tipo, codigoAcceso } = req.body;
    const sala = {
      id: Date.now().toString(),
      idCreador,
      tipo,
      codigoAcceso,
      jugadores: [idCreador],
      estado: 'esperando'
    };
    salasEspera.set(sala.id, sala);
    res.status(201).json(sala);
  } catch (error) {
    res.status(400).json({ message: "Error creando sala", error: error.message });
  }
});

app.get("/partidas/historial/:userId", async (req, res) => {
  try {
    
    const partidas = await Partida.aggregate([
      {
        $match: { "jugadores.idUsuario": req.params.userId } // Filtrar partidas donde el jugador tiene el idUsuario que buscamos
      },
      {
        $unwind: "$jugadores" // Deshacer el array 'jugadores' para trabajar con cada jugador individualmente
      },
      {
        $lookup: {
          from: "usuarios", // Nombre de la colección de Usuarios
          localField: "jugadores.idUsuario", // Campo en 'Partida' que corresponde al idUsuario del jugador
          foreignField: "correo", // Campo en 'Usuarios' que corresponde al correo (que es el idUsuario)
          as: "usuario_info" // Resultado del lookup se almacenará en 'usuario_info'
        }
      },
      {
        $unwind: "$usuario_info" // Deshacer el array 'usuario_info' para que solo quede un objeto con la información
      },
      {
        $project: {
          "idPartida": 1,
          "fecha_inicio": 1,
          "estado": 1,
          "jugadores.nombre": "$usuario_info.nombre", // Agregar nombre desde 'usuario_info'
          "jugadores.idUsuario": 1, // Mantener el idUsuario
          "jugadores.equipo": 1, // Mantener el equipo
          "jugadores.puntuacion": 1 // Mantener la puntuación
        }
      },
      {
        $group: {
          _id: "$_id",
          idPartida: {$first: "$idPartida" },
          fecha_inicio: { $first: "$fecha_inicio" },
          estado: { $first: "$estado" },
          jugadores: { $push: { nombre: "$jugadores.nombre", idUsuario: "$jugadores.idUsuario", equipo: "$jugadores.equipo", puntuacion: "$jugadores.puntuacion" } }
        }
      },
      {
        $sort: { fecha_inicio: -1 } // Ordenar por fecha_inicio de forma descendente
      }
    ]);

    res.json(partidas);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo historial", error: error.message });
  }
});

// Rutas de Salas
app.use("/salas", salasRoutes);

// Configuración de Socket.IO para tiempo real
io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);
  let userId = null;

  // Asociar usuario con socket
  socket.on('identificar', (data) => {
    userId = data.userId;
    socket.userId = userId;
    
    // Reconectar a partida si existe
    const partidaActiva = Array.from(partidasActivas.values())
      .find(p => p.jugadores.includes(userId));
    
    if (partidaActiva) {
      socket.join(partidaActiva.id);
      clearTimeout(timeoutsReconexion.get(userId));
      timeoutsReconexion.delete(userId);
      io.to(partidaActiva.id).emit('jugadorReconectado', { jugadorId: userId });
    }
  });

  // Unirse a una sala
  socket.on('unirSala', async ({ salaId, userId, codigoAcceso }) => {
    const sala = salasEspera.get(salaId);
    if (sala && sala.codigoAcceso === codigoAcceso && !sala.jugadores.includes(userId)) {
      sala.jugadores.push(userId);
      socket.join(salaId);
      io.to(salaId).emit('actualizacionSala', sala);

      // Si la sala está llena, iniciar partida
      if (sala.jugadores.length === (sala.tipo === '1v1' ? 2 : 4)) {
        const nuevaPartida = await iniciarPartida(sala);
        partidasActivas.set(nuevaPartida.id, nuevaPartida);
        io.to(salaId).emit('inicioPartida', nuevaPartida);
        salasEspera.delete(salaId);
      }
    }
  });

  // Manejar jugadas
  socket.on('realizarJugada', ({ partidaId, jugada }) => {
    const partida = partidasActivas.get(partidaId);
    if (partida && partida.turnoActual === socket.userId) {
      const estadoActualizado = procesarJugada(partida, { ...jugada, jugadorId: socket.userId });
      partidasActivas.set(partidaId, estadoActualizado);
      io.to(partidaId).emit('actualizacionPartida', estadoActualizado);
    }
  });

  // Pausar partida
  socket.on('pausarPartida', async ({ partidaId }) => {
    const partida = partidasActivas.get(partidaId);
    if (partida && partida.jugadores.includes(socket.userId)) {
      partida.estado = 'pausada';
      await guardarEstadoPartida(partida);
      io.to(partidaId).emit('partidaPausada', partida);
    }
  });

  // Desconexión
  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.id);
    
    if (socket.userId) {
      const partidaActiva = Array.from(partidasActivas.values())
        .find(p => p.jugadores.includes(socket.userId));
      
      if (partidaActiva) {
        // Iniciar timeout de reconexión
        timeoutsReconexion.set(socket.userId, setTimeout(async () => {
          partidaActiva.estado = 'abandonada';
          await guardarEstadoPartida(partidaActiva);
          io.to(partidaActiva.id).emit('partidaAbandonada', {
            partidaId: partidaActiva.id,
            jugadorDesconectado: socket.userId
          });
          partidasActivas.delete(partidaActiva.id);
        }, 30000)); // 30 segundos de timeout
      }
    }
  });
});
