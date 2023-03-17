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
const express_1 = __importDefault(require("express"));
const validate_1 = require("./middewares/validate");
const yup_1 = require("yup");
const model_1 = require("../models/model");
const bcrypt_1 = require("bcrypt");
const router = express_1.default.Router();
const LoginSchemaValidation = (0, yup_1.object)().shape({
    email: (0, yup_1.string)().required().email(),
    password: (0, yup_1.string)().required(),
});
router.get("/", (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.log(error);
        }
        return res.render("admin/login.html");
    });
});
router.post("/", (0, validate_1.validateAndRedirectOnFail)(LoginSchemaValidation, "Username and password cannot be empty", "/login"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const body = req.body;
    const user = yield model_1.User.findOne({
        where: {
            email: body.email,
        },
    });
    if (!user) {
        return res.redirect("/login");
    }
    const password = ((_a = user.get("password")) !== null && _a !== void 0 ? _a : "");
    try {
        const isPasswordSame = yield (0, bcrypt_1.compare)(body.password, password);
        if (isPasswordSame) {
            req.session.user = user.dataValues;
            req.session.save();
            return res.redirect("/dashboard");
        }
        return res.redirect("/login");
    }
    catch (error) {
        console.log(error);
    }
    return res.redirect("/dashboard");
}));
exports.default = router;
