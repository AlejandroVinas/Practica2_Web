import express from "express";
import Product from "../models/Product.js";
import { authenticateJWT } from "../middleware/authenticateJWT.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();

// Listado (autenticado)
router.get("/", authenticateJWT, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
});

// Detalle
router.get("/:id", authenticateJWT, async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: "No encontrado" });
    res.json(p);
  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
});

// Crear (admin)
router.post("/", authenticateJWT, isAdmin, async (req, res) => {
  try {
    const { name, description, price } = req.body;
    if (!name || price == null) return res.status(400).json({ message: "Faltan campos" });
    const p = new Product({ name, description, price });
    await p.save();
    res.status(201).json(p);
  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
});

// Editar (admin)
router.put("/:id", authenticateJWT, isAdmin, async (req, res) => {
  try {
    const data = req.body;
    const p = await Product.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!p) return res.status(404).json({ message: "No encontrado" });
    res.json(p);
  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
});

// Borrar (admin)
router.delete("/:id", authenticateJWT, isAdmin, async (req, res) => {
  try {
    const p = await Product.findByIdAndDelete(req.params.id);
    if (!p) return res.status(404).json({ message: "No encontrado" });
    res.json({ message: "Eliminado" });
  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
});

export default router;
