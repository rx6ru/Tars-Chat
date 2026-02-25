import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";

export const toggleReaction = mutation({
    args: {
        messageId: v.id("messages"),
        emoji: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new ConvexError("Unauthenticated");

        const currentUser = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .first();

        if (!currentUser) throw new ConvexError("User not found");

        const message = await ctx.db.get(args.messageId);
        if (!message) throw new ConvexError("Message not found");

        // Verify membership in conversation
        const membership = await ctx.db
            .query("conversationMembers")
            .withIndex("by_conversationId_userId", (q) =>
                q.eq("conversationId", message.conversationId)
                    .eq("userId", currentUser._id)
            )
            .first();

        if (!membership) {
            throw new ConvexError("Not a member of this conversation");
        }

        // Check if a reaction by this user on this message already exists
        const existingReaction = await ctx.db
            .query("reactions")
            .withIndex("by_messageId_userId", (q) =>
                q.eq("messageId", args.messageId).eq("userId", currentUser._id)
            )
            .first();

        if (existingReaction) {
            if (existingReaction.emoji === args.emoji) {
                // Remove it if clicking the same emoji
                await ctx.db.delete(existingReaction._id);
                return { action: "removed" };
            } else {
                // Overwrite it if clicking a different emoji
                await ctx.db.patch(existingReaction._id, {
                    emoji: args.emoji
                });
                return { action: "updated" };
            }
        } else {
            // Add it
            await ctx.db.insert("reactions", {
                messageId: args.messageId,
                userId: currentUser._id,
                emoji: args.emoji,
            });
            return { action: "added" };
        }
    },
});

export const getReactionsForMessage = query({
    args: {
        messageId: v.id("messages"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];

        const currentUser = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .first();

        if (!currentUser) return [];

        const reactions = await ctx.db
            .query("reactions")
            .withIndex("by_messageId", (q) => q.eq("messageId", args.messageId))
            .collect();

        // We want to return who reacted, so we fetch users
        const reactionsWithDetails = await Promise.all(
            reactions.map(async (reaction) => {
                const user = await ctx.db.get(reaction.userId);
                return {
                    ...reaction,
                    userName: user?.name || "Unknown",
                    isMe: user?._id === currentUser._id,
                };
            })
        );

        return reactionsWithDetails;
    },
});
