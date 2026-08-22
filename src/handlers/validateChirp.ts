import { Request, Response } from "express";

export function handlerValidateChirp(req: Request, res: Response) {
  try {
    let content = "";

    req.on("data", (chunk) => {
      content += chunk;
    });

    req.on("end", () => {
      try {
        const chirp = JSON.parse(content);
        if (chirp.body.length > 140) {
          res.status(400).json({ error: "Chirp is too long" });
        } else {
          res.status(200).json({ valid: true });
        }
      } catch (error) {
        res.status(400).send("Invalid JSON");
      }
    });
  } catch (error) {
    res.status(400).json({ error: "Something went wrong" });
  }
}
