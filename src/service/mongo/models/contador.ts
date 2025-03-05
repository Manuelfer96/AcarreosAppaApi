import { Schema, model } from 'mongoose';

interface ContadorI {
    nombre: String,
    valor: Number
}

const contadorSchema = new Schema<ContadorI>({
    nombre: { type: String, required: true, unique: true }, // Nombre del contador (por ejemplo, "numAcarreo")
    valor: { type: Number, default: 0 } // Valor actual del contador
});

export const Contador = model<ContadorI>('Contador', contadorSchema);