"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { OnlineDot } from "@/components/shared/OnlineDot";

export function SidebarSearch() {
    const [query, setQuery] = useState("");
    const searchResults = useQuery(api.users.searchUsers, { query });

    return (
        <div className="flex flex-col border-b border-[#1E1530]">
            <div className="p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search users..."
                        className="pl-9 bg-[#0F0A1A] border-[#1E1530] text-white focus-visible:ring-[#6D33AB]"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
            </div>

            {query && (
                <div className="absolute top-[141px] left-0 right-0 z-10 bottom-0 bg-[#1A1128] border-r border-[#1E1530]">
                    <div className="p-4 border-b border-[#1E1530] text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Search Results
                    </div>
                    <ScrollArea className="h-full">
                        <div className="flex flex-col gap-1 p-2">
                            {searchResults === undefined ? (
                                <div className="p-4 text-center text-sm text-muted-foreground animate-pulse">
                                    Searching...
                                </div>
                            ) : searchResults.length === 0 ? (
                                <div className="p-4 text-center text-sm text-muted-foreground">
                                    No users found matching "{query}"
                                </div>
                            ) : (
                                searchResults.map((user) => (
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
                                ))
                            )}
                        </div>
                    </ScrollArea>
                </div>
            )}
        </div>
    );
}
