import { Request } from "express";
import { Song } from "./Song";

export interface SpotifyRequest extends Request {
  spotifyAccessToken?: string;
  currentSong?: Song;
}
