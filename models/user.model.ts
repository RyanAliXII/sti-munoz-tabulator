import sequelize from "@models/sequelize";
import { DataTypes } from "sequelize";

export type UserType = {
  id?: number;
  email: string;
  password: string;
  givenName?: string;
  surname?: string;
};

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
  surname: DataTypes.STRING,
});

export const createUser = async (user: UserType) => {
  try {
    await User.create(user);
  } catch (error) {
    throw error;
  }
};
export default User;
