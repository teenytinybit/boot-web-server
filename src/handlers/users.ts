import { Request, Response } from "express";
import { createUser } from "../db/queries/users.js";

export async function handlerCreateUser(req: Request, res: Response) {
  console.log("handler");
  if (!req.body) {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  const email = req.body.email;
  if (!email) {
    return res.status(400).json({ error: "Invalid email" });
  }

  const user = await createUser({ email });
  return res.status(201).json(user);
}
