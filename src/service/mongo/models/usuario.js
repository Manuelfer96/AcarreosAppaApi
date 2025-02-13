import { Schema, model } from "mongoose";

const usuarioSchema = new Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  telefono: { type: String },
  contrasena: { type: String, required: true },
  rol: { type: String, enum: ["cliente", "cuidador"], required: true }, // Para diferenciar entre Cliente y Cuidador
});

const Usuario = model("Usuario", usuarioSchema);
export default Usuario;
