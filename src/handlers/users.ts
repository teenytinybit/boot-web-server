import { Request, Response } from "express";
import { createUser, getUserByEmail } from "../db/queries/users.js";
import { checkPasswordHash, hashPassword } from "../auth.js";
import { User } from "../db/schema.js";

function stripPassword(user: User): Omit<User, "hashedPassword"> {
  const { hashedPassword, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export async function handlerCreateUser(req: Request, res: Response) {
  const hash = await hashPassword(req.body.password);
  const user = await createUser({
    email: req.body.email,
    hashedPassword: hash,
  });

  return res.status(201).json(stripPassword(user));
}

export async function handlerLogin(req: Request, res: Response) {
  const user = await getUserByEmail(req.body.email);
  const isPasswordValid = await checkPasswordHash(
    req.body.password,
    user?.hashedPassword || "",
  );
  if (user && isPasswordValid) {
    return res.status(200).json(stripPassword(user));
  }
  return res.status(401).json({ error: "Incorrect email or password" });
}
