import { config } from "dotenv";

config();

const settings = {
  db_host: process.env.DB_HOST,
  db_port: process.env.DB_PORT,
  db_user: process.env.DP_USER,
  db_password: process.env.DB_PASSWORD,
  db_mongo_uri: process.env.DB_MONGO_URI,
};

export default settings;
