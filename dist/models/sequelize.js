"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", { value: true });
exports.testConnection = exports.PASSWORD = exports.USERNAME = exports.HOST = exports.DB_NAME = void 0;
const sequelize_1 = require("sequelize");
const dotenv = __importStar(require("dotenv"));
const env = dotenv.config();
const PORT = (_a = env.parsed) === null || _a === void 0 ? void 0 : _a.DB_PORT;
exports.DB_NAME = (_b = env.parsed) === null || _b === void 0 ? void 0 : _b.DB_NAME;
exports.HOST = (_c = env.parsed) === null || _c === void 0 ? void 0 : _c.DB_HOST;
exports.USERNAME = (_d = env.parsed) === null || _d === void 0 ? void 0 : _d.DB_USERNAME;
exports.PASSWORD = (_e = env.parsed) === null || _e === void 0 ? void 0 : _e.DB_PASSWORD;
const sequelize = new sequelize_1.Sequelize({
    host: exports.HOST,
    port: 5432,
    database: exports.DB_NAME,
    username: exports.USERNAME,
    password: exports.PASSWORD,
    dialect: "postgres",
});
const testConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sequelize.authenticate();
        console.log("Database connection has been established successfully.");
    }
    catch (error) {
        throw error;
    }
});
exports.testConnection = testConnection;
exports.default = sequelize;
