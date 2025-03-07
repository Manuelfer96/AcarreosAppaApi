import { config } from "dotenv";

config();

const settings = {
  db_mongo_uri: process.env.DB_MONGO_URI || "",
  salt_work_factor: process.env.salt_work_factor || "",
  JWT_SECRET: process.env.JWT_SECRET || "",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "",
  ADMIN_SECRET: process.env.ADMIN_SECRET || "",
};

export default settings;
