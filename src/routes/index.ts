import { Router } from "express";
import Cuidador from "../service/mongo/models/cuidador";
import Bisonte from "../service/mongo/models/bisonte";
import { authMiddleware } from "../middlewares/authMiddleware";
var router = Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/asignar", authMiddleware, async (req, res) => {
  try {
    // Obtener cuidadores sin bisontes y bisontes sin cuidadores
    const [cuidadoresSinBisontes, bisontesSinCuidadores] = await Promise.all([
      Cuidador.find({ bisonte: { $exists: false } })
        .select(["-__v", "-contrasena"])
        .lean(),
      Bisonte.find({ cuidador: { $exists: false } })
        .select("-__v")
        .lean(),
    ]);

    // Determinar cuántos pares se pueden hacer
    const totalAsignaciones = Math.min(
      cuidadoresSinBisontes.length,
      bisontesSinCuidadores.length
    );

    // Asignar uno a uno
    const asignaciones = [];
    for (let i = 0; i < totalAsignaciones; i++) {
      const cuidador = cuidadoresSinBisontes[i];
      const bisonte = bisontesSinCuidadores[i];

      // Actualización en la base de datos
      const cuidadorActualizado = await Cuidador.findByIdAndUpdate(
        cuidador._id,
        { bisonte: bisonte._id },
        { new: true }
      ).select(["-__v", "-contrasena"]);

      const bisonteActualizado = await Bisonte.findByIdAndUpdate(
        bisonte._id,
        { cuidador: cuidador._id },
        { new: true }
      ).select("-__v");

      asignaciones.push({
        cuidador: cuidadorActualizado,
        bisonte: bisonteActualizado,
      });
    }

    res.status(200).json({
      asignaciones,
      cuidadoresSinAsignar: cuidadoresSinBisontes.slice(totalAsignaciones),
      bisontesSinAsignar: bisontesSinCuidadores.slice(totalAsignaciones),
    });
  } catch (error: any) {
    console.error("Error en la asignación:", error);
    res.status(500).json({
      message: "Error durante la asignación",
      error: error.message,
    });
  }
});

export default router;
