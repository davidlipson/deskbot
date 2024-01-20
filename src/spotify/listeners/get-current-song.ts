import axios from "axios";
import { Request, Response } from "express";
import { refreshAccessToken } from "../auth";
import { Song } from "../Song";
import { SpotifyRequest } from "../../types";

export const getCurrentSong = async (req: SpotifyRequest, res: Response) => {
  try {
    res.send({
      message: `${req.currentSong?.name} [${req.currentSong?.artist}]`,
      progress: req.currentSong?.progress(),
      is_playing: req.currentSong?.is_playing,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error fetching current song from Spotify",
    });
  }
};
