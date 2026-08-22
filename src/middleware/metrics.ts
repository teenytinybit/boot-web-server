import { NextFunction, Request, Response } from "express";
import config from "../config";

export function middlewareMetricsInc(req: Request, res: Response, next: NextFunction) {
  config.fileserverHits += 1;
  next();
}
