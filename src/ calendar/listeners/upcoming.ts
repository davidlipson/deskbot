import { google } from "googleapis";
import { CalendarRequest } from "../../types";
import { Event } from "../Event";

import fs from "fs";
import csv from "csv-parser";
import moment from "moment";
import { Response } from "express";

interface GarbageRow {
  CollectionDate: string;
  Organics: string;
  Garbage: string;
  Recycling: string;
  YardWaste: string;
  [key: string]: string;
}

export const garbage = async (): Promise<Event | undefined> => {
  const results: GarbageRow[] = [];
  const stream = fs.createReadStream("garbage2024.csv").pipe(csv());

  for await (const data of stream) {
    results.push(data as GarbageRow);
  }

  const tomorrow = moment().add(2, "days");

  const collection = results.find((item) => {
    const collectionDate = moment(item.CollectionDate);
    return collectionDate.isSame(tomorrow, "day");
  });

  if (collection) {
    const items = ["Garbage", "Recycling", "Organics", "YardWaste"].filter(
      (item) => collection[item] === "T"
    );
    if (items.length > 0) {
      return new Event(`${items.join(", ")}`);
    }
  }
};

export const upcomingEvents = async (req: CalendarRequest, res: Response) => {
  try {
    // Initialize the Google Calendar service
    const calendar = google.calendar({ version: "v3", auth: req.client });

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const calendars = await calendar.calendarList.list();
    const ids = calendars.data.items?.map((item) => item.id) || [];

    // Make a request to the Google Calendar API to get events for today
    const allEvents = (
      await Promise.all(
        ids.map((id) =>
          calendar.events.list({
            calendarId: id as string,
            timeMin: now.toISOString(),
            timeMax: endOfDay.toISOString(),
            singleEvents: true,
            orderBy: "startTime",
          })
        )
      )
    ).flatMap((response) => response.data.items);

    console.log(allEvents);
    const events =
      allEvents
        .filter(
          (event) =>
            event?.summary && event.start?.dateTime && event.end?.dateTime
        )
        .map(
          (event) =>
            new Event(
              event?.summary?.trim() as string,
              new Date(event?.start?.dateTime as string),
              new Date(event?.end?.dateTime as string)
            )
        ) || [];

    const garbageEvent = await garbage();
    if (garbageEvent) {
      events.push(garbageEvent);
    }

    // sort events by start_time, if no start time then put at the end
    events.sort((a, b) => {
      if (a.start_time && b.start_time) {
        return a.start_time.getTime() - b.start_time.getTime();
      } else if (a.start_time) {
        return -1;
      } else if (b.start_time) {
        return 1;
      } else {
        return 0;
      }
    });

    if (events?.length) {
      res.send({
        message: "Here are your events for today!",
        events: events.map((event) => event.details()),
      });
    } else {
      res.send({ message: "No more events today!", events: [] });
    }
  } catch (error) {
    res.status(500).send("Couldn't get Google Calendar events...");
  }
};
