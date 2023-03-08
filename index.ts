import express from "express"
import * as dotenv from "dotenv"
const env = dotenv.config()
const app = express()
import loginRouter from "@endpoints/login.route"
import path from "path"
import ejs from "ejs"
const PORT = env.parsed?.PORT ?? 3000

app.engine('html', ejs.renderFile)
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.send("TypeScript With Express");
});
 
app.use("/login", loginRouter)

app.listen(PORT, () => {
    console.log(`TypeScript with Express
         http://localhost:${PORT}/`);
});