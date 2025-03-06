import { Schema } from "mongoose";
import Usuario, { IUsuario } from "./usuario";

const adminSchema = new Schema<IUsuario>({});

// Hereda de Usuario
const Admin = Usuario.discriminator<IUsuario>("Admin", adminSchema);
export default Admin;
