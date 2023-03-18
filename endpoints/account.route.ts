import { permissions } from "@internal/acl/acl";
import express from "express";
import { array, object, string } from "yup";
import { validateJSON, validatePemissions } from "./middewares/validate";
import generator from "generate-password";
import bcrypt from "bcrypt";
import { User } from "@models/model";
import { StatusCodes } from "http-status-codes";
import { json } from "body-parser";
const router = express.Router();
const Module = "Account";
const AccountCreateValidationSchema = object().shape({
  email: string().required().email(),
  surname: string().required(),
  givenName: string().required(),
  permissions: array().of(string()).required().min(0),
});

const AccountUpdateValidationSchema = object().shape({
  email: string().required().email(),
  surname: string().required(),
  givenName: string().required(),
  permissions: array().of(string()).required().min(0),
});
router.get("/", validatePemissions(["Account.Read"]), async (req, res) => {
  if (req.headers["content-type"] == "application/json") {
    try {
      const users = await User.findAll({
        attributes: ["id", "email", "surname", "givenName", "permissions"],
        where: {
          isRoot: false,
        },
      });
      return res.json({
        message: "users fetched",
        data: {
          accounts: users.map((user) => user.dataValues) ?? [],
        },
      });
    } catch (error) {
      console.log(error);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Unknown error occured." });
    }
  }
  return res.render("admin/account/index.html", {
    module: Module,
    permissions: permissions,
  });
});
router.post(
  "/",
  validateJSON(AccountCreateValidationSchema),
  async (req, res) => {
    try {
      const account = req.body;
      const generatedPassword = generator.generate({
        length: 10,
        strict: true,
      });
      const hashedPassword = await bcrypt.hash(generatedPassword, 5);
      await User.create({ ...account, password: hashedPassword });
      return res.json({
        message: "Account Created.",
        data: {
          password: generatedPassword,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Account creation failed.",
      });
    }
  }
);

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    User.destroy({
      where: {
        id: id,
        isRoot: false,
      },
    });
    return res.json({
      message: "Account deleted.",
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Account creation failed.",
    });
  }
});

router.put(
  "/:id",
  validateJSON(AccountUpdateValidationSchema),
  async (req, res) => {
    const account = req.body;
    try {
      User.update(account, {
        where: {
          id: account.id,
          isRoot: false,
        },
      });
      return res.json({
        message: "Account deleted.",
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Account creation failed.",
      });
    }
  }
);

export default router;
