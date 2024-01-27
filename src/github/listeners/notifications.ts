import { DeskbotRequest } from "../../types";
import { Response } from "express";
import { Octokit } from "@octokit/rest";
import { Notification } from "../Notification";
import moment from "moment-timezone";

const HOURS_CHECKED = 6;

export const notificationsHelper = async (req: DeskbotRequest) => {
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
      return { message: "No GH msgs!", notifications: [] };
    }

    return {
      message: `${unreadNotifications.length} unread GH msgs.`,
      totalItems: unreadNotifications.length,
      items: unreadNotifications.map((notification) =>
        new Notification(
          notification.subject.title,
          notification.subject.type
        ).details()
      ),
    };
  } catch (error) {
    return { message: "Github Error.", notifications: [] };
  }
};

export const notifications = async (req: DeskbotRequest, res: Response) => {
  const result = await notificationsHelper(req);
  res.send(result);
};
