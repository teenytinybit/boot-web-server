import { Request, Response } from "express";

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

export function handlerValidateChirp(req: Request, res: Response) {
  if (!req.body) {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  let chirp = req.body.body;
  if (!validateLength(chirp)) {
    return res.status(400).json({ error: "Chirp is too long" });
  }

  chirp = maskProfanity(chirp);
  return res.status(200).json({ cleanedBody: chirp });
}
