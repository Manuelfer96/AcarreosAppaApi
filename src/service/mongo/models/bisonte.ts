import { Schema, model } from "mongoose";

export interface BisonI {
  nombre: { type: String };
  peso: { type: Number };
  estado: { type: String; default: "activo" };
  cuidador?: { type: Schema.Types.ObjectId };
}

const bisonteSchema = new Schema<BisonI>({
  nombre: { type: String, required: true },
  peso: { type: Number },
  estado: { type: String, default: "activo" },
  cuidador: { type: Schema.Types.ObjectId, ref: "Cuidador" }, // Referencia a Cuidador
});

const Bisonte = model<BisonI>("Bisonte", bisonteSchema);
export default Bisonte;
