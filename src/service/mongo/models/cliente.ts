import { Schema } from "mongoose";
import Usuario, { IUsuario } from "./usuario";

interface IClient extends IUsuario {
  direccion: string;
}

const clienteSchema = new Schema<IClient>({
  direccion: { type: String, require: true },
});

// Hereda de Usuario
const Cliente = Usuario.discriminator<IClient>("Cliente", clienteSchema);
export default Cliente;
