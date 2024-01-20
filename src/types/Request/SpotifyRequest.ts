import { Request } from "express";
import { Song } from "../../spotify/Song";

export interface SpotifyRequest extends Request {
  spotifyAccessToken?: string;
  currentSong?: Song;
}
