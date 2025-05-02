const express = require("express");
const cors = require("cors");
const http = require('http');
const socketIo = require('socket.io');
const bcrypt = require('bcrypt');
const { iniciarPartida, procesarJugada, guardarEstadoPartida } = require('./gameManager');
const gameManager = require("./gameManager");
const { connectDB } = require('../Bd/db');
require("dotenv").config();

const saltRounds = 10; // Nivel de complejidad de las contraseñas

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
module.exports = { io };
gameManager.init(io);

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


// * DONE Documentación y prueba de funcionalidad actual
/**
 * GET /usuarios
 *
 * Descripción:
 * Esta ruta obtiene la lista completa de usuarios registrados en la base de datos.
 *
 * Parámetros de la solicitud:
 * - No requiere parámetros en la URL ni en la query.
 *
 * Respuesta:
 * - 200 OK: Devuelve un arreglo de objetos usuario en formato JSON.
 * - 500 Internal Server Error: Devuelve un objeto con un mensaje de error y el detalle del mismo.
 *
 * Ejemplo de respuesta exitosa:
 * [
 *   {
 *     "_id": "607d1b2f531123456789abcd",
 *     "nombre": "Juan Pérez",
 *     "correo": "juan@example.com",
 *     ...
 *   },
 *   ...
 * ]
 *
 */
app.get("/usuarios", async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo usuarios", error: error.message });
  }
});

// * DONE Documentación
// ! NOT DONE Falta probar el cifrado y prueba funcionalidad actual
/**
 * POST /usuarios/registro
 *
 * Descripción:
 * Esta ruta registra un nuevo usuario en la base de datos.
 *
 * Parámetros de la solicitud:
 * - @params {string} nombre - Nombre del nuevo usuario.
 * - @params {string} correo - Correo electrónico del nuevo usuario.
 * - @params {string} contrasena - Contraseña del nuevo usuario.
 *
 * Respuesta:
 * - 201 Created: Devuelve el contenido del nuevo usuario.
 * - 400 Bad Request: Devuelve un objeto con un mensaje de error y el detalle del mismo.
 *
 */
app.post("/usuarios/registro", async (req, res) => {
  try {
    const { nombre, correo, contrasena } = req.body;

    const hash = await bcrypt.hash(contrasena, saltRounds);

    const usuario = new Usuario({ nombre, correo, contrasena: hash, foto_perfil: "default.png", nVictorias: 0, amigos: [], tapete: "default.png", imagen_carta: "default.png" });
    await usuario.save();
    res.status(201).json(usuario);
  } catch (error) {
    res.status(400).json({ message: "Error en el registro", error: error.message });
  }
});

// * DONE Documentación y prueba de funcionalidad actual
// ! NOT DONE Falta probar el cifrado de la contraseña contraseña
/**
 * POST /usuarios/inicioSesion
 *
 * Descripción:
 * Esta ruta se encarga de validar el inicio de sesión de los usuarios.
 *
 * Parámetros de la solicitud:
 * - @params {string} correo - Correo electrónico del usuario.
 * - @params {string} contrasena - Contraseña del usuario.
 *
 * Respuesta:
 * - 202 Accepted: Devuelve el correo y el nombre del usuario
 * - 401 Unauthorized: Devuelve error, no se ha podido iniciar sesión.
 * - 404 Not found: Devuelve error, no se ha podido encontrar el usuario.
 * 
 * Ejemplo de respuesta exitosa:
 * [
 *   {
 *       "_id": "67f40268b679013fe7fa6548",
 *       "correo": "pruebaRegistro@gmail.com",
 *       "nombre": "pruebaRegistro"
 *   }
 * ]
 *
 */
app.post("/usuarios/inicioSesion", async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    // Buscar usuario por correo
    const usuario = await Usuario.findOne({ correo });

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Comparar contrasena ingresada con el hash almacenado
    const coinciden = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!coinciden) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Si todo está bien, responder con los datos públicos
    const { nombre, correo: correoUsuario, foto_perfil, tapete, imagen_carta } = usuario;
    res.status(202).json({ nombre, correo: correoUsuario, foto_perfil, tapete, imagen_carta });

  } catch (error) {
    res.status(500).json({ message: "Error en el inicio de sesión", error: error.message });
  }
});


