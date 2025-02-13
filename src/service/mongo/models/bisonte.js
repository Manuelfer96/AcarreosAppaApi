import { Schema, model } from "mongoose";

const bisonteSchema = new Schema({
  nombre: { type: String, required: true },
  peso: { type: Number },
  estado: { type: String },
  cuidador: { type: Schema.Types.ObjectId, ref: "Cuidador" }, // Referencia a Cuidador
});

const Bisonte = model("Bisonte", bisonteSchema);
export default Bisonte;
