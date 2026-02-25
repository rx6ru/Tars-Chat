"use client";

import { useState, useRef, useEffect } from "react";
import { SendHorizontal } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useTypingIndicator } from "@/hooks/useTypingIndicator";
import { X } from "lucide-react";
import { MessageWithSender } from "./MessageList";
import { toast } from "sonner";

interface MessageInputProps {
    conversationId: Id<"conversations">;
    replyingTo?: MessageWithSender | null;
    onCancelReply?: () => void;
}

export function MessageInput({ conversationId, replyingTo, onCancelReply }: MessageInputProps) {
    const [content, setContent] = useState("");
    const [isSending, setIsSending] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { onType, stopTyping } = useTypingIndicator(conversationId);

    // Auto-focus on conversation change or when a reply is initiated
    useEffect(() => {
        if (textareaRef.current) {
            // Fix: Browser focus race conditions during active clicks can swallow programmatic focus. 
            // Delaying to the next tick ensures focus persists securely.
            setTimeout(() => {
                textareaRef.current?.focus();
            }, 10);
        }
    }, [conversationId, replyingTo?._id]);

    // Fallback if the convex generated API hasn't loaded `messages` yet during early development
    const sendMessage = useMutation(api.messages?.sendMessage || ("" as "mutation"));

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();

        const text = content.trim();
        if (!text || isSending || !api.messages) return;

        try {
            setIsSending(true);
            setContent("");
            stopTyping();

            // Reset textarea height after sending
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }

            await sendMessage({
                conversationId,
                content: text,
                replyToMessageId: replyingTo?._id,
            });

            if (onCancelReply) {
                onCancelReply();
            }

        } catch (error) {
            console.error("Failed to send message:", error);
            setContent(text);
            toast.error("Failed to send message. Please try again.");
        } finally {
            setIsSending(false);
            // Re-focus after sending
            setTimeout(() => {
                if (textareaRef.current) {
                    textareaRef.current.focus();
                }
            }, 10);
        }
    };

    return (
        <div className="flex-shrink-0 p-4 border-t border-t-border flex flex-col gap-2 bg-t-bg-app">
            {/* Reply Strip */}
            {replyingTo && (
                <div className="flex items-center gap-2 px-3 py-2 bg-t-bg-item rounded-md border-l-2 border-t-accent animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex flex-col flex-1 overflow-hidden min-w-0">
                        <span className="text-xs font-semibold text-t-accent-text flex items-center gap-1">
                            Replying to {replyingTo.sender.name}
                        </span>
                        <span className="truncate text-sm text-t-text-mid mt-0.5">
                            {replyingTo.content}
                        </span>
                    </div>
                    <button
                        onClick={onCancelReply}
                        className="p-1.5 rounded bg-transparent hover:bg-t-bg-item-active text-t-text-mid hover:text-t-text-hi transition-colors shrink-0"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            {/* Input Area */}
            <form
                onSubmit={handleSend}
                className="flex items-end gap-2 bg-t-bg-input rounded-md px-3 py-2 focus-within:ring-1 focus-within:ring-t-accent"
            >
                <Textarea
                    ref={textareaRef}
                    className="flex-1 min-h-[40px] max-h-[200px] resize-none border-0 bg-transparent text-t-text-hi focus-visible:ring-0 focus-visible:ring-offset-0 px-0 py-2 placeholder:text-t-text-mid"
                    placeholder="Message..."
                    value={content}
                    onChange={(e) => {
                        setContent(e.target.value);
                        onType();
                        // Auto-resize logic with safe check
                        const target = e.target;
                        setTimeout(() => {
                            if (target) {
                                target.style.height = 'auto';
                                target.style.height = `${target.scrollHeight}px`;
                            }
                        }, 0);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSend(e);
                        }
                        if (e.key === "Escape" && replyingTo && onCancelReply) {
                            e.preventDefault();
                            onCancelReply();
                        }
                    }}
                    rows={1}
                    disabled={isSending || !api.messages}
                />

                <Button
                    type="submit"
                    size="icon"
                    disabled={!content.trim() || isSending || !api.messages}
                    className="h-8 w-8 rounded bg-t-accent hover:bg-t-accent/90 transition-colors shrink-0 text-white mb-1"
                >
                    <SendHorizontal className="h-4 w-4" />
                    <span className="sr-only">Send message</span>
                </Button>
            </form>
        </div>
    );
}
