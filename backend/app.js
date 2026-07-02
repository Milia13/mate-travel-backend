// app.js

const path          = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express       = require("express");
const cors          = require("cors");
const conectarDB    = require("./config/db");
const usuariosRoutes = require("./routes/usuarios");
const perfilesRoutes = require("./routes/perfiles");
const matchesRoutes  = require("./routes/matches");

const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const Mensaje = require("./models/Mensaje");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

// Autenticación del socket
io.use((socket, next) => {
  if (socket.handshake.auth && socket.handshake.auth.token) {
    jwt.verify(socket.handshake.auth.token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return next(new Error("Authentication error"));
      socket.usuarioId = decoded.id;
      next();
    });
  } else {
    next(new Error("Authentication error"));
  }
});

io.on("connection", (socket) => {
  // El usuario se une a un canal con su propio ID para recibir mensajes privados
  socket.join(socket.usuarioId);

  socket.on("enviar_mensaje", async (data) => {
    try {
      const nuevoMensaje = await Mensaje.create({
        emisor: socket.usuarioId,
        receptor: data.receptor,
        texto: data.texto
      });
      
      // Emitir al receptor si está conectado
      io.to(data.receptor).emit("nuevo_mensaje", {
        emisor: socket.usuarioId,
        texto: data.texto,
        fecha: nuevoMensaje.fecha
      });
      
      // Emitir confirmación de vuelta al emisor
      socket.emit("mensaje_enviado", {
        receptor: data.receptor,
        texto: data.texto,
        fecha: nuevoMensaje.fecha
      });
    } catch (err) {
      console.error("Error al guardar mensaje:", err);
    }
  });
});

// Conectar a MongoDB
conectarDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Servir el frontend (HTML, CSS, JS, imágenes)
app.use(express.static(path.join(__dirname, "../frontend")));

// Rutas de la API
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/perfiles", perfilesRoutes);
app.use("/api/matches", matchesRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🧉 Servidor corriendo en http://localhost:${PORT}`);
});
