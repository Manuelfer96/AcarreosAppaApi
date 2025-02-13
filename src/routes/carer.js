import { Router } from "express";
var router = Router();
import Cuidador from "../service/mongo/models/cuidador.js"

/* GET home page. */
router.get("/", async (req, res, next) => {
  const cuidador = await Cuidador.find();
  res.send(cuidador)
});

router.get('/:id', async (req, res) => {
    const cuidador = await Cuidador.findById(req.params.id);
    res.send(cuidador);
  });

router.post('/', async (req, res) => {
  const dataCuidador = {
      nombre: req.body.nombre,
      Modelo: req.body.correo,
      Precio: req.body.telefono,
      contrasena: req.body.contrasena,
      rol: 'cuidador',
    }
  const cuidador = new Cuidador(dataCuidador);

  await cuidador.save().catch((err) => {
        console.log(err);
  });
  res.send(client);
});

router.put('/:id', async (req, res) => {
  const dataCuidador = req.body;
  const cuidador = await Cuidador.findByIdAndUpdate(req.params.id, dataCuidador, { new: true });
  res.send(cuidador);
});
  
router.delete('/:id', async (req, res) => {
  await Cuidador.findByIdAndDelete(req.params.id);
  res.send('Cuidador eliminado');
});

export default router;
