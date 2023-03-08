import express from "express";
import { validateAndRedirectOnFail } from "./middewares/validate";
import { object, string } from "yup";
import User, { UserType } from "@models/user.model";
import { compare } from "bcrypt";

const router = express.Router();
const LoginSchemaValidation = object().shape({
  email: string().required().email(),
  password: string().required(),
});
type LoginBody = {
  email: string;
  password: string;
};

router.get("/", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.log(error);
    }
    return res.render("admin/login.html");
  });
});
router.post(
  "/",
  validateAndRedirectOnFail(
    LoginSchemaValidation,
    "Username and password cannot be empty",
    "/login"
  ),
  async (req, res) => {
    const body: LoginBody = req.body;
    const user = await User.findOne({
      where: {
        email: body.email,
      },
    });
    if (!user) {
      return res.redirect("/login");
    }
    const password = (user.get("password") ?? "") as string;
    try {
      const isPasswordSame = await compare(body.password, password);

      if (isPasswordSame) {
        req.session.user = user.dataValues as UserType;
        req.session.save();
        return res.redirect("/dashboard");
      }
      return res.redirect("/login");
    } catch (error) {
      console.log(error);
    }

    return res.redirect("/dashboard");
  }
);

export default router;
