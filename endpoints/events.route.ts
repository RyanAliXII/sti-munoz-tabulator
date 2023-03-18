import { Event } from "@models/model";
import { name } from "ejs";
import express from "express";
import { StatusCodes } from "http-status-codes";
import { date, object, string } from "yup";
import { validateJSON, validatePemissions } from "./middewares/validate";
const router = express.Router();

const Module = "Event";

const EventCreateSchemaValidation = object().shape({
  name: string().required(),
  date: date().required(),
});

const EventUpdateSchemaValidation = object().shape({
  id: string().required().uuid(),
  name: string().required(),
  date: date().required(),
});

router.get("/", validatePemissions(["Event.Read"]), async (req, res) => {
  try {
    if (req.headers["content-type"] === "application/json") {
      const events = (await Event.findAll()).map((e) => e.dataValues);
      return res.json({ data: { events: events } });
    }
    res.render("admin/event/index.html", {
      module: Module,
    });
  } catch (error) {
    console.error(error);
    if (req.headers["content-type"] === "application/json") {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Unknown error occured",
        data: {
          events: [],
        },
      });
    }
    return res.render("admin/event/index.html", {
      module: Module,
    });
  }
});
router.post(
  "/",
  validateJSON(EventCreateSchemaValidation),
  async (req, res) => {
    try {
      await Event.create(req.body);
      return res
        .status(StatusCodes.OK)
        .json({ message: "Event created successfully", data: {} });
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
  validateJSON(EventUpdateSchemaValidation),
  async (req, res) => {
    try {
      const event = req.body;
      await Event.update(
        {
          name: event.name,
          date: event.date,
        },
        {
          where: {
            id: event.id,
          },
        }
      );
      return res
        .status(StatusCodes.OK)
        .json({ message: "Event updated successfully", data: {} });
    } catch (error) {
      console.error(error);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Unknown error occured.", data: {} });
    }
  }
);
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await Event.destroy({
      where: {
        id: id,
      },
    });
    return res.status(StatusCodes.OK).json({ messsage: "Event deleted." });
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Unknown error occured" });
  }
});
export default router;
