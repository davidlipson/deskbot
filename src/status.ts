import { upcomingHelper } from "./ calendar/listeners";
import { notificationsHelper } from "./github/listeners";
import { getCurrentSongHelper } from "./spotify/listeners";
import { DeskbotRequest } from "./types";
import { Response } from "express";

export const status = async (req: DeskbotRequest, res: Response) => {
  try {
    const song = getCurrentSongHelper(req);
    const calendar = await upcomingHelper(req);
    const github = await notificationsHelper(req);
    res.send({
      song,
      calendar,
      github,
    });
  } catch (error) {
    res.status(500).send({
      error: "Status Error.",
    });
  }
};
