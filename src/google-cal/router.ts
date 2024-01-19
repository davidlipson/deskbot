import express from "express";
import { upcomingEvents } from "./listeners";
import { clientMiddleware } from "./middleware";

const router = express.Router();

router.get("/upcoming", clientMiddleware, upcomingEvents);
router.get("/oauth/callback", (req, res) => {
  res.send("Hello World!");
});

export default router;
