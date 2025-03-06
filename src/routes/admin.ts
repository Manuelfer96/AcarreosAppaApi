import { Router } from "express";
import Admin from "../service/mongo/models/admin";
import { generarToken } from "../utils/jwt";
import { authMiddleware } from "../middlewares/authMiddleware";
var router = Router();

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

router.post("/", async (req, res) => {
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
