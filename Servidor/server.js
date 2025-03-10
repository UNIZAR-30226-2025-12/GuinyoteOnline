const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

// Importar modelos
const Usuario = require("../Bd/models/Usuario");

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Rutas de ejemplo
app.get("/", (req, res) => {
  res.send("API funcionando");
});

app.get("/usuarios", async (req, res) => {
  const usuarios = await Usuario.find();
  res.json(usuarios);
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
