import mongoose from "mongoose";

const informeAcarreoSchema = new mongoose.Schema({
  informe: { type: mongoose.Schema.Types.ObjectId, ref: "Informe" }, // Referencia a Informe
  acarreo: { type: mongoose.Schema.Types.ObjectId, ref: "Acarreo" }, // Referencia a Asignado
  detalle: { type: String },
});

const InformeAcarreo = mongoose.model("InformeAcarreo", informeAcarreoSchema);
module.exports = InformeAcarreo;
