// src/utils/jwt.ts
import jwt from "jsonwebtoken";
import settings from "../settings";

const JWT_SECRET = settings.JWT_SECRET;
const JWT_EXPIRES_IN = settings.JWT_EXPIRES_IN;

// Generar un token JWT
export const generarToken = (payload: object): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
};

// Verificar un token JWT
export const verificarToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error("Token inválido o expirado");
  }
};

// GetUser un token JWT
export const getUser = (token: string): any => {
  try {
    return jwt.decode(token);
  } catch (error) {
    throw new Error("Token inválido o expirado");
  }
};
