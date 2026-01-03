import express from "express";
import User from "../models/User.js";
import { authenticateJWT } from "../middleware/authenticateJWT.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();

// Listar todos los usuarios (solo admin)
router.get("/", authenticateJWT, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
});

// Obtener usuario por ID (solo admin)
router.get("/:id", authenticateJWT, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener usuario" });
  }
});

// Actualizar rol de usuario (solo admin)
router.put("/:id/role", authenticateJWT, isAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Rol inválido" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al actualizar usuario" });
  }
});

// Eliminar usuario (solo admin)
router.delete("/:id", authenticateJWT, isAdmin, async (req, res) => {
  try {
    // No permitir que el admin se elimine a sí mismo
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: "No puedes eliminarte a ti mismo" });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al eliminar usuario" });
  }
});

export default router;