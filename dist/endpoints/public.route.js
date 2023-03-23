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
const router = express_1.default.Router();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const teams = yield model_1.Team.findAll({
        attributes: ["id", "name"],
    });
    return res.render("public/index.html", { teams: teams !== null && teams !== void 0 ? teams : [] });
}));
router.get("/p/leaderboard", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const teams = yield model_1.Team.findAll({
        attributes: ["id", "name"],
    });
    return res.render("public/leaderboard.html", { teams: teams !== null && teams !== void 0 ? teams : [] });
}));
router.get("/p/teams", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const teams = yield model_1.Team.findAll({
        attributes: ["id", "name"],
    });
    return res.render("public/teams.html", {
        teams: (_a = teams.map((t) => t.dataValues)) !== null && _a !== void 0 ? _a : [],
    });
}));
router.get("/p/teams/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const team = yield model_1.Team.findOne({
            attributes: ["name", "id"],
            where: {
                id: id,
            },
        });
        const events = yield model_1.Event.findAll({
            attributes: ["id", "name", "date"],
            include: {
                model: model_1.Score,
                required: false,
                where: {
                    teamId: id,
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
                      ORDER BY (COALESCE("score->rank".points, 0) + COALESCE("score"."additionalPoints", 0)) DESC
                  ))`),
                        "position",
                    ],
                ],
            },
        });
        const overall = yield model_1.Score.findOne({
            where: {
                teamId: id,
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
        return res.render("public/team.html", {
            team: team === null || team === void 0 ? void 0 : team.dataValues,
            events: events.map((e) => {
                var _a;
                return (Object.assign(Object.assign({}, e.dataValues), { score: (_a = e.dataValues.score) === null || _a === void 0 ? void 0 : _a.dataValues }));
            }),
            overall: overall
                ? overall.dataValues
                : {
                    team: team,
                    position: 0,
                    totalPoints: 0,
                },
        });
    }
    catch (error) {
        console.log(error);
        return res.render("error/public/404.html", {});
    }
}));
exports.default = router;
