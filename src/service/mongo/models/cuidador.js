import { Schema } from "mongoose";
import Usuario from "./usuario.js";

const cuidadorSchema = new Schema({
  bisonte: { type: Schema.Types.ObjectId, ref: "Bisonte" }, // Referencia a Bisonte
});

// Hereda de Usuario
const Cuidador = Usuario.discriminator("Cuidador", cuidadorSchema);
export default Cuidador;
