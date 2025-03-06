import mongoose, { Schema, model, Document } from "mongoose";
import bcrypt from "bcrypt";

import settings from "../../../settings";

export interface IUsuario extends Document {
  _id: mongoose.Types.ObjectId;
  nombre: string;
  correo: string;
  telefono?: string;
  contrasena: string;
  rol: string;
  compararContrasena: (contrasena: string) => Promise<boolean>;
}

const usuarioSchema = new Schema<IUsuario>({
  nombre: { type: String, required: true },
  correo: { type: String, required: true },
  telefono: { type: String },
  contrasena: { type: String, required: true },
  rol: { type: String, enum: ["cliente", "cuidador", "admin"], required: true }, // Para diferenciar entre Cliente y Cuidador
});

usuarioSchema.index({ correo: 1, rol: 1 }, { unique: true });

usuarioSchema.methods.toJSON = function () {
  let userObject = this.toObject();
  delete userObject.contrasena;
  return userObject;
};

// Hook para hashear la contraseña antes de guardar
usuarioSchema.pre<IUsuario>("save", async function (next) {
  if (!this.isModified("contrasena")) return next();
  try {
    const salt = await bcrypt.genSalt(parseInt(settings.salt_work_factor));
    const hash = await bcrypt.hash(this.contrasena, salt);
    this.contrasena = hash;
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Método para comparar contraseñas
usuarioSchema.methods.compararContrasena = async function (
  contrasena: string
): Promise<boolean> {
  return await bcrypt.compare(contrasena, this.contrasena);
};

const Usuario = model<IUsuario>("Usuario", usuarioSchema);
export default Usuario;
