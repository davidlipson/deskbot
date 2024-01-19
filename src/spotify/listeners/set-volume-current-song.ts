import axios from "axios";
import { Response } from "express";
import { SpotifyRequest } from "../SpotifyRequest";

export const setVolumeCurrentSong = async (
  req: SpotifyRequest,
  res: Response
) => {
  try {
    console.log("test");
    const volume = Number(req.query.volume);

    if (!Number.isInteger(volume)) {
      return res
        .status(400)
        .send("Volume must be an integer between 0 and 100");
    }

    const roundedVolume = Math.min(
      Math.max(15, Math.floor(volume / 10) * 10),
      100
    );

    await axios.put(
      `https://api.spotify.com/v1/me/player/volume?volume_percent=${roundedVolume}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${req.spotifyAccessToken}`,
        },
      }
    );

    res.send({ message: `Volume: ${roundedVolume}%` });
  } catch (error) {
    res.status(500).send({ message: "Couldn't set Spotify volume..." });
  }
};
