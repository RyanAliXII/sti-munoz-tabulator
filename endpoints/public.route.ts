import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  return res.send("Hello world");
});

export default router;
