import { GithubRequest } from "../../types";
import { Response } from "express";
import { Octokit } from "@octokit/rest";
import { Notification } from "../Notification";
import moment from "moment-timezone";

const HOURS_CHECKED = 6;

export const notifications = async (req: GithubRequest, res: Response) => {
  try {
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });

    const { data: notifications } =
      await octokit.activity.listNotificationsForAuthenticatedUser({
        all: true,
        since: moment()
          .tz("America/Toronto")
          .subtract(HOURS_CHECKED, "hours")
          .toISOString(),
      });

    const unreadNotifications = notifications.filter(
      (notification) =>
        notification?.unread &&
        ["assign", "mention", "review_requested"].includes(notification.reason)
    );

    if (!unreadNotifications.length) {
      return res.send({ message: "No new notifications!", notifications: [] });
    }
    res.json({
      message: `${unreadNotifications.length} unread notifications on github.`,
      totalItems: unreadNotifications.length,
      items: unreadNotifications.map((notification) =>
        new Notification(
          notification.subject.title,
          notification.subject.type
        ).details()
      ),
    });
  } catch (error) {
    console.error("Couldn't get github notifications...", error);
    res.status(500).send("Couldn't get github notifications...");
  }
};
