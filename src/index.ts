import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import spotify from "./spotify/router";
import calendar from "./ calendar/router";
import github from "./github/router";
import { songMiddleware, tokenMiddleware } from "./spotify/middleware";
import { clientMiddleware } from "./ calendar/middleware";
import { status } from "./status";

dotenv.config();

(async () => {
  const app: Express = express();
  const port = process.env.PORT || 3000;

  app.get("/status", tokenMiddleware, songMiddleware, clientMiddleware, status);
  app.use("/spotify", spotify);
  app.use("/calendar", calendar);
  app.use("/github", github);

  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
})();
