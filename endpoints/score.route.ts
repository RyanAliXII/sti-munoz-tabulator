import { Event, Rank, Score, Team } from "@models/model";
import express from "express";
import { StatusCodes } from "http-status-codes";

const Module = "Score";

const router = express.Router();

router.get("/", async (req, res) => {
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
    res.render("admin/score/index.html", { module: Module });
  }
});

router.get("/events/:eventId", async (req, res) => {
  try {
    const data = await Team.findAll({
      include: [
        {
          model: Score,
          attributes: ["eventId", "rankId"],
          required: false,
          include: [{ model: Event, required: false }],
        },
      ],
    });

    console.log(data);
    return res.json({
      message: "events fetched with scores and teams.",
      data: [],
    });
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Unknown error occured", data: {} });
  }
});

export default router;
