import express from "express"
import * as dotenv from "dotenv"
const env = dotenv.config()
const app = express()
import loginRouter from "@endpoints/login.route"
import dashboardRouter from "@endpoints/dashboard.route"
import path from "path"
import ejs from "ejs"
const PORT = env.parsed?.PORT ?? 3000

app.engine('html', ejs.renderFile)
app.set('views', path.join(__dirname, 'views'));
app.use('/assets',express.static("assets"))

app.get('/', (req, res) => {
    res.send("TypeScript With Express");
});
 
app.use("/login", loginRouter)
app.use("/dashboard", dashboardRouter)

app.listen(PORT, () => {
    console.log(`TypeScript with Express
         http://localhost:${PORT}/`);
});