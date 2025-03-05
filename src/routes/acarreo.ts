import { Router } from "express";
var router = Router();
import Acarreo from "../service/mongo/models/acarreo";
import { obtenerSiguienteNumAcarreo } from "../utils/contador";
import Bisonte from "../service/mongo/models/bisonte";
import Cuidador from "../service/mongo/models/cuidador";

/* GET home page. */
router.get("/", async (req, res, next) => {
  const acarreo = await Acarreo.find();
  res.send(acarreo);
});

router.get("/:id", async (req, res) => {
  try {
    const acarreo = await Acarreo.findById(req.params.id);
    res.send(acarreo);
  } catch (error: any) {
    res
      .status(500)
      .json({ mensaje: "Error con la guia", error: error.message });
  }
});

router.get("/guia/:numAcarreo", async (req, res) => {
  try {
    const acarreo = await Acarreo.findOne({
      numAcarreo: req.params.numAcarreo,
    });
    res.send(acarreo);
  } catch (error: any) {
    res
      .status(500)
      .json({ mensaje: "Error con la guia", error: error.message });
  }
});

router.get("/acarreo/cuidador/:id", async (req, res) => {
  try {
    const acarreo = await Acarreo.findOne({
      cuidador: req.params.id,
      estado: "pendiente",
    });
    res.status(200).json(acarreo);
  } catch (error: any) {
    res
      .status(500)
      .json({ mensaje: "Error con la guia", error: error.message });
  }
});

router.get("/:id/bisonte", async (req, res) => {
  const acarreo = await Acarreo.findById(req.params.id);
  const bison = await Bisonte.findOne({ cuidador: acarreo?.cuidador });
  res.send({ acarreo, bison });
});

router.post("/", async (req, res) => {
  try {
    // Extraer los datos del cuerpo de la solicitud
    const numAcarreo = await obtenerSiguienteNumAcarreo();
    console.log(numAcarreo);
    const {
      cliente,
      cuidador,
      fechaInicio,
      fechaEntrega,
      direccionOrigen,
      direccionFinal,
      peso,
      costoTotal,
      estado,
    } = req.body;

    // Crear un nuevo documento de Asignado
    const nuevoAcarreo = new Acarreo({
      numAcarreo,
      cliente,
      cuidador,
      fechaInicio,
      fechaEntrega,
      direccionOrigen,
      direccionFinal,
      peso,
      costoTotal,
      estado: estado || "pendiente",
    });

    // Guardar el nuevo acarreo en la base de datos
    const acarreoGuardado = await nuevoAcarreo.save();
    await Cuidador.findByIdAndUpdate(
      cuidador,
      { estado: "ocupado" },
      { new: true }
    );
    // Responder con el acarreo creado
    res.status(201).json(acarreoGuardado);
  } catch (error: any) {
    // Manejar errores
    console.error("Error creando acarreo:", error);
    res
      .status(500)
      .json({ mensaje: "Error al crear el acarreo", error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  const dataAcarreo = req.body;
  const acarreo = await Acarreo.findByIdAndUpdate(req.params.id, dataAcarreo, {
    new: true,
  });
  res.send(acarreo);
});

router.delete("/:id", async (req, res) => {
  await Acarreo.findByIdAndDelete(req.params.id);
  res.send("Acarreo eliminado");
});

export default router;
