import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { CalendarRequest } from "../CalendarRequest";
import { Response } from "express";
import { Event } from "../Event";

export const upcomingEvents = async (req: CalendarRequest, res: Response) => {
  try {
    // Initialize the Google Calendar service
    const calendar = google.calendar({ version: "v3", auth: req.client });

    // Get the current date
    const now = new Date();

    // Get the date for tomorrow
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Make a request to the Google Calendar API to get events for today
    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: now.toISOString(),
      timeMax: endOfDay.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    });

    const events =
      response?.data?.items
        ?.filter(
          (event) =>
            event.summary && event.start?.dateTime && event.end?.dateTime
        )
        .map(
          (event) =>
            new Event(
              event.summary?.trim() as string,
              new Date(event.start?.dateTime as string),
              new Date(event.end?.dateTime as string)
            )
        ) || [];

    if (events?.length) {
      res.send({
        message: "Here are your events for today!",
        events: events.map((event) => ({
          details: event.details(),
        })),
      });
    } else {
      res.send({ message: "No more events today!", events: [] });
    }
  } catch (error) {
    console.error("Couldn't get Google Calendar events...", error);
    res.status(500).send("Couldn't get Google Calendar events...");
  }
};
