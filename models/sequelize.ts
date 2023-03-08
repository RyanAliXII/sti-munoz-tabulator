import { Sequelize } from "sequelize";
import * as dotenv from "dotenv"
const env = dotenv.config()

const PORT = env.parsed?.DB_PORT
const DB_NAME = env.parsed?.DB_NAME
const HOST = env.parsed?.DB_HOST
const USERNAME =env.parsed?.DB_USERNAME
const PASSWORD =env.parsed?.DB_PASSWORD

 const sequelize = new Sequelize ({
    host: HOST,
    port: 5432,
    database: DB_NAME,
    username: USERNAME,
    password: PASSWORD,
    dialect:"postgres"
})

export const testConnection = async ()=>{
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
      } catch (error) {
        throw error
      }
}



export default sequelize