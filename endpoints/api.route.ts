import { Event, Rank, Score, Team } from "@models/model";
import sequelize from "@models/sequelize";
import express from "express";
import { StatusCodes } from "http-status-codes";

const router = express.Router();

router.get("/teams", async (req, res) => {
  try {
    const teams = (await Team.findAll({ attributes: ["id", "name"] })).map(
      (t) => t.dataValues
    );
    return res.json({
      message: "Teams fetched.",
      data: {
        teams: teams ?? [],
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Unknown error occured.",
      data: {
        teams: [],
      },
    });
  }
});

router.get("/teams/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const team = await Team.findOne({
      attributes: ["id", "name"],
      where: {
        id: id,
      },
    });

    return res.json({
      message: "Team fetched.",
      data: {
        team: team ?? {},
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Unknown error occured.", data: {} });
  }
});

router.get("/events", async (req, res) => {
  try {
    const events = await Event.findAll({
      attributes: ["id", "name", "date"],
    });
    return res.json({
      message: "Events fetched.",
      data: {
        events: events ?? [],
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Unknown error occured.", data: {} });
  }
});

router.get("/events/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const events = await Event.findOne({
      attributes: ["id", "name", "date"],
      where: {
        id: id,
      },
    });
    return res.json({
      message: "Event fetched.",
      data: {
        event: events ?? [],
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Unknown error occured.", data: {} });
  }
});
router.get("/leaderboard/events/:eventId", async (req, res) => {
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
            attributes: ["id", "name", "date"],
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
        required: false,
      },
    });

    return res.json({
      message: "Scores fetched with teams grouped by event.",
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

router.get("/leaderboard/teams/:teamId/events", async (req, res) => {
  const { teamId } = req.params;
  try {
    const data = await Event.findAll({
      attributes: ["id", "name", "date"],
      include: {
        model: Score,
        required: false,
        where: {
          teamId: teamId,
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
    return res.json({
      message: "Scores fetched with event grouped by team.",
      data: {
        events: data.map((d) => d.dataValues) ?? [],
      },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Unknown error occured", data: {} });
  }
});

router.get("/leaderboard/overall", async (req, res) => {
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

    return res.json({
      message: "Teams overall scores fetched.",
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

router.get("/leaderboard/overall/teams/:teamId", async (req, res) => {
  const { teamId } = req.params;
  try {
    const score = await Score.findOne({
      where: {
        teamId: teamId,
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

    return res.json({
      message: "Team overall scores fetched.",
      data: {
        score: score?.dataValues ?? {},
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
