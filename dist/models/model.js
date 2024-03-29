"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RankClass = exports.Rank = exports.Event = exports.Team = exports.Score = exports.User = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("./sequelize"));
exports.User = sequelize_2.default.define("user", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
    },
    password: sequelize_1.DataTypes.STRING,
    givenName: sequelize_1.DataTypes.STRING,
    surname: sequelize_1.DataTypes.STRING,
    permissions: sequelize_1.DataTypes.JSONB,
    isRoot: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
});
exports.Score = sequelize_2.default.define("score", {
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    additionalPoints: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
    },
    eventId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    teamId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    rankId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
}, {
    indexes: [
        {
            unique: true,
            fields: ["eventId", "teamId"],
        },
    ],
});
exports.Team = sequelize_2.default.define("team", {
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
});
exports.Event = sequelize_2.default.define("event", {
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
    },
    date: {
        type: sequelize_1.DataTypes.DATEONLY,
    },
});
exports.Rank = sequelize_2.default.define("rank", {
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    classId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    points: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
    },
});
exports.RankClass = sequelize_2.default.define("classification", {
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
});
exports.Score.belongsTo(exports.Event, { foreignKey: "eventId" });
exports.Score.belongsTo(exports.Team, { foreignKey: "teamId" });
exports.Score.belongsTo(exports.Rank, { foreignKey: "rankId" });
exports.Event.hasOne(exports.Score, { foreignKey: "eventId" });
exports.Team.hasOne(exports.Score, { foreignKey: "teamId" });
exports.Rank.hasOne(exports.Score, { foreignKey: "rankId" });
exports.Rank.belongsTo(exports.RankClass, { foreignKey: "classId" });
exports.RankClass.hasMany(exports.Rank, { foreignKey: "classId" });
