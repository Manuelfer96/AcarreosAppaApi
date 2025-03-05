import { Router } from "express";
var router = Router();
import Bison from "../service/mongo/models/bisonte";
import { addBisonCarer, removeBisonCarer } from "../utils/bisonCarer";

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
