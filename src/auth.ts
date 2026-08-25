import * as argon2 from "argon2";
import jwt, { JwtPayload } from "jsonwebtoken";
import { InvalidJWTError } from "./errors.js";

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
