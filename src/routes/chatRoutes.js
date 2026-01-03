import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// Obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir la página del chat (SIN autenticación en la ruta, la auth se hace en Socket.IO)
router.get("/", (req, res) => {
  // El archivo chat.html está en public/
  res.sendFile(path.join(__dirname, "../public/chat.html"));
});

export default router;