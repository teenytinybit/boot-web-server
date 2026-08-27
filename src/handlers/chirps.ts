import { Request, Response } from "express";
import {
  createChirp,
  deleteChirp,
  getAllChirps,
  getChirpById,
  getChirpsByUserId,
} from "../db/queries/chirps.js";
import { NotFoundError } from "../errors.js";
import { getBearerToken, validateJWT } from "../auth.js";
import config from "../config.js";

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

export async function handlerCreateChirp(req: Request, res: Response) {
  const token = getBearerToken(req);
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const userId = validateJWT(token, config.api.secret);

  let { body } = req.body;
  body = maskProfanity(body);

  const chirp = await createChirp({ body, userId });
  return res.status(201).json(chirp);
}

export async function handlerGetChirps(req: Request, res: Response) {
  let authorId = (req.query.authorId as string) || ""; // we pre-validate string type in the validator middleware
  const chirps = await (authorId ? getChirpsByUserId(authorId) : getAllChirps());
  if (req.query.sort === "desc") {
    chirps.reverse();
  }
  return res.status(200).json(chirps);
}

export async function handlerGetChirp(req: Request, res: Response) {
  const chirpId = req.params.chirpId as string;
  const chirp = await getChirpById(chirpId);
  if (!chirp) {
    console.log(`[NOT_FOUND]: Chirp id '${chirpId}' not found`);
    throw new NotFoundError("Chirp not found");
  }
  return res.status(200).json(chirp);
}

export async function handlerDeleteChirp(req: Request, res: Response) {
  const token = getBearerToken(req);
  const userId = validateJWT(token, config.api.secret);
  const chirpId = req.params.chirpId as string;
  const chirp = await getChirpById(chirpId);
  if (!chirp) {
    console.log(`[NOT_FOUND]: Chirp id '${chirpId}' not found`);
    throw new NotFoundError("Chirp not found");
  }
  if (chirp.userId !== userId) {
    return res.status(403).json({ error: "Unauthorized" });
  }
  await deleteChirp(chirpId);
  return res.status(204).end();
}
