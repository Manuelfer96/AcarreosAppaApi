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
  try {
    const { carerId, bisonId, type } = bisonCarer;

    if (carerId && bisonId) {
      const [cuidadorRes, bison] = await Promise.all([
        Cuidador.findByIdAndUpdate(carerId, { bisonte: bisonId }, { new: true })
          .select(["-__v", "-contrasena"])
          .lean(),
        Bison.findByIdAndUpdate(
          bisonId,
          { cuidador: carerId },
          { new: true }
        ).lean(),
      ]);
      return type === "bison" ? bison : cuidadorRes;
    }

    if (carerId) {
      const bison = await Bison.findOneAndUpdate(
        { cuidador: null },
        { cuidador: carerId },
        { new: true }
      ).lean();

      if (!bison) {
        return await Cuidador.findById(carerId)
          .select(["-__v", "-contrasena"])
          .lean();
      }

      const cuidadorRes = await Cuidador.findByIdAndUpdate(
        carerId,
        { bisonte: bison._id },
        { new: true }
      )
        .select(["-__v", "-contrasena"])
        .lean();

      return type === "bison" ? bison : cuidadorRes;
    }

    if (bisonId) {
      const carer = await Cuidador.findOneAndUpdate(
        { bisonte: null },
        { bisonte: bisonId },
        { new: true }
      )
        .select(["-__v", "-contrasena"])
        .lean();

      if (!carer) return await Bison.findById(bisonId).select("-__v").lean();

      const bisonRes = await Bison.findByIdAndUpdate(
        bisonId,
        { cuidador: carer._id },
        { new: true }
      )
        .select("-__v")
        .lean();

      return type === "bison" ? bisonRes : carer;
    }

    return null; // Caso donde ni `carerId` ni `bisonId` están presentes
  } catch (error) {
    console.error("Error en addBisonCarer:", error);
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
