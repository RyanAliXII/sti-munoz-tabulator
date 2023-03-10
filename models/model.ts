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
    unique: true,
  },
  points: {
    type: DataTypes.INTEGER,
  },
});
Score.belongsTo(Event, { foreignKey: "eventId" });
Score.belongsTo(Team, { foreignKey: "teamId" });
Score.belongsTo(Rank, { foreignKey: "rankId" });

Event.hasMany(Score, { foreignKey: "eventId" });
Team.hasMany(Score, { foreignKey: "teamId" });
Rank.hasMany(Score, { foreignKey: "rankId" });

// Rank.belongsToMany(Event, { through: Score });
// Team.belongsToMany(Event, { through: Score });
// Event.belongsToMany(Team, { through: Score });
