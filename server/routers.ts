import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { channels, messages, servers, serverMembers } from "../drizzle/schema";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { getDb, getMessagesForChannel, getServersForUser, isChannelMember, isServerMember } from "./db";

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
    messages: protectedProcedure
      .input(z.object({ channelId: z.number().int().positive() }))
      .query(({ ctx, input }) => getMessagesForChannel(ctx.user.id, input.channelId)),
    createServer: protectedProcedure
      .input(z.object({ name: z.string().trim().min(2).max(48) }))
      .mutation(async ({ ctx, input }) => {
        const db = await requireDb();
        const inserted = await db.insert(servers).values({ name: input.name, icon: input.name.slice(0, 1).toUpperCase(), ownerId: ctx.user.id });
        const serverId = Number((inserted as any).insertId);
        await db.insert(serverMembers).values({ serverId, userId: ctx.user.id });
        await db.insert(channels).values({ serverId, name: "general" });
        return { serverId };
      }),
    createChannel: protectedProcedure
      .input(z.object({ serverId: z.number().int().positive(), name: z.string().trim().min(2).max(48) }))
      .mutation(async ({ ctx, input }) => {
        if (!(await isServerMember(ctx.user.id, input.serverId))) {
          throw new TRPCError({ code: "FORBIDDEN", message: "You are not a member of this server" });
        }
        const db = await requireDb();
        const inserted = await db.insert(channels).values({ serverId: input.serverId, name: input.name.replace(/\s+/g, "-").toLowerCase() });
        return { channelId: Number((inserted as any).insertId) };
      }),
    sendMessage: protectedProcedure
      .input(z.object({ channelId: z.number().int().positive(), content: z.string().trim().min(1).max(2000) }))
      .mutation(async ({ ctx, input }) => {
        if (!(await isChannelMember(ctx.user.id, input.channelId))) {
          throw new TRPCError({ code: "FORBIDDEN", message: "You cannot post in this channel" });
        }
        const db = await requireDb();
        await db.insert(messages).values({ channelId: input.channelId, userId: ctx.user.id, content: input.content });
        return { success: true } as const;
      }),
  }),
});

export type AppRouter = typeof appRouter;
