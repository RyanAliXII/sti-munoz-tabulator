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
router.get("/teams", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const teams = (yield model_1.Team.findAll({ attributes: ["id", "name"] })).map((t) => t.dataValues);
        return res.json({
            message: "Teams fetched.",
            data: {
                teams: teams !== null && teams !== void 0 ? teams : [],
            },
        });
    }
    catch (error) {
        console.error(error);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Unknown error occured.",
            data: {
                teams: [],
            },
        });
    }
}));
router.get("/teams/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const team = yield model_1.Team.findOne({
            attributes: ["id", "name"],
            where: {
                id: id,
            },
        });
        return res.json({
            message: "Team fetched.",
            data: {
                team: team !== null && team !== void 0 ? team : {},
            },
        });
    }
    catch (error) {
        console.error(error);
        return res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "Unknown error occured.", data: {} });
    }
}));
router.get("/events", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = yield model_1.Event.findAll({
            attributes: ["id", "name", "date"],
        });
        return res.json({
            message: "Events fetched.",
            data: {
                events: events !== null && events !== void 0 ? events : [],
            },
        });
    }
    catch (error) {
        console.error(error);
        return res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "Unknown error occured.", data: {} });
    }
}));
router.get("/events/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const events = yield model_1.Event.findOne({
            attributes: ["id", "name", "date"],
            where: {
                id: id,
            },
        });
        return res.json({
            message: "Event fetched.",
            data: {
                event: events !== null && events !== void 0 ? events : [],
            },
        });
    }
    catch (error) {
        console.error(error);
        return res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "Unknown error occured.", data: {} });
    }
}));
router.get("/leaderboard/events/:eventId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                        attributes: ["id", "name", "date"],
                    },
                    {
                        model: model_1.Rank,
                        attributes: ["id", "name", "points"],
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
                        sequelize_1.default.literal(`("score->rank".points + "score"."additionalPoints")`),
                        "totalPoints",
                    ],
                    [
                        sequelize_1.default.literal(`
                 ( DENSE_RANK () OVER ( 
                      ORDER BY ("score->rank".points + "score"."additionalPoints") DESC
                  ))`),
                        "position",
                    ],
                ],
                required: false,
            },
        });
        return res.json({
            message: "Scores fetched with teams grouped by event.",
            data: {
                leaderboard: data.map((d) => d.dataValues),
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
router.get("/leaderboard/teams/:teamId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { teamId } = req.params;
    try {
        const data = yield model_1.Event.findAll({
            attributes: ["id", "name", "date"],
            include: {
                model: model_1.Score,
                required: false,
                where: {
                    teamId: teamId,
                },
                include: [
                    {
                        model: model_1.Team,
                        attributes: ["id", "name"],
                    },
                    {
                        model: model_1.Rank,
                        attributes: ["id", "name", "points"],
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
                        sequelize_1.default.literal(`("score->rank".points + "score"."additionalPoints")`),
                        "totalPoints",
                    ],
                    [
                        sequelize_1.default.literal(`
                   ( DENSE_RANK () OVER ( 
                        ORDER BY ("score->rank".points + "score"."additionalPoints") DESC
                    ))`),
                        "position",
                    ],
                ],
            },
        });
        return res.json({
            message: "Scores fetched with event grouped by team.",
            data: {
                leaderboard: (_a = data.map((d) => d.dataValues)) !== null && _a !== void 0 ? _a : [],
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
router.get("/leaderboard/overall", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            message: "Teams overall scores fetched.",
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
router.get("/leaderboard/overall/teams/:teamId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { teamId } = req.params;
    try {
        const score = yield model_1.Score.findOne({
            where: {
                teamId: teamId,
            },
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
        return res.json({
            message: "Team overall scores fetched.",
            data: {
                score: (_b = score === null || score === void 0 ? void 0 : score.dataValues) !== null && _b !== void 0 ? _b : {},
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
