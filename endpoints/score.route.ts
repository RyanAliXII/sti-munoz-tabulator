import { Event, Rank, RankClass, Score, Team } from "@models/model";
import { TeamScore, EventType } from "definitions/types";
import express from "express";
import { StatusCodes } from "http-status-codes";
import { array, number, object, string } from "yup";
import { validatePemissions } from "./middewares/validate";

const Module = "Score";

const router = express.Router();

type ScoreType = {
  event: EventType;
  teams: TeamScore[];
};

const ScoreValidationSchema = array().of(
  object().shape({
    eventId: string().required().uuid(),
    teamId: string().required().uuid(),
    rankId: string().required().uuid(),
    additionalPoints: number().min(0),
  })
);
router.get("/", validatePemissions(["Score.Update"]), async (req, res) => {
  try {
    if (req.headers["content-type"] === "application/json") {
    }
    res.render("admin/score/index.html", { module: Module });
  } catch (error) {
    console.error(error);
    if (req.headers["content-type"] === "application/json") {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Unknown error occured", data: {} });
    }
    return res.render("admin/score/index.html", { module: Module });
  }
});

router.post(
  "/events",
  validatePemissions(["Score.Update"]),
  async (req, res) => {
    try {
      const scores = req.body as ScoreType;
      const data = scores.teams?.map((team) => {
        return {
          eventId: scores.event.id,
          teamId: team.id,
          rankId: team.score.rankId,
          additionalPoints: team?.score?.additionalPoints ?? 0,
        };
      });
      const parsedData = await ScoreValidationSchema.validate(data);
      if (!parsedData) {
        throw "parsedData is undefined.";
      }
      await Score.bulkCreate(parsedData, {
        updateOnDuplicate: ["teamId", "eventId", "additionalPoints", "rankId"],
      });
      return res.status(StatusCodes.OK).json({});
    } catch (error) {
      console.log(error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({});
    }
  }
);
router.get(
  "/events/:eventId/teams",
  validatePemissions(["Score.Update"]),
  async (req, res) => {
    const { eventId } = req.params;
    try {
      const data = await Team.findAll({
        attributes: ["id", "name"],
        include: {
          model: Score,
          where: {
            eventId: eventId,
          },
          attributes: ["id", "eventId", "teamId", "rankId", "additionalPoints"],
          include: [
            {
              model: Rank,
              attributes: ["id", "points", "name", "classId"],
              include: [
                {
                  model: RankClass,
                  attributes: ["id", "name"],
                  include: [
                    {
                      model: Rank,
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
        } else {
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
    } catch (error) {
      console.error(error);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Unknown error occured", data: {} });
    }
  }
);

export default router;
