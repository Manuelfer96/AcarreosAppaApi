import { Router } from "express";
var router = Router();
import Bison from "../service/mongo/models/bisonte";
import { addBisonCarer, removeBisonCarer } from "../utils/bisonCarer";
import Cuidador from "../service/mongo/models/cuidador";

/**
 * @swagger
 * /bison:
 *   post:
 *     summary: Crear un nuevo bisonte
 *     tags: [Bisontes]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Bisonte'
 *     responses:
 *       201:
 *         description: Bisonte creado exitosamente
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error al crear el bisonte
 *   get:
 *     summary: Obtener todos los bisontes
 *     tags: [Bisontes]
 *     responses:
 *       200:
 *         description: Lista de bisontes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Bisonte'
 *       500:
 *         description: Error al obtener los bisontes
 */

/**
 * @swagger
 * /bison/{id}:
 *   get:
 *     summary: Obtener un bisonte por ID
 *     tags: [Bisontes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del bisonte
 *     responses:
 *       200:
 *         description: Bisonte encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bisonte'
 *       404:
 *         description: Bisonte no encontrado
 *       500:
 *         description: Error al obtener el bisonte
 *   put:
 *     summary: Actualizar un bisonte por ID
 *     tags: [Bisontes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del bisonte
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Bisonte'
 *     responses:
 *       200:
 *         description: Bisonte actualizado exitosamente
 *       400:
 *         description: Error en la solicitud
 *       404:
 *         description: Bisonte no encontrado
 *       500:
 *         description: Error al actualizar el bisonte
 *   delete:
 *     summary: Eliminar un bisonte por ID
 *     tags: [Bisontes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del bisonte
 *     responses:
 *       200:
 *         description: Bisonte eliminado exitosamente
 *       404:
 *         description: Bisonte no encontrado
 *       500:
 *         description: Error al eliminar el bisonte
 */

/* GET home page. */
router.get("/", async (req, res, next) => {
  const bison = await Bison.find();
  res.send(bison);
});

router.get("/:id", async (req, res) => {
  const bison = await Bison.findById(req.params.id);
  res.send(bison);
});

router.post("/", async (req, res) => {
  const cuidadorReq = req.body.cuidador;
  const dataBison = {
    nombre: req.body.nombre,
    peso: req.body.peso,
    estado: req.body.estado,
  };

  const bison = new Bison(dataBison);

  await bison.save().catch((err) => {
    console.log(err);
  });
  if (cuidadorReq) {
    const newBison = await addBisonCarer({
      carerId: cuidadorReq,
      bisonId: bison._id,
      type: "bison",
    });
    res.status(201).json(newBison);
  } else {
    const newBison = await addBisonCarer({
      bisonId: bison._id,
      type: "bison",
    });
    res.status(201).json(newBison);
  }
});

router.put("/:id", async (req, res) => {
  const dataBison = req.body;
  const client = await Bison.findByIdAndUpdate(req.params.id, dataBison, {
    new: true,
  });
  res.send(client);
});

router.delete("/:id", async (req, res) => {
  await Bison.findByIdAndDelete(req.params.id);
  await removeBisonCarer({ bisonId: req.params.id });
  res.send("Bisonte eliminado");
});

export default router;
