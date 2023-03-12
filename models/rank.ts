import { DataTypes } from "sequelize";
import sequelize from "./sequelize";

export const Rank = sequelize.define("rank", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  points: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});
