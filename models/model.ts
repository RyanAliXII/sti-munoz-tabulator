import { DataTypes } from "sequelize";
import sequelize from "./sequelize";

export type EventType = {
  name: string;
  date: string;
};

export type UserType = {
  id?: number;
  email: string;
  password: string;
  givenName?: string;
  surname?: string;
  permissions: string[];
  isRoot: true;
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
  permissions: DataTypes.JSONB,
  isRoot: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

export const Score = sequelize.define(
  "score",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    additionalPoints: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    eventId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    teamId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    rankId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["eventId", "teamId"],
      },
    ],
  }
);

export const Team = sequelize.define("team", {
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
});

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
  },
  classId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  points: {
    type: DataTypes.INTEGER,
  },
});

export const RankClass = sequelize.define("classification", {
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
});
Score.belongsTo(Event, { foreignKey: "eventId" });
Score.belongsTo(Team, { foreignKey: "teamId" });
Score.belongsTo(Rank, { foreignKey: "rankId" });

Event.hasOne(Score, { foreignKey: "eventId" });
Team.hasOne(Score, { foreignKey: "teamId" });
Rank.hasOne(Score, { foreignKey: "rankId" });

Rank.belongsTo(RankClass, { foreignKey: "classId" });
RankClass.hasMany(Rank, { foreignKey: "classId" });
