import express from "express";
import { object, string } from "yup";
import { validateJSON, validatePemissions } from "./middewares/validate";
import { Team } from "@models/model";
import { StatusCodes } from "http-status-codes";
const router = express.Router();

const Module = "Team";

const TeamCreateSchemaValidation = object().shape({
  name: string().required(),
});
const TeamUpdateSchemaValidation = object().shape({
  id: string().required().uuid(),
  name: string().required(),
});

router.get("/", validatePemissions(["Team.Read"]), async (req, res) => {
  try {
    if (req.headers["content-type"] == "application/json") {
      const teams = (await Team.findAll()).map((t) => t.dataValues);
      return res.json({
        message: "Teams fetched.",
        data: {
          teams: teams ?? [],
        },
      });
    }
    return res.render("admin/team/index.html", {
      module: Module,
    });
  } catch (error) {
    console.error(error);
    if (req.headers["content-type"] === "application/json") {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Unknown error occured.",
        data: {
          teams: [],
        },
      });
    }
    return res.render("admin/team/index.html", {
      module: Module,
    });
  }
});

router.post(
  "/",
  validateJSON(TeamCreateSchemaValidation),
  validatePemissions(["Team.Create"]),
  async (req, res) => {
    try {
      await Team.create(req.body);
      return res.json({ message: "Team created.", data: {} });
    } catch (error) {
      console.error(error);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Unknown error occured.", data: {} });
    }
  }
);
router.put(
  "/:id",
  validateJSON(TeamUpdateSchemaValidation),
  validatePemissions(["Team.Update"]),
  async (req, res) => {
    try {
      const team = req.body;
      await Team.update(
        {
          name: team.name,
        },
        {
          where: {
            id: team.id,
          },
        }
      );
      return res.json({ message: "Team updated.", data: {} });
    } catch (error) {
      console.error(error);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Unknown error occured.", data: {} });
    }
  }
);
router.delete("/:id", validatePemissions(["Team.Delete"]), async (req, res) => {
  const id = req.params.id;
  try {
    await Team.destroy({
      where: {
        id: id,
      },
    });
    return res.json({ message: "Team deleted.", data: {} });
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Unknown error occured.", data: {} });
  }
});
export default router;
