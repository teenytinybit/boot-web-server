import { Request, Response } from "express";

export function handlerReadiness(req: Request, res: Response) {
  res.set("Content-Type", "text/plain").set("charset", "utf-8");
  res.status(200).send("OK");
}
