import fs from "fs";
import { parse as yamlParse } from "yaml";

const apisConfigContent = () => {
  return fs.readFileSync("env.yml", {
    encoding: "utf8",
  });
};

const config = () => {
  const apiConfig = yamlParse(apisConfigContent());
  return apiConfig;
};

const env = process.env.NODE_ENV;

const concatEnvConfig = (setting: string) => {
  const configYML = config();
  return eval(`configYML.${env}.${setting}`);
};

const settings = {
  db_mongo_uri: concatEnvConfig("DB_MONGO_URI"),
  salt_work_factor: concatEnvConfig("SALT_WORK_FACTOR"),
  JWT_SECRET: concatEnvConfig("JWT_SECRET"),
  JWT_EXPIRES_IN: concatEnvConfig("JWT_EXPIRES_IN"),
};

export default settings;
