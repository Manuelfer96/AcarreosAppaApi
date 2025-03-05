import { Contador } from "../service/mongo/models/contador"; // Asegúrate de importar el modelo Contador

export const obtenerSiguienteNumAcarreo = async (): Promise<Number> => {
  const contador = await Contador.findOneAndUpdate(
    { nombre: "numAcarreo" }, // Busca el contador por nombre
    { $inc: { valor: 1 } }, // Incrementa el valor en 1
    { new: true, upsert: true } // Crea el contador si no existe
  );

  return contador.valor;
};