// * DONE Documentación
// ! NOT DONE Faltan pruebas
/**
 * PUT /usuarios/perfil/cambiarUsername/:id
 *
 * Descripción:
 * Esta ruta se encarga de modificar el nombre de un usuario.
 *
 * Parámetros de la solicitud:
 * - @params {string} id - Correo electrónico del usuario.
 * - @params {string} nuevo_nombre - Nuevo nombre del usuario.
 *
 * Respuesta:
 * - 202 Accepted: Devuelve el correo y el nombre del usuario
 * - 404 Not found: Devuelve error, no se ha podido encontrar el usuario.
 * - 400 Bad Request: Devuelve error, no se ha podido cambiar el nombre del usuario.
 *
 */
app.put("/usuarios/perfil/cambiarUsername/:id", async (req, res) => {
  try {
    const { nombre } = req.body;
    const usuario = await Usuario.findOneAndUpdate(
      { correo: req.params.id },
      { nombre: nombre },
      { new: true }
    );

    if(!usuario) {
      res.status(404).json({ message: "Usuario no encontrado"});
    }

    res.json(usuario);
  } catch (error) {
    res.status(400).json({ message: "Error actualizando nombre de usuario", error: error.message });
  }
})

// * DONE Documentación
// ! NOT DONE Falta probar cifrado contraseña y el funcionamiento
/**
 * PUT /usuarios/perfil/cambiarContrasena/:id
 *
 * Descripción:
 * Esta ruta se encarga de modificar la contraseña de un usuario.
 *
 * Parámetros de la solicitud:
 * - @params {string} id - Correo electrónico del usuario.
 * - @params {string} contrasena_nueva - Contraseña nueva del usuario.
 * - @params {string} contrasena_antigua - Contraseña antigua del usuario.
 *
 * Respuesta:
 * - 202 Accepted: Devuelve el correo y el nombre del usuario
 * - 401 Unauthorized: Devuelve error, no se ha podido cambiar la contraseña
 * - 404 Not found: Devuelve error, no se ha podido encontrar el usuario.
 * - 400 Bad Request: Devuelve error, no se ha podido cambiar la contraseña.
 *
 */
app.put("/usuarios/perfil/cambiarContrasena/:id", async (req, res) => {
  try {
    const { contrasena_antigua, contrasena_nueva } = req.body;
    const correo = req.params.id;

    const usuario = await Usuario.findOne({ correo });

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const coincide = await bcrypt.compare(contrasena_antigua, usuario.contrasena);

    if (!coincide) {
      return res.status(401).json({ message: "Contraseña antigua incorrecta" });
    }

    const hash = await bcrypt.hash(contrasena_nueva, saltRounds);

    usuario.contrasena = hash;
    await usuario.save();

    res.status(200).json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    res.status(400).json({ message: "Error actualizando contraseña", error: error.message });
  }
});


// * DONE Documentación
// ! NOT DONE Faltan pruebas
/**
 * PUT /usuarios/perfil/cambiarFoto/:id
 *
 * Descripción:
 * Esta ruta se encarga de modificar la foto de perfil de un usuario.
 *
 * Parámetros de la solicitud:
 * - @params {string} id - Correo electrónico del usuario.
 * - @params {string} foto_perfil - Nombre de la nueva foto de perfil del usuario.
 *
 * Respuesta:
 * - 202 Accepted: Devuelve el correo y el nombre del usuario
 * - 404 Not found: Devuelve error, no se ha podido encontrar el usuario.
 * - 400 Bad Request: Devuelve error, no se ha podido cambiar el nombre del usuario.
 *
 */
app.put("/usuarios/perfil/cambiarFoto/:id", async (req, res) => {
  try {
    const { foto_perfil } = req.body;
    const usuario = await Usuario.findOneAndUpdate(
      { correo: req.params.id },
      { nombre: foto_perfil },
      { new: true }
    );

    if(!usuario) {
      res.status(404).json({ message: "Usuario no encontrado"});
    }

    res.json(usuario);
  } catch (error) {
    res.status(400).json({ message: "Error actualizando foto de perfil", error: error.message });
  }
})

