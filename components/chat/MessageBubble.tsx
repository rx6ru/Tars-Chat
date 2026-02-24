"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageTimestamp } from "@/components/shared/MessageTimestamp";

interface MessageWithSender {
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

interface MessageBubbleProps {
    message: MessageWithSender;
}

export function MessageBubble({ message }: MessageBubbleProps) {
    const me = useQuery(api.users.getMe);
    const isMine = me?._id === message.senderId;

    if (!me) return null;

    return (
        <div className={`flex w-full ${isMine ? "justify-end" : "justify-start"} motion-preset-slide-up motion-duration-200`}>
            <div className={`flex max-w-[75%] gap-2 ${isMine ? "flex-row-reverse" : "flex-row"}`}>

                {/* Avatar for received messages */}
                {!isMine && (
                    <Avatar className="h-8 w-8 mt-auto shrink-0 border border-[#1E1530]">
                        <AvatarImage src={message.sender.imageUrl} alt={message.sender.name} />
                        <AvatarFallback className="bg-[#1A1128] text-xs text-white">
                            {message.sender.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                )}

                {/* Message Content Bubble */}
                <div className={`group relative flex flex-col rounded-2xl px-4 py-2 ${isMine
                        ? "bg-[#6D33AB] text-white rounded-br-[4px]"
                        : "bg-[#1E1530] text-gray-100 rounded-bl-[4px]"
                    }`}>

                    {/* Reply Context (if any) */}
                    {message.replyToMessage && (
                        <div className={`mb-1 flex flex-col border-l-2 pl-2 text-xs ${isMine ? "border-white/40" : "border-[#6D33AB]"
                            }`}>
                            <span className="font-semibold opacity-80">
                                {message.replyToMessage.senderName}
                            </span>
                            <span className="truncate opacity-70">
                                {message.replyToMessage.content}
                            </span>
                        </div>
                    )}

                    {/* Main Content */}
                    <div className="text-sm break-words whitespace-pre-wrap">
                        {message.isDeleted ? (
                            <em className="text-white/60">This message was deleted</em>
                        ) : (
                            message.content
                        )}
                    </div>

                    {/* Timestamp */}
                    <div className={`flex items-center gap-1 mt-1 justify-end opacity-70`}>
                        <MessageTimestamp
                            timestamp={message.createdAt}
                            className={`text-[10px] ${isMine ? "text-white/80" : "text-gray-400"}`}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
