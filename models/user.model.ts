import sequelize from "@models/sequelize";
import { DataTypes } from "sequelize";

export type UserType = {
    email: string,
    password: string,
    givenName?: string,
    surname?: string
}

export const User = sequelize.define("user", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
    },
    password: DataTypes.STRING,
    givenName: DataTypes.STRING,
    surname: DataTypes.STRING
})


export const createUser = (user:UserType)=>{
    User.create(user)
}
export default User