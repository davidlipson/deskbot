import { Request } from "express";
import { OAuth2Client } from "google-auth-library";

export interface CalendarRequest extends Request {
  client?: OAuth2Client;
}
