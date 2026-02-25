import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";

export const getMessages = query({
    args: {
        conversationId: v.id("conversations"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];

        const currentUser = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .first();

        if (!currentUser) return [];

        // Verify membership
        const membership = await ctx.db
            .query("conversationMembers")
            .withIndex("by_conversationId_userId", (q) =>
                q.eq("conversationId", args.conversationId).eq("userId", currentUser._id)
            )
            .first();

        if (!membership) {
            return [];
        }

        const messages = await ctx.db
            .query("messages")
            .withIndex("by_conversationId_createdAt", (q) =>
                q.eq("conversationId", args.conversationId)
            )
            .order("asc")
            .collect();

        const messagesWithDetails = await Promise.all(
            messages.map(async (message) => {
                const sender = await ctx.db.get(message.senderId);
                let replyToMessageDetail = null;

                if (message.replyToMessageId) {
                    const originalMsg = await ctx.db.get(message.replyToMessageId);
                    if (originalMsg) {
                        const originalSender = await ctx.db.get(originalMsg.senderId);
                        replyToMessageDetail = {
                            content: originalMsg.content,
                            senderName: originalSender?.name || "Unknown",
                        };
                    }
                }

                return {
                    ...message,
                    sender: {
                        name: sender?.name || "Unknown",
                        imageUrl: sender?.imageUrl || "",
                    },
                    replyToMessage: replyToMessageDetail,
                };
            })
        );

        return messagesWithDetails;
    },
});

export const sendMessage = mutation({
    args: {
        conversationId: v.id("conversations"),
        content: v.string(),
        replyToMessageId: v.optional(v.id("messages")),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new ConvexError("Unauthenticated");

        const currentUser = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .first();

        if (!currentUser) throw new ConvexError("User not found");

        // Verify membership
        const membership = await ctx.db
            .query("conversationMembers")
            .withIndex("by_conversationId_userId", (q) =>
                q.eq("conversationId", args.conversationId).eq("userId", currentUser._id)
            )
            .first();

        if (!membership) {
            throw new ConvexError("Not a member of this conversation");
        }

        const messageId = await ctx.db.insert("messages", {
            conversationId: args.conversationId,
            senderId: currentUser._id,
            content: args.content,
            isDeleted: false,
            createdAt: Date.now(),
            replyToMessageId: args.replyToMessageId,
        });

        return messageId;
    },
});

export const deleteMessage = mutation({
    args: { messageId: v.id("messages") },
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

        if (message.senderId !== currentUser._id) {
            throw new ConvexError("Cannot delete someone else's message");
        }

        await ctx.db.patch(args.messageId, {
            isDeleted: true,
        });
    },
});
