import { NextFunction } from "express";
import { DeskbotRequest } from "../../types";
import axios from "axios";
import { Response } from "express";
import { Song } from "../Song";

export const songMiddleware = async (
  req: DeskbotRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await axios.get(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: {
          Authorization: `Bearer ${req.spotifyAccessToken}`,
        },
      }
    );
    if (response.status === 200 && response.data?.item?.name) {
      const name = response.data.item.name;
      const artist = response.data.item.artists[0].name;
      const progress_ms = response.data.progress_ms;
      const is_playing = response.data.is_playing;
      const duration_ms = response.data.item.duration_ms;
      req.currentSong = new Song(
        name,
        artist,
        progress_ms,
        is_playing,
        duration_ms
      );
    }
    next();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching current song from Spotify");
  }
};