// * DONE Documentación
// ! NOT DONE Faltan pruebas
/**
 * PUT /usuarios/perfil/cambiarTapete/:id
 *
 * Descripción:
 * Esta ruta se encarga de modificar el tapete de un usuario.
 *
 * Parámetros de la solicitud:
 * - @params {string} id - Correo electrónico del usuario.
 * - @params {string} tapete - Nombre del nuevo tapete del usuario.
 *
 * Respuesta:
 * - 202 Accepted: Devuelve el correo y el nombre del usuario
 * - 404 Not found: Devuelve error, no se ha podido encontrar el usuario.
 * - 400 Bad Request: Devuelve error, no se ha podido cambiar el nombre del usuario.
 *
 */
app.put("/usuarios/perfil/cambiarTapete/:id", async (req, res) => {
  try {
    const { tapete } = req.body;
    const usuario = await Usuario.findOneAndUpdate(
      { correo: req.params.id },
      { tapete: tapete },
      { new: true }
    );

    if(!usuario) {
      res.status(404).json({ message: "Usuario no encontrado"});
    }

    res.json(usuario);
  } catch (error) {
    res.status(400).json({ message: "Error actualizando el tapete", error: error.message });
  }
})

// * DONE Documentación
// ! NOT DONE Faltan pruebas
/**
 * PUT /usuarios/perfil/cambiarCartas/:id
 *
 * Descripción:
 * Esta ruta se encarga de modificar la imagen de las cartas de un usuario.
 *
 * Parámetros de la solicitud:
 * - @params {string} id - Correo electrónico del usuario.
 * - @params {string} imagen_carta - Nombre de la nueva imagen de las cartas del usuario.
 *
 * Respuesta:
 * - 202 Accepted: Devuelve el correo y el nombre del usuario
 * - 404 Not found: Devuelve error, no se ha podido encontrar el usuario.
 * - 400 Bad Request: Devuelve error, no se ha podido cambiar el nombre del usuario.
 *
 */
app.put("/usuarios/perfil/cambiarCartas/:id", async (req, res) => {
  try {
    const { imagen_carta } = req.body;
    const usuario = await Usuario.findOneAndUpdate(
      { correo: req.params.id },
      { imagen_carta: imagen_carta },
      { new: true }
    );

    if(!usuario) {
      res.status(404).json({ message: "Usuario no encontrado"});
    }

    res.json(usuario);
  } catch (error) {
    res.status(400).json({ message: "Error actualizando la imagen de las cartas", error: error.message });
  }
})

// ! NOT DONE Falta probar la nueva funcionalidad y documentar la respuesta obtenida
// ! //////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * POST /usuarios/actualizacionPerfil/:id
 *
 * Descripción:
 * Esta ruta se encarga de validar el inicio de sesión de los usuarios.
 *
 * Parámetros de la solicitud:
 * - @params {string} correo - Correo electrónico del usuario.
 * - @params {string} contrasena - Contraseña del usuario.
 *
 * Respuesta:
 * - 202 Accepted: Devuelve el correo y el nombre del usuario
 * - 401 Unauthorized: Devuelve error, no se ha podido iniciar sesión.
 * 
 * Ejemplo de respuesta exitosa:
 * [
 *   {
 *       "_id": "67f40268b679013fe7fa6548",
 *       "correo": "pruebaRegistro@gmail.com",
 *       "nombre": "pruebaRegistro"
 *   }
 * ]
 *
 */
app.put("/usuarios/actualizacionPerfil/:id", async (req, res) => {
  try {
    const { nombre, contrasena, foto_perfil } = req.body;
    let usuario;
    if (!nombre && !contrasena) {
      usuario = await Usuario.findOneAndUpdate(
        { correo: req.params.id },
        { foto_perfil: foto_perfil },
        { new: true }
      );
    }
    else if (!nombre) {
      usuario = await Usuario.findOneAndUpdate(
        { correo: req.params.id },
        { contrasena: contrasena, foto_perfil: foto_perfil },
        { new: true }
      );
    } else if (!contrasena) {
      usuario = await Usuario.findOneAndUpdate(
        { correo: req.params.id },
        { nombre: nombre, foto_perfil: foto_perfil },
        { new: true }
      );
    } else {
      usuario = await Usuario.findOneAndUpdate(
        { correo: req.params.id },
        { nombre: nombre, contrasena: contrasena, foto_perfil: foto_perfil },
        { new: true }
      );
    }

    res.json(usuario);
  } catch (error) {
    res.status(400).json({ message: "Error actualizando perfil", error: error.message });
  }
});

