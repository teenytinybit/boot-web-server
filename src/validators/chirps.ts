import { NextFunction, Request, Response } from "express";
import { ValidationError } from "../errors.js";

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
    throw new ValidationError("Chirp is too long. Max length is 140");
  }

  next();
}

export function validateGetChirps(req: Request, res: Response, next: NextFunction) {
  if (req.query.authorId && typeof req.query.authorId !== "string") {
    throw new ValidationError("Invalid query");
  }
  if (req.query.sort && typeof req.query.sort !== "string") {
    throw new ValidationError("Invalid query");
  }

  next();
}
