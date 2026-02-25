import { useState, useRef, useLayoutEffect, useCallback, UIEvent } from "react";

interface Message {
    _id: string | number;
    // other fields omitted
}

export function useAutoScroll(messages: Message[], conversationId?: string) {
    const [isAtBottom, setIsAtBottom] = useState(true);
    const isAtBottomRef = useRef(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    // We use a ref to track if it's the first render block of a chat to force instant snapping without animation
    const isInitialLoad = useRef(true);

    // Reset auto-scroll locks immediately when the conversation route changes
    useLayoutEffect(() => {
        isInitialLoad.current = true;
        setIsAtBottom(true);
        isAtBottomRef.current = true;
    }, [conversationId]);

    const scrollToBottom = useCallback((behavior: ScrollBehavior | "instant" = "smooth") => {
        if (!containerRef.current) return;

        if (behavior === "instant" || behavior === "auto") {
            // Direct mathematical scroll snaps without animations
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        } else if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }
    }, []);

    const handleScroll = useCallback((e: UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget;
        const atBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 150;
        setIsAtBottom(atBottom);
        isAtBottomRef.current = atBottom;

        if (!atBottom) {
            isInitialLoad.current = false; // user manually scrolled, turn off init locks strongly
        }
    }, []);

    // Use ResizeObserver to reliably anchor to the bottom even when layout shifts or images load slowly
    useLayoutEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const contentWrapper = container.firstElementChild; // The div containing all the message bubbles
        if (!contentWrapper) return;

        const resizeObserver = new ResizeObserver(() => {
            if (isInitialLoad.current) {
                // Instantly snap to bottom for any layout shifts during the initial load phase
                container.scrollTop = container.scrollHeight;
            } else if (isAtBottomRef.current) {
                // If anchored to the bottom and a new message comes in, scroll smoothly down
                scrollToBottom("smooth");
            }
        });

        resizeObserver.observe(contentWrapper);

        // Turn off the initial snap lock after the UI has had time to fully settle (e.g. avatars loading)
        const timeoutId = setTimeout(() => {
            isInitialLoad.current = false;
        }, 1000);

        return () => {
            resizeObserver.disconnect();
            clearTimeout(timeoutId);
        };
    }, [conversationId, scrollToBottom]);

    return { containerRef, bottomRef, isAtBottom, scrollToBottom, handleScroll };
}