// * DONE Documentación?
// ! NOT DONE Falta probar la nueva funcionalidad y documentar la respuesta obtenida
/**
 * GET /usuarios/perfil/:id
 *
 * Descripción:
 * Esta ruta se encarga de recoger los datos del perfil del usuario.
 *
 * Parámetros de la solicitud:
 * - @params {string} id - Correo electrónico del usuario (Dentro de la ruta).
 * 
 * Respuesta:
 * - 200 OK: Devuelve un objeto con la información del usuario.
 * - 400 Bad Request: Devuelve un objeto con un mensaje de error y el detalle del mismo.
 *
 * Ejemplo de respuesta exitosa:
 * {
 *   "correo": "pruebaRegistro@gmail.com",
 *   "nombre": "pruebaRegistro",
 *   "contrasena": "pruebaRegistro",
 *   "foto_perfil": "default.png",
 *   "nVictorias": 0,
 *   "_id": "67f40268b679013fe7fa6548",
 *   "amigos": [],
 *   "__v": 0
 * }
 *
 */
app.get("/usuarios/perfil/:id", async (req, res) => {
  try {
    const usuario = await Usuario.findOne({correo: req.params.id}, {amigos: 0});
    res.json(usuario);
  } catch (error) {
    res.status(400).json({ message: "Error obteniendo el perfil", error: error.message});
  }
});

// ! //////////////////////////////////////////////////////////////////////////////////////////////////////

// * DONE Prueba de funcionalidad actual
// ! NOT DONE Documentar la respuesta obtenida
/**
 * GET /rankings
 *
 * Descripción:
 * Esta ruta se encarga obtener el listado de los 100 primeros usuarios del ranking.
 *
 * Parámetros de la solicitud:
 * - No recibe parámetros en la URL ni en la query.
 * 
 * Respuesta:
 * - 200 OK: Devuelve un arreglo con los .
 * - 500 Internal Server Error: Devuelve un objeto con un mensaje de error y el detalle del mismo.
 *
 * Ejemplo de respuesta exitosa:
 * [
 *   {
 *     "_id": "607d1b2f531123456789abcd",
 *     "nombre": "Juan Pérez",
 *     "correo": "juan@example.com",
 *     ...
 *   },
 *   ...
 * ]
 *
 */
app.get("/rankings", async (req, res) => {
  try {
    const rankings = await Usuario.find({}, {foto_perfil: 1, nombre: 1, nVictorias: 1}).sort({ nVictorias: -1 }).limit(100);
    res.json(rankings);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo rankings", error: error.message });
  }
});

// * DONE Prueba de funcionalidad básica
// ! NOT DONE (rojo) Falta probar la nueva funcionalidad y documentar la respuesta obtenida
/**
 * POST /amigos/enviarSolicitud
 *
 * Descripción:
 * Esta ruta se encarga enviar una solicitud a un usuario registrado.
 *
 * Parámetros de la solicitud:
 * - @params {string} idSolicitante - Correo electrónico del usuario que envía la solicitud.
 * - @params {string} idSolicitado - Correo electrónico del usuario al que se le envía la solicitud.
 * 
 * Respuesta:
 * - 201 Created: Se ha creado bien la solicitud o se ha añadido un nuevo amigo si tenías una petición de dicho usuario.
 * - 400 Bad Request: Devuelve un objeto con un mensaje de error y el detalle del mismo.
 *
 */
app.post("/amigos/enviarSolicitud", async (req, res) => {
  try {
    const { idSolicitante, idSolicitado } = req.body;

    if (idSolicitante === idSolicitado) {
      return res.status(400).json({ message: "No puedes enviarte una solicitud a ti mismo" });
    }

    const amigo = await Usuario.findOne(
      { correo: idSolicitante }, { amigos: 1 }
    )

    if (amigo) {
      // Si el usuario ya tiene una solicitud pendiente de amistad se hacen amigos
      if (amigo.amigos.find(amigo => amigo.idUsuario === idSolicitado && amigo.pendiente)) {
        await Usuario.findOneAndUpdate(
          { correo: idSolicitado },
          { $push: { amigos: {idUsuario: idSolicitante, pendiente: false} } }
        );

        await Usuario.findOneAndUpdate(
          { correo: idSolicitante, "amigos.idUsuario": idSolicitado },
          { $set: { "amigos.$.pendiente": false} }
        );

        res.status(201).json({ message: "Tenías una solicitud pendiente, ahora son amigos" });
        return;
      }

      // Si ya son amigos se manda error
      if (amigo.amigos.find(amigo => amigo.idUsuario === idSolicitado && !amigo.pendiente)) {
        return res.status(400).json({ message: "Este usuario ya es amigo tuyo" });
      }
    }

    await Usuario.findOneAndUpdate(
      { correo: idSolicitado },
      { $push: { amigos: {idUsuario: idSolicitante, pendiente: true} } }
    );
    
    res.status(201).json({ message: "Solicitud enviada con éxito"});
  } catch (error) {
    res.status(400).json({ message: "Error enviando solicitud", error: error.message });
  }
});


