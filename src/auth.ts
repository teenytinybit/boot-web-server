import * as argon2 from "argon2";
import * as crypto from "node:crypto";
import { Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ApiKeyError, InvalidJWTError } from "./errors.js";

type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export function makeJWT(userID: string, expiresIn: number, secret: string): string {
  return jwt.sign({ userID }, secret, { expiresIn, subject: userID });
}

export function validateJWT(tokenString: string, secret: string): string {
  try {
    const payload = jwt.verify(tokenString, secret) as payload;
    return payload.sub as string;
  } catch (error) {
    throw new InvalidJWTError();
  }
}

export function hashPassword(password: string): Promise<string> {
  return argon2.hash(password);
}

export function checkPasswordHash(password: string, hash: string): Promise<boolean> {
  return argon2.verify(hash, password);
}

export function getBearerToken(req: Request): string {
  const authorizationHeader = req.get("Authorization");
  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    throw new InvalidJWTError();
  }
  const token = authorizationHeader.split("Bearer ")?.[1];
  return token;
}

export function makeRefreshToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function getAPIKey(req: Request): string {
  const authorizationHeader = req.get("Authorization");
  if (!authorizationHeader || !authorizationHeader.startsWith("ApiKey ")) {
    throw new ApiKeyError();
  }
  const key = authorizationHeader.split("ApiKey ")?.[1];
  return key;
}
