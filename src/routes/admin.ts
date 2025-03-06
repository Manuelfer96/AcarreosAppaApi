import { Router } from "express";
import Admin from "../service/mongo/models/admin";
import { generarToken } from "../utils/jwt";
import {
  authMiddleware,
  verifyAdminSecret,
} from "../middlewares/authMiddleware";
var router = Router();

/**
 * @swagger
 * /admin:
 *   post:
 *     summary: Crear un nuevo admin
 *
 *     tags: [Admins]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Admin'
 *     header:
 *        x-admin-secret:
 *            required: true
 *     responses:
 *       201:
 *         description: Admin creado exitosamente
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error al crear el admin
 *   get:
 *     summary: Obtener todos los admins
 *     tags: [Admins]
 *     responses:
 *       200:
 *         description: Lista de admins
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Admin'
 *       500:
 *         description: Error al obtener los admins
 */

/**
 * @swagger
 * /admin/{id}:
 *   get:
 *     summary: Obtener un admin por ID
 *     tags: [Admins]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del admin
 *     responses:
 *       200:
 *         description: Admin encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Admin'
 *       404:
 *         description: Admin no encontrado
 *       500:
 *         description: Error al obtener el admin
 *   put:
 *     summary: Actualizar un admin por ID
 *     tags: [Admins]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Admin'
 *     responses:
 *       200:
 *         description: Admin actualizado exitosamente
 *       400:
 *         description: Error en la solicitud
 *       404:
 *         description: Admin no encontrado
 *       500:
 *         description: Error al actualizar el admin
 *   delete:
 *     summary: Eliminar un admin por ID
 *     tags: [Admins]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del admin
 *     responses:
 *       200:
 *         description: Admin eliminado exitosamente
 *       404:
 *         description: Admin no encontrado
 *       500:
 *         description: Error al eliminar el admin
 */

router.get("/", authMiddleware, async (req, res) => {
  const admin = await Admin.find().select(["-__v", "-contrasena"]);
  res.send(admin);
});

router.get("/:id", authMiddleware, async (req, res) => {
  const admin = await Admin.findById(req.params.id).select([
    "-__v",
    "-contrasena",
  ]);
  res.send(admin);
});

router.post("/", verifyAdminSecret, async (req, res) => {
  const dataClient = {
    nombre: req.body.nombre,
    correo: req.body.correo,
    telefono: req.body.telefono,
    contrasena: req.body.contrasena,
    rol: "admin",
  };
  const admin = new Admin(dataClient);

  await admin
    .save()
    .then((admin) => {
      const token = generarToken({ id: admin._id, rol: admin.rol });
      res.status(201).json({ token, admin });
    })
    .catch((err) => {
      return res
        .status(400)
        .json({ message: "No se puede crear el cliente", err: err.message });
    });
});

router.put("/:id", authMiddleware, async (req, res) => {
  const dataCliente = req.body;
  const client = await Admin.findByIdAndUpdate(req.params.id, dataCliente, {
    new: true,
  });
  res.send(client);
});

router.delete("/:id", authMiddleware, async (req, res) => {
  await Admin.findByIdAndDelete(req.params.id);
  res.send("Admin eliminado");
});

export default router;
