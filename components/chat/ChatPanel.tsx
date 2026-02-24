"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { TypingIndicator } from "./TypingIndicator";
import { Skeleton } from "@/components/ui/skeleton";
import { useMarkAsRead } from "@/hooks/useMarkAsRead";

interface ChatPanelProps {
    conversationId: Id<"conversations">;
}

export function ChatPanel({ conversationId }: ChatPanelProps) {
    useMarkAsRead(conversationId);

    const conversation = useQuery(api.conversations.getConversation, { conversationId });
    const messages = useQuery(api.messages.getMessages, { conversationId });
    const typingUsers = useQuery(api.presence?.getTypingUsers || ("" as any), { conversationId });

    if (conversation === undefined || messages === undefined) {
        return (
            <div className="flex h-full flex-col bg-[#0F0A1A]">
                {/* Header Skeleton */}
                <div className="flex h-16 items-center border-b border-[#1E1530] px-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="ml-3 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-20" />
                    </div>
                </div>
                {/* Messages Box Skeleton */}
                <div className="flex-1 p-4">
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
                                <Skeleton className={`h-12 w-48 rounded-2xl ${i % 2 === 0 ? "rounded-tl-none" : "rounded-tr-none"}`} />
                            </div>
                        ))}
                    </div>
                </div>
                {/* Input Skeleton */}
                <div className="p-4 border-t border-[#1E1530]">
                    <Skeleton className="h-12 w-full rounded-lg" />
                </div>
            </div>
        );
    }

    if (conversation === null) {
        return (
            <div className="flex h-full flex-col items-center justify-center bg-[#0F0A1A] text-white">
                <p>Conversation not found.</p>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col bg-[#0F0A1A] relative overflow-hidden">
            <ChatHeader conversation={conversation} />
            <MessageList messages={messages} conversationId={conversationId} />
            <div className="flex flex-col bg-[#0F0A1A]">
                {typingUsers && typingUsers.length > 0 && (
                    <TypingIndicator typingUsers={typingUsers} />
                )}
                <MessageInput conversationId={conversationId} />
            </div>
        </div>
    );
}
