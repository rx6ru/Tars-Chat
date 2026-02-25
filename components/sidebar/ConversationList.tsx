"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Users, MessageSquare } from "lucide-react";

export function ConversationList() {
    const conversations = useQuery(api.conversations.getConversations);
    const router = useRouter();

    if (conversations === undefined) {
        return (
            <div className="flex flex-col gap-2 p-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-2">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (conversations.length === 0) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center space-y-4 p-8 text-center text-t-text-mid">
                <div className="rounded-full bg-t-bg-item p-4 text-t-accent">
                    <MessageSquare className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                    <h3 className="text-sm font-medium text-t-text-hi">No chats</h3>
                    <p className="text-xs">Search to start messaging</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <div className="flex flex-col gap-1 p-2">
                {conversations.map((conv) => {
                    const isGroup = conv.isGroup;
                    const name = isGroup ? conv.name : conv.otherMember?.name || "Unknown User";
                    const imageUrl = !isGroup ? conv.otherMember?.imageUrl : undefined;

                    return (
                        <button
                            key={conv._id}
                            onClick={() => router.push(`/conversation/${conv._id}`)}
                            className="group relative flex w-full items-center gap-3 rounded-md p-2 text-left bg-transparent border-l-2 border-transparent hover:bg-t-bg-item hover:border-l-2 hover:border-t-accent transition-all"
                        >
                            <Avatar className="h-10 w-10 shrink-0 bg-t-bg-item border border-t-border">
                                {imageUrl ? (
                                    <AvatarImage src={imageUrl} alt={name || "User"} />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-t-bg-item text-t-text-mid text-xs font-medium">
                                        {(name || "?").charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </Avatar>

                            <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
                                <div className="flex items-center justify-between">
                                    <span className="truncate text-sm font-medium text-t-text-hi">
                                        {name}
                                    </span>
                                    {conv.lastMessage && (
                                        <span className="text-[10px] text-t-text-mid shrink-0 ml-2">
                                            {format(conv.lastMessage.createdAt, "h:mm a")}
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center justify-between mt-0.5">
                                    <span className="truncate text-xs text-t-text-mid pr-2">
                                        {isGroup && !conv.lastMessage && (
                                            <span className="text-t-accent-text font-medium">{conv.memberCount} members</span>
                                        )}
                                        {!isGroup && !conv.lastMessage && "Started a conversation"}
                                        {conv.lastMessage?.isDeleted
                                            ? "This message was deleted"
                                            : conv.lastMessage?.content}
                                    </span>
                                    {conv.unreadCount > 0 && (
                                        <span className="flex shrink-0 h-4 min-w-[16px] items-center justify-center rounded-sm bg-t-accent px-1 text-[9px] font-bold text-white">
                                            {conv.unreadCount > 99 ? "99+" : conv.unreadCount}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
