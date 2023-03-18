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
const acl_1 = require("../internal/acl/acl");
const express_1 = __importDefault(require("express"));
const yup_1 = require("yup");
const validate_1 = require("./middewares/validate");
const generate_password_1 = __importDefault(require("generate-password"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const model_1 = require("../models/model");
const http_status_codes_1 = require("http-status-codes");
const router = express_1.default.Router();
const Module = "Account";
const AccountCreateValidationSchema = (0, yup_1.object)().shape({
    email: (0, yup_1.string)().required().email(),
    surname: (0, yup_1.string)().required(),
    givenName: (0, yup_1.string)().required(),
    permissions: (0, yup_1.array)().of((0, yup_1.string)()).required().min(0),
});
const AccountUpdateValidationSchema = (0, yup_1.object)().shape({
    email: (0, yup_1.string)().required().email(),
    surname: (0, yup_1.string)().required(),
    givenName: (0, yup_1.string)().required(),
    permissions: (0, yup_1.array)().of((0, yup_1.string)()).required().min(0),
});
router.get("/", (0, validate_1.validatePemissions)(["Account.Read"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (req.headers["content-type"] == "application/json") {
        try {
            const users = yield model_1.User.findAll({
                attributes: ["id", "email", "surname", "givenName", "permissions"],
                where: {
                    isRoot: false,
                },
            });
            return res.json({
                message: "users fetched",
                data: {
                    accounts: (_a = users.map((user) => user.dataValues)) !== null && _a !== void 0 ? _a : [],
                },
            });
        }
        catch (error) {
            console.log(error);
            return res
                .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: "Unknown error occured." });
        }
    }
    return res.render("admin/account/index.html", {
        module: Module,
        permissions: acl_1.permissions,
    });
}));
router.post("/", (0, validate_1.validateJSON)(AccountCreateValidationSchema), (0, validate_1.validatePemissions)(["Account.Create"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const account = req.body;
        const generatedPassword = generate_password_1.default.generate({
            length: 10,
            strict: true,
        });
        const hashedPassword = yield bcrypt_1.default.hash(generatedPassword, 5);
        yield model_1.User.create(Object.assign(Object.assign({}, account), { password: hashedPassword }));
        return res.json({
            message: "Account Created.",
            data: {
                password: generatedPassword,
            },
        });
    }
    catch (error) {
        console.log(error);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Account creation failed.",
        });
    }
}));
router.delete("/:id", (0, validate_1.validatePemissions)(["Account.Delete"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        model_1.User.destroy({
            where: {
                id: id,
                isRoot: false,
            },
        });
        return res.json({
            message: "Account deleted.",
        });
    }
    catch (error) {
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Account creation failed.",
        });
    }
}));
router.put("/:id", (0, validate_1.validateJSON)(AccountUpdateValidationSchema), (0, validate_1.validatePemissions)(["Account.Update"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const account = req.body;
    try {
        model_1.User.update(account, {
            where: {
                id: account.id,
                isRoot: false,
            },
        });
        return res.json({
            message: "Account deleted.",
        });
    }
    catch (error) {
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Account creation failed.",
        });
    }
}));
exports.default = router;
