import { and, asc, eq, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { channels, InsertUser, messages, serverMembers, servers, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  for (const field of textFields) {
    if (user[field] === undefined) continue;
    values[field] = user[field] ?? null;
    updateSet[field] = user[field] ?? null;
  }
  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  values.lastSignedIn ??= new Date();
  updateSet.lastSignedIn ??= new Date();

  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function isServerMember(userId: number, serverId: number) {
  const db = await getDb();
  if (!db) return false;
  const result = await db
    .select({ id: serverMembers.id })
    .from(serverMembers)
    .where(and(eq(serverMembers.serverId, serverId), eq(serverMembers.userId, userId)))
    .limit(1);
  return result.length > 0;
}

export async function isChannelMember(userId: number, channelId: number) {
  const db = await getDb();
  if (!db) return false;
  const result = await db
    .select({ serverId: channels.serverId })
    .from(channels)
    .where(eq(channels.id, channelId))
    .limit(1);
  const serverId = result[0]?.serverId;
  return serverId ? isServerMember(userId, serverId) : false;
}

export async function getServersForUser(userId: number) {
  const db = await getDb();
  if (!db) return [];

  let memberships = await db
    .select({ serverId: serverMembers.serverId })
    .from(serverMembers)
    .where(eq(serverMembers.userId, userId));

  if (memberships.length === 0) {
    const inserted = await db.insert(servers).values({ name: "Arphix Lounge", icon: "A", ownerId: userId });
    const serverId = Number((inserted as any).insertId);
    await db.insert(serverMembers).values({ serverId, userId });
    await db.insert(channels).values({ serverId, name: "general" });
    memberships = [{ serverId }];
  }

  const ids = memberships.map(item => item.serverId);
  const serverRows = await db.select().from(servers).where(inArray(servers.id, ids)).orderBy(asc(servers.createdAt));
  const channelRows = await db.select().from(channels).where(inArray(channels.serverId, ids)).orderBy(asc(channels.createdAt));

  return serverRows.map(server => ({
    ...server,
    channels: channelRows.filter(channel => channel.serverId === server.id),
  }));
}

export async function getMessagesForChannel(userId: number, channelId: number) {
  const db = await getDb();
  if (!db || !(await isChannelMember(userId, channelId))) return [];
  return db
    .select({
      id: messages.id,
      content: messages.content,
      createdAt: messages.createdAt,
      userId: messages.userId,
      authorName: users.name,
      authorEmail: users.email,
    })
    .from(messages)
    .innerJoin(users, eq(messages.userId, users.id))
    .where(eq(messages.channelId, channelId))
    .orderBy(asc(messages.createdAt))
    .limit(100);
}
