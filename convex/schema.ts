import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({

    users: defineTable({
        clerkId: v.string(),
        name: v.string(),
        email: v.string(),
        imageUrl: v.string(),
        isOnline: v.boolean(),
        lastSeen: v.number(),             // Unix timestamp ms
    }).index("by_clerkId", ["clerkId"]),

    conversations: defineTable({
        name: v.optional(v.string()),     // null for DMs, string for group chats
        isGroup: v.boolean(),
        createdBy: v.id("users"),
        createdAt: v.number(),
    }),

    conversationMembers: defineTable({
        conversationId: v.id("conversations"),
        userId: v.id("users"),
        lastReadMessageId: v.optional(v.id("messages")), // for unread count tracking
        joinedAt: v.number(),
    })
        .index("by_conversationId", ["conversationId"])
        .index("by_userId", ["userId"])
        .index("by_conversationId_userId", ["conversationId", "userId"]),

    messages: defineTable({
        conversationId: v.id("conversations"),
        senderId: v.id("users"),
        content: v.string(),
        replyToMessageId: v.optional(v.id("messages")), // reply/quote feature
        isDeleted: v.boolean(),                          // soft delete
        createdAt: v.number(),
    })
        .index("by_conversationId", ["conversationId"])
        .index("by_conversationId_createdAt", ["conversationId", "createdAt"]),

    reactions: defineTable({
        messageId: v.id("messages"),
        userId: v.id("users"),
        emoji: v.string(),               // one of: 👍 ❤️ 😂 😮 😢
    })
        .index("by_messageId", ["messageId"])
        .index("by_messageId_userId", ["messageId", "userId"]),

    typingIndicators: defineTable({
        conversationId: v.id("conversations"),
        userId: v.id("users"),
        lastTypedAt: v.number(),         // compare with Date.now() to determine active
    })
        .index("by_conversationId", ["conversationId"])
        .index("by_conversationId_userId", ["conversationId", "userId"]),

});
