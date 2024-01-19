import axios from "axios";
import { Request, Response } from "express";
import { refreshAccessToken } from "../auth";
import { Song } from "../Song";
import { SpotifyRequest } from "../SpotifyRequest";

export const getCurrentSong = async (req: SpotifyRequest, res: Response) => {
  try {
    const response = await axios.get(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: {
          Authorization: `Bearer ${req.spotifyAccessToken}`,
        },
      }
    );
    if (response.status !== 200 || !response.data?.item?.name) {
      return res.send("No song currently playing");
    }
    const name = response.data.item.name;
    const artist = response.data.item.artists[0].name;
    const progress_ms = response.data.progress_ms;
    const is_playing = response.data.is_playing;
    const song = new Song(name, artist, progress_ms, is_playing);
    res.send({
      details: song.details(),
      progress: song.progressBar(),
      is_playing: song.is_playing,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching current song from Spotify");
  }
};
