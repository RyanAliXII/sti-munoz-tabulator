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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.testConnection = exports.PASSWORD = exports.USERNAME = exports.HOST = exports.DB_NAME = exports.DB_PORT = void 0;
const sequelize_1 = require("sequelize");
const dotenv = __importStar(require("dotenv"));
const env = dotenv.config();
exports.DB_PORT = (_b = parseInt((_a = process.env.DB_PORT) !== null && _a !== void 0 ? _a : "")) !== null && _b !== void 0 ? _b : 5432;
exports.DB_NAME = process.env.DB_NAME;
exports.HOST = process.env.DB_HOST;
exports.USERNAME = process.env.DB_USERNAME;
exports.PASSWORD = process.env.DB_PASSWORD;
const sequelize = new sequelize_1.Sequelize({
    host: exports.HOST,
    port: exports.DB_PORT,
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
