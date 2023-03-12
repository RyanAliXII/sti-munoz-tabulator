import { Rank } from "@models/model";
import express from "express";
import { number, object, string } from "yup";
import { validateJSON } from "./middewares/validate";
import { StatusCodes } from "http-status-codes";

const Module = "Rank";

const router = express.Router();

const RankAddSchemaValidation = object().shape({
  name: string().required(),
  points: number().min(0),
});

const RankUpdateSchemaValidation = object().shape({
  id: string().required().uuid(),
  name: string().required(),
  points: number().min(0),
});

router.get("/", async (req, res) => {
  try {
    if (req.headers["content-type"] === "application/json") {
      const ranks = (await Rank.findAll()).map((r) => r.dataValues);
      return res.json({
        message: "Rank fetched.",
        data: {
          ranks: ranks,
        },
      });
    }
    return res.render("admin/rank/index.html", { module: Module });
  } catch (error) {
    console.error(error);
    if (req.headers["content-type"] === "application/json") {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Unknown error occured.",
        data: {},
      });
    }
    return res.render("admin/rank/index.html", { module: Module });
  }
});
router.post("/", validateJSON(RankAddSchemaValidation), async (req, res) => {
  try {
    await Rank.create(req.body);
    return res.json({
      message: "Rank created.",
      data: {},
    });
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Unknown error occured.",
    });
  }
});
router.put(
  "/:id",
  validateJSON(RankUpdateSchemaValidation),
  async (req, res) => {
    try {
      await Rank.update(
        {
          name: req.body.name,
          points: req.body.points,
        },
        {
          where: {
            id: req.body.id,
          },
        }
      );
      return res.json({
        message: "Rank updated.",
        data: {},
      });
    } catch (error) {
      console.error(error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Unknown error occured.",
      });
    }
  }
);
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    await Rank.destroy({
      where: {
        id: id,
      },
    });
    return res.json({
      message: "Rank deleted.",
      data: {},
    });
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Unknown error occured.",
    });
  }
});

export default router;
