import { Router } from "express";
var router = Router();
import Acarreo, { AcarreoI } from "../service/mongo/models/acarreo";
import { obtenerSiguienteNumAcarreo } from "../utils/contador";
import Bisonte from "../service/mongo/models/bisonte";
import Cuidador from "../service/mongo/models/cuidador";
import { ACARREO_PENDIENTE, capitales, CUIDADOR_OCUPADO } from "../constants";

/**
 * @swagger
 * /carer:
 *   post:
 *     summary: Crear un nuevo acarreo
 *     tags: [Acarreos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Acarreo'
 *     responses:
 *       201:
 *         description: Acarreo creado exitosamente
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error al crear el acarreo
 *   get:
 *     summary: Obtener todos los acarreos
 *     tags: [Acarreos]
 *     responses:
 *       200:
 *         description: Lista de acarreos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Acarreo'
 *       500:
 *         description: Error al obtener los acarreos
 */

/**
 * @swagger
 * /carer/{id}:
 *   get:
 *     summary: Obtener un acarreo por ID
 *     tags: [Acarreos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del acarreo
 *     responses:
 *       200:
 *         description: Acarreo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Acarreo'
 *       404:
 *         description: Acarreo no encontrado
 *       500:
 *         description: Error al obtener el acarreo
 *   put:
 *     summary: Actualizar un acarreo por ID
 *     tags: [Acarreos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del acarreo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Acarreo'
 *     responses:
 *       200:
 *         description: Acarreo actualizado exitosamente
 *       400:
 *         description: Error en la solicitud
 *       404:
 *         description: Acarreo no encontrado
 *       500:
 *         description: Error al actualizar el acarreo
 *   delete:
 *     summary: Eliminar un acarreo por ID
 *     tags: [Acarreos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del acarreo
 *     responses:
 *       200:
 *         description: Acarreo eliminado exitosamente
 *       404:
 *         description: Acarreo no encontrado
 *       500:
 *         description: Error al eliminar el acarreo
 */

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

    const direccionActual = direccionOrigen;

    if (
      capitales.some((x) => x !== direccionOrigen) ||
      capitales.some((x) => x !== direccionFinal)
    ) {
      res.status(400).json({
        mensaje:
          "Las direcciones no se encuentran dentro de las capitales activas",
        error: "Direcciones Incorrectas",
      });
      return;
    }

    if (direccionOrigen === direccionFinal) {
      res.status(400).json({
        mensaje: "No se puede enviar al mismo destino",
        error: "Dirección origen es igual a la dirección final",
      });
      return;
    }

    // Crear un nuevo documento de Asignado
    const nuevoAcarreo = new Acarreo({
      numAcarreo,
      cliente,
      cuidador,
      fechaInicio,
      fechaEntrega,
      direccionOrigen,
      direccionFinal,
      direccionActual,
      peso,
      costoTotal,
      estado: estado || ACARREO_PENDIENTE,
    });

    // Guardar el nuevo acarreo en la base de datos
    const acarreoGuardado = await nuevoAcarreo.save();
    await Cuidador.findByIdAndUpdate(
      cuidador,
      { estado: CUIDADOR_OCUPADO },
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
  const dataAcarreo: Partial<AcarreoI> = req.body;
  if (dataAcarreo.direccionActual) {
    if (!verifyCapital(dataAcarreo.direccionActual)) {
      res.status(400).json({
        mensaje:
          "Las direccion no se encuentra dentro de las capitales activas",
        error: "Direccion Incorrecta",
      });
      return;
    }
  }
  const acarreo = await Acarreo.findByIdAndUpdate(req.params.id, dataAcarreo, {
    new: true,
  });
  res.send(acarreo);
});

router.delete("/:id", async (req, res) => {
  await Acarreo.findByIdAndDelete(req.params.id);
  res.send("Acarreo eliminado");
});

const verifyCapital = (capital: string) => {
  return capitales.some((x) => x === capital);
};

export default router;
