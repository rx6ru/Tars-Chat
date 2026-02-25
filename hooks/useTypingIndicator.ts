import { useRef, useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export function useTypingIndicator(conversationId: Id<"conversations">) {
    const setTyping = useMutation(api.presence?.setTyping || ("" as "mutation"));
    const lastTypedAt = useRef<number>(0);

    const onType = useCallback(() => {
        if (!api.presence?.setTyping) return;

        const now = Date.now();
        // Debounce actual server calls to once every 500ms
        if (now - lastTypedAt.current > 500) {
            setTyping({ conversationId }).catch(console.error);
            lastTypedAt.current = now;
        }
    }, [conversationId, setTyping]);

    return { onType };
}
