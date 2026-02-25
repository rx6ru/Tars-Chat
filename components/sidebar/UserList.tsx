"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { OnlineDot } from "@/components/shared/OnlineDot";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function UserList() {
    const [searchQuery, setSearchQuery] = useState("");
    const users = useQuery(api.users.searchUsers, { query: searchQuery });

    const getOrCreateDM = useMutation(api.conversations.getOrCreateDM);
    const router = useRouter();

    return (
        <div className="flex h-full flex-col">
            <div className="p-4 pb-2 shrink-0">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-t-text-mid" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-md bg-t-bg-item border border-t-border py-2 pl-9 pr-4 text-sm text-t-text-hi placeholder:text-t-text-mid focus:border-t-accent focus:outline-none transition-colors"
                    />
                </div>
            </div>

            {users === undefined ? (
                <div className="flex flex-col gap-2 p-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3 p-2">
                            <Skeleton className="h-10 w-10 rounded-full bg-t-bg-item" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-[120px] bg-t-bg-item" />
                                <Skeleton className="h-3 w-[80px] bg-t-bg-item" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : users.length === 0 ? (
                <div className="flex flex-1 items-center justify-center p-4 text-center text-sm text-t-text-mid">
                    {searchQuery ? "No users found matching your search." : "No other users have registered yet."}
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto overflow-x-hidden">
                    <div className="flex flex-col gap-1 p-2">
                        {users.map((user) => (
                            <button
                                key={user._id}
                                onClick={async () => {
                                    try {
                                        const conversationId = await getOrCreateDM({ otherUserId: user._id });
                                        router.push(`/conversation/${conversationId}`);
                                    } catch (error) {
                                        console.error("Failed to start conversation:", error);
                                    }
                                }}
                                className="group relative flex w-full items-center gap-3 rounded-md p-2 text-left bg-transparent border-l-2 border-transparent hover:bg-t-bg-item hover:border-l-2 hover:border-t-accent transition-all"
                            >
                                <div className="relative shrink-0">
                                    <Avatar className="h-10 w-10 bg-t-bg-item border border-t-border">
                                        <AvatarImage src={user.imageUrl} alt={user.name} />
                                        <AvatarFallback className="bg-t-bg-item text-t-text-mid text-xs font-medium">
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
                                    <span className="truncate text-sm font-medium text-t-text-hi">
                                        {user.name}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
