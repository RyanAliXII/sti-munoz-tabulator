import { Team, Event, Rank, Score, User, RankClass } from "@models/model";
import * as dotenv from "dotenv";
import validator from "validator";
import bycrypt from "bcrypt";
import { ValidationError } from "sequelize";
import { permissions } from "@internal/acl/acl";

const env = dotenv.config();

export const runMigration = async () => {
  try {
    await User.sync();
    await Event.sync();
    await Team.sync();
    await RankClass.sync();
    await Rank.sync();
    await Score.sync();
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const runSeed = async () => {
  try {
    await createRootUser();
  } catch (error) {
    throw error;
  }
};
const createRootUser = async () => {
  try {
    const email = process.env.ROOT_USER_EMAIL;
    const password = process.env.ROOT_USER_PASSWORD;
    const givenName = process.env?.ROOT_USER_GIVEN_NAME ?? "";
    const surname = process.env?.ROOT_USER_SURNAME ?? "";

    if (!email || !password) {
      throw "Root user email and password should be added in your .env";
    }
    if (!validator.isEmail(email ?? "")) {
      throw "Invalid Root user email. Please enter valid email.";
    }
    const hashedPassword = await bycrypt.hash(password, 5);
    await User.upsert(
      {
        email,
        password: hashedPassword,
        givenName,
        surname,
        permissions: permissions,
        isRoot: true,
      },
      {
        conflictFields: ["email"],
      }
    );
  } catch (error) {
    throw error;
  }
};
