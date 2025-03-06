import Acarreo from "./service/mongo/models/acarreo";
import m2s from "mongoose-to-swagger";
import Cliente from "./service/mongo/models/cliente";
import Cuidador from "./service/mongo/models/cuidador";
import Admin from "./service/mongo/models/admin";
import Bisonte from "./service/mongo/models/bisonte";
import Informe from "./service/mongo/models/informe";
import InformeAcarreo from "./service/mongo/models/informeAcarreo";

export default {
  acarreo: m2s(Acarreo),
  cliente: m2s(Cliente),
  cuidador: m2s(Cuidador),
  admin: m2s(Admin),
  bisonte: m2s(Bisonte),
  informe: m2s(Informe),
  informeAcarreo: m2s(InformeAcarreo),
};
