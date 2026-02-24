import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { Webhook } from "svix";

const http = httpRouter();

http.route({
    path: "/clerk-webhook",
    method: "POST",
    handler: httpAction(async (ctx, request) => {
        const payloadString = await request.text();
        const headerPayload = request.headers;

        const svixId = headerPayload.get("svix-id");
        const svixTimestamp = headerPayload.get("svix-timestamp");
        const svixSignature = headerPayload.get("svix-signature");

        if (!svixId || !svixTimestamp || !svixSignature) {
            return new Response("Missing svix headers", { status: 400 });
        }

        // CLERK_WEBHOOK_SECRET must be set in Convex Dashboard Environment Variables
        const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
        if (!webhookSecret) {
            return new Response("Missing webhook secret", { status: 400 });
        }

        const wh = new Webhook(webhookSecret);
        let evt: any;

        try {
            evt = wh.verify(payloadString, {
                "svix-id": svixId,
                "svix-timestamp": svixTimestamp,
                "svix-signature": svixSignature,
            });
        } catch (err) {
            return new Response("Error verifying webhook", { status: 400 });
        }

        const eventType = evt.type;
        if (eventType === "user.created" || eventType === "user.updated") {
            const { id, first_name, last_name, image_url, email_addresses } = evt.data;
            const primaryEmail =
                email_addresses && email_addresses.length > 0
                    ? email_addresses[0].email_address
                    : "";
            const name = `${first_name || ""} ${last_name || ""}`.trim() || "User";

            await ctx.runMutation(internal.users.upsertUser, {
                clerkId: id,
                name,
                email: primaryEmail,
                imageUrl: image_url || "",
            });

            return new Response("User upserted successfully", { status: 200 });
        }

        return new Response("Unhandled event type", { status: 404 });
    }),
});

export default http;
