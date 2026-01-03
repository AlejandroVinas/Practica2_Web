import jwt from "jsonwebtoken";
import { config } from "../config.js";
import User from "../models/User.js";

/**
 * Middleware Express para proteger rutas REST.
 * Extrae token de header Authorization: Bearer <token>
 */
export function authenticateJWT(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: "Token requerido" });
  const token = auth.split(" ")[1];

  jwt.verify(token, config.jwtSecret, (err, payload) => {
    if (err) return res.status(403).json({ message: "Token inválido" });
    req.user = payload; // { id, username, role }
    next();
  });
}

/**
 * Para Socket.IO: se espera que el token llegue en socket.handshake.auth.token
 */
export async function verifySocketJWT(socket) {
  const token = socket.handshake.auth?.token;
  if (!token) throw new Error("Token requerido");

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    // opcional: recuperar usuario real desde DB (por si queremos validar role actual)
    const user = await User.findById(payload.id).select("-password");
    if (!user) throw new Error("Usuario no existe");
    socket.user = { id: user._id.toString(), username: user.username, role: user.role };
  } catch (err) {
    throw new Error("Token inválido");
  }
}
