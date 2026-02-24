"use client";

import { useState } from "react";
import { SendHorizontal } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTypingIndicator } from "@/hooks/useTypingIndicator";

interface MessageInputProps {
    conversationId: Id<"conversations">;
}

export function MessageInput({ conversationId }: MessageInputProps) {
    const [content, setContent] = useState("");
    const [isSending, setIsSending] = useState(false);
    const { onType } = useTypingIndicator(conversationId);

    // Fallback if the convex generated API hasn't loaded `messages` yet during early development
    const sendMessage = useMutation(api.messages?.sendMessage || ("" as any));

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();

        const text = content.trim();
        if (!text || isSending || !api.messages) return;

        try {
            setIsSending(true);
            setContent("");

            await sendMessage({
                conversationId,
                content: text
            });

        } catch (error) {
            console.error("Failed to send message:", error);
            setContent(text);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="p-4 bg-[#0F0A1A] border-t border-[#1E1530]">
            <form
                onSubmit={handleSend}
                className="flex items-center gap-2 bg-[#1A1128] rounded-full p-1 pl-4 border border-[#1E1530] focus-within:ring-1 focus-within:ring-[#6D33AB]"
            >
                <Input
                    className="flex-1 border-0 bg-transparent text-white focus-visible:ring-0 focus-visible:ring-offset-0 px-0 placeholder:text-muted-foreground"
                    placeholder="Type a message..."
                    value={content}
                    onChange={(e) => {
                        setContent(e.target.value);
                        onType();
                    }}
                    disabled={isSending || !api.messages}
                />

                <Button
                    type="submit"
                    size="icon"
                    disabled={!content.trim() || isSending || !api.messages}
                    className="rounded-full bg-[#6D33AB] hover:bg-[#C084FC] transition-colors shrink-0 text-white"
                >
                    <SendHorizontal className="h-4 w-4" />
                    <span className="sr-only">Send message</span>
                </Button>
            </form>
        </div>
    );
}
