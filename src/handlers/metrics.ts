import { Request, Response } from "express";
import config from "../config.js";
import { resetUsers } from "../db/queries/users.js";

export function handlerMetrics(req: Request, res: Response) {
  res.set("Content-Type", "text/html").set("charset", "utf-8");
  res.status(200).send(`<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${config.api.fileserverHits} times!</p>
  </body>
</html>`);
}

export async function handlerReset(req: Request, res: Response) {
  if (config.api.platform !== "dev") {
    return res.status(403).json({ error: "Forbidden" });
  }

  await resetUsers();
  config.api.fileserverHits = 0;

  res.set("Content-Type", "text/plain").set("charset", "utf-8");
  return res.status(200).send("OK");
}
