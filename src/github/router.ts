import express from "express";
import { notifications } from "./listeners";

const router = express.Router();

router.get("/notifications", notifications);
router.get("/oauth/callback", (req, res) => {
  res.send("Hello World!");
});

export default router;
