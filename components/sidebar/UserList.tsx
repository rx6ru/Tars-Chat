"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { OnlineDot } from "@/components/shared/OnlineDot";

export function UserList() {
    const users = useQuery(api.users.getUsers);

    if (users === undefined) {
        return (
            <div className="flex flex-col gap-2 p-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-2">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[120px]" />
                            <Skeleton className="h-3 w-[80px]" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (users.length === 0) {
        return (
            <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                No users found.
            </div>
        );
    }

    return (
        <ScrollArea className="flex-1">
            <div className="flex flex-col gap-1 p-2">
                {users.map((user) => (
                    <button
                        key={user._id}
                        className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-[#1E1530]/50 transition-colors"
                    >
                        <div className="relative">
                            <Avatar className="h-10 w-10 border border-[#1E1530]">
                                <AvatarImage src={user.imageUrl} alt={user.name} />
                                <AvatarFallback className="bg-[#1A1128] text-white">
                                    {user.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            {user.isOnline && (
                                <div className="absolute bottom-0 right-0">
                                    <OnlineDot isOnline={user.isOnline} />
                                </div>
                            )}
                        </div>
                        <div className="flex flex-1 flex-col overflow-hidden">
                            <span className="truncate text-sm font-medium text-white">
                                {user.name}
                            </span>
                        </div>
                    </button>
                ))}
            </div>
        </ScrollArea>
    );
}
