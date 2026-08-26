import { NextFunction, Request, Response } from "express";
import { ChirpValidationError } from "../errors.js";

function validateLength(message: string) {
  return message.length <= 140;
}

export function validateCreateChirp(req: Request, res: Response, next: NextFunction) {
  if (!req.body) {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  const { body } = req.body;
  if (!body) {
    return res.status(400).json({ error: "Invalid chirp data" });
  }

  if (!validateLength(body)) {
    throw new ChirpValidationError();
  }

  next();
}
