import { Schema, model } from "mongoose";

const informeSchema = new Schema({
  fechaGeneracion: { type: Date, required: true },
  periodo: { type: String },
  tipoInforme: { type: String },
  estado: { type: String },
});

const Informe = model("Informe", informeSchema);
export default Informe;
