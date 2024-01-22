import express from "express";
import { garbage, upcomingEvents } from "./listeners";
import { clientMiddleware } from "./middleware";

const router = express.Router();

router.get("/", clientMiddleware, upcomingEvents);

router.get("/oauth/callback", (req, res) => {
  res.send("Hello World!");
});

export default router;
