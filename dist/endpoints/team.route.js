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
const express_1 = __importDefault(require("express"));
const yup_1 = require("yup");
const validate_1 = require("./middewares/validate");
const model_1 = require("../models/model");
const http_status_codes_1 = require("http-status-codes");
const router = express_1.default.Router();
const Module = "Team";
const TeamCreateSchemaValidation = (0, yup_1.object)().shape({
    name: (0, yup_1.string)().required(),
});
const TeamUpdateSchemaValidation = (0, yup_1.object)().shape({
    id: (0, yup_1.string)().required().uuid(),
    name: (0, yup_1.string)().required(),
});
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.headers["content-type"] == "application/json") {
            const teams = (yield model_1.Team.findAll()).map((t) => t.dataValues);
            return res.json({
                message: "Teams fetched.",
                data: {
                    teams: teams !== null && teams !== void 0 ? teams : [],
                },
            });
        }
        return res.render("admin/team/index.html", {
            module: Module,
        });
    }
    catch (error) {
        console.error(error);
        if (req.headers["content-type"] === "application/json") {
            return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Unknown error occured.",
                data: {
                    teams: [],
                },
            });
        }
        return res.render("admin/team/index.html", {
            module: Module,
        });
    }
}));
router.post("/", (0, validate_1.validateJSON)(TeamCreateSchemaValidation), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield model_1.Team.create(req.body);
        return res.json({ message: "Team created.", data: {} });
    }
    catch (error) {
        console.error(error);
        return res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "Unknown error occured.", data: {} });
    }
}));
router.put("/:id", (0, validate_1.validateJSON)(TeamUpdateSchemaValidation), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const team = req.body;
        yield model_1.Team.update({
            name: team.name,
        }, {
            where: {
                id: team.id,
            },
        });
        return res.json({ message: "Team updated.", data: {} });
    }
    catch (error) {
        console.error(error);
        return res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "Unknown error occured.", data: {} });
    }
}));
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        yield model_1.Team.destroy({
            where: {
                id: id,
            },
        });
        return res.json({ message: "Team deleted.", data: {} });
    }
    catch (error) {
        console.error(error);
        return res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "Unknown error occured.", data: {} });
    }
}));
exports.default = router;