// * DONE Prueba de funcionalidad actual
// ! NOT DONE (rojo) Falta probar la nueva funcionalidad y documentar la respuesta obtenida
/**
 * POST /amigos/aceptarSolicitud
 *
 * Descripción:
 * Esta ruta se encarga de aceptar una solicitud de amistad de un usuario.
 *
 * Parámetros de la solicitud:
 * - @params {string} idAceptante - Correo electrónico del usuario que acepta la solicitud.
 * - @params {string} idSolicitante - Correo electrónico del usuario al que envío la solicitud.
 * 
 * Respuesta:
 * - 202 OK: Devuelve un arreglo con los .
 * - 400 Bad Request: Devuelve un objeto con un mensaje de error y el detalle del mismo.
 *
 */
app.post("/amigos/aceptarSolicitud", async (req, res) => {
  try {
    const { idAceptante, idSolicitante } = req.body;

    await Usuario.findOneAndUpdate(
      { correo: idAceptante },
      { $pull: { amigos: {idUsuario: idSolicitante, pendiente: true} } }
    );

    await Usuario.findOneAndUpdate(
      { correo: idAceptante},
      { $push: { amigos: {idUsuario: idSolicitante, pendiente: false} } }
    );

    await Usuario.findOneAndUpdate(
      { correo: idSolicitante },
      { $push: { amigos: {idUsuario: idAceptante, pendiente: false} } }
    )
    
    res.status(202).json({ message: "Solicitud aceptada con éxito"});
  } catch (error) {
    res.status(400).json({ message: "Error enviando solicitud", error: error.message });
  }
});


// * DONE Prueba de funcionalidad actual
// ! NOT DONE (rojo) Falta probar la nueva funcionalidad y documentar la respuesta obtenida
/**
 * POST /amigos/rechazarSolicitud
 *
 * Descripción:
 * Esta ruta se encarga de rechazar una solicitud de amistad de un usuario.
 *
 * Parámetros de la solicitud:
 * - @params {string} idRechazante - Correo electrónico del usuario que rechaza la solicitud.
 * - @params {string} idSolicitante - Correo electrónico del usuario al que envío la solicitud.
 * 
 * Respuesta:
 * - 202 OK: Devuelve un arreglo con los .
 * - 500 Internal Server Error: Devuelve un objeto con un mensaje de error y el detalle del mismo.
 *
 */
app.post("/amigos/rechazarSolicitud", async (req, res) => {
  try {
    const { idRechazante, idSolicitante } = req.body;
    await Usuario.findOneAndUpdate(
      { correo: idRechazante },
      { $pull: { amigos: {idUsuario: idSolicitante, pendiente: true} } }
    );
    
    res.status(203).json({ message: "Solicitud rechazada con éxito"});
  } catch (error) {
    res.status(400).json({ message: "Error enviando solicitud", error: error.message });
  }
});


// * DONE Prueba de funcionalidad actual
// ! NOT DONE (rojo) Falta probar la nueva funcionalidad y documentar la respuesta obtenida
/**
 * GET /amigos/:idUsuario
 *
 * Descripción:
 * Esta ruta se encarga de obtener los datos de los amigos del usuario :idUsuario.
 *
 * Parámetros de la solicitud:
 * - @params {string} idUsuario - Correo electrónico del usuario (En el path).
 * 
 * Respuesta:
 * - 200 OK: Devuelve un arreglo con los .
 * - 404 Not Found: Devuelve un objeto con un mensaje de error indicando que el usuario no fue encontrado.
 * - 500 Internal Server Error: Devuelve un objeto con un mensaje de error y el detalle del mismo.
 *
 * Ejemplo de respuesta exitosa:
 * [
 *   {
 *     "_id": "607d1b2f531123456789abcd",
 *     "nombre": "Juan Pérez",
 *     "correo": "juan@example.com",
 *     ...
 *   },
 *   ...
 * ]
 *
 */
