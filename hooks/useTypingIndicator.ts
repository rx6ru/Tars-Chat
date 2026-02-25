import { useRef, useCallback, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export function useTypingIndicator(conversationId: Id<"conversations">) {
    const setTyping = useMutation(api.presence?.setTyping || ("" as "mutation"));
    const stopTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastTypedAt = useRef<number>(0);

    const stopTyping = useCallback(() => {
        if (!api.presence?.setTyping) return;
        if (stopTimeoutRef.current) {
            clearTimeout(stopTimeoutRef.current);
            stopTimeoutRef.current = null;
        }
        lastTypedAt.current = 0;
        setTyping({ conversationId, isTyping: false }).catch(console.error);
    }, [conversationId, setTyping]);

    const onType = useCallback(() => {
        if (!api.presence?.setTyping) return;

        const now = Date.now();
        // Throttle actual server calls to once every 2000ms
        if (now - lastTypedAt.current > 2000) {
            setTyping({ conversationId, isTyping: true }).catch(console.error);
            lastTypedAt.current = now;
        }

        // Keep extending the timeout on every stroke
        if (stopTimeoutRef.current) {
            clearTimeout(stopTimeoutRef.current);
        }

        stopTimeoutRef.current = setTimeout(() => {
            stopTyping();
        }, 2500);
    }, [conversationId, setTyping, stopTyping]);

    // Send false signal when switching chats or unmounting
    useEffect(() => {
        return () => {
            stopTyping();
        };
    }, [stopTyping]);

    return { onType, stopTyping };
}
