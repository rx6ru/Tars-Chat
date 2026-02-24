import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { Doc } from "./_generated/dataModel";

export const getOrCreateDM = mutation({
    args: { otherUserId: v.id("users") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new ConvexError("Unauthorized");

        const currentUser = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .first();

        if (!currentUser) throw new ConvexError("User not found");

        if (currentUser._id === args.otherUserId) {
            throw new ConvexError("Cannot start a conversation with yourself");
        }

        const currentUserMemberships = await ctx.db
            .query("conversationMembers")
            .withIndex("by_userId", (q) => q.eq("userId", currentUser._id))
            .collect();

        for (const membership of currentUserMemberships) {
            const conversation = await ctx.db.get(membership.conversationId);
            if (!conversation || conversation.isGroup) continue;

            const otherMembership = await ctx.db
                .query("conversationMembers")
                .withIndex("by_conversationId_userId", (q) =>
                    q
                        .eq("conversationId", conversation._id)
                        .eq("userId", args.otherUserId)
                )
                .first();

            if (otherMembership) {
                return conversation._id;
            }
        }

        const newConversationId = await ctx.db.insert("conversations", {
            isGroup: false,
            createdBy: currentUser._id,
            createdAt: Date.now(),
        });

        await ctx.db.insert("conversationMembers", {
            conversationId: newConversationId,
            userId: currentUser._id,
            joinedAt: Date.now(),
        });

        await ctx.db.insert("conversationMembers", {
            conversationId: newConversationId,
            userId: args.otherUserId,
            joinedAt: Date.now(),
        });

        return newConversationId;
    },
});

export const createGroup = mutation({
    args: {
        name: v.string(),
        memberIds: v.array(v.id("users")),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new ConvexError("Unauthorized");

        const currentUser = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .first();

        if (!currentUser) throw new ConvexError("User not found");

        if (args.memberIds.length === 0) {
            throw new ConvexError("Group must have at least one other member");
        }

        const newConversationId = await ctx.db.insert("conversations", {
            name: args.name,
            isGroup: true,
            createdBy: currentUser._id,
            createdAt: Date.now(),
        });

        await ctx.db.insert("conversationMembers", {
            conversationId: newConversationId,
            userId: currentUser._id,
            joinedAt: Date.now(),
        });

        for (const memberId of args.memberIds) {
            await ctx.db.insert("conversationMembers", {
                conversationId: newConversationId,
                userId: memberId,
                joinedAt: Date.now(),
            });
        }

        return newConversationId;
    },
});

export const getConversation = query({
    args: {
        conversationId: v.id("conversations"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return null;

        const currentUser = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .first();

        if (!currentUser) return null;

        const conversation = await ctx.db.get(args.conversationId);
        if (!conversation) return null;

        const membership = await ctx.db
            .query("conversationMembers")
            .withIndex("by_conversationId_userId", (q) =>
                q.eq("conversationId", args.conversationId).eq("userId", currentUser._id)
            )
            .first();

        if (!membership) return null;

        let otherMember: Doc<"users"> | null = null;

        if (!conversation.isGroup) {
            const members = await ctx.db
                .query("conversationMembers")
                .withIndex("by_conversationId", (q) => q.eq("conversationId", args.conversationId))
                .collect();

            const otherMembership = members.find(m => m.userId !== currentUser._id);
            if (otherMembership) {
                otherMember = await ctx.db.get(otherMembership.userId);
            }
        }

        return {
            ...conversation,
            otherMember,
        };
    },
});

export const getConversations = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];

        const currentUser = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .first();

        if (!currentUser) return [];

        const memberships = await ctx.db
            .query("conversationMembers")
            .withIndex("by_userId", (q) => q.eq("userId", currentUser._id))
            .collect();

        const conversationsWithDetails = await Promise.all(
            memberships.map(async (membership) => {
                const conversation = await ctx.db.get(membership.conversationId);
                if (!conversation) return null;

                let otherMember: Doc<"users"> | null = null;
                let lastMessage: Doc<"messages"> | null = null;

                if (!conversation.isGroup) {
                    const members = await ctx.db
                        .query("conversationMembers")
                        .withIndex("by_conversationId", (q) => q.eq("conversationId", conversation._id))
                        .collect();

                    const otherMembership = members.find(m => m.userId !== currentUser._id);
                    if (otherMembership) {
                        otherMember = await ctx.db.get(otherMembership.userId);
                    }
                }

                const messages = await ctx.db
                    .query("messages")
                    .withIndex("by_conversationId", (q) => q.eq("conversationId", conversation._id))
                    .order("desc")
                    .take(1);

                if (messages.length > 0) {
                    lastMessage = messages[0];
                }

                let unreadCount = 0;
                if (membership.lastReadMessageId) {
                    const lastReadMsg = await ctx.db.get(membership.lastReadMessageId);
                    if (lastReadMsg) {
                        const newerMessages = await ctx.db
                            .query("messages")
                            .withIndex("by_conversationId_createdAt", (q) =>
                                q.eq("conversationId", conversation._id)
                                    .gt("createdAt", lastReadMsg.createdAt)
                            )
                            .collect();
                        unreadCount = newerMessages.filter(m => m.senderId !== currentUser._id).length;
                    }
                } else {
                    const allMessages = await ctx.db
                        .query("messages")
                        .withIndex("by_conversationId", (q) => q.eq("conversationId", conversation._id))
                        .collect();
                    unreadCount = allMessages.filter(m => m.senderId !== currentUser._id).length;
                }

                return {
                    ...conversation,
                    otherMember,
                    lastMessage,
                    unreadCount,
                };
            })
        );

        return conversationsWithDetails
            .filter((c): c is NonNullable<typeof c> => c !== null)
            .sort((a, b) => {
                const timeA = a.lastMessage?.createdAt || a.createdAt;
                const timeB = b.lastMessage?.createdAt || b.createdAt;
                return timeB - timeA;
            });
    },
});

export const markAsRead = mutation({
    args: { conversationId: v.id("conversations") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return;

        const currentUser = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .first();

        if (!currentUser) return;

        const membership = await ctx.db
            .query("conversationMembers")
            .withIndex("by_conversationId_userId", (q) =>
                q.eq("conversationId", args.conversationId).eq("userId", currentUser._id)
            )
            .first();

        if (!membership) return;

        const lastMessage = await ctx.db
            .query("messages")
            .withIndex("by_conversationId", (q) => q.eq("conversationId", args.conversationId))
            .order("desc")
            .first();

        if (lastMessage && membership.lastReadMessageId !== lastMessage._id) {
            await ctx.db.patch(membership._id, {
                lastReadMessageId: lastMessage._id,
            });
        }
    },
});
