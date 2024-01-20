import { NextFunction, Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
/*
export const clientMiddleware = async (
  req: CalendarRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    req.client = new OAuth2Client(
      process.env.GOOGLE_CAL_CLIENT_ID,
      process.env.GOOGLE_CAL_CLIENT_SECRET,
      "http://localhost:3000/calendar/oauth/callback"
    );
    req.client.setCredentials({
      refresh_token: process.env.GOOGLE_CAL_REFRESH_TOKEN,
    });
    next();
  } catch (error) {
    console.error("Error setting Oauth client", error);
    res.status(500).send("Error setting Oauth client");
  }
};
*/
