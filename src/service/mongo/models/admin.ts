import { Schema } from "mongoose";
import Usuario, { IUsuario } from "./usuario";

const aminSchema = new Schema({});

// Hereda de Usuario
const Admin = Usuario.discriminator("Admin", aminSchema);
export default Admin;
