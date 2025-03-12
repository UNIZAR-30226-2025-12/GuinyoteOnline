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
const Ranking = require("../Bd/models/Ranking");
const Amigos = require("../Bd/models/Amigos");
const JugadorPartida = require("../Bd/models/JugadorPartida");
const Partida = require("../Bd/models/Partida");

// Estado en memoria
const partidasActivas = new Map();
const salasEspera = new Map();
const timeoutsReconexion = new Map();

// Puerto para Render
const PORT = process.env.PORT || 3000;

// Conectar a MongoDB y arrancar servidor
connectDB()
  .then(() => {
    console.log('Base de datos conectada correctamente');
    server.listen(PORT, "0.0.0.0", () => {
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
    const usuario = new Usuario({ nombre, correo, contrasena });
    await usuario.save();
    res.status(201).json(usuario);
  } catch (error) {
    res.status(400).json({ message: "Error en el registro", error: error.message });
  }
});

app.put("/usuarios/:id/perfil", async (req, res) => {
  try {
    const { nombre, foto_perfil } = req.body;
    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      { nombre, foto_perfil },
      { new: true }
    );
    res.json(usuario);
  } catch (error) {
    res.status(400).json({ message: "Error actualizando perfil", error: error.message });
  }
});

// Rutas de Ranking
app.get("/rankings", async (req, res) => {
  try {
    const rankings = await Ranking.find().sort({ victorias: -1 }).limit(100);
    res.json(rankings);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo rankings", error: error.message });
  }
});

// Rutas de Amigos
app.post("/amigos/solicitud", async (req, res) => {
  try {
    const { idUsuario, idAmigo } = req.body;
    const amistad = new Amigos({ idUsuario, idAmigo, estado: 'pendiente' });
    await amistad.save();
    res.status(201).json(amistad);
  } catch (error) {
    res.status(400).json({ message: "Error enviando solicitud", error: error.message });
  }
});

app.get("/amigos/:userId", async (req, res) => {
  try {
    const amigos = await Amigos.find({ 
      $or: [
        { idUsuario: req.params.userId },
        { idAmigo: req.params.userId }
      ],
      estado: 'aceptado'
    });
    res.json(amigos);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo amigos", error: error.message });
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
    const partidas = await Partida.find({
      jugadores: req.params.userId
    }).sort({ fecha: -1 });
    res.json(partidas);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo historial", error: error.message });
  }
});

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
