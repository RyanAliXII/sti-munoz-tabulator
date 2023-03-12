import { Team, Event, Rank, Score, User, createUser } from "@models/model";
import * as dotenv from "dotenv";
import validator from "validator";
import bycrypt from "bcrypt";
import { ValidationError } from "sequelize";

const env = dotenv.config();

export const runMigration = async () => {
  try {
    User.sync();
    Event.sync();
    Team.sync();
    Rank.sync();
    Score.sync();
  } catch (error) {
    console.log(error);
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
    const email = env.parsed?.ROOT_USER_EMAIL;
    const password = env.parsed?.ROOT_USER_PASSWORD;
    const givenName = env.parsed?.ROOT_USER_GIVEN_NAME ?? "";
    const surname = env.parsed?.ROOT_USER_SURNAME ?? "";

    if (!email || !password) {
      throw "Root user email and password should be added in your .env";
    }
    if (!validator.isEmail(email ?? "")) {
      throw "Invalid Root user email. Please enter valid email.";
    }
    const hashedPassword = await bycrypt.hash(password, 5);
    await createUser({
      email,
      password: hashedPassword,
      givenName,
      surname,
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      console.log("Root user is already created.");
      return;
    }
    throw error;
  }
};
