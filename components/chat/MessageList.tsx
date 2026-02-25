import { Id } from "@/convex/_generated/dataModel";
import { MessageCircle } from "lucide-react";
import { MessageBubble } from "./MessageBubble";
import { useAutoScroll } from "@/hooks/useAutoScroll";
import { ArrowDown } from "lucide-react";

export interface MessageWithSender {
    _id: Id<"messages">;
    content: string;
    senderId: Id<"users">;
    sender: {
        name: string;
        imageUrl: string;
    };
    replyToMessage?: {
        senderName: string;
        content: string;
    } | null;
    isDeleted: boolean;
    createdAt: number;
}

interface MessageListProps {
    messages: MessageWithSender[];
    conversationId: Id<"conversations">;
    isGroup: boolean;
    onReply?: (message: MessageWithSender) => void;
}

export function MessageList({ messages, conversationId, isGroup, onReply }: MessageListProps) {
    const { containerRef, bottomRef, isAtBottom, scrollToBottom, handleScroll } = useAutoScroll(messages, conversationId);

    if (messages.length === 0) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center space-y-4 p-8 text-center bg-t-bg-app">
                <div className="rounded-full bg-t-bg-item p-4 text-t-accent">
                    <MessageCircle className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                    <h3 className="text-lg font-medium text-t-text-hi">No messages yet</h3>
                    <p className="text-sm text-t-text-mid">Be the first to say something</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative flex-1 flex flex-col overflow-hidden bg-t-bg-app">
            <div
                className="flex-1 px-4 py-4 overflow-y-auto"
                ref={containerRef}
                onScroll={handleScroll}
            >
                <div className="flex flex-col gap-4 pb-4">
                    {messages.map((message) => (
                        <MessageBubble key={message._id} message={message} isGroup={isGroup} onReply={onReply} />
                    ))}
                    <div ref={bottomRef} className="h-1 shrink-0" />
                </div>
            </div>

            {!isAtBottom && (
                <button
                    onClick={() => scrollToBottom("smooth")}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-t-bg-item border border-t-border p-2 text-t-accent transition-all hover:bg-t-bg-item-active hover:text-white shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-300"
                >
                    <ArrowDown className="h-5 w-5" />
                </button>
            )}
        </div>
    );
}
