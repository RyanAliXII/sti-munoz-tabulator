import { Score, Team, Event, Rank } from "@models/model";
import sequelize from "@models/sequelize";
import { json } from "body-parser";
import { group } from "console";
import express from "express";
import { StatusCodes } from "http-status-codes";
const router = express.Router();

const Module = "Leaderboard";
router.get("/", (req, res) => {
  return res.render("admin/leaderboard/index.html", { module: Module });
});
router.get("/:eventId", async (req, res) => {
  const { eventId } = req.params;
  try {
    const data = await Team.findAll({
      attributes: ["id", "name"],
      include: {
        model: Score,
        where: {
          eventId: eventId,
        },
        include: [
          {
            model: Event,
            required: false,
          },
          {
            model: Rank,
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
            sequelize.literal(
              `COALESCE("score->rank".points, 0) + COALESCE("score"."additionalPoints", 0)`
            ),
            "totalPoints",
          ],
          [
            sequelize.literal(`
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
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Unknown error occured", data: {} });
  }
});

router.get("/rank/overall", async (req, res) => {
  try {
    const scores = await Score.findAll({
      attributes: [
        "team.id",
        "team.name",
        [
          sequelize.fn(
            "sum",
            sequelize.literal(`"rank"."points" + "score"."additionalPoints"`)
          ),
          "totalPoints",
        ],
        [
          sequelize.literal(`
               ( DENSE_RANK () OVER ( 
                    ORDER BY (sum("rank"."points" + "score"."additionalPoints")) DESC
                ))`),
          "position",
        ],
      ],
      include: [
        {
          model: Team,
          required: true,
          attributes: ["id", "name"],
        },
        {
          model: Rank,
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
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Unknown error occured", data: {} });
  }
});
export default router;
