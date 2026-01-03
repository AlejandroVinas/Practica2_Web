import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { config } from "../config.js";

const router = express.Router();

// Registro
router.post("/register", async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Faltan datos" });

    const exists = await User.findOne({ username });
    if (exists) return res.status(400).json({ message: "Usuario ya existe" });

    const user = new User({ username, password, role: role || "user" });
    await user.save();

    res.status(201).json({ message: "Usuario creado", user: { id: user._id, username: user.username, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error en servidor" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Faltan datos" });

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Usuario/contraseña inválidos" });

    const valid = await user.comparePassword(password);
    if (!valid) return res.status(400).json({ message: "Usuario/contraseña inválidos" });

    const payload = { id: user._id.toString(), username: user.username, role: user.role };
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: "8h" });

    res.json({ token, user: payload });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error en servidor" });
  }
});

export default router;
