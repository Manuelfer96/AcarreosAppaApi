import { Schema } from "mongoose";
import Usuario from "./usuario.js";

const clienteSchema = new Schema({
  direccion: { type: String },
});

// Hereda de Usuario
const Cliente = Usuario.discriminator("Cliente", clienteSchema);
export default Cliente;
