"use client";

import { useState } from "react";
import { useQuery, useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ChatHeader } from "./ChatHeader";
import { MessageList, MessageWithSender } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { TypingIndicator } from "./TypingIndicator";
import { Skeleton } from "@/components/ui/skeleton";
import { useMarkAsRead } from "@/hooks/useMarkAsRead";

interface ChatPanelProps {
    conversationId: Id<"conversations">;
}

export function ChatPanel({ conversationId }: ChatPanelProps) {
    const { isAuthenticated } = useConvexAuth();
    const [replyingTo, setReplyingTo] = useState<MessageWithSender | null>(null);

    useMarkAsRead(conversationId);

    const conversation = useQuery(api.conversations.getConversation, isAuthenticated ? { conversationId } : "skip");
    const messages = useQuery(api.messages.getMessages, isAuthenticated ? { conversationId } : "skip");
    const typingUsers = useQuery(api.presence?.getTypingUsers || ("" as "query"), isAuthenticated ? { conversationId } : "skip");

    if (conversation === undefined || messages === undefined) {
        return (
            <div className="flex h-full flex-col bg-t-bg-app">
                {/* Header Skeleton */}
                <div className="flex h-16 items-center border-b border-t-border px-4 shrink-0">
                    <Skeleton className="h-10 w-10 rounded-full bg-t-bg-item" />
                    <div className="ml-3 space-y-2">
                        <Skeleton className="h-4 w-32 bg-t-bg-item" />
                        <Skeleton className="h-3 w-20 bg-t-bg-item" />
                    </div>
                </div>
                {/* Messages Box Skeleton */}
                <div className="flex-1 p-4 overflow-hidden">
                    <div className="space-y-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
                                <div className={`flex items-end gap-2 max-w-[70%] ${i % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}>
                                    {i % 2 === 0 && <Skeleton className="h-8 w-8 rounded-full shrink-0" />}
                                    <Skeleton
                                        className={`
                                            h-12 rounded-2xl
                                            ${i % 2 === 0 ? "rounded-bl-none" : "rounded-br-none"}
                                            ${i % 3 === 0 ? "w-48" : "w-32"}
                                        `}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Input Skeleton */}
                <div className="p-4 border-t border-t-border shrink-0">
                    <Skeleton className="h-[52px] w-full rounded-md bg-t-bg-input" />
                </div>
            </div>
        );
    }

    if (conversation === null) {
        return (
            <div className="flex h-full flex-col items-center justify-center bg-t-bg-app text-t-text-hi">
                <p>Conversation not found.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-1 w-full h-full flex-col bg-t-bg-app relative overflow-hidden">
            <ChatHeader conversation={conversation} />
            <MessageList
                messages={messages}
                conversationId={conversationId}
                isGroup={conversation.isGroup}
                onReply={setReplyingTo}
            />
            <div className="flex flex-col bg-t-bg-app">
                {typingUsers && typingUsers.length > 0 && (
                    <TypingIndicator typingUsers={typingUsers} />
                )}
                <MessageInput
                    conversationId={conversationId}
                    replyingTo={replyingTo}
                    onCancelReply={() => setReplyingTo(null)}
                />
            </div>
        </div>
    );
}
