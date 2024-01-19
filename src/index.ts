import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import spotify from "./spotify/router";
import { getAccessToken } from "./spotify/auth";

dotenv.config();

(async () => {
  const app: Express = express();
  const port = process.env.PORT || 3000;

  app.use("/spotify", spotify);

  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
})();
