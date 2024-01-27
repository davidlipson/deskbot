import { google } from "googleapis";
import { Event } from "../Event";

import fs from "fs";
import csv from "csv-parser";
import moment from "moment-timezone";
import { Response } from "express";
import { DeskbotRequest } from "../../types";

interface GarbageRow {
  CollectionDate: string;
  Organics: string;
  Garbage: string;
  Recycling: string;
  YardWaste: string;
  [key: string]: string;
}

export const upcomingHelper = async (req: DeskbotRequest) => {
  try {
    // Initialize the Google Calendar service
    const calendar = google.calendar({ version: "v3", auth: req.client });

    const now = moment().tz("America/Toronto").startOf("day");
    const endOfDay = moment().tz("America/Toronto").endOf("day");

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
              moment
                .tz(event?.start?.dateTime as string, "America/Toronto")
                .toDate(),
              moment
                .tz(event?.end?.dateTime as string, "America/Toronto")
                .toDate()
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
      return {
        message: `${events.length} events today`,
        events: events.map((event) => event.details()),
      };
    } else {
      return { message: "No events today", events: [] };
    }
  } catch (error) {
    console.log(error);
    return { message: "Calendar Error", events: [] };
  }
};

export const garbage = async (): Promise<Event | undefined> => {
  const results: GarbageRow[] = [];
  const stream = fs.createReadStream("garbage2024.csv").pipe(csv());

  for await (const data of stream) {
    results.push(data as GarbageRow);
  }

  const tomorrow = moment().tz("America/Toronto").add(2, "days");

  const collection = results.find((item) => {
    const collectionDate = moment.tz(item.CollectionDate, "America/Toronto");
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

export const upcomingEvents = async (req: DeskbotRequest, res: Response) => {
  const result = await upcomingHelper(req);
  res.send(result);
};
