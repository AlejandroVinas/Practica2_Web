import express from "express";
import http from "http";
import { Server as IOServer } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import jwt from "jsonwebtoken";
import { config } from "./config.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { verifySocketJWT } from "./middleware/authenticateJWT.js";
import { typeDefs } from "./graphql/schema.js";
import { resolvers } from "./graphql/resolvers.js";

const app = express();
const server = http.createServer(app);
const io = new IOServer(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

// Middlewares básicos
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  if (req.method === "POST") {
    console.log("🔥 Body recibido en el servidor:", req.body);
  }
  next();
});

// IMPORTANTE: Los archivos estáticos ANTES de las rutas
app.use(express.static("public"));

// Conexión a MongoDB
mongoose.connect(config.mongoURI)
  .then(() => {
    console.log("✅ MongoDB conectado");
    console.log("📂 Base de datos activa:", mongoose.connection.name);
  })
  .catch(err => console.error("❌ Error MongoDB:", err));

// Configurar Apollo Server
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

// Iniciar Apollo Server
await apolloServer.start();

// Context para GraphQL (autenticación)
app.use(
  "/graphql",
  expressMiddleware(apolloServer, {
    context: async ({ req }) => {
      const token = req.headers.authorization?.replace("Bearer ", "");
      
      if (!token) {
        return { user: null };
      }

      try {
        const decoded = jwt.verify(token, config.jwtSecret);
        return { user: decoded };
      } catch (err) {
        return { user: null };
      }
    }
  })
);

// Rutas API REST
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);

// Ruta del chat (SIN middleware de autenticación)
// La autenticación se maneja en Socket.IO
app.use("/chat", chatRoutes);

// Socket.IO auth middleware
io.use(async (socket, next) => {
  try {
    await verifySocketJWT(socket);
    next();
  } catch (err) {
    next(new Error("Authentication error"));
  }
});

io.on("connection", (socket) => {
  const user = socket.user;
  console.log(`👤 Usuario conectado al chat: ${user.username}`);

  socket.on("message", (text) => {
    const msg = { user: user.username, text, time: new Date() };
    io.emit("message", msg);
  });

  socket.on("disconnect", () => {
    console.log(`👋 Usuario desconectado: ${user.username}`);
  });
});

server.listen(config.port, () => {
  console.log(`🚀 Servidor en http://localhost:${config.port}`);
  console.log(`📊 GraphQL en http://localhost:${config.port}/graphql`);
  console.log(`💬 Chat en http://localhost:${config.port}/chat`);
});