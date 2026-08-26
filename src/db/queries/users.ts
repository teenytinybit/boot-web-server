import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { NewUser, User, users } from "../schema.js";

type UpdateUser = Partial<Omit<User, "id" | "createdAt" | "updatedAt">>;

export async function createUser(user: NewUser) {
  const [result] = await db.insert(users).values(user).onConflictDoNothing().returning();
  return result;
}

export async function resetUsers() {
  await db.delete(users);
}

export async function getUserByEmail(email: string) {
  const [result] = await db.select().from(users).where(eq(users.email, email));
  return result;
}

export async function getUserById(userId: string) {
  const [result] = await db.select().from(users).where(eq(users.id, userId));
  return result;
}

export async function updateUser(userId: string, user: UpdateUser) {
  const [result] = await db.update(users).set(user).where(eq(users.id, userId)).returning();
  return result;
}
