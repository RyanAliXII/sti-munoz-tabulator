import { Sequelize } from "sequelize";
import * as dotenv from "dotenv";
const env = dotenv.config();

export const DB_PORT = parseInt(process.env.DB_PORT ?? "") ?? 5432;
export const DB_NAME = process.env.DB_NAME;
export const HOST = process.env.DB_HOST;
export const USERNAME = process.env.DB_USERNAME;
export const PASSWORD = process.env.DB_PASSWORD;

const sequelize = new Sequelize({
  host: HOST,
  port: DB_PORT,
  database: DB_NAME,
  username: USERNAME,
  password: PASSWORD,
  dialect: "postgres",
});

export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");
  } catch (error) {
    throw error;
  }
};

export default sequelize;
