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
const model_1 = require("../models/model");
const express_1 = __importDefault(require("express"));
const yup_1 = require("yup");
const validate_1 = require("./middewares/validate");
const http_status_codes_1 = require("http-status-codes");
const Module = "Rank";
const router = express_1.default.Router();
const RankAddSchemaValidation = (0, yup_1.object)().shape({
    name: (0, yup_1.string)().required(),
    points: (0, yup_1.number)().min(0),
});
const RankUpdateSchemaValidation = (0, yup_1.object)().shape({
    id: (0, yup_1.string)().required().uuid(),
    name: (0, yup_1.string)().required(),
    points: (0, yup_1.number)().min(0),
});
router.get("/", (0, validate_1.validatePemissions)(["Rank.Read"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.headers["content-type"] === "application/json") {
            const ranks = (yield model_1.Rank.findAll()).map((r) => r.dataValues);
            return res.json({
                message: "Rank fetched.",
                data: {
                    ranks: ranks,
                },
            });
        }
        return res.render("admin/rank/index.html", { module: Module });
    }
    catch (error) {
        console.error(error);
        if (req.headers["content-type"] === "application/json") {
            return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Unknown error occured.",
                data: {},
            });
        }
        return res.render("admin/rank/index.html", { module: Module });
    }
}));
router.post("/", (0, validate_1.validateJSON)(RankAddSchemaValidation), (0, validate_1.validatePemissions)(["Rank.Create"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield model_1.Rank.create(req.body);
        return res.json({
            message: "Rank created.",
            data: {},
        });
    }
    catch (error) {
        console.error(error);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Unknown error occured.",
        });
    }
}));
router.put("/:id", (0, validate_1.validateJSON)(RankUpdateSchemaValidation), (0, validate_1.validatePemissions)(["Rank.Update"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield model_1.Rank.update({
            name: req.body.name,
            points: req.body.points,
        }, {
            where: {
                id: req.body.id,
            },
        });
        return res.json({
            message: "Rank updated.",
            data: {},
        });
    }
    catch (error) {
        console.error(error);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Unknown error occured.",
        });
    }
}));
router.delete("/:id", (0, validate_1.validatePemissions)(["Rank.Delete"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    console.log(id);
    try {
        yield model_1.Rank.destroy({
            where: {
                id: id,
            },
        });
        return res.json({
            message: "Rank deleted.",
            data: {},
        });
    }
    catch (error) {
        console.error(error);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Unknown error occured.",
        });
    }
}));
exports.default = router;
