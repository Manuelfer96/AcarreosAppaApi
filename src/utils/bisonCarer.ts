import mongoose from "mongoose";
import Bison, { BisonI } from "../service/mongo/models/bisonte"; // Asegúrate de importar el modelo Contador
import Cuidador, { CuidadorI } from "../service/mongo/models/cuidador"; // Asegúrate de importar el modelo Contador

interface BisonCarerI {
  carerId?: mongoose.Types.ObjectId | string;
  bisonId?: mongoose.Types.ObjectId | string;
  type?: string;
}
export const addBisonCarer = async (
  bisonCarer: BisonCarerI
): Promise<BisonI | CuidadorI | null> => {
  if (bisonCarer.carerId && bisonCarer.bisonId) {
    const cuidadorRes = await Cuidador.findByIdAndUpdate(
      bisonCarer.carerId,
      { bisonte: bisonCarer.bisonId },
      { new: true }
    ).select(["-__v", "-contrasena"]);
    const bison = await Bison.findByIdAndUpdate(
      bisonCarer.bisonId,
      { cuidador: bisonCarer.carerId },
      { new: true }
    );
    return bisonCarer.type === "bison" ? bison : cuidadorRes;
  } else if (bisonCarer.carerId && !bisonCarer.bisonId) {
    const bison = await Bison.findOneAndUpdate(
      { cuidador: null },
      { cuidador: bisonCarer.carerId },
      { new: true }
    );
    if (!bison)
      return await Cuidador.findById(bisonCarer.carerId).select([
        "-__v",
        "-contrasena",
      ]); // Si no hay bisontes disponibles

    const cuidadorRes = await Cuidador.findByIdAndUpdate(
      bisonCarer.carerId,
      { bisonte: bison._id },
      { new: true }
    ).select(["-__v", "-contrasena"]);
    return bisonCarer.type === "bison" ? bison : cuidadorRes;
  } else if (!bisonCarer.carerId && bisonCarer.bisonId) {
    const carer = await Cuidador.findOneAndUpdate(
      { bisonte: null },
      { bisonte: bisonCarer.bisonId },
      { new: true }
    ).select(["-__v", "-contrasena"]);
    const bison = await Bison.findById(bisonCarer.bisonId).select("-__v");
    if (!carer) return bison; // Si no hay cuidadores disponibles

    const bisonRes = await Bison.findByIdAndUpdate(
      bisonCarer.bisonId,
      { cuidador: carer._id },
      { new: true }
    ).select("-__v");
    return bisonCarer.type === "bison" ? bisonRes : carer;
  } else {
    // Caso donde ni carerId ni bisonId están presentes
    return null;
  }
};

export const removeBisonCarer = async (
  bisonCarer: BisonCarerI
): Promise<BisonI | CuidadorI | null> => {
  if (bisonCarer.carerId && !bisonCarer.bisonId) {
    const cuidadorRes = await Cuidador.findByIdAndUpdate(
      bisonCarer.carerId,
      {
        bisonte: null,
      },
      { new: true }
    );

    return cuidadorRes;
  } else if (!bisonCarer.carerId && bisonCarer.bisonId) {
    const bison = await Bison.findByIdAndUpdate(
      bisonCarer.bisonId,
      {
        cuidador: null,
      },
      { new: true }
    );
    return bison;
  } else return null;
};
