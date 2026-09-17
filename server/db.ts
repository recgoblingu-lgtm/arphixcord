import { and, asc, eq, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { channels, InsertUser, invites, messageReactions, messages, moderationActions, serverMembers, servers, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;
export async function getDb() { if (!_db && process.env.DATABASE_URL) { try { _db = drizzle(process.env.DATABASE_URL); } catch (error) { console.warn("[Database] Failed to connect:", error); _db = null; } } return _db; }

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb(); if (!db) return;
  const values: InsertUser = { openId: user.openId }; const updateSet: Record<string, unknown> = {};
  for (const field of ["name", "email", "loginMethod"] as const) { if (user[field] !== undefined) { values[field] = user[field] ?? null; updateSet[field] = user[field] ?? null; } }
  values.lastSignedIn = user.lastSignedIn ?? new Date(); updateSet.lastSignedIn = values.lastSignedIn;
  if (user.role !== undefined || user.openId === ENV.ownerOpenId) { values.role = user.role ?? "admin"; updateSet.role = values.role; }
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}
export async function getUserByOpenId(openId: string) { const db = await getDb(); if (!db) return undefined; return (await db.select().from(users).where(eq(users.openId, openId)).limit(1))[0]; }
export async function getMember(userId: number, serverId: number) { const db = await getDb(); if (!db) return undefined; return (await db.select().from(serverMembers).where(and(eq(serverMembers.serverId, serverId), eq(serverMembers.userId, userId))).limit(1))[0]; }
export async function isServerMember(userId: number, serverId: number) { return Boolean(await getMember(userId, serverId)); }
export async function isServerModerator(userId: number, serverId: number) { const member = await getMember(userId, serverId); return member?.role === "owner" || member?.role === "moderator"; }
export async function isChannelMember(userId: number, channelId: number) { const db = await getDb(); if (!db) return false; const row = (await db.select({ serverId: channels.serverId }).from(channels).where(eq(channels.id, channelId)).limit(1))[0]; return row ? isServerMember(userId, row.serverId) : false; }

export async function getServersForUser(userId: number) {
  const db = await getDb(); if (!db) return [];
  let memberships = await db.select({ serverId: serverMembers.serverId }).from(serverMembers).where(eq(serverMembers.userId, userId));
  if (memberships.length === 0) { const inserted = await db.insert(servers).values({ name: "Arphix Lounge", icon: "A", ownerId: userId }); const serverId = Number((inserted as any).insertId); await db.insert(serverMembers).values({ serverId, userId, role: "owner" }); await db.insert(channels).values({ serverId, name: "general" }); memberships = [{ serverId }]; }
  const ids = memberships.map(item => item.serverId); const serverRows = await db.select().from(servers).where(inArray(servers.id, ids)).orderBy(asc(servers.createdAt)); const channelRows = await db.select().from(channels).where(inArray(channels.serverId, ids)).orderBy(asc(channels.createdAt));
  return serverRows.map(server => ({ ...server, channels: channelRows.filter(channel => channel.serverId === server.id) }));
}

export async function getMessagesForChannel(userId: number, channelId: number) {
  const db = await getDb(); if (!db || !(await isChannelMember(userId, channelId))) return [];
  const rows = await db.select({ id: messages.id, content: messages.content, createdAt: messages.createdAt, userId: messages.userId, authorName: users.name, authorEmail: users.email }).from(messages).innerJoin(users, eq(messages.userId, users.id)).where(eq(messages.channelId, channelId)).orderBy(asc(messages.createdAt)).limit(100);
  const ids = rows.map(row => row.id); const reactions = ids.length ? await db.select().from(messageReactions).where(inArray(messageReactions.messageId, ids)) : [];
  return rows.map(row => ({ ...row, reactions: reactions.filter(reaction => reaction.messageId === row.id) }));
}

export async function getInvite(code: string) { const db = await getDb(); if (!db) return undefined; return (await db.select().from(invites).where(eq(invites.code, code)).limit(1))[0]; }
export { invites, messageReactions, moderationActions, messages, channels, servers, serverMembers };
