import { Rank, RankClass, Score } from "@models/model";
import express from "express";
import { array, number, object, string } from "yup";
import { validateJSON, validatePemissions } from "./middewares/validate";
import { StatusCodes } from "http-status-codes";
import { RankType } from "@definitions/types";
import { Model } from "sequelize";

const Module = "Rank";

const router = express.Router();

const CreateClassificationSchemaValidation = object().shape({
  name: string().required(),
  ranks: array()
    .of(
      object().shape({
        name: string().required(),
        points: number().integer().min(0),
      })
    )
    .min(1),
});

const UpdateClassificationSchemaValidation = object().shape({
  id: string().required().uuid(),
  name: string().required(),
  ranks: array()
    .of(
      object().shape({
        name: string().required(),
        points: number().integer().min(0),
      })
    )
    .min(1),
});
router.get("/", validatePemissions(["Rank.Read"]), async (req, res) => {
  try {
    if (req.headers["content-type"] === "application/json") {
      const rankClasses = await RankClass.findAll({
        attributes: ["id", "name"],
      });
      return res.json({
        message: "Classifications fetched.",
        data: {
          classifications: rankClasses.map((d) => d.dataValues),
        },
      });
    }
    return res.render("admin/classification/index.html", { module: Module });
  } catch (error) {
    console.error(error);
    if (req.headers["content-type"] === "application/json") {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Unknown error occured.",
        data: {},
      });
    }
    return res.render("admin/classification/index.html", { module: Module });
  }
});
router.get("/create", (req, res) => {
  return res.render("admin/classification/create-class.html", {
    module: Module,
  });
});

router.get("/edit/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const rankClass = await RankClass.findOne({
      attributes: ["id", "name"],
      where: {
        id: id,
      },
      include: [
        {
          attributes: ["id", "name", "points"],
          model: Rank,
        },
      ],
    });
    console.log(rankClass);
    return res.render("admin/classification/edit-class.html", {
      module: Module,
      classification: rankClass?.dataValues,
    });
  } catch {
    return res.render("error/404.html");
  }
});

router.get("/", async (req, res) => {
  try {
    const rankClasses = await RankClass.findAll({
      attributes: ["id", "name"],
    });
    return res.json({
      message: "Classifications fetched.",
      data: {
        classifications: rankClasses.map((d) => d.dataValues),
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({});
  }
});

router.get("/:id/ranks", async (req, res) => {
  const { id } = req.params;
  try {
    const ranks = await Rank.findAll({
      attributes: ["id", "name", "points"],
      where: {
        classId: id,
      },
    });
    return res.json({
      message: "Ranks by classification fetched.",
      data: {
        ranks: ranks.map((d) => d.dataValues),
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({});
  }
});

router.put(
  "/:id",
  validateJSON(UpdateClassificationSchemaValidation),
  async (req, res) => {
    const rankClass = req.body;
    console.log(rankClass);
    try {
      await RankClass.update(
        { name: rankClass.name, id: rankClass.id },
        {
          where: {
            id: rankClass.id,
          },
        }
      );
      await Rank.destroy({
        where: {
          classId: rankClass.id,
        },
      });
      await Rank.bulkCreate(
        rankClass.ranks.map((r: RankType) => ({ ...r, classId: rankClass.id }))
      );
      return res.json({
        message: "classification has been updated.",
        data: {},
      });
    } catch (error) {
      console.log(error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({});
    }
  }
);
router.post(
  "/",
  validateJSON(CreateClassificationSchemaValidation),
  async (req, res) => {
    try {
      const classification = req.body;
      const data = await RankClass.create({
        name: classification.name,
      });
      const insertedClass = data.dataValues;
      const ranks = classification.ranks.map((r: RankType) => ({
        ...r,
        classId: insertedClass.id,
      }));

      await Rank.bulkCreate(ranks);
      return res.json({
        message: "Rank class created.",
        data: {},
      });
    } catch (error) {
      console.log(error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Unknown error occured.",
      });
    }
  }
);

export default router;