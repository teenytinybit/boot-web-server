import { Request, Response } from "express";
import { checkPasswordHash, hashPassword, makeJWT } from "../auth.js";
import config from "../config.js";
import { createUser, getUserByEmail } from "../db/queries/users.js";
import { User } from "../db/schema.js";

const DEFAULT_EXPITY_TIME_SEC = 3600; // 1 hour

function stripPassword(user: User): Omit<User, "hashedPassword"> {
  const { hashedPassword, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

function getExpirationTime(expiresInSeconds: number | undefined) {
  if (expiresInSeconds && expiresInSeconds <= DEFAULT_EXPITY_TIME_SEC) {
    return expiresInSeconds;
  }
  return DEFAULT_EXPITY_TIME_SEC;
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
    const expiry = getExpirationTime(req.body.expiresInSeconds);
    const token = makeJWT(user.id, expiry, config.api.secret);
    return res.status(200).json({ ...stripPassword(user), token });
  }
  return res.status(401).json({ error: "Incorrect email or password" });
}
