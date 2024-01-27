import { NextFunction, Response } from "express";
import { refreshAccessToken } from "../auth";
import { DeskbotRequest } from "../../types";

export const tokenMiddleware = async (
  req: DeskbotRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const spotifyAccessToken = await refreshAccessToken();
    req.spotifyAccessToken = spotifyAccessToken;
    next();
  } catch (error) {
    console.error("Error refreshing access token", error);
    res.status(500).send("Error refreshing access token");
  }
};
