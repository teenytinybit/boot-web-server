import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { NewRefreshToken, refreshTokens } from "../schema.js";

export async function createRefreshToken(token: NewRefreshToken) {
  await db.insert(refreshTokens).values(token);
}

export async function getRefreshToken(token: string) {
  const [result] = await db.select().from(refreshTokens).where(eq(refreshTokens.token, token));
  return result;
}

export async function revokeRefreshToken(token: string) {
  await db
    .update(refreshTokens)
    .set({ revokedAt: new Date() })
    .where(eq(refreshTokens.token, token));
}
