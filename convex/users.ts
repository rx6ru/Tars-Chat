import { internalMutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getMe = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return null;
        }
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .first();
        return user;
    },
});

export const getUsers = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }

        const users = await ctx.db.query("users").collect();
        // Exclude current user
        return users.filter((u) => u.clerkId !== identity.subject);
    },
});

export const searchUsers = query({
    args: { query: v.string() },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }

        const { query } = args;
        if (!query) {
            return [];
        }

        const users = await ctx.db.query("users").collect();
        const currentClerkId = identity.subject;

        return users.filter((u) => {
            // Exclude current user and check if name includes query (case-insensitive)
            if (u.clerkId === currentClerkId) return false;
            return u.name.toLowerCase().includes(query.toLowerCase());
        });
    },
});

export const upsertUser = internalMutation({
    args: {
        clerkId: v.string(),
        name: v.string(),
        email: v.string(),
        imageUrl: v.string(),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
            .first();

        if (existing) {
            await ctx.db.patch(existing._id, {
                name: args.name,
                email: args.email,
                imageUrl: args.imageUrl,
            });
            return existing._id;
        } else {
            const newUserId = await ctx.db.insert("users", {
                clerkId: args.clerkId,
                name: args.name,
                email: args.email,
                imageUrl: args.imageUrl,
                isOnline: true,
                lastSeen: Date.now(),
            });
            return newUserId;
        }
    },
});
