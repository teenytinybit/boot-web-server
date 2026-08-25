import { describe, it, expect, beforeAll } from "vitest";
import { checkPasswordHash, hashPassword, makeJWT, validateJWT } from "./auth.js";
import { InvalidJWTError } from "./errors.js";
import jwt from "jsonwebtoken";

describe("Password Hashing", () => {
  const password1 = "correctPassword123!";
  const password2 = "anotherPassword456!";
  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
    hash1 = await hashPassword(password1);
    hash2 = await hashPassword(password2);
  });

  it("should return true for the correct password", async () => {
    const result = await checkPasswordHash(password1, hash1);
    expect(result).toBe(true);
  });

  it("should return false for the incorrect password", async () => {
    const result = await checkPasswordHash(password1, hash2);
    expect(result).toBe(false);
  });

  it("should return false for an empty password", async () => {
    const result = await checkPasswordHash("", hash1);
    expect(result).toBe(false);
  });

  it("should throw an error for an empty hash", async () => {
    expect(() => checkPasswordHash(password1, "")).rejects.toThrow();
  });
});

describe("JWT", () => {
  const userID = "12345";
  const expiresIn = 3600;
  const secret = "secret";

  let token: string;
  beforeAll(() => {
    token = makeJWT(userID, expiresIn, secret);
  });

  it("should produce a non-empty string", () => {
    expect(token).toBeDefined();
    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(0);
  });

  it("should validate a valid token", () => {
    expect(() => validateJWT(token, secret)).not.toThrow();
    const value = validateJWT(token, secret);
    expect(value).toBe(userID);
  });

  it("should reject a token signed by an invalid secret", () => {
    const wrongSecretToken = makeJWT(userID, expiresIn, "wrongSecret");
    expect(() => validateJWT(wrongSecretToken, secret)).toThrow(InvalidJWTError);
  });

  it("should throw an error for an invalid JWT", () => {
    expect(() => validateJWT("invalidToken", secret)).toThrow(InvalidJWTError);
  });

  it("should reject an expired JWT", () => {
    const expiredToken = makeJWT(userID, -1, secret);
    expect(() => validateJWT(expiredToken, secret)).toThrow(InvalidJWTError);
  });
});
