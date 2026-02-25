import { internalMutation, query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getMe = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return null;

        return await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .first();
    },
});

export const getUsers = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];

        const currentClerkId = identity.subject;

        const users = await ctx.db.query("users").collect();
        return users.filter((u) => u.clerkId !== currentClerkId);
    },
});

export const searchUsers = query({
    args: { query: v.string() },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];

        const currentClerkId = identity.subject;
        const { query } = args;

        const allUsers = await ctx.db.query("users").collect();

        // If no query string, return everyone except the current user
        if (!query || query.trim() === "") {
            return allUsers.filter((u) => u.clerkId !== currentClerkId);
        }

        // If there is a query, filter by string match AND exclude current user
        const searchLower = query.toLowerCase();
        return allUsers.filter((u) => {
            if (u.clerkId === currentClerkId) return false;
            return u.name.toLowerCase().includes(searchLower) ||
                u.email.toLowerCase().includes(searchLower);
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

export const storeUser = mutation({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        console.log("getUserIdentity in storeUser:", identity?.subject || "null");
        if (!identity) {
            return null;
        }

        // Check if we've already stored this user.
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (user !== null) {
            // We NO LONGER aggressively patch name or imageUrl here.
            // Why? Clerk JWTs take time to mint on updates (like profile pic changes).
            // A rapid page reload would cause `storeUser` to fire with the OLD stale JWT image,
            // instantly reverting the fast `user.updated` webhook that correctly updated the Convex DB.
            // Webhooks are the authoritative source truth for metadata updates!
            return user._id;
        }

        // If it's a new user, create them.
        const name = `${identity.givenName ?? ""} ${identity.familyName ?? ""}`.trim() || identity.name || "User";
        console.log("Creating new user in Convex:", name, identity.subject);
        return await ctx.db.insert("users", {
            clerkId: identity.subject,
            name,
            email: identity.email ?? "",
            imageUrl: identity.pictureUrl ?? "",
            isOnline: true,
            lastSeen: Date.now(),
        });
    },
});

export const debugListAllUsers = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("users").collect();
    },
});

export const createTestUser = mutation({
    args: { name: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db.insert("users", {
            clerkId: "test-" + Date.now(),
            name: args.name,
            email: "test@example.com",
            imageUrl: "",
            isOnline: true,
            lastSeen: Date.now(),
        });
    },
});


