// src/routes/auth.ts
import express, { Request, Response } from "express";
import { generarToken, verificarToken } from "../utils/jwt";
import Usuario from "../service/mongo/models/usuario";
import { compare } from "bcrypt";
import Cliente from "../service/mongo/models/cliente";
import Cuidador from "../service/mongo/models/cuidador";

const router = express.Router();

// Inicio de sesión
router.post("/login", async (req: Request, res: any) => {
  const { correo, contrasena } = req.body;

  try {
    // Buscar el usuario por correo
    const usuario = await Usuario.findOne({
      correo: { $regex: correo, $options: "i" },
    });
    if (!usuario) {
      return res.status(400).json({ message: "Credenciales inválidas." });
    }

    // Verificar la contraseña
    const contrasenaValida = await compare(contrasena, usuario.contrasena);
    if (!contrasenaValida) {
      return res.status(400).json({ message: "Credenciales inválidas." });
    }

    // Generar token JWT
    const token = generarToken({ id: usuario._id, rol: usuario.rol });

    res.json({ usuario, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al iniciar sesión.", error });
  }
});

router.get("/getUser/:token", async (req: Request, res: Response) => {
  const token = req.params.token;

  try {
    const user = verificarToken(token);

    if (user.rol == "cliente") {
      const usuario = await Cliente.findById(user.id);
      res.json(usuario);
    } else {
      const usuario = await Cuidador.findById(user.id);
      res.json(usuario);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al iniciar sesión.", error });
  }
});

router.get("/getProfile", async (req: any, res: Response) => {
  try {
    const usuario = req.usuario;
    res.json(usuario);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al iniciar sesión.", error });
  }
});

export default router;
