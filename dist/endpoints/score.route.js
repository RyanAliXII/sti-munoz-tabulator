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
const http_status_codes_1 = require("http-status-codes");
const yup_1 = require("yup");
const validate_1 = require("./middewares/validate");
const Module = "Score";
const router = express_1.default.Router();
const ScoreValidationSchema = (0, yup_1.array)().of((0, yup_1.object)().shape({
    eventId: (0, yup_1.string)().required().uuid(),
    teamId: (0, yup_1.string)().required().uuid(),
    rankId: (0, yup_1.string)().required().uuid(),
    additionalPoints: (0, yup_1.number)().min(0).integer(),
}));
router.get("/", (0, validate_1.validatePemissions)(["Score.Update"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.headers["content-type"] === "application/json") {
        }
        res.render("admin/score/index.html", { module: Module });
    }
    catch (error) {
        console.error(error);
        if (req.headers["content-type"] === "application/json") {
            return res
                .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: "Unknown error occured", data: {} });
        }
        return res.render("admin/score/index.html", { module: Module });
    }
}));
router.post("/events", (0, validate_1.validatePemissions)(["Score.Update"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const scores = req.body;
        const data = (_a = scores.teams) === null || _a === void 0 ? void 0 : _a.map((team) => {
            var _a, _b;
            return {
                eventId: scores.event.id,
                teamId: team.id,
                rankId: team.score.rankId,
                additionalPoints: (_b = (_a = team === null || team === void 0 ? void 0 : team.score) === null || _a === void 0 ? void 0 : _a.additionalPoints) !== null && _b !== void 0 ? _b : 0,
            };
        });
        const parsedData = yield ScoreValidationSchema.validate(data);
        if (!parsedData) {
            throw "parsedData is undefined.";
        }
        yield model_1.Score.bulkCreate(parsedData, {
            updateOnDuplicate: ["teamId", "eventId", "additionalPoints", "rankId"],
        });
        return res.status(http_status_codes_1.StatusCodes.OK).json({});
    }
    catch (error) {
        console.log(error);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({});
    }
}));
router.get("/events/:eventId/teams", (0, validate_1.validatePemissions)(["Score.Update"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventId } = req.params;
    try {
        const data = yield model_1.Team.findAll({
            attributes: ["id", "name"],
            include: {
                model: model_1.Score,
                where: {
                    eventId: eventId,
                },
                attributes: ["id", "eventId", "teamId", "rankId", "additionalPoints"],
                include: [
                    {
                        model: model_1.Rank,
                        attributes: ["id", "points", "name", "classId"],
                        include: [
                            {
                                model: model_1.RankClass,
                                attributes: ["id", "name"],
                                include: [
                                    {
                                        model: model_1.Rank,
                                        attributes: ["id", "points", "name"],
                                    },
                                ],
                            },
                        ],
                    },
                ],
                required: false,
            },
        });
        const teams = data.map((d) => {
            const score = d.dataValues.score;
            if (score) {
                d.dataValues.score = d.dataValues.score.dataValues;
            }
            else {
                d.dataValues.score = {
                    id: "",
                    additionalPoints: 0,
                    eventId: "",
                    teamId: "",
                    rankId: "",
                    rank: {
                        id: "",
                        points: "",
                        name: "",
                        classId: "",
                        classification: {
                            id: "",
                            name: "",
                            ranks: [],
                        },
                    },
                };
            }
            return d.dataValues;
        });
        return res.json({
            message: "events fetched with scores and teams.",
            data: {
                teams,
            },
        });
    }
    catch (error) {
        console.error(error);
        return res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "Unknown error occured", data: {} });
    }
}));
exports.default = router;
