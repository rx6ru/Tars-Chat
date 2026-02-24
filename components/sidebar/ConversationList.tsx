"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";

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
            <div className="flex h-32 flex-col items-center justify-center text-center p-4 text-sm text-muted-foreground">
                <p>No conversations yet.</p>
                <p>Search for a user to start chatting!</p>
            </div>
        );
    }

    return (
        <ScrollArea className="flex-1">
            <div className="flex flex-col gap-1 p-2">
                {conversations.map((conv) => {
                    const isGroup = conv.isGroup;
                    const name = isGroup ? conv.name : conv.otherMember?.name || "Unknown User";
                    const imageUrl = !isGroup ? conv.otherMember?.imageUrl : undefined;

                    return (
                        <button
                            key={conv._id}
                            onClick={() => router.push(`/conversation/${conv._id}`)}
                            className="group relative flex w-full items-center gap-3 rounded-lg p-3 text-left hover:bg-[#1E1530]/50 transition-colors"
                        >
                            <Avatar className="h-12 w-12 border border-[#1E1530] bg-[#1A1128]">
                                {imageUrl ? (
                                    <AvatarImage src={imageUrl} alt={name} />
                                ) : isGroup ? (
                                    <div className="flex h-full w-full items-center justify-center bg-[#1E1530] text-[#6D33AB]">
                                        <Users className="h-5 w-5" />
                                    </div>
                                ) : (
                                    <AvatarFallback className="bg-[#1A1128] text-white">
                                        {(name || "?").charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                )}
                            </Avatar>

                            <div className="flex flex-1 flex-col overflow-hidden">
                                <div className="flex items-center justify-between">
                                    <span className="truncate font-medium text-white">
                                        {name}
                                    </span>
                                    {conv.lastMessage && (
                                        <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                                            {format(conv.lastMessage.createdAt, "h:mm a")}
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center justify-between mt-0.5">
                                    <span className="truncate text-xs text-muted-foreground pr-2">
                                        {conv.lastMessage?.isDeleted
                                            ? "This message was deleted"
                                            : conv.lastMessage?.content || "Started a conversation"}
                                    </span>
                                    {conv.unreadCount > 0 && (
                                        <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#6D33AB] px-1.5 text-[10px] font-medium text-white">
                                            {conv.unreadCount > 99 ? "99+" : conv.unreadCount}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </ScrollArea>
    );
}
