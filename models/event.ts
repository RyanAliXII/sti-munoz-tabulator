import sequelize from "@models/sequelize";
import { DataTypes } from "sequelize";

export type EventType = {
  name: string;
  date: string;
};

export const Event = sequelize.define("event", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    unique: true,
  },
  date: {
    type: DataTypes.DATEONLY,
  },
});

export const createEvent = (event: EventType) => {
  Event.create(event);
};

export default Event;
