import { Request, Response, NextFunction } from "express";
import { verificarToken } from "../utils/jwt";

import settings from "./../settings";

export const authMiddleware = (req: any, res: any, next: NextFunction) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json({ mensaje: "Acceso denegado. Token no proporcionado." });
  }

  try {
    const decoded = verificarToken(token);
    req.usuario = decoded;
    next();
  } catch (error) {
    res.status(400).json({ mensaje: "Token inválido o expirado." });
  }
};

export const verifyAdminSecret = (req: any, res: any, next: NextFunction) => {
  const adminSecret = req.headers["x-admin-secret"];

  if (adminSecret !== settings.ADMIN_SECRET) {
    return res
      .status(403)
      .json({ mensaje: "No tienes permiso para realizar esta acción." });
  }

  next(); // Continuar si el secreto es válido
};
