import express from "express"

const router = express.Router()

router.get("/", (req, res)=>{
    
    res.render("admin/login.html")
})
router.post("/", (req, res)=>{
    res.redirect("/dashboard")
})




export default router