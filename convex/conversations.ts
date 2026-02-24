import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";

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

        // Can't DM yourself
        if (currentUser._id === args.otherUserId) {
            throw new ConvexError("Cannot start a conversation with yourself");
        }

        // Find all conversations currentUser is in
        const currentUserMemberships = await ctx.db
            .query("conversationMembers")
            .withIndex("by_userId", (q) => q.eq("userId", currentUser._id))
            .collect();

        // Check if there's an existing DM (isGroup: false) containing both users
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
                // DM already exists
                return conversation._id;
            }
        }

        // No existing DM found, create a new one
        const newConversationId = await ctx.db.insert("conversations", {
            isGroup: false,
            createdBy: currentUser._id,
            createdAt: Date.now(),
        });

        // Add current user to conversation
        await ctx.db.insert("conversationMembers", {
            conversationId: newConversationId,
            userId: currentUser._id,
            joinedAt: Date.now(),
        });

        // Add other user to conversation
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
        memberIds: v.array(v.id("users")), // Excludes current user, current user added implicitly
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

        // Add current user
        await ctx.db.insert("conversationMembers", {
            conversationId: newConversationId,
            userId: currentUser._id,
            joinedAt: Date.now(),
        });

        // Add other members
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

                let otherMember = null;
                let lastMessage = null;

                // If it's a DM, fetch the other user's info
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

                // Fetch last message
                const messages = await ctx.db
                    .query("messages")
                    .withIndex("by_conversationId", (q) => q.eq("conversationId", conversation._id))
                    .order("desc")
                    .take(1);

                if (messages.length > 0) {
                    lastMessage = messages[0];
                }

                // Calculate unread message count purely by message count after lastReadMessageId
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
                        // Exclude own messages from unread count
                        unreadCount = newerMessages.filter(m => m.senderId !== currentUser._id).length;
                    }
                } else {
                    // No last read message = all messages from others are unread
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

        // Filter out nulls and sort by last message date, falling back to creation date
        return conversationsWithDetails
            .filter((c): c is NonNullable<typeof c> => c !== null)
            .sort((a, b) => {
                const timeA = a.lastMessage?.createdAt || a.createdAt;
                const timeB = b.lastMessage?.createdAt || b.createdAt;
                return timeB - timeA;
            });
    },
});
