import { Router } from "express";
import Cliente from "../service/mongo/models/cliente";
import { generarToken } from "../utils/jwt";
import { authMiddleware } from "../middlewares/authMiddleware";
var router = Router();

/**
 * @swagger
 * /client:
 *   post:
 *     summary: Crear un nuevo cliente
 *     tags: [Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cliente'
 *     responses:
 *       201:
 *         description: Cliente creado exitosamente
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error al crear el cliente
 *   get:
 *     summary: Obtener todos los clientes
 *     tags: [Clientes]
 *     responses:
 *       200:
 *         description: Lista de clientes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cliente'
 *       500:
 *         description: Error al obtener los clientes
 */

/**
 * @swagger
 * /clientes/{id}:
 *   get:
 *     summary: Obtener un cliente por ID
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       404:
 *         description: Cliente no encontrado
 *       500:
 *         description: Error al obtener el cliente
 *   put:
 *     summary: Actualizar un cliente por ID
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cliente'
 *     responses:
 *       200:
 *         description: Cliente actualizado exitosamente
 *       400:
 *         description: Error en la solicitud
 *       404:
 *         description: Cliente no encontrado
 *       500:
 *         description: Error al actualizar el cliente
 *   delete:
 *     summary: Eliminar un cliente por ID
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Cliente eliminado exitosamente
 *       404:
 *         description: Cliente no encontrado
 *       500:
 *         description: Error al eliminar el cliente
 */
router.get("/", authMiddleware, async (req, res) => {
  const client = await Cliente.find().select(["-__v", "-contrasena"]);
  res.send(client);
});

router.get("/:id", authMiddleware, async (req, res) => {
  const client = await Cliente.findById(req.params.id).select([
    "-__v",
    "-contrasena",
  ]);
  res.send(client);
});

router.post("/", async (req, res) => {
  const dataClient = {
    nombre: req.body.nombre,
    correo: req.body.correo,
    telefono: req.body.telefono,
    contrasena: req.body.contrasena,
    rol: "cliente",
    direccion: req.body.direccion,
  };
  const client = new Cliente(dataClient);

  await client
    .save()
    .then((client) => {
      const token = generarToken({ id: client._id, rol: client.rol });
      res.status(201).json({ token, client });
    })
    .catch((err) => {
      return res
        .status(400)
        .json({ message: "No se puede crear el cliente", err: err.message });
    });
});

router.put("/:id", authMiddleware, async (req, res) => {
  const dataCliente = req.body;
  const client = await Cliente.findByIdAndUpdate(req.params.id, dataCliente, {
    new: true,
  });
  res.send(client);
});

router.delete("/:id", authMiddleware, async (req, res) => {
  await Cliente.findByIdAndDelete(req.params.id);
  res.send("Cliente eliminado");
});

export default router;
