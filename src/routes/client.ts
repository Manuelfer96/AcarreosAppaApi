import { Router } from "express";
import Cliente from "../service/mongo/models/cliente";
import { generarToken } from "../utils/jwt";
import { authMiddleware } from "../middlewares/authMiddleware";
var router = Router();

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
