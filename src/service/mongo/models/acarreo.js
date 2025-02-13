import { Schema, model } from "mongoose";

const asignadoSchema = new Schema({
  numAcarreo: { type: Number },
  cliente: { type: Schema.Types.ObjectId, ref: "Cliente" }, // Referencia a Cliente
  cuidador: { type: Schema.Types.ObjectId, ref: "Cuidador" }, // Referencia a Cuidador
  fechaInicio: { type: Date },
  fechaEntrega: { type: Date },
  direccionOrigen: { type: String },
  direccionFinal: { type: String },
  peso: { type: Number },
  costoTotal: { type: Number },
  estado: { type: String },
});

const Acarreo = model("Acarreo", asignadoSchema);
export default Acarreo;
