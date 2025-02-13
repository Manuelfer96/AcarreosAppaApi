import { createConnection } from "mysql";
import config from "../settings.js";
var connection = createConnection({
  host: config.db_host,
  port: config.db_port,
  user: config.db_user,
  password: config.db_password,
  database: "acarreosappa_db",
});

connection.connect((err) => {
  if (!err) {
    console.log("Conecction to MYSQL Server AIVEN");
  } else {
    console.error(err);
  }
});

const getConnection = () => {
  return connection;
};

export default getConnection;
