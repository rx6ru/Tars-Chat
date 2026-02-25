"use client";

import { useState } from "react";
import { Search, SearchX } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { OnlineDot } from "@/components/shared/OnlineDot";
import { useRouter } from "next/navigation";

export function SidebarSearch() {
    const [query, setQuery] = useState("");
    const searchResults = useQuery(api.users.searchUsers, { query });
    const getOrCreateDM = useMutation(api.conversations.getOrCreateDM);
    const router = useRouter();

    return (
        <div className="flex flex-col border-b border-t-border bg-t-bg-sidebar">
            <div className="p-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-t-text-mid" />
                    <Input
                        placeholder="Search users..."
                        className="pl-9 h-8 bg-t-bg-input border-t-border text-t-text-hi rounded-md focus-visible:ring-t-accent text-sm placeholder:text-t-text-mid"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
            </div>

            {query && (
                <div className="absolute top-[141px] left-0 right-0 z-10 bottom-0 bg-t-bg-app border-r border-t-border">
                    <div className="p-3 border-b border-t-border text-[10px] font-semibold text-t-text-mid uppercase tracking-wider">
                        Search Results
                    </div>
                    <ScrollArea className="h-full">
                        <div className="flex flex-col gap-1 p-2">
                            {searchResults === undefined ? (
                                <div className="p-4 text-center text-sm text-t-text-mid animate-pulse">
                                    Searching...
                                </div>
                            ) : searchResults.length === 0 ? (
                                <div className="flex flex-col items-center justify-center space-y-3 p-8 text-center bg-t-bg-sidebar h-full rounded-md mt-2">
                                    <div className="rounded-full bg-t-bg-item p-3 text-t-text-mid">
                                        <SearchX className="h-6 w-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-t-text-hi">No users found</p>
                                        <p className="text-xs text-t-text-mid">Try a different name</p>
                                    </div>
                                </div>
                            ) : (
                                searchResults.map((user) => (
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
                                        <div className="relative">
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
                                ))
                            )}
                        </div>
                    </ScrollArea>
                </div>
            )}
        </div>
    );
}
