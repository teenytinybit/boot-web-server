import { Request, Response } from "express";
import {
  checkPasswordHash,
  getAPIKey,
  getBearerToken,
  hashPassword,
  makeJWT,
  makeRefreshToken,
  validateJWT,
} from "../auth.js";
import config from "../config.js";
import { createUser, getUserByEmail, getUserById, updateUser } from "../db/queries/users.js";
import { User } from "../db/schema.js";
import {
  createRefreshToken,
  getRefreshToken,
  revokeRefreshToken,
} from "../db/queries/refreshTokens.js";
import { ApiKeyError } from "../errors.js";

const ACCESS_TOKEN_EXP_SECONDS = 3600; // 1 hour
const REFRESH_TOKEN_EXP_MILLISECONDS = 60 * 24 * 3600 * 1000; // 60 days

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
    const token = makeJWT(user.id, ACCESS_TOKEN_EXP_SECONDS, config.api.secret);
    const refreshToken = makeRefreshToken();
    await createRefreshToken({
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXP_MILLISECONDS),
    });

    return res.status(200).json({ ...stripPassword(user), token, refreshToken });
  }
  return res.status(401).json({ error: "Incorrect email or password" });
}

export async function handlerRefresh(req: Request, res: Response) {
  const token = getBearerToken(req);
  const refreshToken = await getRefreshToken(token);
  if (refreshToken && !refreshToken.revokedAt && refreshToken.expiresAt > new Date()) {
    const token = makeJWT(refreshToken.userId, ACCESS_TOKEN_EXP_SECONDS, config.api.secret);
    return res.status(200).json({ token });
  }
  return res.status(401).json({ error: "Invalid token" });
}

export async function handlerRevoke(req: Request, res: Response) {
  console.log("Revoking token");
  const token = getBearerToken(req);
  console.log(token);
  await revokeRefreshToken(token);
  console.log("Token revoked");
  return res.status(204).end();
}

export async function handlerUpdateUser(req: Request, res: Response) {
  const token = getBearerToken(req);
  const userId = validateJWT(token, config.api.secret);
  const { email, password } = req.body;
  const hashedPassword = await hashPassword(password);
  const user = await updateUser(userId, { email, hashedPassword });
  return res.status(200).json(stripPassword(user));
}

export async function handlerPolkaWebhook(req: Request, res: Response) {
  console.log("[POLKA WEBHOOK]: Processing event");
  const apiKey = getAPIKey(req);
  if (apiKey !== config.api.polkaKey) {
    throw new ApiKeyError();
  }
  if (!req.body) {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  const { event, data } = req.body;
  if (!event || !data) {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  console.log(event, data);
  if (event !== "user.upgraded") {
    return res.status(204).end();
  }

  const userId = data.userId;
  const user = await getUserById(userId);
  if (!user) {
    return res.status(404).end();
  }

  await updateUser(userId, { isChirpyRed: true });
  return res.status(204).end();
}
