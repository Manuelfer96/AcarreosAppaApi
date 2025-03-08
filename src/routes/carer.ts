import { Response, Router } from "express";
var router = Router();
import Cuidador, { CuidadorI } from "../service/mongo/models/cuidador";
import { removeBisonCarer, addBisonCarer } from "../utils/bisonCarer";
import { generarToken } from "../utils/jwt";

import { authMiddleware } from "../middlewares/authMiddleware";
import Acarreo from "../service/mongo/models/acarreo";

/**
 * @swagger
 * /carer:
 *   post:
 *     summary: Crear un nuevo cuidador
 *     tags: [Cuidadores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cuidador'
 *     responses:
 *       201:
 *         description: Cuidador creado exitosamente
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error al crear el cuidador
 *   get:
 *     summary: Obtener todos los cuidadors
 *     tags: [Cuidadores]
 *     responses:
 *       200:
 *         description: Lista de cuidadors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cuidador'
 *       500:
 *         description: Error al obtener los cuidadors
 */

/**
 * @swagger
 * /carer/{id}:
 *   get:
 *     summary: Obtener un cuidador por ID
 *     tags: [Cuidadores]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del cuidador
 *     responses:
 *       200:
 *         description: Cuidador encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cuidador'
 *       404:
 *         description: Cuidador no encontrado
 *       500:
 *         description: Error al obtener el cuidador
 *   put:
 *     summary: Actualizar un cuidador por ID
 *     tags: [Cuidadores]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del cuidador
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cuidador'
 *     responses:
 *       200:
 *         description: Cuidador actualizado exitosamente
 *       400:
 *         description: Error en la solicitud
 *       404:
 *         description: Cuidador no encontrado
 *       500:
 *         description: Error al actualizar el cuidador
 *   delete:
 *     summary: Eliminar un cuidador por ID
 *     tags: [Cuidadores]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del cuidador
 *     responses:
 *       200:
 *         description: Cuidador eliminado exitosamente
 *       404:
 *         description: Cuidador no encontrado
 *       500:
 *         description: Error al eliminar el cuidador
 */

/* GET home page. */
router.get("/", authMiddleware, async (req, res, next) => {
  const cuidador = await Cuidador.find().select(["-__v", "-contrasena"]);
  res.send(cuidador);
});

router.get("/:id", authMiddleware, async (req, res) => {
  const cuidador = await Cuidador.findById(req.params.id).select([
    "-__v",
    "-contrasena",
  ]);
  res.send(cuidador);
});

router.get("/disponible", authMiddleware, async (req, res) => {
  const cuidadores = await Cuidador.find({ estado: CUIDADOR_DISPONIBLE });
  if (cuidadores) {
    res.status(200).json(cuidadores);
  } else {
  }
});
router.post("/", async (req, res) => {
  try {
    const { bisonte, nombre, correo, telefono, contrasena } = req.body;

    const dataCuidador = {
      nombre,
      correo,
      telefono,
      contrasena,
      rol: "cuidador",
    };

    const cuidador = new Cuidador(dataCuidador);
    await cuidador.save();

    const token = generarToken({ id: cuidador._id, rol: cuidador.rol });

    const newCarer = await addBisonCarer({
      carerId: cuidador._id,
      bisonId: bisonte,
      type: "carer",
    });

    res.status(201).json({ token, cuidador: newCarer });
  } catch (err: any) {
    console.error("Error al crear cuidador:", err);
    res.status(404).json({ message: "Cuidador no creado", error: err.message });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  const dataCuidador = req.body;
  const cuidador = await Cuidador.findByIdAndUpdate(
    req.params.id,
    dataCuidador,
    { new: true }
  ).select(["-__v", "-contrasena"]);
  res.send(cuidador);
});

router.delete("/:id", authMiddleware, async (req, res) => {
  await Cuidador.findByIdAndDelete(req.params.id);
  await removeBisonCarer({ carerId: req.params.id });
  res.send("Cuidador eliminado");
});

export default router;
