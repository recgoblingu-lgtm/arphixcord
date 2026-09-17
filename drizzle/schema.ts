import { int, index, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const servers = mysqlTable(
  "servers",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 80 }).notNull(),
    icon: varchar("icon", { length: 4 }).notNull().default("A"),
    ownerId: int("ownerId").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => ({ ownerIdx: index("servers_owner_idx").on(table.ownerId) }),
);

export const serverMembers = mysqlTable(
  "serverMembers",
  {
    id: int("id").autoincrement().primaryKey(),
    serverId: int("serverId").notNull(),
    userId: int("userId").notNull(),
    joinedAt: timestamp("joinedAt").defaultNow().notNull(),
  },
  table => ({
    serverIdx: index("server_members_server_idx").on(table.serverId),
    userIdx: index("server_members_user_idx").on(table.userId),
  }),
);

export const channels = mysqlTable(
  "channels",
  {
    id: int("id").autoincrement().primaryKey(),
    serverId: int("serverId").notNull(),
    name: varchar("name", { length: 80 }).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => ({ serverIdx: index("channels_server_idx").on(table.serverId) }),
);

export const messages = mysqlTable(
  "messages",
  {
    id: int("id").autoincrement().primaryKey(),
    channelId: int("channelId").notNull(),
    userId: int("userId").notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => ({
    channelIdx: index("messages_channel_idx").on(table.channelId),
    authorIdx: index("messages_author_idx").on(table.userId),
  }),
);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Server = typeof servers.$inferSelect;
export type Channel = typeof channels.$inferSelect;
export type Message = typeof messages.$inferSelect;
