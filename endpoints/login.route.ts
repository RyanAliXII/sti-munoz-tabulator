import express from "express"
import path from "path"


const router = express.Router()

router.get("/", (req, res)=>{

    res.render("admin/login.html")
})
router.post("/", (req, res)=>{
    res.redirect("/dashboard")
})




export default router