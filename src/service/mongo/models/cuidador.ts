import { Schema } from "mongoose";
import Usuario, { IUsuario } from "./usuario";

export interface CuidadorI extends IUsuario {
  bisonte?: { type: Schema.Types.ObjectId };
  estado: string;
}

const cuidadorSchema = new Schema<CuidadorI>({
  bisonte: { type: Schema.Types.ObjectId, ref: "Bisonte" },
  estado: { type: String, default: "disponible" },
});

// Hereda de Usuario
const Cuidador = Usuario.discriminator<CuidadorI>("Cuidador", cuidadorSchema);
export default Cuidador;
