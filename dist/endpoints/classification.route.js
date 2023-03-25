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
const CreateClassificationSchemaValidation = (0, yup_1.object)().shape({
    name: (0, yup_1.string)().required(),
    ranks: (0, yup_1.array)()
        .of((0, yup_1.object)().shape({
        name: (0, yup_1.string)().required(),
        points: (0, yup_1.number)().min(0),
    }))
        .min(1),
});
const UpdateClassificationSchemaValidation = (0, yup_1.object)().shape({
    id: (0, yup_1.string)().required().uuid(),
    name: (0, yup_1.string)().required(),
    ranks: (0, yup_1.array)()
        .of((0, yup_1.object)().shape({
        name: (0, yup_1.string)().required(),
        points: (0, yup_1.number)().min(0),
    }))
        .min(1),
});
router.get("/", (0, validate_1.validatePemissions)(["Class.Read"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.headers["content-type"] === "application/json") {
            const rankClasses = yield model_1.RankClass.findAll({
                attributes: ["id", "name"],
                include: [
                    {
                        model: model_1.Rank,
                        attributes: ["id", "name", "points"],
                    },
                ],
            });
            return res.json({
                message: "Classifications fetched.",
                data: {
                    classifications: rankClasses.map((d) => d.dataValues),
                },
            });
        }
        return res.render("admin/classification/index.html", { module: Module });
    }
    catch (error) {
        console.error(error);
        if (req.headers["content-type"] === "application/json") {
            return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Unknown error occured.",
                data: {},
            });
        }
        return res.render("admin/classification/index.html", { module: Module });
    }
}));
router.get("/create", (0, validate_1.validatePemissions)(["Class.Create"]), (req, res) => {
    return res.render("admin/classification/create-class.html", {
        module: Module,
    });
});
router.get("/edit/:id", (0, validate_1.validatePemissions)(["Class.Update"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const rankClass = yield model_1.RankClass.findOne({
            attributes: ["id", "name"],
            where: {
                id: id,
            },
            include: [
                {
                    attributes: ["id", "name", "points"],
                    model: model_1.Rank,
                },
            ],
        });
        console.log(rankClass);
        return res.render("admin/classification/edit-class.html", {
            module: Module,
            classification: rankClass === null || rankClass === void 0 ? void 0 : rankClass.dataValues,
        });
    }
    catch (_a) {
        return res.render("error/404.html");
    }
}));
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rankClasses = yield model_1.RankClass.findAll({
            attributes: ["id", "name"],
        });
        return res.json({
            message: "Classifications fetched.",
            data: {
                classifications: rankClasses.map((d) => d.dataValues),
            },
        });
    }
    catch (error) {
        console.log(error);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({});
    }
}));
router.get("/:id/ranks", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const ranks = yield model_1.Rank.findAll({
            attributes: ["id", "name", "points"],
            where: {
                classId: id,
            },
        });
        return res.json({
            message: "Ranks by classification fetched.",
            data: {
                ranks: ranks.map((d) => d.dataValues),
            },
        });
    }
    catch (error) {
        console.log(error);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({});
    }
}));
router.put("/:id", (0, validate_1.validatePemissions)(["Class.Update"]), (0, validate_1.validateJSON)(UpdateClassificationSchemaValidation), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rankClass = req.body;
    console.log(rankClass);
    try {
        yield model_1.RankClass.update({ name: rankClass.name, id: rankClass.id }, {
            where: {
                id: rankClass.id,
            },
        });
        yield model_1.Rank.destroy({
            where: {
                classId: rankClass.id,
            },
        });
        yield model_1.Rank.bulkCreate(rankClass.ranks.map((r) => (Object.assign(Object.assign({}, r), { classId: rankClass.id }))));
        return res.json({
            message: "classification has been updated.",
            data: {},
        });
    }
    catch (error) {
        console.log(error);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({});
    }
}));
router.post("/", (0, validate_1.validatePemissions)(["Class.Create"]), (0, validate_1.validateJSON)(CreateClassificationSchemaValidation), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const classification = req.body;
        const data = yield model_1.RankClass.create({
            name: classification.name,
        });
        const insertedClass = data.dataValues;
        const ranks = classification.ranks.map((r) => (Object.assign(Object.assign({}, r), { classId: insertedClass.id })));
        yield model_1.Rank.bulkCreate(ranks);
        return res.json({
            message: "Rank class created.",
            data: {},
        });
    }
    catch (error) {
        console.log(error);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Unknown error occured.",
        });
    }
}));
exports.default = router;
