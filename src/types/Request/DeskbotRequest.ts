import { Request } from "express";
import { OAuth2Client } from "google-auth-library";
import { Song } from "../../spotify/Song";

export interface DeskbotRequest extends Request {
  client?: OAuth2Client;
  spotifyAccessToken?: string;
  currentSong?: Song;
}
