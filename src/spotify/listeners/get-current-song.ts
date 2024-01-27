import { Response } from "express";
import { DeskbotRequest } from "../../types";

export const getCurrentSongHelper = (req: DeskbotRequest) => {
  try {
    if (req.currentSong) {
      return {
        message: `${req.currentSong?.name} [${req.currentSong?.artist}]`,
        progress: req.currentSong?.progress(),
        is_playing: req.currentSong?.is_playing,
      };
    }
    return {
      message: "No song is currently playing",
      progress: 0,
      is_playing: false,
    };
  } catch (error) {
    return {
      message: "Spotify Error.",
      progress: 0,
      is_playing: false,
    };
  }
};

export const getCurrentSong = async (req: DeskbotRequest, res: Response) => {
  res.send(getCurrentSongHelper(req));
};
