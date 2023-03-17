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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c;
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
const PORT = (_b = (_a = env.parsed) === null || _a === void 0 ? void 0 : _a.PORT) !== null && _b !== void 0 ? _b : 3000;
const express_session_1 = __importDefault(require("express-session"));
const connect_pg_simple_1 = __importDefault(require("connect-pg-simple"));
const pg_1 = __importDefault(require("pg"));
const sequelize_1 = require("./models/sequelize");
const events_route_1 = __importDefault(require("./endpoints/events.route"));
const team_route_1 = __importDefault(require("./endpoints/team.route"));
const rank_route_1 = __importDefault(require("./endpoints/rank.route"));
const score_route_1 = __importDefault(require("./endpoints/score.route"));
const leaderboard_route_1 = __importDefault(require("./endpoints/leaderboard.route"));
const pgSession = (0, connect_pg_simple_1.default)(express_session_1.default);
const pgPool = new pg_1.default.Pool({
    database: sequelize_1.DB_NAME,
    host: sequelize_1.HOST,
    user: sequelize_1.USERNAME,
    password: sequelize_1.PASSWORD,
    port: 5432,
});
const SESSION_SECRET = (_c = env.parsed) === null || _c === void 0 ? void 0 : _c.SESSION_SECRET;
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
app.use("/login", login_route_1.default);
// route registered after this statement will be affected with required login.
// app.use(loginRequired);
app.use("/dashboard", dashboard_route_1.default);
app.use("/events", events_route_1.default);
app.use("/teams", team_route_1.default);
app.use("/ranks", rank_route_1.default);
app.use("/scores", score_route_1.default);
app.use("/leaderboards", leaderboard_route_1.default);
app.get("/", (req, res) => {
    return res.send("TypeScript With Express");
});
(0, migrate_1.runMigration)().then(() => {
    (0, migrate_1.runSeed)();
});
app.listen(PORT, () => {
    console.log(`TypeScript with Express
         http://localhost:${PORT}/`);
});