app.get("/amigos/:idUsuario", async (req, res) => {
  try {
    const usuario = await Usuario.findOne(
      { correo: req.params.idUsuario },
      { amigos: 1 }
    );

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const listaAmigos = usuario.amigos.filter(amigo => amigo.pendiente === false);
    
    console.log('listaAmigos --> ' + listaAmigos);
    
    const correosAmigos = listaAmigos.map(amigo => amigo.idUsuario);

    console.log('correosAmigos --> ' + correosAmigos);

    const amigosList = await Usuario.find(
      { correo: { $in: correosAmigos } },
      { nombre: 1, correo: 1, foto_perfil: 1 }
    );
    
    console.log('amigosList --> ' + amigosList);

    res.json(amigosList);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo amigos", error: error.message });
  }
});


// * DONE Prueba de funcionalidad actual
// ! NOT DONE (rojo) Falta probar la nueva funcionalidad y documentar la respuesta obtenida
/**
 * GET /solicitudes/:idUsuario
 *
 * Descripción:
 * Esta ruta se encarga de obtener los datos de las solicitudes del usuario :idUsuario.
 *
 * Parámetros de la solicitud:
 * - @params {string} idUsuario - Correo electrónico del usuario (En el path).
 * 
 * Respuesta:
 * - 200 OK: Devuelve un arreglo con los .
 * - 404 Not Found: Devuelve un objeto con un mensaje de error indicando que el usuario no fue encontrado.
 * - 500 Internal Server Error: Devuelve un objeto con un mensaje de error y el detalle del mismo.
 *
 * Ejemplo de respuesta exitosa:
 * [
 *   {
 *     "_id": "607d1b2f531123456789abcd",
 *     "nombre": "Juan Pérez",
 *     "correo": "juan@example.com",
 *     ...
 *   },
 *   ...
 * ]
 *
 */
app.get("/solicitudes/:idUsuario", async (req, res) => {
  try {
    const usuario = await Usuario.findOne(
      { correo: req.params.idUsuario },
      { amigos: 1 }
    );

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const solicitudesPendientes = usuario.amigos.filter(amigo => amigo.pendiente === true);
    const correosSolicitantes = solicitudesPendientes.map(amigo => amigo.idUsuario);
    const usuariosSolicitantes = await Usuario.find(
      { correo: { $in: correosSolicitantes } },
      { nombre: 1, correo: 1, foto_perfil: 1 }
    );

    res.json(usuariosSolicitantes);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo solicitudes", error: error.message });
  }
});


// Rutas de Salas
app.use("/salas", salasRoutes);


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

  socket.on('join-lobby', ({ lobbyId, playerId }) => {
    socket.emit('hello', '¡Hola desde el servidor!');
    socket.join(lobbyId);
    socket.to(lobbyId).emit('player-joined', playerId);
    console.log(`Jugador ${playerId} se unió al lobby ${lobbyId}`);
  });

  // Unirse a una sala
  socket.on('unirSalaPrivada', async ({ salaId, userId, codigoAcceso }) => {
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

  // Buscar partida
  socket.on('buscarPartida', ({ tipo, userId }) => {
    let sala = Array.from(salasEspera.values()).find(s => s.tipo === tipo && s.jugadores.length < (tipo === '1v1' ? 2 : 4));

    if (!sala) {
        sala = {
            id: Date.now().toString(),
            tipo,
            jugadores: [userId],
            estado: 'esperando'
        };
        salasEspera.set(sala.id, sala);
    } else {
        sala.jugadores.push(userId);
    }

    socket.join(sala.id);
    io.to(sala.id).emit('actualizacionSala', sala);

    if (sala.jugadores.length === (tipo === '1v1' ? 2 : 4)) {
        const nuevaPartida = iniciarPartida(sala);
        partidasActivas.set(nuevaPartida.id, nuevaPartida);
        io.to(sala.id).emit('inicioPartida', nuevaPartida);
        salasEspera.delete(sala.id);
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
