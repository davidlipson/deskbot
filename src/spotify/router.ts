import express from "express";
import {
  getCurrentSong,
  setVolumeCurrentSong,
  toggleCurrentSong,
} from "./listeners";
import { tokenMiddleware, songMiddleware } from "./middleware";

const router = express.Router();

router.get("/current", tokenMiddleware, songMiddleware, getCurrentSong);
router.get("/toggle", tokenMiddleware, songMiddleware, toggleCurrentSong);
router.get("/volume", tokenMiddleware, songMiddleware, setVolumeCurrentSong);

router.get("/oauth/callback", (req, res) => {
  res.send("Hello World!");
});

export default router;
