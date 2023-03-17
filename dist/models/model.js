"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rank = exports.Event = exports.Team = exports.Score = exports.createUser = exports.User = void 0;
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
});
const createUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.User.create(user);
    }
    catch (error) {
        throw error;
    }
});
exports.createUser = createUser;
exports.Score = sequelize_2.default.define("score", {
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    additionalPoints: {
        type: sequelize_1.DataTypes.INTEGER,
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
        unique: true,
    },
    points: {
        type: sequelize_1.DataTypes.INTEGER,
    },
});
exports.Score.belongsTo(exports.Event, { foreignKey: "eventId" });
exports.Score.belongsTo(exports.Team, { foreignKey: "teamId" });
exports.Score.belongsTo(exports.Rank, { foreignKey: "rankId" });
exports.Event.hasOne(exports.Score, { foreignKey: "eventId" });
exports.Team.hasOne(exports.Score, { foreignKey: "teamId" });
exports.Rank.hasOne(exports.Score, { foreignKey: "rankId" });
