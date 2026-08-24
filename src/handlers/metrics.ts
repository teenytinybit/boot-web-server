import { Request, Response } from "express";
import config from "../config.js";

export function handlerMetrics(req: Request, res: Response) {
  res.set("Content-Type", "text/html").set("charset", "utf-8");
  res.status(200).send(`<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${config.fileserverHits} times!</p>
  </body>
</html>`);
}

export function handlerMetricsReset(req: Request, res: Response) {
  config.fileserverHits = 0;
  res.set("Content-Type", "text/plain").set("charset", "utf-8");
  res.status(200).send("OK");
}
