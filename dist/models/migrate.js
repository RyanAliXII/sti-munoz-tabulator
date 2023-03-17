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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSeed = exports.runMigration = void 0;
const model_1 = require("./model");
const dotenv = __importStar(require("dotenv"));
const validator_1 = __importDefault(require("validator"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const sequelize_1 = require("sequelize");
const env = dotenv.config();
const runMigration = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield model_1.User.sync();
        yield model_1.Event.sync();
        yield model_1.Team.sync();
        yield model_1.Rank.sync();
        yield model_1.Score.sync();
    }
    catch (error) {
        console.log(error);
        return error;
    }
});
exports.runMigration = runMigration;
const runSeed = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield createRootUser();
    }
    catch (error) {
        throw error;
    }
});
exports.runSeed = runSeed;
const createRootUser = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    try {
        const email = (_a = env.parsed) === null || _a === void 0 ? void 0 : _a.ROOT_USER_EMAIL;
        const password = (_b = env.parsed) === null || _b === void 0 ? void 0 : _b.ROOT_USER_PASSWORD;
        const givenName = (_d = (_c = env.parsed) === null || _c === void 0 ? void 0 : _c.ROOT_USER_GIVEN_NAME) !== null && _d !== void 0 ? _d : "";
        const surname = (_f = (_e = env.parsed) === null || _e === void 0 ? void 0 : _e.ROOT_USER_SURNAME) !== null && _f !== void 0 ? _f : "";
        if (!email || !password) {
            throw "Root user email and password should be added in your .env";
        }
        if (!validator_1.default.isEmail(email !== null && email !== void 0 ? email : "")) {
            throw "Invalid Root user email. Please enter valid email.";
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 5);
        yield (0, model_1.createUser)({
            email,
            password: hashedPassword,
            givenName,
            surname,
        });
    }
    catch (error) {
        if (error instanceof sequelize_1.ValidationError) {
            console.log("Root user is already created.");
            return;
        }
        throw error;
    }
});
