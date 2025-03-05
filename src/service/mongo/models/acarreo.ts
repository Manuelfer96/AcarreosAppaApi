import mongoose, { Schema, model } from "mongoose";

interface AcarreoI extends mongoose.Document {
  numAcarreo: number;
  cliente: Schema.Types.ObjectId;
  cuidador: Schema.Types.ObjectId;
  fechaInicio: Date;
  fechaEntrega: Date;
  direccionOrigen: string;
  direccionFinal: string;
  peso: number;
  costoTotal: number;
  estado: string;
}

const asignadoSchema = new mongoose.Schema<AcarreoI>({
  numAcarreo: { type: Number, required: true },
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cliente",
    required: true,
  },
  cuidador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cuidador",
    required: true,
  },
  fechaInicio: { type: Date, required: true },
  fechaEntrega: { type: Date, required: true },
  direccionOrigen: { type: String, required: true },
  direccionFinal: { type: String, required: true },
  peso: { type: Number, required: true },
  costoTotal: { type: Number, required: true },
  estado: { type: String, default: "pendiente" }, // Estado por defecto
});

const Acarreo = model<AcarreoI>("Acarreo", asignadoSchema);
export default Acarreo;
