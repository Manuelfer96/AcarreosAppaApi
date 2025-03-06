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
  const acarreos = await Acarreo.find({ estado: "pendiente" });
  const cuidadores = acarreos.map((acarreo) => acarreo.cuidador);
  let cuidador = await Cuidador.findOne({ _id: { $nin: cuidadores } });
  if (cuidador) {
    res.status(200).json(cuidador);
  } else {
    let newCuidador = acarreos.filter(
      (acarreo) => acarreo.estado != "pendiente"
    );

    if (newCuidador) {
    }
  }
});

router.post("/", async (req, res) => {
  const bisonRep = req.body.bisonte;
  const dataCuidador = {
    nombre: req.body.nombre,
    correo: req.body.correo,
    telefono: req.body.telefono,
    contrasena: req.body.contrasena,
    rol: "cuidador",
  };
  const cuidador = new Cuidador(dataCuidador);

  await cuidador
    .save()
    .then(async (cuidador) => {
      // Generar token JWT
      const token = generarToken({ id: cuidador._id, rol: cuidador.rol });
      if (bisonRep) {
        const newCarer = await addBisonCarer({
          carerId: cuidador._id,
          bisonId: bisonRep,
          type: "carer",
        });
        res.status(201).json({ token, cuidador: newCarer });
      } else {
        const newCarer = await addBisonCarer({
          carerId: cuidador._id,
          type: "carer",
        });
        res.status(201).json({ token, cuidador: newCarer });
      }
    })
    .catch((err: any) => {
      console.log(err);
      res
        .status(404)
        .send({ message: "Cuidador no creado", error: err.message });
    });
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
