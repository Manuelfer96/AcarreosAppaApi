import { connect } from "mongoose";
import settings from "../../settings";

connect(settings.db_mongo_uri)
  .then(() => console.log("Conectado a MongoDB"))
  .catch((error) => console.error("Error al conectar a MongoDB", error));
