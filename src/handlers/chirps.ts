import { Request, Response } from "express";
import { ChirpValidationError, NotFoundError } from "../errors.js";
import { createChirp, getAllChirps, getChirpById } from "../db/queries/chirps.js";

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

export async function handlerGetChirps(req: Request, res: Response) {
  const chirps = await getAllChirps();
  return res.status(200).json(chirps);
}

export async function handlerGetChirp(req: Request, res: Response) {
  const chirpId = req.params.chirpId as string;
  console.log("whatafstdfastd");
  const chirp = await getChirpById(chirpId);
  if (!chirp) {
    console.log(`[NOT_FOUND]: Chirp id '${chirpId}' not found`);
    throw new NotFoundError("Chirp not found");
  }
  return res.status(200).json(chirp);
}
