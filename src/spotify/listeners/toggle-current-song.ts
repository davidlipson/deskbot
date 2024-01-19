import axios from "axios";
import { Response } from "express";
import { SpotifyRequest } from "../SpotifyRequest";

export const toggleCurrentSong = async (req: SpotifyRequest, res: Response) => {
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
    res.send(`Spotify ${currentlyPlaying ? "paused" : "playing"}`);
  } catch (error) {
    console.error("Couldn't pause Spotify...", error);
  }
};
