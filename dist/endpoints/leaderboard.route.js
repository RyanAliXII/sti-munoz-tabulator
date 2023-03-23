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
const sequelize_1 = __importDefault(require("../models/sequelize"));
const express_1 = __importDefault(require("express"));
const http_status_codes_1 = require("http-status-codes");
const router = express_1.default.Router();
const Module = "Leaderboard";
router.get("/", (req, res) => {
    return res.render("admin/leaderboard/index.html", { module: Module });
});
router.get("/:eventId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventId } = req.params;
    try {
        const data = yield model_1.Team.findAll({
            attributes: ["id", "name"],
            include: {
                model: model_1.Score,
                where: {
                    eventId: eventId,
                },
                include: [
                    {
                        model: model_1.Event,
                        required: false,
                    },
                    {
                        model: model_1.Rank,
                        required: false,
                    },
                ],
                attributes: [
                    "id",
                    "eventId",
                    "teamId",
                    "rankId",
                    "additionalPoints",
                    [
                        sequelize_1.default.literal(`COALESCE("score->rank".points, 0) + COALESCE("score"."additionalPoints", 0)`),
                        "totalPoints",
                    ],
                    [
                        sequelize_1.default.literal(`
               ( DENSE_RANK () OVER ( 
                    ORDER BY (COALESCE("score->rank".points, 0) + COALESCE("score"."additionalPoints", 0)) DESC
                ))`),
                        "position",
                    ],
                ],
                required: false,
            },
        });
        return res.json({
            message: "events fetched with scores and teams.",
            data: {
                teams: data.map((d) => d.dataValues),
            },
        });
    }
    catch (error) {
        console.log(error);
        return res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "Unknown error occured", data: {} });
    }
}));
router.get("/rank/overall", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const scores = yield model_1.Score.findAll({
            attributes: [
                "team.id",
                "team.name",
                [
                    sequelize_1.default.fn("sum", sequelize_1.default.literal(`"rank"."points" + "score"."additionalPoints"`)),
                    "totalPoints",
                ],
                [
                    sequelize_1.default.literal(`
               ( DENSE_RANK () OVER ( 
                    ORDER BY (sum("rank"."points" + "score"."additionalPoints")) DESC
                ))`),
                    "position",
                ],
            ],
            include: [
                {
                    model: model_1.Team,
                    required: true,
                    attributes: ["id", "name"],
                },
                {
                    model: model_1.Rank,
                    required: true,
                    attributes: [],
                },
            ],
            group: ["team.id"],
        });
        console.log(scores);
        return res.json({
            message: "events fetched with scores and teams.",
            data: {
                scores: scores.map((d) => d.dataValues),
            },
        });
    }
    catch (error) {
        console.log(error);
        return res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "Unknown error occured", data: {} });
    }
}));
exports.default = router;
