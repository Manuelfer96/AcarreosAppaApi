import { Schema, model, Document } from "mongoose";

interface CapitalI extends Document {
  nombre: string;
  valor: string;
  estado: string;
}

const asignadoSchema = new Schema<CapitalI>({
  nombre: { type: String, required: true },
  valor: { type: String, required: true },
  estado: { type: String, default: "disponible" }, // Estado por defecto
});

const Capital = model<CapitalI>("Capital", asignadoSchema);
export default Capital;
