import { Router } from "express";
var router = Router();
import Cliente from "../service/mongo/models/cliente.js"

/* GET home page. */
router.get("/", async (req, res, next) => {
  const client = await Cliente.find();
  res.send(client)
});

router.get('/:id', async (req, res) => {
    const client = await Cliente.findById(req.params.id);
    res.send(client);
  });

router.post('/', async (req, res) => {
  const dataClient = {
      nombre: req.body.nombre,
      Modelo: req.body.correo,
      Precio: req.body.telefono,
      contrasena: req.body.contrasena,
      rol: 'cliente',
      direccion: req.body.direccion
    }
  const client = new Cliente(dataClient);

  await client.save().catch((err) => {
        console.log(err);
  });
  res.send(client);
});

router.put('/:id', async (req, res) => {
  const dataCliente = req.body;
  const client = await Cliente.findByIdAndUpdate(req.params.id, dataCliente, { new: true });
  res.send(client);
});
  
router.delete('/:id', async (req, res) => {
  await Cliente.findByIdAndDelete(req.params.id);
  res.send('Cliente eliminado');
});

export default router;
