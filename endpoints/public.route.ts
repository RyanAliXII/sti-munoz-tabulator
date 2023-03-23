import { Event, Rank, Score, Team } from "@models/model";
import sequelize from "@models/sequelize";
import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
  const teams = await Team.findAll({
    attributes: ["id", "name"],
  });
  return res.render("public/index.html", { teams: teams ?? [] });
});
router.get("/p/leaderboard", async (req, res) => {
  const teams = await Team.findAll({
    attributes: ["id", "name"],
  });
  return res.render("public/leaderboard.html", { teams: teams ?? [] });
});
router.get("/p/teams", async (req, res) => {
  const teams = await Team.findAll({
    attributes: ["id", "name"],
  });
  return res.render("public/teams.html", {
    teams: teams.map((t) => t.dataValues) ?? [],
  });
});
router.get("/p/teams/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const team = await Team.findOne({
      attributes: ["name", "id"],
      where: {
        id: id,
      },
    });
    const events = await Event.findAll({
      attributes: ["id", "name", "date"],
      include: {
        model: Score,
        required: false,
        where: {
          teamId: id,
        },
        include: [
          {
            model: Team,
            attributes: ["id", "name"],
          },
          {
            model: Rank,
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
            sequelize.literal(
              `("score->rank".points + "score"."additionalPoints")`
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
      },
    });
    const overall = await Score.findOne({
      where: {
        teamId: id,
      },
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

    return res.render("public/team.html", {
      team: team?.dataValues,
      events: events.map((e) => ({
        ...e.dataValues,
        score: e.dataValues.score?.dataValues,
      })),
      overall: overall
        ? overall.dataValues
        : {
            team: team,
            position: 0,
            totalPoints: 0,
          },
    });
  } catch (error) {
    console.log(error);
    return res.render("error/public/404.html", {});
  }
});

export default router;
