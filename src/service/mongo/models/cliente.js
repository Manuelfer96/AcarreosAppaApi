import { Schema } from "mongoose";
import Usuario from "./usuario.js";

const clienteSchema = new Schema({
  direccion: { type: String, require:true },
});

// Hereda de Usuario
const Cliente = Usuario.discriminator("Cliente", clienteSchema);
export default Cliente;
