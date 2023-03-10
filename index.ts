import express from "express";
import * as dotenv from "dotenv";
const env = dotenv.config();
const app = express();
import loginRouter from "@endpoints/login.route";
import dashboardRouter from "@endpoints/dashboard.route";
import path from "path";
import ejs from "ejs";
import { runMigration, runSeed } from "@models/migrate";
import bodyParser from "body-parser";
const PORT = env.parsed?.PORT ?? 3000;
import Session from "express-session";
import PGSession from "connect-pg-simple";
import pg from "pg";
import { DB_NAME, HOST, PASSWORD, USERNAME } from "@models/sequelize";
import { UserType } from "@models/model";
import loginRequired from "@endpoints/middewares/loginRequired";
import eventRouter from "@endpoints/events.route";
import teamRouter from "@endpoints/team.route";
import rankRouter from "@endpoints/rank.route";
import scoreRouter from "@endpoints/score.route";
declare module "express-session" {
  interface SessionData {
    user: UserType;
  }
}
const pgSession = PGSession(Session);
const pgPool = new pg.Pool({
  database: DB_NAME,
  host: HOST,
  user: USERNAME,
  password: PASSWORD,
  port: 5432,
});
const SESSION_SECRET = env.parsed?.SESSION_SECRET;

if (!SESSION_SECRET) {
  console.warn(
    "SESSION_SECRET is not declared or empty in env variable. Please add session secret."
  );
}

app.use(
  Session({
    store: new pgSession({
      pool: pgPool,
      tableName: "user_sessions",
      createTableIfMissing: true,
    }),
    secret: SESSION_SECRET ?? "",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true }, // 30days
  })
);
app.engine("html", ejs.renderFile);
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/assets", express.static("assets"));
app.use("/login", loginRouter);
// route registered after this statement will be affected with required login.
// app.use(loginRequired);
app.use("/dashboard", dashboardRouter);
app.use("/events", eventRouter);
app.use("/teams", teamRouter);
app.use("/ranks", rankRouter);
app.use("/scores/", scoreRouter);
app.get("/", (req, res) => {
  return res.send("TypeScript With Express");
});

runMigration();
runSeed();

app.listen(PORT, () => {
  console.log(`TypeScript with Express
         http://localhost:${PORT}/`);
});
