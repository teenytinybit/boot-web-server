import { Request, Response } from "express";
import { ChirpValidationError } from "../errors.js";
import { createChirp } from "../db/queries/chirps.js";

function maskProfanity(message: string) {
  const PROFANITIES = ["kerfuffle", "sharbert", "fornax"];
  return message
    .split(" ")
    .map((word) => {
      if (PROFANITIES.includes(word.toLowerCase())) {
        return "****";
      }
      return word;
    })
    .join(" ");
}

function validateLength(message: string) {
  return message.length <= 140;
}

export async function handlerCreateChirp(req: Request, res: Response) {
  if (!req.body) {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  let { body, userId } = req.body;
  if (!validateLength(body)) {
    throw new ChirpValidationError();
  }

  body = maskProfanity(body);
  const chirp = await createChirp({ body, userId });
  return res.status(201).json(chirp);
}
