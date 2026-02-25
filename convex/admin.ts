import { mutation, query } from "./_generated/server";

export const getAllData = query({
    args: {},
    handler: async (ctx) => {
        const users = await ctx.db.query("users").collect();
        const messages = await ctx.db.query("messages").collect();
        const conversations = await ctx.db.query("conversations").collect();
        const members = await ctx.db.query("conversationMembers").collect();
        return { users, messages, conversations, members };
    }
});

export const removeDuplicateUsers = mutation({
    args: {},
    handler: async (ctx) => {
        const users = await ctx.db.query("users").collect();
        const seenClerkIds = new Set<string>();
        let deleted = 0;

        for (const user of users) {
            if (seenClerkIds.has(user.clerkId)) {
                await ctx.db.delete(user._id);
                deleted++;
            } else {
                seenClerkIds.add(user.clerkId);
            }
        }
        return `Deleted ${deleted} duplicate users.`;
    }
});

export const deleteStaleUsers = mutation({
    args: {},
    handler: async (ctx) => {
        // The stale User-1 LN
        await ctx.db.delete("jn78wnekyav70wv1d2xg2g48kd81tyf7" as any);
        // The stale User-2 LN
        await ctx.db.delete("jn7e77t99z95w585rcbyk9f1fn81tyhb" as any);
        return "Deleted the 2 stale user records.";
    }
});
