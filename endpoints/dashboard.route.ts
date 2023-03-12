import express from "express";
const router = express.Router();

const Module = "Dashboard";
router.get("/", (req, res) => {
  return res.render("admin/dashboard.html", { module: Module });
});

export default router;
