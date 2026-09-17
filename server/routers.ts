import { and, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { channels, invites, messageReactions, messages, moderationActions, servers, serverMembers } from "../drizzle/schema";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { getDb, getInvite, getMembersForServer, getMessagesForChannel, getServersForUser, isChannelMember, isServerMember, isServerModerator } from "./db";

const requireDb = async () => {
  const db = await getDb();
  if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database is not available" });
  return db;
};

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  community: router({
    listServers: protectedProcedure.query(({ ctx }) => getServersForUser(ctx.user.id)),
    members: protectedProcedure.input(z.object({ serverId: z.number().int().positive() })).query(({ ctx, input }) => getMembersForServer(ctx.user.id, input.serverId)),
    messages: protectedProcedure.input(z.object({ channelId: z.number().int().positive() })).query(({ ctx, input }) => getMessagesForChannel(ctx.user.id, input.channelId)),
    createServer: protectedProcedure.input(z.object({ name: z.string().trim().min(2).max(48) })).mutation(async ({ ctx, input }) => {
      const db = await requireDb();
      const inserted = await db.insert(servers).values({ name: input.name, icon: input.name.slice(0, 1).toUpperCase(), ownerId: ctx.user.id });
      const serverId = Number((inserted as any).insertId);
      await db.insert(serverMembers).values({ serverId, userId: ctx.user.id, role: "owner" });
      await db.insert(channels).values({ serverId, name: "general" });
      return { serverId };
    }),
    createChannel: protectedProcedure.input(z.object({ serverId: z.number().int().positive(), name: z.string().trim().min(2).max(48) })).mutation(async ({ ctx, input }) => {
      if (!(await isServerModerator(ctx.user.id, input.serverId))) throw new TRPCError({ code: "FORBIDDEN", message: "Only server moderators can create channels" });
      const db = await requireDb();
      const inserted = await db.insert(channels).values({ serverId: input.serverId, name: input.name.replace(/\s+/g, "-").toLowerCase() });
      return { channelId: Number((inserted as any).insertId) };
    }),
    sendMessage: protectedProcedure.input(z.object({ channelId: z.number().int().positive(), content: z.string().trim().min(1).max(2000) })).mutation(async ({ ctx, input }) => {
      if (!(await isChannelMember(ctx.user.id, input.channelId))) throw new TRPCError({ code: "FORBIDDEN", message: "You cannot post in this channel" });
      const db = await requireDb();
      await db.insert(messages).values({ channelId: input.channelId, userId: ctx.user.id, content: input.content });
      return { success: true } as const;
    }),
    createInvite: protectedProcedure.input(z.object({ serverId: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
      if (!(await isServerMember(ctx.user.id, input.serverId))) throw new TRPCError({ code: "FORBIDDEN" });
      const db = await requireDb();
      const code = nanoid(10);
      await db.insert(invites).values({ serverId: input.serverId, code, createdBy: ctx.user.id, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
      return { code };
    }),
    joinInvite: protectedProcedure.input(z.object({ code: z.string().trim().min(4).max(24) })).mutation(async ({ ctx, input }) => {
      const invite = await getInvite(input.code);
      if (!invite || (invite.expiresAt && invite.expiresAt < new Date())) throw new TRPCError({ code: "NOT_FOUND", message: "Invite expired or not found" });
      const db = await requireDb();
      if (!(await isServerMember(ctx.user.id, invite.serverId))) {
        await db.insert(serverMembers).values({ serverId: invite.serverId, userId: ctx.user.id, role: "member" });
        await db.update(invites).set({ uses: invite.uses + 1 }).where(eq(invites.id, invite.id));
      }
      return { serverId: invite.serverId };
    }),
    setMemberRole: protectedProcedure.input(z.object({ serverId: z.number().int().positive(), userId: z.number().int().positive(), role: z.enum(["moderator", "member"]) })).mutation(async ({ ctx, input }) => {
      if (!(await isServerModerator(ctx.user.id, input.serverId))) throw new TRPCError({ code: "FORBIDDEN" });
      const db = await requireDb();
      await db.update(serverMembers).set({ role: input.role }).where(and(eq(serverMembers.serverId, input.serverId), eq(serverMembers.userId, input.userId)));
      return { success: true } as const;
    }),
    toggleReaction: protectedProcedure.input(z.object({ messageId: z.number().int().positive(), emoji: z.string().min(1).max(16) })).mutation(async ({ ctx, input }) => {
      const db = await requireDb();
      const existing = (await db.select().from(messageReactions).where(and(eq(messageReactions.messageId, input.messageId), eq(messageReactions.userId, ctx.user.id), eq(messageReactions.emoji, input.emoji))).limit(1))[0];
      if (existing) await db.delete(messageReactions).where(eq(messageReactions.id, existing.id));
      else await db.insert(messageReactions).values({ messageId: input.messageId, userId: ctx.user.id, emoji: input.emoji });
      return { success: true } as const;
    }),
    deleteMessage: protectedProcedure.input(z.object({ messageId: z.number().int().positive(), serverId: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
      if (!(await isServerModerator(ctx.user.id, input.serverId))) throw new TRPCError({ code: "FORBIDDEN", message: "Only moderators can delete messages" });
      const db = await requireDb();
      await db.delete(messages).where(eq(messages.id, input.messageId));
      await db.insert(moderationActions).values({ serverId: input.serverId, moderatorId: ctx.user.id, messageId: input.messageId, action: "delete_message", reason: "Deleted by moderator" });
      return { success: true } as const;
    }),
  }),
});

export type AppRouter = typeof appRouter;
