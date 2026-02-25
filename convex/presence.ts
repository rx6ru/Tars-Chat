import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";

export const setOnline = mutation({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return;

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .first();

        if (user) {
            await ctx.db.patch(user._id, {
                isOnline: true,
                lastSeen: Date.now(),
            });
        }
    },
});

export const setOffline = mutation({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return;

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .first();

        if (user) {
            await ctx.db.patch(user._id, {
                isOnline: false,
                lastSeen: Date.now(),
            });
        }
    },
});

export const setTyping = mutation({
    args: {
        conversationId: v.id("conversations"),
        isTyping: v.boolean(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return;

        const currentUser = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .first();

        if (!currentUser) return;

        // Check if user is a member of the conversation
        const membership = await ctx.db
            .query("conversationMembers")
            .withIndex("by_conversationId_userId", (q) =>
                q.eq("conversationId", args.conversationId).eq("userId", currentUser._id)
            )
            .first();

        if (!membership) return;

        // See if typing indicator record exists
        const typingRecord = await ctx.db
            .query("typingIndicators")
            .withIndex("by_conversationId_userId", (q) =>
                q.eq("conversationId", args.conversationId).eq("userId", currentUser._id)
            )
            .first();

        if (args.isTyping) {
            if (typingRecord) {
                await ctx.db.patch(typingRecord._id, {
                    lastTypedAt: Date.now(),
                });
            } else {
                await ctx.db.insert("typingIndicators", {
                    conversationId: args.conversationId,
                    userId: currentUser._id,
                    lastTypedAt: Date.now(),
                });
            }
        } else {
            // Explicitly delete the record to trigger a reactive update for other clients
            if (typingRecord) {
                await ctx.db.delete(typingRecord._id);
            }
        }
    },
});

export const getTypingUsers = query({
    args: { conversationId: v.id("conversations") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];

        const currentUser = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .first();

        if (!currentUser) return [];

        // Check that currentUser is actually in conversation
        const membership = await ctx.db
            .query("conversationMembers")
            .withIndex("by_conversationId_userId", (q) =>
                q.eq("conversationId", args.conversationId).eq("userId", currentUser._id)
            )
            .first();

        if (!membership) return [];

        const typingRecords = await ctx.db
            .query("typingIndicators")
            .withIndex("by_conversationId", (q) => q.eq("conversationId", args.conversationId))
            .collect();

        const typingUsers = await Promise.all(
            typingRecords
                .filter((record) => record.userId !== currentUser._id)
                .map(async (record) => {
                    const user = await ctx.db.get(record.userId);
                    return user;
                })
        );

        return typingUsers.filter((u): u is NonNullable<typeof u> => u !== null);
    },
});
