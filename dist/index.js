"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv = __importStar(require("dotenv"));
const env = dotenv.config();
const app = (0, express_1.default)();
const login_route_1 = __importDefault(require("./endpoints/login.route"));
const dashboard_route_1 = __importDefault(require("./endpoints/dashboard.route"));
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const migrate_1 = require("./models/migrate");
const body_parser_1 = __importDefault(require("body-parser"));
const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3000;
const express_session_1 = __importDefault(require("express-session"));
const connect_pg_simple_1 = __importDefault(require("connect-pg-simple"));
const pg_1 = __importDefault(require("pg"));
const sequelize_1 = require("./models/sequelize");
const loginRequired_1 = __importDefault(require("./endpoints/middewares/loginRequired"));
const events_route_1 = __importDefault(require("./endpoints/events.route"));
const team_route_1 = __importDefault(require("./endpoints/team.route"));
const rank_route_1 = __importDefault(require("./endpoints/rank.route"));
const score_route_1 = __importDefault(require("./endpoints/score.route"));
const leaderboard_route_1 = __importDefault(require("./endpoints/leaderboard.route"));
const account_route_1 = __importDefault(require("./endpoints/account.route"));
const api_route_1 = __importDefault(require("./endpoints/api.route"));
const pgSession = (0, connect_pg_simple_1.default)(express_session_1.default);
const pgPool = new pg_1.default.Pool({
    database: sequelize_1.DB_NAME,
    host: sequelize_1.HOST,
    user: sequelize_1.USERNAME,
    password: sequelize_1.PASSWORD,
    port: sequelize_1.DB_PORT,
});
const SESSION_SECRET = process.env.SESSION_SECRET;
if (!SESSION_SECRET) {
    console.warn("SESSION_SECRET is not declared or empty in env variable. Please add session secret.");
}
app.use((0, express_session_1.default)({
    store: new pgSession({
        pool: pgPool,
        tableName: "user_sessions",
        createTableIfMissing: true,
    }),
    secret: SESSION_SECRET !== null && SESSION_SECRET !== void 0 ? SESSION_SECRET : "",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true }, // 30days
}));
app.engine("html", ejs_1.default.renderFile);
app.set("views", path_1.default.join(__dirname, "views"));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use("/assets", express_1.default.static("assets"));
app.use("/api/1", api_route_1.default);
app.use("/login", login_route_1.default);
app.get("/", (req, res) => {
    return res.send("TypeScript With Express");
});
// route registered after this statement will be affected with required login.
app.use(loginRequired_1.default);
app.use((req, res, next) => {
    res.locals = {
        user: req.session.user,
    };
    next();
});
app.use("/dashboard", dashboard_route_1.default);
app.use("/events", events_route_1.default);
app.use("/teams", team_route_1.default);
app.use("/ranks", rank_route_1.default);
app.use("/scores", score_route_1.default);
app.use("/leaderboards", leaderboard_route_1.default);
app.use("/accounts", account_route_1.default);
(0, migrate_1.runMigration)()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, migrate_1.runSeed)();
    }
    catch (error) {
        console.log(error);
    }
}))
    .catch((error) => {
    console.log(error);
});
app.listen(PORT, () => {
    console.log(sequelize_1.HOST);
    console.log(sequelize_1.DB_NAME);
    console.log(sequelize_1.USERNAME);
    console.log(sequelize_1.PASSWORD);
    console.log(sequelize_1.DB_PORT);
});
