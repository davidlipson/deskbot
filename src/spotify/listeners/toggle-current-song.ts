import axios from "axios";
import { Response } from "express";
import { DeskbotRequest } from "../../types";

export const toggleCurrentSong = async (req: DeskbotRequest, res: Response) => {
  try {
    const currentlyPlaying = req.currentSong?.is_playing;
    await axios.put(
      currentlyPlaying
        ? "https://api.spotify.com/v1/me/player/pause"
        : "https://api.spotify.com/v1/me/player/play",
      {},
      {
        headers: {
          Authorization: `Bearer ${req.spotifyAccessToken}`,
        },
      }
    );
    res.send({ message: `Spotify ${currentlyPlaying ? "paused" : "playing"}` });
  } catch (error) {
    res.status(500).send({ message: "Couldn't toggle Spotify playback" });
  }
};
