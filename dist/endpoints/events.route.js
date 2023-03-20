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
const express_1 = __importDefault(require("express"));
const http_status_codes_1 = require("http-status-codes");
const yup_1 = require("yup");
const validate_1 = require("./middewares/validate");
const router = express_1.default.Router();
const Module = "Event";
const EventCreateSchemaValidation = (0, yup_1.object)().shape({
    name: (0, yup_1.string)().required(),
    date: (0, yup_1.date)().required(),
});
const EventUpdateSchemaValidation = (0, yup_1.object)().shape({
    id: (0, yup_1.string)().required().uuid(),
    name: (0, yup_1.string)().required(),
    date: (0, yup_1.date)().required(),
});
router.get("/", (0, validate_1.validatePemissions)(["Event.Read"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const events = yield model_1.Event.findAll({
            attributes: ["id", "name", "date"],
        });
        if (req.headers["content-type"] === "application/json") {
            return res.json({
                message: "Events fetched",
                data: {
                    events: events,
                },
            });
        }
        res.render("admin/event/index.html", {
            module: Module,
            events: (_a = events === null || events === void 0 ? void 0 : events.map((e) => e.dataValues)) !== null && _a !== void 0 ? _a : [],
        });
    }
    catch (error) {
        if (req.headers["content-type"] === "application/json") {
            return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Events fetched",
                data: {},
            });
        }
        return res.render("error/500.html", {
            module: Module,
        });
    }
}));
router.post("/", (0, validate_1.validateJSON)(EventCreateSchemaValidation), (0, validate_1.validatePemissions)(["Event.Create"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield model_1.Event.create(req.body);
        return res
            .status(http_status_codes_1.StatusCodes.OK)
            .json({ message: "Event created successfully", data: {} });
    }
    catch (error) {
        console.error(error);
        return res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "Unknown error occured.", data: {} });
    }
}));
router.put("/:id", (0, validate_1.validateJSON)(EventUpdateSchemaValidation), (0, validate_1.validatePemissions)(["Event.Update"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const event = req.body;
        yield model_1.Event.update({
            name: event.name,
            date: event.date,
        }, {
            where: {
                id: event.id,
            },
        });
        return res
            .status(http_status_codes_1.StatusCodes.OK)
            .json({ message: "Event updated successfully", data: {} });
    }
    catch (error) {
        console.error(error);
        return res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "Unknown error occured.", data: {} });
    }
}));
router.delete("/:id", (0, validate_1.validatePemissions)(["Event.Update"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        yield model_1.Event.destroy({
            where: {
                id: id,
            },
        });
        return res.status(http_status_codes_1.StatusCodes.OK).json({ messsage: "Event deleted." });
    }
    catch (error) {
        console.error(error);
        return res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "Unknown error occured" });
    }
}));
exports.default = router;
