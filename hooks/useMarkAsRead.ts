import { useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export function useMarkAsRead(conversationId: Id<"conversations">) {
    const markAsRead = useMutation(api.conversations.markAsRead);

    useEffect(() => {
        if (!api.conversations?.markAsRead) return;

        // Mark as read immediately on mount
        markAsRead({ conversationId }).catch(console.error);

        // Mark as read when the window regains focus
        const handleFocus = () => {
            markAsRead({ conversationId }).catch(console.error);
        };

        window.addEventListener("focus", handleFocus);
        return () => {
            window.removeEventListener("focus", handleFocus);
        };
    }, [conversationId, markAsRead]);
}
