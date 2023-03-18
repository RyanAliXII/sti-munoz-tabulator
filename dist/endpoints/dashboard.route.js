"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const Module = "Dashboard";
router.get("/", (req, res) => {
    return res.render("admin/dashboard.html", { module: Module });
});
exports.default = router;
